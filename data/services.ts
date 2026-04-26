export type ServiceField = {
  key: string;
  label: string;
  type: "text" | "number" | "url" | "select";
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export type ServicePackage = {
  id: string;
  label: string;
  price: string;
  displayPrice?: string;
  internalCost?: string;
  participants?: string;
  result: string;
  deliveryTime?: string;
  durationLabel?: string;
  durationHours?: string;
  recommended?: boolean;
};

export type Service = {
  slug: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  price: string;
  deliveryTime: string;
  scenarios: string[];
  notes: string[];
  fields: ServiceField[];
  packages?: ServicePackage[];
};

export type ServiceAction = {
  label: string;
  slug: string;
};

export type PlatformIconKey =
  | "x"
  | "instagram"
  | "facebook"
  | "telegram"
  | "tiktok"
  | "discord"
  | "threads"
  | "binance";

export type PlatformGroup = {
  platform: string;
  iconKey: PlatformIconKey;
  description: string;
  actions: ServiceAction[];
};

type ActionKind =
  | "follow"
  | "like"
  | "comment"
  | "retweet"
  | "kol-comment"
  | "join-group";

type SocialPlatformConfig = {
  platform: string;
  iconKey: PlatformIconKey;
  description: string;
  targetLabel: string;
  contentLabel: string;
  actions: Array<{
    label: string;
    slug: string;
    kind: ActionKind;
  }>;
};

const regionField: ServiceField = {
  key: "region",
  label: "国家 / 地区",
  type: "select",
  required: true,
  options: ["Global", "United States", "Japan", "Singapore", "Hong Kong"],
};

function urlField(key: string, label: string, placeholder: string): ServiceField {
  return {
    key,
    label,
    type: "url",
    required: true,
    placeholder,
  };
}

function createService(input: Service): Service {
  return input;
}

export function getDefaultServicePackage(packages?: ServicePackage[]) {
  if (!packages?.length) {
    return null;
  }

  return packages.find((item) => item.recommended) ?? packages[0];
}

function createPackages(
  slug: string,
  items: Array<{
    price: string;
    displayPrice?: string;
    internalCost?: string;
    participants?: string;
    result: string;
    deliveryTime: string;
    durationLabel?: string;
    durationHours?: string;
    label?: string;
    recommended?: boolean;
  }>,
): ServicePackage[] {
  return items.map((item, index) => ({
    id: `${slug}-package-${index + 1}`,
    label:
      item.label ??
      (index === 0 ? "入门方案" : index === 1 ? "增长方案" : "扩量方案"),
    price: item.displayPrice ?? item.price,
    displayPrice: item.displayPrice ?? item.price,
    internalCost: item.internalCost,
    participants: item.participants,
    result: item.result,
    deliveryTime: item.durationLabel ?? item.deliveryTime,
    durationLabel: item.durationLabel ?? item.deliveryTime,
    durationHours: item.durationHours,
    recommended: index === items.length - 1,
  }));
}

function getPackageStartPrice(packages: ServicePackage[]) {
  return `${packages[0]?.price ?? "$0"} 起`;
}

function getPackageDeliveryTime(packages: ServicePackage[]) {
  return getDefaultServicePackage(packages)?.deliveryTime ?? packages[0]?.deliveryTime ?? "24-72 小时";
}

const socialMediaPlatformConfigs: SocialPlatformConfig[] = [
  {
    platform: "X",
    iconKey: "x",
    description: "适合账号增长、内容互动与讨论度提升",
    targetLabel: "账号链接",
    contentLabel: "内容链接",
    actions: [
      { label: "关注增长", slug: "x-follow", kind: "follow" },
      { label: "点赞增长", slug: "x-like", kind: "like" },
      { label: "评论增长", slug: "x-comment", kind: "comment" },
      { label: "转推增长", slug: "x-retweet", kind: "retweet" },
      { label: "蓝V KOL评论", slug: "x-kol-comment", kind: "kol-comment" },
    ],
  },
  {
    platform: "Instagram",
    iconKey: "instagram",
    description: "适合主页增长与内容互动提升",
    targetLabel: "账号链接",
    contentLabel: "内容链接",
    actions: [
      { label: "关注增长", slug: "instagram-follow", kind: "follow" },
      { label: "点赞增长", slug: "instagram-like", kind: "like" },
      { label: "评论增长", slug: "instagram-comment", kind: "comment" },
    ],
  },
  {
    platform: "Facebook",
    iconKey: "facebook",
    description: "适合页面增长与内容互动提升",
    targetLabel: "主页链接",
    contentLabel: "内容链接",
    actions: [
      { label: "关注增长", slug: "facebook-follow", kind: "follow" },
      { label: "点赞增长", slug: "facebook-like", kind: "like" },
      { label: "评论增长", slug: "facebook-comment", kind: "comment" },
    ],
  },
  {
    platform: "Telegram",
    iconKey: "telegram",
    description: "适合社群规模增长与群组扩展",
    targetLabel: "群组链接",
    contentLabel: "内容链接",
    actions: [{ label: "加入群组", slug: "telegram-join-group", kind: "join-group" }],
  },
  {
    platform: "TikTok",
    iconKey: "tiktok",
    description: "适合内容传播与互动提升",
    targetLabel: "账号链接",
    contentLabel: "内容链接",
    actions: [
      { label: "关注增长", slug: "tiktok-follow", kind: "follow" },
      { label: "点赞增长", slug: "tiktok-like", kind: "like" },
      { label: "评论增长", slug: "tiktok-comment", kind: "comment" },
    ],
  },
  {
    platform: "Discord",
    iconKey: "discord",
    description: "适合社区规模增长与群组扩展",
    targetLabel: "群组链接",
    contentLabel: "内容链接",
    actions: [{ label: "加入群组", slug: "discord-join-group", kind: "join-group" }],
  },
  {
    platform: "Threads",
    iconKey: "threads",
    description: "适合账号增长与内容互动提升",
    targetLabel: "账号链接",
    contentLabel: "内容链接",
    actions: [
      { label: "关注增长", slug: "threads-follow", kind: "follow" },
      { label: "点赞增长", slug: "threads-like", kind: "like" },
      { label: "评论增长", slug: "threads-comment", kind: "comment" },
    ],
  },
  {
    platform: "Binance 广场粉丝",
    iconKey: "binance",
    description: "适合账号增长与内容曝光提升",
    targetLabel: "账号链接",
    contentLabel: "内容链接",
    actions: [{ label: "关注增长", slug: "binance-follow", kind: "follow" }],
  },
];

export const socialMediaPlatforms: PlatformGroup[] = socialMediaPlatformConfigs.map(
  ({ platform, iconKey, description, actions }) => ({
    platform,
    iconKey,
    description,
    actions: actions.map(({ label, slug }) => ({ label, slug })),
  }),
);

const packageMap: Record<string, ServicePackage[]> = {
  "x-follow": createPackages("x-follow", [
    { price: "$50", result: "约 500 关注", deliveryTime: "24 小时" },
    {
      price: "$100",
      result: "约 1,200 关注",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$200", result: "约 2,800 关注", deliveryTime: "48 小时" },
  ]),
  "x-like": createPackages("x-like", [
    { price: "$30", result: "约 300 点赞", deliveryTime: "24 小时" },
    {
      price: "$80",
      result: "约 1,000 点赞",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$150", result: "约 2,200 点赞", deliveryTime: "36 小时" },
  ]),
  "x-comment": createPackages("x-comment", [
    { price: "$45", result: "约 60 评论", deliveryTime: "24 小时" },
    {
      price: "$120",
      result: "约 160 评论",
      deliveryTime: "36 小时",
      recommended: true,
    },
    { price: "$220", result: "约 360 评论", deliveryTime: "48 小时" },
  ]),
  "x-retweet": createPackages("x-retweet", [
    { price: "$40", result: "约 250 转推", deliveryTime: "24 小时" },
    {
      price: "$90",
      result: "约 700 转推",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$180", result: "约 1,600 转推", deliveryTime: "36 小时" },
  ]),
  "x-kol-comment": createPackages("x-kol-comment", [
    { price: "$160", result: "约 20 条评论", deliveryTime: "36 小时" },
    {
      price: "$300",
      result: "约 45 条评论",
      deliveryTime: "48 小时",
      recommended: true,
    },
    { price: "$520", result: "约 80 条评论", deliveryTime: "72 小时" },
  ]),
  "instagram-follow": createPackages("instagram-follow", [
    {
      price: "$75",
      displayPrice: "$75",
      internalCost: "$10",
      participants: "500",
      result: "500 参与人数",
      deliveryTime: "3天",
      durationLabel: "3天",
      durationHours: "72 Hours",
    },
    {
      price: "$150",
      displayPrice: "$150",
      internalCost: "$20",
      participants: "1000",
      result: "1000 参与人数",
      deliveryTime: "5天",
      durationLabel: "5天",
      durationHours: "120 Hours",
      recommended: true,
    },
    {
      price: "$300",
      displayPrice: "$300",
      internalCost: "$50",
      participants: "2000",
      result: "2000 参与人数",
      deliveryTime: "7天",
      durationLabel: "7天",
      durationHours: "168 Hours",
    },
  ]),
  "instagram-like": createPackages("instagram-like", [
    { price: "$25", result: "约 400 点赞", deliveryTime: "24 小时" },
    {
      price: "$70",
      result: "约 1,200 点赞",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$135", result: "约 2,600 点赞", deliveryTime: "36 小时" },
  ]),
  "instagram-comment": createPackages("instagram-comment", [
    { price: "$55", result: "约 80 评论", deliveryTime: "24 小时" },
    {
      price: "$140",
      result: "约 220 评论",
      deliveryTime: "36 小时",
      recommended: true,
    },
    { price: "$260", result: "约 480 评论", deliveryTime: "48 小时" },
  ]),
  "facebook-follow": createPackages("facebook-follow", [
    { price: "$45", result: "约 500 关注", deliveryTime: "24 小时" },
    {
      price: "$95",
      result: "约 1,100 关注",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$180", result: "约 2,500 关注", deliveryTime: "48 小时" },
  ]),
  "facebook-like": createPackages("facebook-like", [
    { price: "$30", result: "约 400 点赞", deliveryTime: "24 小时" },
    {
      price: "$78",
      result: "约 1,200 点赞",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$145", result: "约 2,800 点赞", deliveryTime: "36 小时" },
  ]),
  "facebook-comment": createPackages("facebook-comment", [
    { price: "$55", result: "约 80 评论", deliveryTime: "24 小时" },
    {
      price: "$140",
      result: "约 220 评论",
      deliveryTime: "36 小时",
      recommended: true,
    },
    { price: "$260", result: "约 500 评论", deliveryTime: "48 小时" },
  ]),
  "telegram-join-group": createPackages("telegram-join-group", [
    {
      price: "$2",
      displayPrice: "$2",
      internalCost: "$1",
      participants: "300",
      result: "约 300 人加入群组",
      deliveryTime: "72 小时",
      durationLabel: "72 小时",
      durationHours: "72 Hours",
    },
    {
      price: "$140",
      result: "约 900 人加入群组",
      deliveryTime: "36 小时",
      recommended: true,
    },
    { price: "$260", result: "约 2,000 人加入群组", deliveryTime: "48 小时" },
  ]),
  "tiktok-follow": createPackages("tiktok-follow", [
    { price: "$45", result: "约 500 关注", deliveryTime: "24 小时" },
    {
      price: "$95",
      result: "约 1,100 关注",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$180", result: "约 2,500 关注", deliveryTime: "48 小时" },
  ]),
  "tiktok-like": createPackages("tiktok-like", [
    { price: "$28", result: "约 500 点赞", deliveryTime: "24 小时" },
    {
      price: "$75",
      result: "约 1,500 点赞",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$145", result: "约 3,500 点赞", deliveryTime: "36 小时" },
  ]),
  "tiktok-comment": createPackages("tiktok-comment", [
    { price: "$55", result: "约 80 评论", deliveryTime: "24 小时" },
    {
      price: "$140",
      result: "约 220 评论",
      deliveryTime: "36 小时",
      recommended: true,
    },
    { price: "$260", result: "约 500 评论", deliveryTime: "48 小时" },
  ]),
  "discord-join-group": createPackages("discord-join-group", [
    { price: "$60", result: "约 250 人加入群组", deliveryTime: "24 小时" },
    {
      price: "$140",
      result: "约 800 人加入群组",
      deliveryTime: "36 小时",
      recommended: true,
    },
    { price: "$260", result: "约 1,800 人加入群组", deliveryTime: "48 小时" },
  ]),
  "threads-follow": createPackages("threads-follow", [
    { price: "$45", result: "约 500 关注", deliveryTime: "24 小时" },
    {
      price: "$95",
      result: "约 1,100 关注",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$180", result: "约 2,500 关注", deliveryTime: "48 小时" },
  ]),
  "threads-like": createPackages("threads-like", [
    { price: "$28", result: "约 450 点赞", deliveryTime: "24 小时" },
    {
      price: "$75",
      result: "约 1,300 点赞",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$145", result: "约 3,000 点赞", deliveryTime: "36 小时" },
  ]),
  "threads-comment": createPackages("threads-comment", [
    { price: "$55", result: "约 80 评论", deliveryTime: "24 小时" },
    {
      price: "$140",
      result: "约 220 评论",
      deliveryTime: "36 小时",
      recommended: true,
    },
    { price: "$260", result: "约 500 评论", deliveryTime: "48 小时" },
  ]),
  "binance-follow": createPackages("binance-follow", [
    { price: "$50", result: "约 400 关注", deliveryTime: "24 小时" },
    {
      price: "$110",
      result: "约 1,000 关注",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$210", result: "约 2,200 关注", deliveryTime: "48 小时" },
  ]),
  "twitter-growth": createPackages("twitter-growth", [
    { price: "$50", result: "约 500 粉丝", deliveryTime: "24 小时" },
    {
      price: "$100",
      result: "约 1,200 粉丝",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$200", result: "约 2,800 粉丝", deliveryTime: "48 小时" },
  ]),
  "tweet-engagement": createPackages("tweet-engagement", [
    { price: "$30", result: "约 300 互动", deliveryTime: "24 小时" },
    {
      price: "$85",
      result: "约 1,000 互动",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$160", result: "约 2,400 互动", deliveryTime: "36 小时" },
  ]),
  "verified-comments": createPackages("verified-comments", [
    { price: "$100", result: "约 40 条评论", deliveryTime: "24 小时" },
    {
      price: "$220",
      result: "约 100 条评论",
      deliveryTime: "36 小时",
      recommended: true,
    },
    { price: "$420", result: "约 220 条评论", deliveryTime: "48 小时" },
  ]),
  "airdrop-campaign": createPackages("airdrop-campaign", [
    { price: "$200", result: "约 800 参与", deliveryTime: "48 小时" },
    {
      price: "$420",
      result: "约 2,000 参与",
      deliveryTime: "72 小时",
      recommended: true,
    },
    { price: "$780", result: "约 4,500 参与", deliveryTime: "72 小时" },
  ]),
  "github-stars": createPackages("github-stars", [
    { price: "$20", result: "约 50 Stars", deliveryTime: "24 小时" },
    {
      price: "$50",
      result: "约 150 Stars",
      deliveryTime: "24 小时",
      recommended: true,
    },
    { price: "$100", result: "约 400 Stars", deliveryTime: "48 小时" },
  ]),
  "app-download-review": createPackages("app-download-review", [
    { price: "$80", result: "约 300 下载 + Review", deliveryTime: "48 小时" },
    {
      price: "$180",
      result: "约 800 下载 + Review",
      deliveryTime: "72 小时",
      recommended: true,
    },
    { price: "$360", result: "约 2,000 下载 + Review", deliveryTime: "72 小时" },
  ]),
  "site-register": createPackages("site-register", [
    { price: "$70", result: "约 120 次注册", deliveryTime: "24 小时" },
    {
      price: "$160",
      result: "约 320 次注册",
      deliveryTime: "36 小时",
      recommended: true,
    },
    { price: "$300", result: "约 700 次注册", deliveryTime: "48 小时" },
  ]),
  "site-register-interaction": createPackages("site-register-interaction", [
    { price: "$120", result: "约 100 次注册 + 交互", deliveryTime: "36 小时" },
    {
      price: "$260",
      result: "约 260 次注册 + 交互",
      deliveryTime: "48 小时",
      recommended: true,
    },
    { price: "$480", result: "约 560 次注册 + 交互", deliveryTime: "72 小时" },
  ]),
  "site-register-paid-interaction": createPackages("site-register-paid-interaction", [
    { price: "$180", result: "约 80 次注册 + 付费交互", deliveryTime: "48 小时" },
    {
      price: "$360",
      result: "约 180 次注册 + 付费交互",
      deliveryTime: "72 小时",
      recommended: true,
    },
    { price: "$680", result: "约 420 次注册 + 付费交互", deliveryTime: "72 小时" },
  ]),
  "site-register-kyc": createPackages("site-register-kyc", [
    { price: "$120", result: "约 80 次注册（含 KYC）", deliveryTime: "48 小时" },
    {
      price: "$260",
      result: "约 180 次注册（含 KYC）",
      deliveryTime: "72 小时",
      recommended: true,
    },
    { price: "$480", result: "约 420 次注册（含 KYC）", deliveryTime: "72 小时" },
  ]),
  "site-register-kyc-interaction": createPackages("site-register-kyc-interaction", [
    { price: "$180", result: "约 60 次注册（含 KYC）+ 交互", deliveryTime: "48 小时" },
    {
      price: "$360",
      result: "约 140 次注册（含 KYC）+ 交互",
      deliveryTime: "72 小时",
      recommended: true,
    },
    {
      price: "$680",
      result: "约 320 次注册（含 KYC）+ 交互",
      deliveryTime: "72 小时",
    },
  ]),
  "site-register-kyc-paid-interaction": createPackages("site-register-kyc-paid-interaction", [
    { price: "$260", result: "约 50 次注册（含 KYC）+ 付费交互", deliveryTime: "48 小时" },
    {
      price: "$520",
      result: "约 120 次注册（含 KYC）+ 付费交互",
      deliveryTime: "72 小时",
      recommended: true,
    },
    {
      price: "$960",
      result: "约 280 次注册（含 KYC）+ 付费交互",
      deliveryTime: "72 小时",
    },
  ]),
  "github-forks": createPackages("github-forks", [
    { price: "$35", result: "约 30 Forks", deliveryTime: "24 小时" },
    {
      price: "$80",
      result: "约 90 Forks",
      deliveryTime: "36 小时",
      recommended: true,
    },
    { price: "$160", result: "约 220 Forks", deliveryTime: "48 小时" },
  ]),
  "token-nft-presale": createPackages("token-nft-presale", [
    { price: "$220", result: "约 120 次参与", deliveryTime: "48 小时" },
    {
      price: "$460",
      result: "约 320 次参与",
      deliveryTime: "72 小时",
      recommended: true,
    },
    { price: "$860", result: "约 750 次参与", deliveryTime: "72 小时" },
  ]),
  "token-buy": createPackages("token-buy", [
    { price: "$260", result: "约 100 次买币参与", deliveryTime: "48 小时" },
    {
      price: "$520",
      result: "约 260 次买币参与",
      deliveryTime: "72 小时",
      recommended: true,
    },
    { price: "$980", result: "约 620 次买币参与", deliveryTime: "72 小时" },
  ]),
  "token-hold": createPackages("token-hold", [
    { price: "$280", result: "约 100 次持币参与", deliveryTime: "48 小时" },
    {
      price: "$560",
      result: "约 260 次持币参与",
      deliveryTime: "72 小时",
      recommended: true,
    },
    { price: "$1,020", result: "约 620 次持币参与", deliveryTime: "72 小时" },
  ]),
  "app-download": createPackages("app-download", [
    { price: "$80", result: "约 500 下载", deliveryTime: "48 小时" },
    {
      price: "$150",
      result: "约 1,200 下载",
      deliveryTime: "72 小时",
      recommended: true,
    },
    { price: "$300", result: "约 3,000 下载", deliveryTime: "72 小时" },
  ]),
  "app-review": createPackages("app-review", [
    { price: "$90", result: "约 80 条评价", deliveryTime: "48 小时" },
    {
      price: "$180",
      result: "约 220 条评价",
      deliveryTime: "72 小时",
      recommended: true,
    },
    { price: "$360", result: "约 520 条评价", deliveryTime: "72 小时" },
  ]),
};

function getPackagesBySlug(slug: string) {
  return packageMap[slug];
}

const socialActionMeta: Record<
  ActionKind,
  {
    serviceName: string;
    shortDesc: (platform: string) => string;
    fullDesc: (platform: string) => string;
    fields: (config: SocialPlatformConfig) => ServiceField[];
    scenarios: (platform: string) => string[];
    notes: (config: SocialPlatformConfig) => string[];
  }
> = {
  follow: {
    serviceName: "关注增长",
    shortDesc: (platform) =>
      `面向 ${platform} 的账号增长服务，适合提升主页体量与对外展示效果。`,
    fullDesc: (platform) =>
      `该服务适合希望在 ${platform} 上提升账号关注规模的项目、品牌与个人主页，用于建立更完整的外部展示基础，并增强主页在活动周期与传播节点中的承接能力。`,
    fields: (config) => [
      urlField("targetUrl", config.targetLabel, "请输入目标主页或账号链接"),
    ],
    scenarios: (platform) => [
      `${platform} 账号冷启动`,
      "活动前提升主页基础展示效果",
      "配合内容投放扩大账号曝光承接",
    ],
    notes: (config) => [
      `请提供可正常访问的${config.targetLabel}`,
      "建议根据当前账号体量选择合适套餐",
      "下单前请确认目标主页已公开展示",
    ],
  },
  like: {
    serviceName: "点赞增长",
    shortDesc: (platform) =>
      `面向 ${platform} 的内容热度服务，适合提升重点内容的互动表现。`,
    fullDesc: (platform) =>
      `该服务聚焦于 ${platform} 单条内容的互动表现，适合重点内容扩散、活动预热与阶段性热度补强，用于让内容在关键窗口获得更直接的可见度。`,
    fields: (config) => [
      urlField("contentUrl", config.contentLabel, "请输入目标内容链接"),
    ],
    scenarios: (platform) => [
      `${platform} 重点内容热度补强`,
      "活动预热阶段提升互动表现",
      "强化内容在传播窗口期的承接效果",
    ],
    notes: () => [
      "请提供可正常访问的内容链接",
      "建议内容已公开且处于可访问状态",
      "建议按当前内容热度选择匹配套餐",
    ],
  },
  comment: {
    serviceName: "评论增长",
    shortDesc: (platform) =>
      `面向 ${platform} 的评论区增长服务，适合提升讨论度与互动深度。`,
    fullDesc: (platform) =>
      `该服务适合需要在 ${platform} 上强化讨论氛围与评论区活跃度的内容场景，可用于重点发布节点、合作官宣与内容热度补强。`,
    fields: (config) => [
      urlField("contentUrl", config.contentLabel, "请输入目标内容链接"),
    ],
    scenarios: (platform) => [
      `${platform} 内容评论区补强`,
      "活动或合作发布时提升讨论氛围",
      "增强内容页的互动感与停留感",
    ],
    notes: () => [
      "请确保目标内容仍可持续访问",
      "评论规模建议结合当前内容热度设置",
      "若内容链接变更，请重新提交订单信息",
    ],
  },
  retweet: {
    serviceName: "转推增长",
    shortDesc: () =>
      "面向 X 的内容扩散服务，适合提升二次传播效率与内容外溢效果。",
    fullDesc: () =>
      "该服务聚焦重点内容的扩散效率与转发密度，适合重要公告、合作发布与活动预热等强调传播速度的场景。",
    fields: () => [urlField("contentUrl", "内容链接", "请输入目标内容链接")],
    scenarios: () => [
      "重点公告发布后的集中扩散",
      "活动预热阶段提升传播声量",
      "强化内容在短时间窗口内的外溢效果",
    ],
    notes: () => [
      "请提供目标内容的公开链接",
      "建议内容发布时间与下单时间保持接近",
      "如传播节奏变化，可重新提交新链接",
    ],
  },
  "kol-comment": {
    serviceName: "蓝V KOL评论",
    shortDesc: () =>
      "面向 X 的高阶评论展示服务，适合重点内容的评论区强化与专业感呈现。",
    fullDesc: () =>
      "该服务适合需要在重点内容评论区呈现更高阶讨论感的场景，可用于重要官宣、合作发布与核心传播节点的评论区补强。",
    fields: () => [urlField("contentUrl", "内容链接", "请输入目标内容链接")],
    scenarios: () => [
      "重要官宣与合作发布的评论区补强",
      "需要提升高阶讨论感的重点内容页面",
      "强化内容的信任感与讨论密度",
    ],
    notes: () => [
      "请确保目标内容已公开展示且可访问",
      "该服务更适合重点内容与关键发布节点",
      "建议与整体传播节奏协同安排，避免集中堆叠",
    ],
  },
  "join-group": {
    serviceName: "加入群组",
    shortDesc: (platform) =>
      `面向 ${platform} 的群组扩展服务，适合提升社区规模与入口承接能力。`,
    fullDesc: (platform) =>
      `该服务适合希望在 ${platform} 上扩大群组规模与社区基础的项目，可用于冷启动、活动导流与阶段性社群扩展场景。`,
    fields: (config) => [
      urlField("groupUrl", config.targetLabel, "请输入目标群组或社群链接"),
    ],
    scenarios: (platform) => [
      `${platform} 社群冷启动与成员扩展`,
      "活动周期内补强群组规模与承接能力",
      "阶段性拉新时提升社区入口热度",
    ],
    notes: (config) => [
      `请提供可正常访问的${config.targetLabel}`,
      "建议结合当前群组承接能力选择合理套餐",
      "请确认目标群组规则与当前引流节奏保持一致",
    ],
  },
};

function createSocialService(
  config: SocialPlatformConfig,
  action: SocialPlatformConfig["actions"][number],
): Service {
  const packages = getPackagesBySlug(action.slug);
  const meta = socialActionMeta[action.kind];

  return createService({
    slug: action.slug,
    name: `${config.platform} ${meta.serviceName}`,
    shortDesc: meta.shortDesc(config.platform),
    fullDesc: meta.fullDesc(config.platform),
    price: getPackageStartPrice(packages),
    deliveryTime: getPackageDeliveryTime(packages),
    scenarios: meta.scenarios(config.platform),
    notes: meta.notes(config),
    fields: meta.fields(config),
    packages,
  });
}

const socialMediaServices = socialMediaPlatformConfigs.flatMap((config) =>
  config.actions.map((action) => createSocialService(config, action)),
);

function createPackagedService(input: Omit<Service, "price" | "deliveryTime" | "packages"> & { packages: ServicePackage[] }): Service {
  return createService({
    ...input,
    price: getPackageStartPrice(input.packages),
    deliveryTime: getPackageDeliveryTime(input.packages),
    packages: input.packages,
  });
}

const legacyServices: Service[] = [
  createPackagedService({
    slug: "twitter-growth",
    name: "Twitter 粉丝增长",
    shortDesc: "提升账号关注与曝光，适用于新账号冷启动与社区扩散场景。",
    fullDesc:
      "该服务适合希望稳步提升账号关注规模的项目账号、品牌主页与个人账号，用于建立更完整的对外展示基础与主页承接效果。",
    scenarios: ["新账号建立基础关注度", "品牌活动前提升主页可信度", "配合内容投放扩大账号曝光"],
    notes: ["请提供可正常访问的账号链接", "建议根据当前账号体量选择合理套餐", "下单前请确认账号信息已公开展示"],
    fields: [urlField("accountUrl", "账号链接", "请输入账号主页链接")],
    packages: getPackagesBySlug("twitter-growth"),
  }),
  createPackagedService({
    slug: "tweet-engagement",
    name: "推文互动引流",
    shortDesc: "提升内容互动表现，适用于重点推文扩散与活动预热。",
    fullDesc:
      "该服务围绕单条内容的互动表现设计，适合新品发布、合作官宣、活动预热与阶段性传播节点，用于增强内容热度与讨论感。",
    scenarios: ["重点推文发布后的集中扩散", "活动预热阶段提升互动密度", "新产品与里程碑公告曝光强化"],
    notes: ["请提供需要引流的单条内容链接", "建议内容已公开且处于可访问状态", "方案建议与当前账号基础体量保持协调"],
    fields: [urlField("postUrl", "推文链接", "请输入推文链接")],
    packages: getPackagesBySlug("tweet-engagement"),
  }),
  createPackagedService({
    slug: "verified-comments",
    name: "Verified 评论",
    shortDesc: "高质量账号评论互动，适用于重点内容讨论区的信任建立。",
    fullDesc:
      "该服务适合需要在重点内容下建立讨论感与可信度的场景，可用于强化评论区观感、内容参与感与重要发布节点的讨论氛围。",
    scenarios: ["品牌官宣内容下建立讨论氛围", "重点合作发布时增强评论区可信度", "提升核心内容页的参与感与停留感"],
    notes: ["请提供需要评论互动的内容链接", "评论规模建议与内容热度匹配", "若内容链接变化，请重新提交信息"],
    fields: [urlField("postUrl", "推文链接", "请输入推文链接")],
    packages: getPackagesBySlug("verified-comments"),
  }),
  createPackagedService({
    slug: "airdrop-campaign",
    name: "Airdrop Campaign",
    shortDesc: "提升活动参与度与传播效果，适用于拉新扩散与阶段性增长活动。",
    fullDesc:
      "该服务适合活动冷启动、阶段性拉新与传播扩散场景，用于帮助活动页面更快进入传播节奏并建立初始热度。",
    scenarios: ["新活动上线后的初始参与提升", "阶段性传播计划中的集中扩散", "需要快速建立活动热度的增长节点"],
    notes: ["请确保活动页面可正常访问", "目标规模应结合活动承接能力评估", "如活动规则变化，建议重新确认需求"],
    fields: [urlField("campaignUrl", "活动链接", "请输入活动链接")],
    packages: getPackagesBySlug("airdrop-campaign"),
  }),
  createPackagedService({
    slug: "github-stars",
    name: "GitHub Stars",
    shortDesc: "面向 GitHub 仓库展示与可信度提升的真实用户服务。",
    fullDesc:
      "该服务适合希望强化开源项目展示效果的团队与个人，用于优化仓库展示页、提升公开项目的承接效果与第一印象。",
    scenarios: ["项目公开发布前优化展示效果", "对外合作前增强可信度", "开源仓库冷启动阶段建立基础热度"],
    notes: ["请提供公开可访问的仓库链接", "建议目标方案与项目阶段保持匹配", "若仓库地址更新，请重新提交订单信息"],
    fields: [urlField("repoUrl", "仓库链接", "请输入仓库链接")],
    packages: getPackagesBySlug("github-stars"),
  }),
  createPackagedService({
    slug: "app-download-review",
    name: "App 下载 / Review",
    shortDesc: "真实用户下载与评价，适用于应用冷启动与商店展示优化。",
    fullDesc:
      "该服务适合应用上新、区域推广与商店展示优化等场景，用于帮助应用建立更完整的商店展示基础与初始下载反馈。",
    scenarios: ["应用上新后的首轮数据铺垫", "重点地区推广前提升展示基础", "产品迭代节点强化下载与评价表现"],
    notes: ["请提供可访问的应用链接", "国家或地区信息请按目标投放填写", "建议结合当前应用承接能力选择套餐"],
    fields: [
      urlField("appUrl", "App 链接", "请输入应用链接"),
      regionField,
    ],
    packages: getPackagesBySlug("app-download-review"),
  }),
];

const categoryServices: Service[] = [
  createPackagedService({
    slug: "site-register",
    name: "网站注册",
    shortDesc: "面向网站注册场景的真实用户服务，适合基础拉新与首轮转化承接。",
    fullDesc:
      "该服务适合需要完成网站注册动作的场景，可用于活动页、产品等待名单、社区招募与各类基础注册入口的承接。",
    scenarios: ["活动页注册承接", "产品内测名单扩充", "官网注册数据铺垫"],
    notes: ["请提供可正常访问的网站链接", "请确认注册入口开放且流程完整", "若注册流程有变动，请重新提交需求"],
    fields: [urlField("siteUrl", "网站链接", "请输入目标网站链接")],
    packages: getPackagesBySlug("site-register"),
  }),
  createPackagedService({
    slug: "site-register-interaction",
    name: "网站注册 + 交互",
    shortDesc: "面向网站注册与基础交互场景的真实用户服务。",
    fullDesc:
      "该服务适合需要完成注册并承接基础站内交互的场景，可用于验证产品流程、活动页承接与站内行为铺垫。",
    scenarios: ["注册后完成基础站内操作", "活动页注册与交互承接", "产品流程体验验证"],
    notes: ["请提供网站链接与交互要求", "请确保相关页面可正常访问", "建议事先确认交互路径与入口说明"],
    fields: [urlField("siteUrl", "网站链接", "请输入目标网站链接")],
    packages: getPackagesBySlug("site-register-interaction"),
  }),
  createPackagedService({
    slug: "site-register-paid-interaction",
    name: "网站注册 + 付费交互",
    shortDesc: "面向网站注册与付费型交互场景的真实用户服务。",
    fullDesc:
      "该服务适合需要注册并完成更深层交互动作的场景，可用于活动转化、流程承接与阶段性增长需求的演示验证。",
    scenarios: ["注册后承接更深层交互流程", "产品关键转化节点验证", "活动型页面的付费交互承接"],
    notes: ["请在下单前确认流程说明完整", "请确保目标网站访问正常", "建议明确付费交互的路径与目标动作"],
    fields: [urlField("siteUrl", "网站链接", "请输入目标网站链接")],
    packages: getPackagesBySlug("site-register-paid-interaction"),
  }),
  createPackagedService({
    slug: "site-register-kyc",
    name: "网站注册（需要 KYC）",
    shortDesc: "面向需要完成 KYC 流程的网站注册场景的真实用户服务。",
    fullDesc:
      "该服务适合注册流程中包含 KYC 验证的网站场景，可用于受限入口承接、阶段性拉新验证与关键注册流程的演示补强。",
    scenarios: ["需要完成 KYC 的注册入口承接", "受限网站或活动入口的注册流程验证", "阶段性拉新中的 KYC 注册承接"],
    notes: ["请在下单前确认 KYC 流程说明完整", "请确保网站链接与相关步骤可正常访问", "建议明确是否存在区域、材料或验证步骤要求"],
    fields: [urlField("siteUrl", "网站链接", "请输入目标网站链接")],
    packages: getPackagesBySlug("site-register-kyc"),
  }),
  createPackagedService({
    slug: "site-register-kyc-interaction",
    name: "网站注册（需要 KYC）+ 交互",
    shortDesc: "面向需要完成 KYC 后继续承接基础交互流程的真实用户服务。",
    fullDesc:
      "该服务适合注册流程中包含 KYC 验证，且在完成注册后仍需继续承接站内基础交互的场景，可用于流程验证、页面承接与活动体验补强。",
    scenarios: ["完成 KYC 后继续承接基础交互", "活动页或产品流程中的 KYC + 交互验证", "受限入口场景下的注册与站内行为承接"],
    notes: ["请提供网站链接与交互要求", "请确保 KYC 完成后的页面与操作路径可访问", "建议提前确认注册、验证与交互步骤说明"],
    fields: [urlField("siteUrl", "网站链接", "请输入目标网站链接")],
    packages: getPackagesBySlug("site-register-kyc-interaction"),
  }),
  createPackagedService({
    slug: "site-register-kyc-paid-interaction",
    name: "网站注册（需要 KYC）+ 付费交互",
    shortDesc: "面向需要完成 KYC 后继续承接付费型交互的真实用户服务。",
    fullDesc:
      "该服务适合注册流程中包含 KYC 验证，且在完成注册后还需进入更深层付费交互的场景，可用于关键节点验证、阶段性转化承接与流程演示补强。",
    scenarios: ["完成 KYC 后承接付费型交互流程", "关键转化节点中的 KYC + 付费交互验证", "活动与产品链路中的深层承接场景"],
    notes: ["请在下单前确认流程说明完整", "请确保 KYC、注册与付费交互路径均可正常访问", "建议明确目标动作、节点顺序与承接要求"],
    fields: [urlField("siteUrl", "网站链接", "请输入目标网站链接")],
    packages: getPackagesBySlug("site-register-kyc-paid-interaction"),
  }),
  createPackagedService({
    slug: "github-forks",
    name: "GitHub Forks",
    shortDesc: "面向 GitHub 仓库互动与展示强化的真实用户服务。",
    fullDesc:
      "该服务适合希望进一步强化仓库活跃度与展示效果的团队与个人，可用于开源项目发布、合作沟通与社区展示场景。",
    scenarios: ["开源项目发布阶段增强仓库观感", "对外展示前提升互动层级", "重点仓库冷启动热度补强"],
    notes: ["请提供公开可访问的仓库链接", "建议与仓库当前热度保持协调", "若仓库地址变更，请重新提交需求"],
    fields: [urlField("repoUrl", "仓库链接", "请输入仓库链接")],
    packages: getPackagesBySlug("github-forks"),
  }),
  createPackagedService({
    slug: "token-nft-presale",
    name: "参与代币或 NFT 预售",
    shortDesc: "面向预售参与场景的真实用户服务。",
    fullDesc:
      "该服务适合需要承接代币或 NFT 预售参与场景的项目，可用于阶段性参与度补强、预售节点扩散与活动承接。",
    scenarios: ["预售活动冷启动", "重点发售节点参与补强", "活动传播与承接验证"],
    notes: ["请提供预售页面链接", "请确认活动规则已公开", "建议结合活动窗口设置目标规模"],
    fields: [urlField("targetUrl", "预售链接", "请输入预售页面链接")],
    packages: getPackagesBySlug("token-nft-presale"),
  }),
  createPackagedService({
    slug: "token-buy",
    name: "购买代币",
    shortDesc: "面向买币场景的真实用户服务。",
    fullDesc:
      "该服务适合需要承接购买代币场景的项目，可用于阶段性参与演示、产品链路承接与关键节点展示。",
    scenarios: ["代币上线后的初始参与承接", "关键传播节点的买币场景演示", "增长活动中的流程验证"],
    notes: ["请提供目标页面链接", "请确保流程说明清晰", "建议明确目标规模与承接节奏"],
    fields: [urlField("targetUrl", "目标链接", "请输入目标页面链接")],
    packages: getPackagesBySlug("token-buy"),
  }),
  createPackagedService({
    slug: "token-hold",
    name: "持有代币",
    shortDesc: "面向持有代币场景的真实用户服务。",
    fullDesc:
      "该服务适合需要补强持币展示与阶段性持有场景的项目，可用于活动承接、展示优化与增长节点演示。",
    scenarios: ["阶段性持币展示优化", "活动承接与参与结构补强", "重点节点的持有场景验证"],
    notes: ["请提供目标页面或说明链接", "请提前确认持有场景要求", "建议结合整体节奏安排服务时间"],
    fields: [urlField("targetUrl", "目标链接", "请输入目标页面链接")],
    packages: getPackagesBySlug("token-hold"),
  }),
  createPackagedService({
    slug: "app-download",
    name: "App 下载",
    shortDesc: "面向 App 下载场景的真实用户服务。",
    fullDesc:
      "该服务适合需要提升应用下载量与商店承接效果的场景，可用于上新、区域推广与阶段性展示优化。",
    scenarios: ["应用上新后的下载铺垫", "重点地区推广前补强下载基础", "阶段性投放中的展示承接"],
    notes: ["请提供可访问的应用链接", "国家或地区信息请按目标填写", "建议结合当前应用承接能力选择方案"],
    fields: [
      urlField("appUrl", "App 链接", "请输入应用链接"),
      regionField,
    ],
    packages: getPackagesBySlug("app-download"),
  }),
  createPackagedService({
    slug: "app-review",
    name: "App Review",
    shortDesc: "面向 App 评价场景的真实用户服务。",
    fullDesc:
      "该服务适合需要提升应用评价展示与商店观感的场景，可用于版本更新、区域运营与阶段性展示优化。",
    scenarios: ["应用版本更新后的评价补强", "重点地区推广前优化商店观感", "阶段性运营中的展示提升"],
    notes: ["请提供可访问的应用链接", "国家或地区信息请按目标填写", "建议与应用当前展示节奏保持协调"],
    fields: [
      urlField("appUrl", "App 链接", "请输入应用链接"),
      regionField,
    ],
    packages: getPackagesBySlug("app-review"),
  }),
];

export const services: Service[] = [
  ...legacyServices,
  ...socialMediaServices,
  ...categoryServices,
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
