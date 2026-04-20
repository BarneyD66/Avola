import type {
  CategoryPageData,
  CategoryPackageHighlight,
  CategoryPreview,
} from "@/data/categories";
import type { Locale } from "@/data/locale";
import type { OrderTimelineItem } from "@/data/orderStore";
import {
  getDefaultServicePackage,
  getServiceBySlug,
  type PlatformGroup,
  type Service,
  type ServiceField,
  type ServicePackage,
} from "@/data/services";

type LocalizedServiceContent = Pick<
  Service,
  "name" | "shortDesc" | "fullDesc" | "scenarios" | "notes"
>;

const enCategoryPreviewMap: Record<
  string,
  {
    title: string;
    description: string;
    previewItems: string[];
    ctaLabel: string;
    packageHighlights: CategoryPackageHighlight[];
  }
> = {
  "social-media": {
    title: "Social Media Growth",
    description:
      "Real user growth services across major social media platforms",
    previewItems: [
      "X",
      "Instagram",
      "Facebook",
      "Telegram",
      "TikTok",
      "Discord",
      "Threads",
      "Binance Feed Followers",
    ],
    ctaLabel: "Select Service",
    packageHighlights: [
      { title: "X Follow Growth", result: "About 500 follows", price: "$50+" },
      {
        title: "Instagram Like Growth",
        result: "About 400 likes",
        price: "$25+",
      },
      {
        title: "Telegram Group Join",
        result: "About 300 group joins",
        price: "$60+",
      },
    ],
  },
  "site-registration": {
    title: "Site Registration + Interaction",
    description:
      "Real user services for registration, interaction, and paid interaction",
    previewItems: [
      "Site Registration",
      "Registration + Interaction",
      "Registration + Paid Interaction",
      "Registration (KYC)",
      "KYC + Interaction",
      "KYC + Paid Interaction",
    ],
    ctaLabel: "Select Service",
    packageHighlights: [
      {
        title: "Site Registration",
        result: "About 120 registrations",
        price: "$70+",
      },
      {
        title: "Site Registration (KYC)",
        result: "About 80 registrations (with KYC)",
        price: "$120+",
      },
      {
        title: "KYC + Interaction",
        result: "About 60 registrations (with KYC) + interaction",
        price: "$180+",
      },
      {
        title: "KYC + Paid Interaction",
        result: "About 50 registrations (with KYC) + paid interaction",
        price: "$260+",
      },
    ],
  },
  "github-growth": {
    title: "GitHub Growth",
    description:
      "Real user services for GitHub account and repository growth",
    previewItems: ["GitHub Stars", "GitHub Forks"],
    ctaLabel: "Select Service",
    packageHighlights: [
      { title: "GitHub Stars", result: "About 50 Stars", price: "$20+" },
      { title: "GitHub Forks", result: "About 30 Forks", price: "$35+" },
      {
        title: "Repository Growth Bundle",
        result: "Suitable for public project presentation enhancement",
        price: "$55+",
      },
    ],
  },
  "token-nft-participation": {
    title: "Token / NFT Participation",
    description:
      "Real user services for presale participation, token buying, and token holding scenarios",
    previewItems: ["Presale Participation", "Internal Buy-side", "Holder Count"],
    ctaLabel: "Select Service",
    packageHighlights: [
      {
        title: "Presale Participation",
        result: "About 120 participations",
        price: "$220+",
      },
      {
        title: "Internal Buy-side",
        result: "About 100 buy-side participations",
        price: "$260+",
      },
      {
        title: "Holder Count",
        result: "About 100 holder participations",
        price: "$280+",
      },
    ],
  },
  "app-download": {
    title: "App Downloads",
    description: "Real user services for app downloads and reviews",
    previewItems: ["App Downloads", "App Review"],
    ctaLabel: "Select Service",
    packageHighlights: [
      {
        title: "App Downloads",
        result: "About 500 downloads",
        price: "$80+",
      },
      { title: "App Review", result: "About 80 reviews", price: "$90+" },
      {
        title: "Download + Review Bundle",
        result: "Suitable for the launch-stage presentation handoff",
        price: "$170+",
      },
    ],
  },
};

