import {
  buildRaffleStatusMessage,
  createRaffleSession,
  getRaffleSession,
  updateRaffleMessageId,
} from "@/lib/raffleStore";

type TelegramSendMessageResponse = {
  ok: boolean;
  result?: {
    message_id?: number;
  };
  description?: string;
};

type TelegramReplyMarkup = {
  inline_keyboard: Array<
    Array<{ text: string; callback_data?: string; url?: string }>
  >;
};

function getTelegramConfig() {
  return {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID ?? "@avolatest",
  };
}

export async function sendTelegramMessage({
  botToken,
  chatId,
  text,
  disableWebPagePreview,
  replyMarkup,
}: {
  botToken: string;
  chatId: string;
  text: string;
  disableWebPagePreview: boolean;
  replyMarkup?: TelegramReplyMarkup;
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
        reply_markup: replyMarkup,
      }),
    },
  );
  const result = (await response.json()) as TelegramSendMessageResponse;

  if (!response.ok || !result.ok) {
    throw new Error(
      result.description ??
        `Telegram dispatch failed with status ${response.status}.`,
    );
  }

  return result.result?.message_id
    ? String(result.result.message_id)
    : undefined;
}

function getParticipateCallbackData(orderId: string) {
  return `realjoin_participate:${orderId.replace(/[^A-Za-z0-9_-]/g, "")}`;
}

function getParticipateKeyboard(orderId: string): TelegramReplyMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: "Participate!",
          callback_data: getParticipateCallbackData(orderId),
        },
      ],
    ],
  };
}

export async function dispatchTelegramTask(
  message: string,
  options?: { orderId?: string; targetParticipants?: number },
) {
  const { botToken, chatId } = getTelegramConfig();

  if (!botToken) {
    throw new Error("Telegram bot token is not configured.");
  }

  const existingSession = options?.orderId
    ? await getRaffleSession(options.orderId)
    : null;
  let messageId = existingSession?.taskMessageId;

  if (!messageId) {
    messageId = await sendTelegramMessage({
      botToken,
      chatId,
      text: message,
      disableWebPagePreview: false,
    });
  }

  let raffleMessageId = existingSession?.raffleMessageId;

  if (options?.orderId) {
    await createRaffleSession({
      orderId: options.orderId,
      chatId,
      taskMessageId: messageId,
      raffleMessageId,
      targetParticipants: options.targetParticipants,
    });

    if (!raffleMessageId) {
      raffleMessageId = await sendTelegramMessage({
        botToken,
        chatId,
        text: buildRaffleStatusMessage(0),
        disableWebPagePreview: true,
        replyMarkup: getParticipateKeyboard(options.orderId),
      });

      await updateRaffleMessageId(options.orderId, raffleMessageId);
    }
  }

  return { chatId, messageId, randyMessageId: raffleMessageId };
}

export async function answerTelegramCallbackQuery({
  botToken,
  callbackQueryId,
  text,
}: {
  botToken: string;
  callbackQueryId: string;
  text: string;
}) {
  await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
      show_alert: false,
    }),
  });
}

export async function editTelegramRaffleMessage({
  botToken,
  chatId,
  messageId,
  orderId,
  count,
}: {
  botToken: string;
  chatId: number | string;
  messageId: number | string;
  orderId: string;
  count: number;
}) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text: buildRaffleStatusMessage(count),
      disable_web_page_preview: true,
      reply_markup: getParticipateKeyboard(orderId),
    }),
  });
  const result = (await response.json()) as TelegramSendMessageResponse;

  if (!response.ok || !result.ok) {
    throw new Error(
      result.description ??
        `Telegram raffle update failed with status ${response.status}.`,
    );
  }
}
