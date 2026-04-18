import type { PlatformGroup } from "@/data/services";
import { socialMediaPlatforms } from "@/data/services";

export type CategoryIconKey =
  | "social"
  | "site"
  | "github"
  | "token"
  | "app";

export type CategoryPackageHighlight = {
  title: string;
  result: string;
  price: string;
};

export type CategoryPreview = {
  title: string;
  slug: string;
  description: string;
  previewItems: string[];
  ctaLabel: string;
  iconKey: CategoryIconKey;
  packageHighlights: CategoryPackageHighlight[];
};

export type CategoryPageData = {
  title: string;
  slug: string;
  description: string;
  items?: {
    title: string;
    slug?: string;
    description?: string;
  }[];
  platforms?: PlatformGroup[];
};

export const categoryPreviews: CategoryPreview[] = [
  {
    title: "社交媒体增长",
    slug: "social-media",
    description: "覆盖主流社交平台的真实用户增长服务",
    previewItems: [
      "X",
      "Instagram",
      "Facebook",
      "Telegram",
      "TikTok",
      "Discord",
      "Threads",
      "Binance 广场粉丝",
    ],
    ctaLabel: "选择服务",
    iconKey: "social",
    packageHighlights: [
      { title: "X 关注增长", result: "约 500 关注", price: "$50 起" },
      {
        title: "Instagram 点赞增长",
        result: "约 400 点赞",
        price: "$25 起",
      },
      {
        title: "Telegram 加入群组",
        result: "约 300 人加入群组",
        price: "$60 起",
      },
    ],
  },
  {
    title: "网站注册 + 交互",
    slug: "site-registration",
    description: "面向注册、交互与付费交互的真实用户服务",
    previewItems: [
      "网站注册",
      "注册+交互",
      "注册+付费交互",
      "注册（KYC）",
      "KYC+交互",
      "KYC+付费交互",
    ],
    ctaLabel: "选择服务",
    iconKey: "site",
    packageHighlights: [
      { title: "网站注册", result: "约 120 次注册", price: "$70 起" },
      {
        title: "网站注册（KYC）",
        result: "约 80 次注册（含 KYC）",
        price: "$120 起",
      },
      {
        title: "注册（KYC）+ 交互",
        result: "约 60 次注册（含 KYC）+ 交互",
        price: "$180 起",
      },
      {
        title: "注册（KYC）+ 付费交互",
        result: "约 50 次注册（含 KYC）+ 付费交互",
        price: "$260 起",
      },
    ],
  },
  {
    title: "GitHub 增长",
    slug: "github-growth",
    description: "面向 GitHub 仓库与账号增长的真实用户服务",
    previewItems: ["Stars", "Forks"],
    ctaLabel: "选择服务",
    iconKey: "github",
    packageHighlights: [
      { title: "GitHub Stars", result: "约 50 Stars", price: "$20 起" },
      { title: "GitHub Forks", result: "约 30 Forks", price: "$35 起" },
      {
        title: "仓库增长组合",
        result: "适合公开项目展示优化",
        price: "$55 起",
      },
    ],
  },
  {
    title: "代币 / NFT 参与",
    slug: "token-nft-participation",
    description: "面向预售、买币与持币场景的真实用户服务",
    previewItems: ["参与预售", "内盘买盘", "持币人数"],
    ctaLabel: "选择服务",
    iconKey: "token",
    packageHighlights: [
      { title: "参与预售", result: "约 120 次参与", price: "$220 起" },
      { title: "内盘买盘", result: "约 100 次买盘参与", price: "$260 起" },
      { title: "持币人数", result: "约 100 次持币参与", price: "$280 起" },
    ],
  },
  {
    title: "App 下载",
    slug: "app-download",
    description: "面向 App 下载与评价的真实用户服务",
    previewItems: ["App 下载", "App Review"],
    ctaLabel: "选择服务",
    iconKey: "app",
    packageHighlights: [
      { title: "App 下载", result: "约 500 下载", price: "$80 起" },
      { title: "App Review", result: "约 80 条评价", price: "$90 起" },
      {
        title: "下载 + 评价组合",
        result: "适合上新期展示承接",
        price: "$170 起",
      },
    ],
  },
];

export const categoryPages: CategoryPageData[] = [
  {
    title: "社交媒体增长",
    slug: "social-media",
    description: "覆盖主流社交平台的真实用户增长服务",
    platforms: socialMediaPlatforms,
  },
  {
    title: "网站注册 + 交互",
    slug: "site-registration",
    description: "面向网站注册、基础交互与付费交互的真实用户服务",
    items: [
      {
        title: "网站注册",
        slug: "site-register",
        description: "适合基础注册承接与首轮用户进入场景。",
      },
      {
        title: "网站注册 + 交互",
        slug: "site-register-interaction",
        description: "适合注册后承接基础站内行为与流程验证。",
      },
      {
        title: "网站注册 + 付费交互",
        slug: "site-register-paid-interaction",
        description: "适合更深层流程承接与关键转化节点验证。",
      },
      {
        title: "网站注册（需要 KYC）",
        slug: "site-register-kyc",
        description: "适合需要完成 KYC 流程的注册场景与受限入口承接。",
      },
      {
        title: "网站注册（需要 KYC）+ 交互",
        slug: "site-register-kyc-interaction",
        description: "适合完成 KYC 后继续承接基础交互与流程验证。",
      },
      {
        title: "网站注册（需要 KYC）+ 付费交互",
        slug: "site-register-kyc-paid-interaction",
        description: "适合完成 KYC 后承接更深层付费交互与关键节点验证。",
      },
    ],
  },
  {
    title: "GitHub 增长",
    slug: "github-growth",
    description: "面向 GitHub 账号与仓库增长的真实用户服务",
    items: [
      {
        title: "GitHub Stars",
        slug: "github-stars",
        description: "适合强化仓库展示与第一印象。",
      },
      {
        title: "GitHub Forks",
        slug: "github-forks",
        description: "适合补强仓库互动层级与项目热度。",
      },
    ],
  },
  {
    title: "参与代币或 NFT 预售 / 购买代币 / 持有代币",
    slug: "token-nft-participation",
    description: "面向预售参与、买币与持有代币场景的真实用户服务",
    items: [
      {
        title: "参与预售",
        slug: "token-nft-presale",
        description: "适合预售参与场景与阶段性活动承接。",
      },
      {
        title: "内盘买盘",
        slug: "token-buy",
        description: "适合买币场景演示与关键节点承接。",
      },
      {
        title: "持币人数",
        slug: "token-hold",
        description: "适合持币结构展示与阶段性规模补强。",
      },
    ],
  },
  {
    title: "App 下载",
    slug: "app-download",
    description: "面向 App 下载与评价的真实用户服务",
    items: [
      {
        title: "App 下载",
        slug: "app-download",
        description: "适合下载量铺垫与商店展示基础优化。",
      },
      {
        title: "App Review",
        slug: "app-review",
        description: "适合评价展示补强与商店观感优化。",
      },
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return categoryPages.find((category) => category.slug === slug) ?? null;
}