const enCategoryPageMeta: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  "social-media": {
    title: "Social Media Growth",
    description:
      "Real user growth services across major social media platforms",
  },
  "site-registration": {
    title: "Site Registration + Interaction",
    description:
      "Real user services for site registration, basic interaction, and paid interaction",
  },
  "github-growth": {
    title: "GitHub Growth",
    description:
      "Real user services for GitHub account and repository growth",
  },
  "token-nft-participation": {
    title:
      "Participating in Token or NFT Presales / Buying Tokens / Holding Tokens",
    description:
      "Real user services for presale participation, token buying, and token holding scenarios",
  },
  "app-download": {
    title: "App Downloads",
    description: "Real user services for app downloads and reviews",
  },
};

const enPlatformMap: Record<
  string,
  {
    platform: string;
    description: string;
    actions: Record<string, string>;
  }
> = {
  x: {
    platform: "X",
    description:
      "Suitable for account growth, content interaction, and stronger discussion volume",
    actions: {
      "x-follow": "Follow Growth",
      "x-like": "Like Growth",
      "x-comment": "Comment Growth",
      "x-retweet": "Retweet Growth",
      "x-kol-comment": "Verified KOL Comments",
    },
  },
  instagram: {
    platform: "Instagram",
    description: "Suitable for profile growth and stronger content interaction",
    actions: {
      "instagram-follow": "Follow Growth",
      "instagram-like": "Like Growth",
      "instagram-comment": "Comment Growth",
    },
  },
  facebook: {
    platform: "Facebook",
    description: "Suitable for page growth and stronger content interaction",
    actions: {
      "facebook-follow": "Follow Growth",
      "facebook-like": "Like Growth",
      "facebook-comment": "Comment Growth",
    },
  },
  telegram: {
    platform: "Telegram",
    description: "Suitable for group size growth and community expansion",
    actions: {
      "telegram-join-group": "Join Group",
    },
  },
  tiktok: {
    platform: "TikTok",
    description: "Suitable for content distribution and stronger interaction",
    actions: {
      "tiktok-follow": "Follow Growth",
      "tiktok-like": "Like Growth",
      "tiktok-comment": "Comment Growth",
    },
  },
  discord: {
    platform: "Discord",
    description: "Suitable for community size growth and group expansion",
    actions: {
      "discord-join-group": "Join Group",
    },
  },
  threads: {
    platform: "Threads",
    description: "Suitable for account growth and stronger content interaction",
    actions: {
      "threads-follow": "Follow Growth",
      "threads-like": "Like Growth",
      "threads-comment": "Comment Growth",
    },
  },
  binance: {
    platform: "Binance Feed Followers",
    description: "Suitable for account growth and stronger content exposure",
    actions: {
      "binance-follow": "Follow Growth",
    },
  },
};

const socialPlatformNameMap: Record<string, string> = {
  x: "X",
  instagram: "Instagram",
  facebook: "Facebook",
  telegram: "Telegram",
  tiktok: "TikTok",
  discord: "Discord",
  threads: "Threads",
  binance: "Binance Feed Followers",
};

const socialActionNameMap = {
  follow: "Follow Growth",
  like: "Like Growth",
  comment: "Comment Growth",
  retweet: "Retweet Growth",
  "kol-comment": "Verified KOL Comments",
  "join-group": "Join Group",
} as const;

const timelineLabelMap: Record<string, string> = {
  "订单已创建": "Order created",
  "已进入执行队列": "Entered execution queue",
  "执行中": "Running",
  "审核中": "Reviewing",
  "已完成": "Completed",
  "待更新": "Pending update",
};

