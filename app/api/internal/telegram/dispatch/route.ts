import { NextResponse } from "next/server";
import { dispatchTelegramTask } from "@/lib/telegram";

export async function POST(request: Request) {
  let payload: { orderId?: unknown; message?: unknown };

  try {
    payload = (await request.json()) as { orderId?: unknown; message?: unknown };
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
    const result = await dispatchTelegramTask(payload.message);

    return NextResponse.json({
      ok: true,
      orderId: payload.orderId,
      chatId: result.chatId,
      messageId: result.messageId,
      randyMessageId: result.randyMessageId,
    });
  } catch (error) {
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
