import { NextResponse } from "next/server";
import {
  createCryptomusInvoice,
  getSiteUrl,
  isCryptomusConfigured,
  normalizeCryptomusAmount,
} from "@/lib/cryptomus";
import {
  generatePaymentTaskCode,
  savePendingPaymentSession,
} from "@/lib/paymentSessionStore";
import { buildTgTaskMessage } from "@/data/tgTaskTemplate";
import { getServiceBySlug, type ServicePackage } from "@/data/services";
import type { Order } from "@/data/orderStore";

type CreatePaymentPayload = {
  order?: Partial<Order>;
};

function getPackage(serviceSlug: string, packageId?: string) {
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    throw new Error("Service not found.");
  }

  const selectedPackage =
    service.packages?.find((item) => item.id === packageId) ??
    service.packages?.find((item) => item.recommended) ??
    service.packages?.[0] ??
    null;

  return { service, selectedPackage };
}

function getPackagePaymentPrice(selectedPackage: ServicePackage | null) {
  return selectedPackage?.displayPrice ?? selectedPackage?.price;
}

function buildSanitizedTgOrder(
  order: Partial<Order>,
  selectedPackage: ServicePackage | null,
): Order {
  const now = new Date();
  const updatedAt = now.toISOString().slice(0, 16).replace("T", " ");
  const selectedPackagePrice =
    selectedPackage?.displayPrice ?? selectedPackage?.price ?? order.amount ?? "$0";

  return {
    id: String(order.id),
    serviceName: String(order.serviceName ?? ""),
    serviceSlug: String(order.serviceSlug),
    status: "pending",
    amount: selectedPackagePrice,
    progress: 0,
    createdAt: String(order.createdAt ?? updatedAt),
    updatedAt,
    estimatedCompletion: String(order.estimatedCompletion ?? updatedAt),
    queryPassword: String(order.queryPassword ?? ""),
    summary: String(order.summary ?? ""),
    timeline: Array.isArray(order.timeline) ? order.timeline : [],
    selectedPackageId: selectedPackage?.id ?? order.selectedPackageId,
    selectedPackageLabel: selectedPackage?.label ?? order.selectedPackageLabel,
    selectedPackagePrice,
    selectedPackageResult: selectedPackage?.result ?? order.selectedPackageResult,
    selectedPackageDeliveryTime:
      selectedPackage?.deliveryTime ?? order.selectedPackageDeliveryTime,
    selectedPackageInternalCost:
      selectedPackage?.internalCost ?? order.selectedPackageInternalCost,
    selectedPackageDurationHours:
      selectedPackage?.durationHours ?? order.selectedPackageDurationHours,
    selectedPackageParticipants:
      selectedPackage?.participants ?? order.selectedPackageParticipants,
    deliveryTime:
      selectedPackage?.deliveryTime ?? order.deliveryTime ?? "24-72 小时",
    formValues: order.formValues,
    targetLink: order.targetLink,
    additionalRequirement: order.additionalRequirement,
    contact: order.contact,
    paymentProvider: "cryptomus",
    paymentMethod: "crypto",
    paymentStatus: "awaiting_transfer",
    paymentAmount: selectedPackagePrice,
    paymentCurrency: process.env.CRYPTOMUS_INVOICE_CURRENCY ?? "USD",
    tgDispatchStatus: "tg_ready",
    tgTaskType: String(order.serviceSlug),
    tgTargetChannel: order.tgTargetChannel,
    tgTaskCode: order.tgTaskCode ?? generatePaymentTaskCode(now),
    tgTemplateVersion: "tg-task-template-v1",
  };
}

export async function POST(request: Request) {
  if (!isCryptomusConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Cryptomus is not configured." },
      { status: 501 },
    );
  }

  let payload: CreatePaymentPayload;

  try {
    payload = (await request.json()) as CreatePaymentPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 },
    );
  }

  const order = payload.order;

  if (!order?.id || !order.serviceSlug) {
    return NextResponse.json(
      { ok: false, error: "Missing order information." },
      { status: 400 },
    );
  }

  try {
    const { selectedPackage } = getPackage(
      String(order.serviceSlug),
      order.selectedPackageId,
    );
    const paymentPrice = getPackagePaymentPrice(selectedPackage);

    if (!paymentPrice) {
      throw new Error("Payment price is not configured.");
    }

    const siteUrl = getSiteUrl();
    const sanitizedOrder = buildSanitizedTgOrder(order, selectedPackage);
    const tgMessage = buildTgTaskMessage(sanitizedOrder);
    const invoice = await createCryptomusInvoice({
      amount: normalizeCryptomusAmount(paymentPrice),
      currency: process.env.CRYPTOMUS_INVOICE_CURRENCY ?? "USD",
      order_id: String(order.id),
      url_callback: `${siteUrl}/api/payments/cryptomus/webhook`,
      url_return: `${siteUrl}/checkout/${order.id}`,
      url_success: `${siteUrl}/order/success/${order.id}?cryptomus=success`,
      lifetime: 3600,
      additional_data: JSON.stringify({
        orderId: order.id,
        serviceSlug: order.serviceSlug,
        packageId: selectedPackage?.id,
      }),
      is_payment_multiple: false,
    });

    savePendingPaymentSession({
      orderId: String(order.id),
      tgMessage,
      createdAt: Date.now(),
    });

    return NextResponse.json({
      ok: true,
      paymentUrl: invoice.url,
      paymentSessionId: invoice.uuid,
      paymentReference: invoice.order_id ?? order.id,
      paymentAmount: paymentPrice,
      paymentCurrency: invoice.currency ?? process.env.CRYPTOMUS_INVOICE_CURRENCY ?? "USD",
      paymentExpiresAt: invoice.expired_at,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Cryptomus invoice creation failed.",
      },
      { status: 502 },
    );
  }
}