const enServiceMap: Record<string, LocalizedServiceContent> = {
  "twitter-growth": {
    name: "Twitter Follower Growth",
    shortDesc:
      "Increase account followers and exposure, suitable for new-account cold start and community expansion scenarios.",
    fullDesc:
      "This service is suitable for project accounts, brand pages, and personal profiles that want to steadily increase follower scale, in order to build a more complete external presentation base and profile handoff effect.",
    scenarios: [
      "Building a basic follower base for a new account",
      "Improving profile credibility before brand campaigns",
      "Expanding account exposure together with content distribution",
    ],
    notes: [
      "Please provide an account link that can be accessed normally",
      "It is recommended to choose a suitable package according to the current account size",
      "Please confirm that the target profile is publicly visible before ordering",
    ],
  },
  "tweet-engagement": {
    name: "Tweet Engagement Growth",
    shortDesc:
      "Improve content interaction performance, suitable for key post distribution and campaign warm-up.",
    fullDesc:
      "This service is designed around the interaction performance of a single piece of content. It is suitable for new product launches, partnership announcements, campaign warm-up, and staged distribution nodes, and is used to strengthen content heat and discussion.",
    scenarios: [
      "Concentrated distribution after a key post is published",
      "Increasing interaction density during the campaign warm-up stage",
      "Exposure reinforcement for new product and milestone announcements",
    ],
    notes: [
      "Please provide the single content link that needs traffic handoff",
      "It is recommended that the content is public and accessible",
      "The package suggestion should stay coordinated with the current account base size",
    ],
  },
  "verified-comments": {
    name: "Verified Comments",
    shortDesc:
      "High-quality account comments and interaction, suitable for building trust in discussion areas around key content.",
    fullDesc:
      "This service is suitable for scenarios that need to build discussion and credibility under key content. It can be used to strengthen the appearance of the comment section, the sense of participation around the content, and the discussion atmosphere at important publishing nodes.",
    scenarios: [
      "Building discussion atmosphere under brand announcement content",
      "Enhancing comment-section credibility during key partnership announcements",
      "Improving participation and dwell time on core content pages",
    ],
    notes: [
      "Please provide the content link that needs comment interaction",
      "The comment scale should match the content heat",
      "If the content link changes, please resubmit the information",
    ],
  },
  "airdrop-campaign": {
    name: "Airdrop Campaign",
    shortDesc:
      "Increase participation and distribution effect for campaigns, suitable for acquisition expansion and staged growth activities.",
    fullDesc:
      "This service is suitable for campaign cold starts, staged acquisition, and distribution expansion scenarios. It helps the campaign page enter the distribution rhythm faster and establish initial heat.",
    scenarios: [
      "Initial participation boost after a new campaign goes live",
      "Concentrated expansion inside staged distribution plans",
      "Growth nodes that need to quickly establish campaign heat",
    ],
    notes: [
      "Please make sure the campaign page can be accessed normally",
      "The target scale should be evaluated together with the campaign handoff capacity",
      "If campaign rules change, it is recommended to reconfirm the requirements",
    ],
  },
  "github-stars": {
    name: "GitHub Stars",
    shortDesc:
      "Real user service for improving GitHub repository presentation and credibility.",
    fullDesc:
      "This service is suitable for teams and individuals who want to strengthen the presentation effect of open-source projects. It is used to optimize the repository presentation page and improve the handoff effect and first impression of public projects.",
    scenarios: [
      "Optimizing presentation before a public project release",
      "Enhancing credibility before external collaboration",
      "Building baseline heat during the cold-start stage of an open-source repository",
    ],
    notes: [
      "Please provide a publicly accessible repository link",
      "It is recommended that the target package matches the project stage",
      "If the repository URL is updated, please resubmit the order information",
    ],
  },
  "app-download-review": {
    name: "App Downloads / Review",
    shortDesc:
      "Real user downloads and reviews, suitable for app cold start and store presentation optimization.",
    fullDesc:
      "This service is suitable for app launches, regional promotion, and store presentation optimization. It helps the app build a more complete store presentation base and initial download feedback.",
    scenarios: [
      "First-round data setup after a new app launch",
      "Improving presentation basics before promotion in key regions",
      "Strengthening download and review performance at product iteration nodes",
    ],
    notes: [
      "Please provide an accessible app link",
      "Please fill in the country or region information according to the target placement",
      "It is recommended to choose a package together with the app's current handoff capacity",
    ],
  },
  "site-register": {
    name: "Site Registration",
    shortDesc:
      "Real user service for site registration scenarios, suitable for basic user acquisition and first-round conversion handoff.",
    fullDesc:
      "This service is suitable for scenarios that need users to complete a site registration action. It can be used for campaign pages, product waiting lists, community recruitment, and all kinds of basic registration-entry handoff.",
    scenarios: [
      "Registration handoff for campaign pages",
      "Expanding product beta waiting lists",
      "Building website registration data",
    ],
    notes: [
      "Please provide a website link that can be accessed normally",
      "Please confirm that the registration entry is open and the flow is complete",
      "If the registration flow changes, please resubmit the requirement",
    ],
  },
  "site-register-interaction": {
    name: "Site Registration + Interaction",
    shortDesc:
      "Real user service for site registration and basic interaction scenarios.",
    fullDesc:
      "This service is suitable for scenarios that need user registration and basic on-site interactions afterward. It can be used for product flow verification, campaign-page handoff, and on-site behavior setup.",
    scenarios: [
      "Completing basic on-site actions after registration",
      "Registration and interaction handoff for campaign pages",
      "Product flow experience verification",
    ],
    notes: [
      "Please provide the website link and interaction requirements",
      "Please make sure the related pages can be accessed normally",
      "It is recommended to confirm the interaction path and entry explanation in advance",
    ],
  },
  "site-register-paid-interaction": {
    name: "Site Registration + Paid Interaction",
    shortDesc:
      "Real user service for site registration and paid interaction scenarios.",
    fullDesc:
      "This service is suitable for scenarios that require registration and deeper interaction actions. It can be used for campaign conversion, process handoff, and demonstration verification for staged growth needs.",
    scenarios: [
      "Handling deeper interaction flows after registration",
      "Verification of key product conversion nodes",
      "Paid interaction handoff for campaign-type pages",
    ],
    notes: [
      "Please confirm that the process explanation is complete before ordering",
      "Please make sure the target website is accessible normally",
      "It is recommended to define the path and target action of the paid interaction clearly",
    ],
  },
  "site-register-kyc": {
    name: "Site Registration (KYC Required)",
    shortDesc:
      "Real user service for site registration scenarios that require a completed KYC process.",
    fullDesc:
      "This service is suitable for website scenarios where the registration flow includes KYC verification. It can be used for restricted-entry handoff, staged acquisition verification, and demonstration reinforcement for key registration flows.",
    scenarios: [
      "Handling registration entries that require KYC completion",
      "Verification of registration flows for restricted websites or campaign entries",
      "KYC registration handoff in staged user acquisition",
    ],
    notes: [
      "Please confirm that the KYC process description is complete before ordering",
      "Please make sure the website link and related steps can be accessed normally",
      "It is recommended to clarify whether there are region, material, or verification-step requirements",
    ],
  },
  "site-register-kyc-interaction": {
    name: "Site Registration (KYC Required) + Interaction",
    shortDesc:
      "Real user service for scenarios that require KYC completion and continued basic interaction afterward.",
    fullDesc:
      "This service is suitable for scenarios where the registration flow includes KYC verification and still needs basic on-site interaction after registration is completed. It can be used for flow verification, page handoff, and campaign-experience reinforcement.",
    scenarios: [
      "Continuing basic interaction after completing KYC",
      "KYC + interaction verification in campaign pages or product flows",
      "Registration and on-site behavior handoff under restricted-entry scenarios",
    ],
    notes: [
      "Please provide the website link and interaction requirements",
      "Please make sure the page and action path after KYC completion are accessible",
      "It is recommended to confirm the explanation of registration, verification, and interaction steps in advance",
    ],
  },
  "site-register-kyc-paid-interaction": {
    name: "Site Registration (KYC Required) + Paid Interaction",
    shortDesc:
      "Real user service for scenarios that require KYC completion and continued paid interaction afterward.",
    fullDesc:
      "This service is suitable for scenarios where the registration flow includes KYC verification and deeper paid interaction is still required after registration is completed. It can be used for key-node verification, staged conversion handoff, and process-demonstration reinforcement.",
    scenarios: [
      "Handling paid interaction flows after completing KYC",
      "KYC + paid interaction verification at key conversion nodes",
      "Deep handoff scenarios in campaign and product pathways",
    ],
    notes: [
      "Please confirm that the process explanation is complete before ordering",
      "Please make sure the KYC, registration, and paid interaction paths are all accessible normally",
      "It is recommended to define the target action, node sequence, and handoff requirements clearly",
    ],
  },
  "github-forks": {
    name: "GitHub Forks",
    shortDesc:
      "Real user service for strengthening GitHub repository interaction and presentation.",
    fullDesc:
      "This service is suitable for teams and individuals who want to further strengthen repository activity and presentation effect. It can be used for open-source project releases, collaboration communication, and community presentation scenarios.",
    scenarios: [
      "Strengthening repository appearance during the open-source release stage",
      "Improving interaction level before external presentation",
      "Reinforcing heat for key repositories during cold start",
    ],
    notes: [
      "Please provide a publicly accessible repository link",
      "It is recommended to stay coordinated with the repository's current heat",
      "If the repository URL changes, please resubmit the requirement",
    ],
  },
  "token-nft-presale": {
    name: "Participating in Token or NFT Presales",
    shortDesc: "Real user service for presale participation scenarios.",
    fullDesc:
      "This service is suitable for projects that need to handle token or NFT presale participation scenarios. It can be used for staged participation reinforcement, presale-node distribution, and campaign handoff.",
    scenarios: [
      "Cold start for presale campaigns",
      "Participation reinforcement at key sale nodes",
      "Verification of campaign distribution and handoff",
    ],
    notes: [
      "Please provide the presale page link",
      "Please confirm that the campaign rules have been made public",
      "It is recommended to set the target scale together with the campaign window",
    ],
  },
  "token-buy": {
    name: "Buying Tokens",
    shortDesc: "Real user service for token-buying scenarios.",
    fullDesc:
      "This service is suitable for projects that need to handle token-buying scenarios. It can be used for staged participation demonstration, product-path handoff, and key-node presentation.",
    scenarios: [
      "Initial participation handoff after token launch",
      "Demonstration of buy-token scenarios at key distribution nodes",
      "Flow verification inside growth campaigns",
    ],
    notes: [
      "Please provide the target page link",
      "Please make sure the process explanation is clear",
      "It is recommended to define the target scale and handoff rhythm clearly",
    ],
  },
  "token-hold": {
    name: "Holding Tokens",
    shortDesc: "Real user service for token-holding scenarios.",
    fullDesc:
      "This service is suitable for projects that need to strengthen holder presentation and staged holding scenarios. It can be used for campaign handoff, presentation optimization, and growth-node demonstrations.",
    scenarios: [
      "Optimization of staged token-holder presentation",
      "Campaign handoff and participation-structure reinforcement",
      "Verification of holding scenarios at key nodes",
    ],
    notes: [
      "Please provide the target page or an explanatory link",
      "Please confirm the requirements for the holding scenario in advance",
      "It is recommended to schedule the service time together with the overall rhythm",
    ],
  },
  "app-download": {
    name: "App Downloads",
    shortDesc: "Real user service for app download scenarios.",
    fullDesc:
      "This service is suitable for scenarios that need to improve app download volume and store handoff effect. It can be used for launch, regional promotion, and staged presentation optimization.",
    scenarios: [
      "Download setup after a new app release",
      "Reinforcing the download base before promotion in key regions",
      "Presentation handoff inside staged placements",
    ],
    notes: [
      "Please provide an accessible app link",
      "Please fill in the country or region information according to the target",
      "It is recommended to choose a plan together with the app's current handoff capacity",
    ],
  },
  "app-review": {
    name: "App Review",
    shortDesc: "Real user service for app review scenarios.",
    fullDesc:
      "This service is suitable for scenarios that need to improve app review presentation and store appearance. It can be used for version updates, regional operations, and staged presentation optimization.",
    scenarios: [
      "Review reinforcement after app version updates",
      "Optimizing store appearance before promotion in key regions",
      "Presentation improvement during staged operations",
    ],
    notes: [
      "Please provide an accessible app link",
      "Please fill in the country or region information according to the target",
      "It is recommended to stay coordinated with the app's current presentation rhythm",
    ],
  },
};

