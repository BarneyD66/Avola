import { NextResponse } from "next/server";
import {
  getRaffleSession,
  getRaffleProgress,
  recordRaffleParticipant,
} from "@/lib/raffleStore";
import {
  answerTelegramCallbackQuery,
  editTelegramRaffleMessage,
  sendTelegramMessage,
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
  message?: {
    text?: string;
    chat?: {
      id?: number | string;
    };
    from?: {
      id?: number;
    };
  };
};

const participatePrefix = "realjoin_participate:";
const startPrefix = "rj_";

function getBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN;
}

function parseStartOrderId(text?: string) {
  const payload = text?.match(/^\/start(?:@\w+)?\s+([A-Za-z0-9_-]+)/)?.[1];

  if (!payload?.startsWith(startPrefix)) {
    return "";
  }

  return payload.slice(startPrefix.length);
}

async function updateRaffleProgressMessage({
  botToken,
  orderId,
  count,
}: {
  botToken: string;
  orderId: string;
  count: number;
}) {
  const session = await getRaffleSession(orderId);

  if (!session?.chatId || !session.raffleMessageId) {
    return;
  }

  await editTelegramRaffleMessage({
    botToken,
    chatId: session.chatId,
    messageId: session.raffleMessageId,
    orderId,
    count,
  });
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
  const startOrderId = parseStartOrderId(update.message?.text);

  if (startOrderId) {
    const botToken = getBotToken();

    if (!botToken) {
      return NextResponse.json(
        { ok: false, error: "Telegram bot token is not configured." },
        { status: 501 },
      );
    }

    const participantId = update.message?.from?.id;
    const userChatId = update.message?.chat?.id;
    const session = await getRaffleSession(startOrderId);

    if (!participantId || !userChatId || !session?.chatId) {
      return NextResponse.json(
        { ok: false, error: "Incomplete Telegram start payload." },
        { status: 400 },
      );
    }

    const result = await recordRaffleParticipant({
      orderId: startOrderId,
      chatId: session.chatId,
      raffleMessageId: session.raffleMessageId,
      participantId,
    });

    await Promise.allSettled([
      updateRaffleProgressMessage({
        botToken,
        orderId: startOrderId,
        count: result.count,
      }),
      sendTelegramMessage({
        botToken,
        chatId: String(userChatId),
        text: result.alreadyParticipating
          ? "You are already participating."
          : "Participation recorded.",
        disableWebPagePreview: true,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      orderId: startOrderId,
      currentParticipants: result.count,
      progress: await getRaffleProgress(startOrderId),
    });
  }

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

  const result = await recordRaffleParticipant({
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
    progress: await getRaffleProgress(orderId),
  });
}
