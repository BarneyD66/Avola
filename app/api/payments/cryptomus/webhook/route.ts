import { NextResponse } from "next/server";
import { verifyCryptomusWebhook } from "@/lib/cryptomus";
import {
  getPendingPaymentSession,
  markPendingPaymentSessionDispatched,
  releaseTelegramDispatch,
  reserveTelegramDispatch,
} from "@/lib/paymentSessionStore";
import { dispatchTelegramTask } from "@/lib/telegram";

const paidStatuses = new Set(["paid", "paid_over"]);

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

  const pendingSession = getPendingPaymentSession(orderId);

  if (!pendingSession || pendingSession.dispatchedAt) {
    return NextResponse.json({ ok: true, orderId, dispatched: false });
  }

  try {
    if (!reserveTelegramDispatch(orderId)) {
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
    markPendingPaymentSessionDispatched(orderId);

    return NextResponse.json({
      ok: true,
      orderId,
      dispatched: true,
      messageId: result.messageId,
      randyMessageId: result.randyMessageId,
    });
  } catch (error) {
    releaseTelegramDispatch(orderId);

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