function formatPackageLabel(label: string) {
  if (label.includes("入门")) {
    return "Starter Package";
  }

  if (label.includes("增长")) {
    return "Growth Package";
  }

  if (label.includes("扩量")) {
    return "Scale Package";
  }

  return label;
}

function formatDeliveryTime(deliveryTime?: string) {
  if (!deliveryTime) {
    return deliveryTime;
  }

  return deliveryTime.replace(/小时/g, " hours").replace(/\s+/g, " ").trim();
}

function extractAmountText(input: string) {
  const match = input.match(/[\d,]+/);
  return match?.[0] ?? "";
}

function getPackageResultSuffix(slug: string) {
  if (slug.endsWith("-follow") || slug === "twitter-growth") {
    return "follows";
  }

  if (slug.endsWith("-like")) {
    return "likes";
  }

  if (slug.endsWith("-comment") || slug === "verified-comments") {
    return "comments";
  }

  if (slug.endsWith("-retweet")) {
    return "retweets";
  }

  if (slug.endsWith("-join-group")) {
    return "group joins";
  }

  if (slug === "tweet-engagement") {
    return "engagements";
  }

  if (slug === "airdrop-campaign" || slug === "token-nft-presale") {
    return "participations";
  }

  if (slug === "github-stars") {
    return "Stars";
  }

  if (slug === "github-forks") {
    return "Forks";
  }

  if (slug === "app-download-review") {
    return "downloads + reviews";
  }

  if (slug === "site-register") {
    return "registrations";
  }

  if (slug === "site-register-interaction") {
    return "registrations + interactions";
  }

  if (slug === "site-register-paid-interaction") {
    return "registrations + paid interactions";
  }

  if (slug === "site-register-kyc") {
    return "registrations (with KYC)";
  }

  if (slug === "site-register-kyc-interaction") {
    return "registrations (with KYC) + interactions";
  }

  if (slug === "site-register-kyc-paid-interaction") {
    return "registrations (with KYC) + paid interactions";
  }

  if (slug === "token-buy") {
    return "buy-side participations";
  }

  if (slug === "token-hold") {
    return "holder participations";
  }

  if (slug === "app-download") {
    return "downloads";
  }

  if (slug === "app-review") {
    return "reviews";
  }

  return "";
}

