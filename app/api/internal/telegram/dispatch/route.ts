import { NextResponse } from "next/server";
import {
  releaseTelegramDispatch,
  reserveTelegramDispatch,
} from "@/lib/paymentSessionStore";
import { parseParticipantTarget } from "@/lib/raffleStore";
import { dispatchTelegramTask } from "@/lib/telegram";

export async function POST(request: Request) {
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
    if (!reserveTelegramDispatch(payload.orderId)) {
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
    releaseTelegramDispatch(payload.orderId);

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
