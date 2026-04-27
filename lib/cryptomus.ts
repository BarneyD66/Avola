import { createHash, timingSafeEqual } from "crypto";
import { execFileSync } from "child_process";

const CRYPTOMUS_API_URL = "https://api.cryptomus.com/v1";

export type CryptomusInvoiceRequest = {
  amount: string;
  currency: string;
  order_id: string;
  url_callback?: string;
  url_return?: string;
  url_success?: string;
  lifetime?: number;
  additional_data?: string;
  is_payment_multiple?: boolean;
};

export type CryptomusInvoiceResult = {
  uuid?: string;
  order_id?: string;
  amount?: string;
  payment_amount?: string;
  currency?: string;
  url?: string;
  expired_at?: string;
};

type CryptomusResponse<T> = {
  state?: number;
  result?: T;
  message?: string;
  errors?: unknown;
};

function isLocalWindowsFetchReset(error: unknown) {
  return (
    process.platform === "win32" &&
    process.env.NODE_ENV !== "production" &&
    error instanceof Error &&
    (error.message.includes("fetch failed") ||
      error.cause instanceof Error && error.cause.message.includes("ECONNRESET"))
  );
}

function requestCryptomusWithPowerShell<T>({
  url,
  merchantId,
  sign,
  payload,
}: {
  url: string;
  merchantId: string;
  sign: string;
  payload: Record<string, unknown>;
}) {
  const script = `
$ErrorActionPreference = 'Stop'
$payload = [Console]::In.ReadToEnd()
$headers = @{
  merchant = '${merchantId.replaceAll("'", "''")}'
  sign = '${sign.replaceAll("'", "''")}'
}
$response = Invoke-RestMethod -Uri '${url.replaceAll("'", "''")}' -Method Post -Headers $headers -Body $payload -ContentType 'application/json'
$response | ConvertTo-Json -Depth 20 -Compress
`;
  try {
    const stdout = execFileSync(
      "powershell",
      ["-NoProfile", "-Command", script],
      {
        input: JSON.stringify(payload),
        encoding: "utf8",
        timeout: 30000,
      },
    );

    return JSON.parse(stdout) as CryptomusResponse<T>;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("(401)") || message.includes("401")) {
      throw new Error(
        "Cryptomus returned 401 Unauthorized. Please verify the merchant ID and Payment API key belong to the same merchant and that the Payment API key is enabled.",
      );
    }

    throw error;
  }
}

export function isCryptomusConfigured() {
  return Boolean(
    process.env.CRYPTOMUS_MERCHANT_ID &&
      process.env.CRYPTOMUS_PAYMENT_API_KEY,
  );
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function getCryptomusCredentials() {
  const merchantId = process.env.CRYPTOMUS_MERCHANT_ID;
  const paymentApiKey = process.env.CRYPTOMUS_PAYMENT_API_KEY;

  if (!merchantId || !paymentApiKey) {
    throw new Error("Cryptomus merchant id or payment API key is not configured.");
  }

  return { merchantId, paymentApiKey };
}

export function createCryptomusSign(
  payload: Record<string, unknown>,
  apiKey = process.env.CRYPTOMUS_PAYMENT_API_KEY,
  options?: { escapeSlashes?: boolean },
) {
  if (!apiKey) {
    throw new Error("Cryptomus payment API key is not configured.");
  }

  const payloadJson = options?.escapeSlashes
    ? JSON.stringify(payload).replace(/\//g, "\\/")
    : JSON.stringify(payload);
  const encodedPayload = Buffer.from(payloadJson).toString("base64");

  return createHash("md5").update(`${encodedPayload}${apiKey}`).digest("hex");
}

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export function verifyCryptomusWebhook(payload: Record<string, unknown>) {
  const receivedSign = payload.sign;

  if (typeof receivedSign !== "string" || !receivedSign) {
    return false;
  }

  const unsignedPayload = { ...payload };
  delete unsignedPayload.sign;

  // Cryptomus' webhook examples generate the hash with PHP json_encode and
  // JSON_UNESCAPED_UNICODE. That keeps Unicode readable but still escapes "/",
  // so URL fields can produce a different digest than plain JSON.stringify.
  const expectedSigns = [
    createCryptomusSign(unsignedPayload),
    createCryptomusSign(unsignedPayload, undefined, { escapeSlashes: true }),
  ];

  return expectedSigns.some((expectedSign) =>
    signaturesMatch(expectedSign, receivedSign),
  );
}

export function normalizeCryptomusAmount(value: string) {
  const amount = value.replace(/[^\d.]/g, "");

  if (!amount || Number.isNaN(Number(amount))) {
    throw new Error("Invalid payment amount.");
  }

  return Number(amount).toFixed(2);
}

export async function createCryptomusInvoice(
  payload: CryptomusInvoiceRequest,
) {
  const { merchantId } = getCryptomusCredentials();
  const sign = createCryptomusSign(payload);
  const url = `${CRYPTOMUS_API_URL}/payment`;
  let result: CryptomusResponse<CryptomusInvoiceResult>;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant: merchantId,
        sign,
      },
      body: JSON.stringify(payload),
    });
    result = (await response.json()) as CryptomusResponse<CryptomusInvoiceResult>;

    if (!response.ok) {
      throw new Error(
        result.message ||
          `Cryptomus invoice creation failed (${response.status}).`,
      );
    }
  } catch (error) {
    if (!isLocalWindowsFetchReset(error)) {
      throw error;
    }

    result = requestCryptomusWithPowerShell<CryptomusInvoiceResult>({
      url,
      merchantId,
      sign,
      payload,
    });
  }

  if (result.state !== 0 || !result.result?.url) {
    throw new Error(
      result.message ||
        `Cryptomus invoice creation failed: ${JSON.stringify(result.errors ?? {})}`,
    );
  }

  return result.result;
}
