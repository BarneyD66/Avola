import { NextResponse } from "next/server";
import {
  releaseTelegramDispatch,
  reserveTelegramDispatch,
} from "@/lib/paymentSessionStore";
import { parseParticipantTarget } from "@/lib/raffleStore";
import { dispatchTelegramTask } from "@/lib/telegram";

function isInternalDispatchAllowed(request: Request) {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  const secret = process.env.INTERNAL_TELEGRAM_DISPATCH_SECRET;

  return Boolean(
    secret &&
      request.headers.get("x-realjoin-internal-secret") === secret,
  );
}

export async function POST(request: Request) {
  if (!isInternalDispatchAllowed(request)) {
    return NextResponse.json(
      { ok: false, error: "Internal dispatch is not available." },
      { status: 403 },
    );
  }

  let payload: {
    orderId?: unknown;
    message?: unknown;
    targetParticipants?: unknown;
  };

  try {
    payload = (await request.json()) as {
      orderId?: unknown;
      message?: unknown;
      targetParticipants?: unknown;
    };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 },
    );
  }

  if (typeof payload.orderId !== "string" || !payload.orderId.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing order id." },
      { status: 400 },
    );
  }

  if (typeof payload.message !== "string" || !payload.message.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing Telegram message." },
      { status: 400 },
    );
  }

  try {
    if (!(await reserveTelegramDispatch(payload.orderId))) {
      return NextResponse.json({
        ok: true,
        orderId: payload.orderId,
        skipped: true,
        reason: "Telegram task already dispatched or in progress.",
      });
    }

    const result = await dispatchTelegramTask(payload.message, {
      orderId: payload.orderId,
      targetParticipants: parseParticipantTarget(
        typeof payload.targetParticipants === "string" ||
          typeof payload.targetParticipants === "number"
          ? payload.targetParticipants
          : undefined,
      ),
    });

    return NextResponse.json({
      ok: true,
      orderId: payload.orderId,
      chatId: result.chatId,
      messageId: result.messageId,
      randyMessageId: result.randyMessageId,
    });
  } catch (error) {
    await releaseTelegramDispatch(payload.orderId);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Telegram dispatch failed.",
      },
      { status: 502 },
    );
  }
}