function formatPackageResult(slug: string, result: string) {
  const amount = extractAmountText(result);
  const suffix = getPackageResultSuffix(slug);

  if (!amount || !suffix) {
    return result;
  }

  return `About ${amount} ${suffix}`;
}

function translateField(slug: string, field: ServiceField): ServiceField {
  if (field.key === "targetUrl") {
    if (slug.endsWith("-follow")) {
      return {
        ...field,
        label: "Target Profile / Account URL",
        placeholder: "Please enter the target profile or account URL",
      };
    }

    if (slug.endsWith("-join-group")) {
      return {
        ...field,
        label: "Group URL",
        placeholder: "Please enter the target group or community URL",
      };
    }

    if (slug === "token-nft-presale") {
      return {
        ...field,
        label: "Presale URL",
        placeholder: "Please enter the presale page URL",
      };
    }

    return {
      ...field,
      label: "Target URL",
      placeholder: "Please enter the target page URL",
    };
  }

  if (field.key === "contentUrl" || field.key === "postUrl") {
    return {
      ...field,
      label: "Content URL",
      placeholder: "Please enter the target content URL",
    };
  }

  if (field.key === "groupUrl") {
    return {
      ...field,
      label: "Group URL",
      placeholder: "Please enter the target group or community URL",
    };
  }

  if (field.key === "accountUrl") {
    return {
      ...field,
      label: "Account URL",
      placeholder: "Please enter the account profile URL",
    };
  }

  if (field.key === "repoUrl") {
    return {
      ...field,
      label: "Repository URL",
      placeholder: "Please enter the repository URL",
    };
  }

  if (field.key === "campaignUrl") {
    return {
      ...field,
      label: "Campaign URL",
      placeholder: "Please enter the campaign URL",
    };
  }

  if (field.key === "siteUrl") {
    return {
      ...field,
      label: "Site URL",
      placeholder: "Please enter the target site URL",
    };
  }

  if (field.key === "appUrl") {
    return {
      ...field,
      label: "App URL",
      placeholder: "Please enter the app URL",
    };
  }

  if (field.key === "region") {
    return {
      ...field,
      label: "Country / Region",
    };
  }

  return field;
}

