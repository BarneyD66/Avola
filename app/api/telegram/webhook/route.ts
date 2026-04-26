import { NextResponse } from "next/server";
import {
  getRaffleProgress,
  recordRaffleParticipant,
} from "@/lib/raffleStore";
import {
  answerTelegramCallbackQuery,
  editTelegramRaffleMessage,
} from "@/lib/telegram";

type TelegramCallbackUpdate = {
  callback_query?: {
    id?: string;
    data?: string;
    from?: {
      id?: number;
    };
    message?: {
      message_id?: number;
      chat?: {
        id?: number | string;
      };
    };
  };
};

const participatePrefix = "realjoin_participate:";

function getBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN;
}

export async function POST(request: Request) {
  let update: TelegramCallbackUpdate;

  try {
    update = (await request.json()) as TelegramCallbackUpdate;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid Telegram update." },
      { status: 400 },
    );
  }

  const callbackQuery = update.callback_query;
  const callbackData = callbackQuery?.data ?? "";

  if (!callbackData.startsWith(participatePrefix)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const botToken = getBotToken();

  if (!botToken) {
    return NextResponse.json(
      { ok: false, error: "Telegram bot token is not configured." },
      { status: 501 },
    );
  }

  const orderId = callbackData.slice(participatePrefix.length).trim();
  const participantId = callbackQuery?.from?.id;
  const callbackQueryId = callbackQuery?.id;
  const chatId = callbackQuery?.message?.chat?.id;
  const messageId = callbackQuery?.message?.message_id;

  if (!orderId || !participantId || !callbackQueryId || !chatId || !messageId) {
    return NextResponse.json(
      { ok: false, error: "Incomplete Telegram callback." },
      { status: 400 },
    );
  }

  const result = recordRaffleParticipant({
    orderId,
    chatId: String(chatId),
    raffleMessageId: String(messageId),
    participantId,
  });

  await Promise.allSettled([
    answerTelegramCallbackQuery({
      botToken,
      callbackQueryId,
      text: result.alreadyParticipating
        ? "You are already participating."
        : "You are in.",
    }),
    editTelegramRaffleMessage({
      botToken,
      chatId,
      messageId,
      orderId,
      count: result.count,
    }),
  ]);

  return NextResponse.json({
    ok: true,
    orderId,
    currentParticipants: result.count,
    progress: getRaffleProgress(orderId),
  });
}
