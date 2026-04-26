import type { Order } from "@/data/orderStore";

export const TG_TASK_TEMPLATE_VERSION = "tg-task-template-v1";

const fallbackActionText = "Complete the requested task";

const targetLinkKeys = [
  "targetUrl",
  "contentUrl",
  "groupUrl",
  "accountUrl",
  "postUrl",
  "campaignUrl",
  "repoUrl",
  "siteUrl",
  "appUrl",
  "appStoreUrl",
  "playStoreUrl",
] as const;

export const tgActionTextByServiceSlug: Record<string, string> = {
  "x-follow": "Follow X account",
  "x-like": "Like the post on X",
  "x-comment": "Comment on the post on X",
  "x-retweet": "Retweet the post on X",
  "x-kol-comment": "Comment on the post on X",
  "instagram-follow": "Follow Instagram",
  "instagram-like": "Like the Instagram post",
  "instagram-comment": "Comment on the Instagram post",
  "facebook-follow": "Follow Facebook page",
  "facebook-like": "Like the Facebook post",
  "facebook-comment": "Comment on the Facebook post",
  "telegram-join-group": "Join Telegram Group",
  "tiktok-follow": "Follow TikTok account",
  "tiktok-like": "Like the TikTok post",
  "tiktok-comment": "Comment on the TikTok post",
  "discord-join-group": "Join Discord Server",
  "threads-follow": "Follow Threads account",
  "threads-like": "Like the Threads post",
  "threads-comment": "Comment on the Threads post",
  "binance-follow": "Follow Binance Feed account",
  "site-register": "Register on the website",
  "site-register-interaction":
    "Register and complete the required interaction",
  "site-register-paid-interaction":
    "Register and complete the paid interaction",
  "site-register-kyc": "Register on the website with KYC",
  "site-register-kyc-interaction":
    "Register with KYC and complete the required interaction",
  "site-register-kyc-paid-interaction":
    "Register with KYC and complete the paid interaction",
  "github-stars": "Star the GitHub repository",
  "github-forks": "Fork the GitHub repository",
  "app-download": "Download the app",
  "app-review": "Download and review the app",
  "app-download-review": "Download and review the app",
  "twitter-growth": "Follow X account",
  "tweet-engagement": "Like the post on X",
  "verified-comments": "Comment on the post on X",
};

function padSequence(value: number) {
  return value.toString().padStart(2, "0");
}

function getTaskDatePart(date: Date) {
  return `${date.getMonth() + 1}${date.getDate().toString().padStart(2, "0")}`;
}

export function generateTgTaskCode(orders: Order[], date = new Date()) {
  const datePart = getTaskDatePart(date);
  const sequence =
    orders.filter((order) => order.tgTaskCode?.startsWith(datePart)).length + 1;

  return `${datePart}${padSequence(sequence)}`;
}

export function normalizeEstimatedTime(value?: string) {
  const source = value?.trim();

  if (!source) {
    return "24 Hours";
  }

  const rangeMatch = source.match(/(\d+)\s*[-~]\s*(\d+)/);

  if (rangeMatch) {
    return `${rangeMatch[1]}-${rangeMatch[2]} Hours`;
  }

  const singleMatch = source.match(/(\d+)/);

  if (singleMatch) {
    return `${singleMatch[1]} Hours`;
  }

  return source
    .replace(/小时|小時/gi, "Hours")
    .replace(/\bhours?\b/gi, "Hours");
}

export function getTgActionText(serviceSlug: string) {
  return tgActionTextByServiceSlug[serviceSlug] ?? fallbackActionText;
}

export function getOrderTargetLink(order: Order) {
  if (order.targetLink?.trim()) {
    return order.targetLink.trim();
  }

  for (const key of targetLinkKeys) {
    const value = order.formValues?.[key]?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}

export function buildTgTaskMessage(order: Order) {
  const amount =
    order.selectedPackageInternalCost ??
    order.paymentAmount ??
    order.selectedPackagePrice ??
    order.amount;
  const estimatedTime = normalizeEstimatedTime(
    order.selectedPackageDurationHours ??
      order.selectedPackageDeliveryTime ??
      order.deliveryTime,
  );
  const taskCode = order.tgTaskCode ?? "UNASSIGNED";
  const actionText = getTgActionText(order.serviceSlug);
  const targetLink = getOrderTargetLink(order) || "MISSING_TARGET_LINK";
  const additionalRequirement = order.additionalRequirement?.trim();
  const lines = [
    `${amount} ~ ${estimatedTime} | ${taskCode}`,
    "",
    `- ${actionText} 👉 HERE (${targetLink})`,
  ];

  if (additionalRequirement) {
    lines.push("", `- Requirement: ${additionalRequirement}`);
  }

  lines.push("", "- Post Proof & Click Participate ⬇️");

  return lines.join("\n");
}