function translatePackages(slug: string, packages?: ServicePackage[]) {
  if (!packages?.length) {
    return packages;
  }

  return packages.map((item) => ({
    ...item,
    label: formatPackageLabel(item.label),
    result: formatPackageResult(slug, item.result),
    deliveryTime: formatDeliveryTime(item.deliveryTime),
  }));
}

function buildSocialServiceTranslation(
  service: Service,
): LocalizedServiceContent | null {
  const [platformKey, actionKey] = service.slug.split(/-(.+)/);
  const platformName = socialPlatformNameMap[platformKey];
  const actionName =
    socialActionNameMap[actionKey as keyof typeof socialActionNameMap];

  if (!platformName || !actionName) {
    return null;
  }

  if (actionKey === "follow") {
    return {
      name: `${platformName} ${actionName}`,
      shortDesc: `Real user account growth service for ${platformName}, suitable for improving profile scale and external presentation effect.`,
      fullDesc: `This service is suitable for projects, brands, and personal profiles that want to improve follower scale on ${platformName}. It is used to build a more complete external presentation base and strengthen profile handoff during campaign cycles and distribution nodes.`,
      scenarios: [
        `${platformName} account cold start`,
        "Improving basic profile presentation before campaigns",
        "Expanding account exposure together with content distribution",
      ],
      notes: [
        "Please provide a target profile or account URL that can be accessed normally",
        "It is recommended to choose a suitable package according to the current account size",
        "Please confirm that the target profile is publicly visible before ordering",
      ],
    };
  }

  if (actionKey === "like") {
    return {
      name: `${platformName} ${actionName}`,
      shortDesc: `Real user content heat service for ${platformName}, suitable for improving interaction performance on key content.`,
      fullDesc: `This service focuses on the interaction performance of single content on ${platformName}. It is suitable for key-content distribution, campaign warm-up, and staged heat reinforcement, helping content gain more direct visibility during key windows.`,
      scenarios: [
        `${platformName} key-content heat reinforcement`,
        "Improving interaction performance during campaign warm-up",
        "Strengthening content handoff effect during distribution windows",
      ],
      notes: [
        "Please provide a content link that can be accessed normally",
        "It is recommended that the content is already public and accessible",
        "It is recommended to choose a matching package according to the current content heat",
      ],
    };
  }

  if (actionKey === "comment") {
    return {
      name: `${platformName} ${actionName}`,
      shortDesc: `Real user comment-section growth service for ${platformName}, suitable for improving discussion strength and interaction depth.`,
      fullDesc: `This service is suitable for content scenarios that need stronger discussion atmosphere and comment-section activity on ${platformName}. It can be used for key release nodes, partnership announcements, and content heat reinforcement.`,
      scenarios: [
        `${platformName} comment-section reinforcement`,
        "Improving discussion atmosphere during campaign or partnership announcements",
        "Strengthening the sense of interaction and dwell time on content pages",
      ],
      notes: [
        "Please make sure the target content remains continuously accessible",
        "The comment scale should be set together with the current content heat",
        "If the content link changes, please resubmit the order information",
      ],
    };
  }

  if (actionKey === "retweet") {
    return {
      name: `${platformName} ${actionName}`,
      shortDesc:
        "Content distribution service for X, suitable for improving secondary distribution efficiency and outward content spillover.",
      fullDesc:
        "This service focuses on the distribution efficiency and forwarding density of key content. It is suitable for important announcements, partnership releases, and campaign warm-up scenarios that emphasize distribution speed.",
      scenarios: [
        "Concentrated distribution after a key announcement is published",
        "Improving distribution volume during the campaign warm-up stage",
        "Strengthening the outward spillover effect of content within a short time window",
      ],
      notes: [
        "Please provide a public link to the target content",
        "It is recommended that the content publishing time stays close to the ordering time",
        "If the distribution rhythm changes, you can resubmit a new link",
      ],
    };
  }

  if (actionKey === "kol-comment") {
    return {
      name: `${platformName} ${actionName}`,
      shortDesc:
        "Higher-tier comment presentation service for X, suitable for strengthening key content comment sections and presenting a stronger professional feel.",
      fullDesc:
        "This service is suitable for scenarios that need a higher-tier discussion feel in the comment section of key content. It can be used for important announcements, partnership releases, and reinforcement of comment sections at core distribution nodes.",
      scenarios: [
        "Comment-section reinforcement for important announcements and partnership releases",
        "Key content pages that need a higher-tier discussion feel",
        "Strengthening trust and discussion density around content",
      ],
      notes: [
        "Please make sure the target content is public and accessible",
        "This service is more suitable for key content and core release nodes",
        "It is recommended to coordinate it with the overall distribution rhythm to avoid concentrated stacking",
      ],
    };
  }

  if (actionKey === "join-group") {
    return {
      name: `${platformName} ${actionName}`,
      shortDesc: `Real user group-expansion service for ${platformName}, suitable for improving community size and entry handoff capacity.`,
      fullDesc: `This service is suitable for projects that want to expand group size and community base on ${platformName}. It can be used for cold start, campaign traffic handoff, and staged community expansion scenarios.`,
      scenarios: [
        `${platformName} community cold start and member expansion`,
        "Reinforcing group size and handoff capacity during campaign cycles",
        "Increasing the heat of community entry points during staged acquisition",
      ],
      notes: [
        "Please provide a group URL that can be accessed normally",
        "It is recommended to choose a reasonable package together with the current group handoff capacity",
        "Please confirm that the target group rules stay aligned with the current traffic-leading rhythm",
      ],
    };
  }

  return null;
}

