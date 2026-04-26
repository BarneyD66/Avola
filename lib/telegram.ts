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

export async function sendTelegramMessage({
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

export async function dispatchTelegramTask(message: string) {
  const { botToken, chatId } = getTelegramConfig();

  if (!botToken) {
    throw new Error("Telegram bot token is not configured.");
  }

  const messageId = await sendTelegramMessage({
    botToken,
    chatId,
    text: message,
    disableWebPagePreview: false,
  });

  const randyMessageId = await sendTelegramMessage({
    botToken,
    chatId,
    text: "/randy",
    disableWebPagePreview: true,
  });

  return { chatId, messageId, randyMessageId };
}
