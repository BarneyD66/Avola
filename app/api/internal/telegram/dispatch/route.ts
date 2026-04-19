import { NextResponse } from "next/server";

type TelegramSendMessageResponse = {
  ok: boolean;
  result?: {
    message_id?: number;
  };
  description?: string;
};

function getTelegramConfig() {
  return {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID ?? "@avolatest",
  };
}

async function sendTelegramMessage({
  botToken,
  chatId,
  text,
  disableWebPagePreview,
}: {
  botToken: string;
  chatId: string;
  text: string;
  disableWebPagePreview: boolean;
}) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: disableWebPagePreview,
      }),
    },
  );
  const result = (await response.json()) as TelegramSendMessageResponse;

  if (!response.ok || !result.ok) {
    throw new Error(result.description ?? "Telegram dispatch failed.");
  }

  return result.result?.message_id
    ? String(result.result.message_id)
    : undefined;
}

export async function POST(request: Request) {
  const { botToken, chatId } = getTelegramConfig();

  if (!botToken) {
    return NextResponse.json(
      { ok: false, error: "Telegram bot token is not configured." },
      { status: 500 },
    );
  }

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
    const messageId = await sendTelegramMessage({
      botToken,
      chatId,
      text: payload.message,
      disableWebPagePreview: false,
    });

    const randyMessageId = await sendTelegramMessage({
      botToken,
      chatId,
      text: "/randy",
      disableWebPagePreview: true,
    });

    return NextResponse.json({
      ok: true,
      orderId: payload.orderId,
      chatId,
      messageId,
      randyMessageId,
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