function buildLocalizedService(
  service: Service,
  content: LocalizedServiceContent,
): Service {
  const localizedPackages = translatePackages(service.slug, service.packages);

  return {
    ...service,
    name: content.name,
    shortDesc: content.shortDesc,
    fullDesc: content.fullDesc,
    scenarios: content.scenarios,
    notes: content.notes,
    fields: service.fields.map((field) => translateField(service.slug, field)),
    packages: localizedPackages,
    price: getDefaultServicePackage(localizedPackages)?.price ?? service.price,
    deliveryTime:
      getDefaultServicePackage(localizedPackages)?.deliveryTime ??
      formatDeliveryTime(service.deliveryTime) ??
      service.deliveryTime,
  };
}

export function getLocalizedCategoryPreview(
  category: CategoryPreview,
  locale: Locale,
) {
  if (locale === "zh-CN") {
    return category;
  }

  const translated = enCategoryPreviewMap[category.slug];

  if (!translated) {
    return category;
  }

  return {
    ...category,
    ...translated,
  };
}

function getLocalizedPlatform(
  platform: PlatformGroup,
  locale: Locale,
): PlatformGroup {
  if (locale === "zh-CN") {
    return platform;
  }

  const translated = enPlatformMap[platform.iconKey];

  if (!translated) {
    return platform;
  }

  return {
    ...platform,
    platform: translated.platform,
    description: translated.description,
    actions: platform.actions.map((action) => ({
      ...action,
      label: translated.actions[action.slug] ?? action.label,
    })),
  };
}

