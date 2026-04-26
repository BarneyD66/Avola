import { NextResponse } from "next/server";
import { verifyCryptomusWebhook } from "@/lib/cryptomus";
import {
  getPendingPaymentSession,
  markPendingPaymentSessionDispatched,
  savePendingPaymentSession,
  type PendingPaymentSession,
  releaseTelegramDispatch,
  reserveTelegramDispatch,
} from "@/lib/paymentSessionStore";
import { dispatchTelegramTask } from "@/lib/telegram";
import { buildTgTaskMessage } from "@/data/tgTaskTemplate";
import { getServiceBySlug } from "@/data/services";
import type { Order } from "@/data/orderStore";

const paidStatuses = new Set(["paid", "paid_over"]);

type CryptomusDispatchData = {
  v?: number;
  orderId?: string;
  serviceSlug?: string;
  packageId?: string;
  targetLink?: string;
  additionalRequirement?: string;
  tgTaskCode?: string;
  targetParticipants?: number;
};

function parseAdditionalData(value: unknown): CryptomusDispatchData | null {
  if (!value) {
    return null;
  }

  if (typeof value === "object") {
    return value as CryptomusDispatchData;
  }

  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value) as CryptomusDispatchData;
  } catch {
    return null;
  }
}

function buildFallbackPendingSession(
  orderId: string,
  payload: Record<string, unknown>,
): PendingPaymentSession | null {
  const additionalData = parseAdditionalData(payload.additional_data);
  const serviceSlug = additionalData?.serviceSlug;

  if (!serviceSlug) {
    return null;
  }

  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return null;
  }

  const selectedPackage =
    service.packages?.find((item) => item.id === additionalData?.packageId) ??
    service.packages?.find((item) => item.recommended) ??
    service.packages?.[0] ??
    null;
  const now = new Date().toISOString().slice(0, 16).replace("T", " ");
  const selectedPackagePrice =
    selectedPackage?.displayPrice ?? selectedPackage?.price ?? "$0";
  const fallbackOrder: Order = {
    id: orderId,
    serviceName: service.name,
    serviceSlug: service.slug,
    status: "pending",
    amount: selectedPackagePrice,
    progress: 0,
    createdAt: now,
    updatedAt: now,
    estimatedCompletion: now,
    queryPassword: "",
    summary: "",
    timeline: [],
    selectedPackageId: selectedPackage?.id,
    selectedPackageLabel: selectedPackage?.label,
    selectedPackagePrice,
    selectedPackageResult: selectedPackage?.result,
    selectedPackageDeliveryTime: selectedPackage?.deliveryTime,
    selectedPackageInternalCost: selectedPackage?.internalCost,
    selectedPackageDurationHours: selectedPackage?.durationHours,
    selectedPackageParticipants: selectedPackage?.participants,
    deliveryTime: selectedPackage?.deliveryTime ?? service.deliveryTime,
    targetLink: additionalData?.targetLink,
    additionalRequirement: additionalData?.additionalRequirement,
    paymentProvider: "cryptomus",
    paymentMethod: "crypto",
    paymentStatus: "paid",
    paymentAmount: selectedPackagePrice,
    paymentCurrency: process.env.CRYPTOMUS_INVOICE_CURRENCY ?? "USD",
    tgDispatchStatus: "tg_ready",
    tgTaskType: service.slug,
    tgTaskCode: additionalData?.tgTaskCode,
    tgTemplateVersion: "tg-task-template-v1",
  };

  return {
    orderId,
    tgMessage: buildTgTaskMessage(fallbackOrder),
    createdAt: Date.now(),
    targetParticipants: additionalData?.targetParticipants,
  };
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid webhook payload." },
      { status: 400 },
    );
  }

  if (!verifyCryptomusWebhook(payload)) {
    return NextResponse.json(
      { ok: false, error: "Invalid Cryptomus signature." },
      { status: 401 },
    );
  }

  const orderId = typeof payload.order_id === "string" ? payload.order_id : "";
  const status = typeof payload.status === "string" ? payload.status : "";

  if (!orderId || !paidStatuses.has(status)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const storedPendingSession = await getPendingPaymentSession(orderId);
  const fallbackPendingSession = storedPendingSession
    ? null
    : buildFallbackPendingSession(orderId, payload);
  const pendingSession = storedPendingSession ?? fallbackPendingSession;

  if (!pendingSession || pendingSession.dispatchedAt) {
    return NextResponse.json({ ok: true, orderId, dispatched: false });
  }

  try {
    if (fallbackPendingSession) {
      await savePendingPaymentSession(fallbackPendingSession);
    }

    if (!(await reserveTelegramDispatch(orderId))) {
      return NextResponse.json({
        ok: true,
        orderId,
        dispatched: false,
        skipped: true,
      });
    }

    const result = await dispatchTelegramTask(pendingSession.tgMessage, {
      orderId,
      targetParticipants: pendingSession.targetParticipants,
    });
    await markPendingPaymentSessionDispatched(orderId);

    return NextResponse.json({
      ok: true,
      orderId,
      dispatched: true,
      messageId: result.messageId,
      randyMessageId: result.randyMessageId,
    });
  } catch (error) {
    await releaseTelegramDispatch(orderId);

    return NextResponse.json(
      {
        ok: false,
        orderId,
        error:
          error instanceof Error ? error.message : "Telegram dispatch failed.",
      },
      { status: 502 },
    );
  }
}