export function getLocalizedCategoryPage(
  category: CategoryPageData,
  locale: Locale,
): CategoryPageData {
  if (locale === "zh-CN") {
    return category;
  }

  const meta = enCategoryPageMeta[category.slug];
  const items = category.items?.map((item) => {
    if (!item.slug) {
      return item;
    }

    const service = getServiceBySlug(item.slug);
    const localizedService = service ? getLocalizedService(service, locale) : null;

    return {
      ...item,
      title: localizedService?.name ?? item.title,
      description: localizedService?.shortDesc ?? item.description,
    };
  });

  return {
    ...category,
    title: meta?.title ?? category.title,
    description: meta?.description ?? category.description,
    items,
    platforms: category.platforms?.map((platform) =>
      getLocalizedPlatform(platform, locale),
    ),
  };
}

export function getLocalizedService(service: Service, locale: Locale): Service {
  if (locale === "zh-CN") {
    return service;
  }

  const socialContent = buildSocialServiceTranslation(service);

  if (socialContent) {
    return buildLocalizedService(service, socialContent);
  }

  const translated = enServiceMap[service.slug];

  if (!translated) {
    return {
      ...service,
      fields: service.fields.map((field) => translateField(service.slug, field)),
      packages: translatePackages(service.slug, service.packages),
      deliveryTime:
        formatDeliveryTime(service.deliveryTime) ?? service.deliveryTime,
    };
  }

  return buildLocalizedService(service, translated);
}

export function getLocalizedServiceName(
  serviceSlug: string,
  fallback: string,
  locale: Locale,
) {
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return fallback;
  }

  return getLocalizedService(service, locale).name;
}

export function getLocalizedSelectedPackage(
  serviceSlug: string,
  selectedPackageId: string | undefined,
  selectedPackageLabel: string | undefined,
  selectedPackageResult: string | undefined,
  locale: Locale,
) {
  if (locale === "zh-CN") {
    return {
      label: selectedPackageLabel,
      result: selectedPackageResult,
    };
  }

  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return {
      label: selectedPackageLabel,
      result: selectedPackageResult,
    };
  }

  const localizedService = getLocalizedService(service, locale);
  const matchedPackage = localizedService.packages?.find(
    (item) => item.id === selectedPackageId,
  );

  return {
    label: matchedPackage?.label ?? selectedPackageLabel,
    result: matchedPackage?.result ?? selectedPackageResult,
  };
}

export function getLocalizedTimelineItems(
  items: OrderTimelineItem[],
  locale: Locale,
) {
  if (locale === "zh-CN") {
    return items;
  }

  return items.map((item) => ({
    ...item,
    label: timelineLabelMap[item.label] ?? item.label,
    time: item.time === "待更新" ? "Pending update" : item.time,
  }));
}


