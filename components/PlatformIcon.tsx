import type { IconType } from "react-icons";
import {
  SiBinance,
  SiDiscord,
  SiFacebook,
  SiInstagram,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiX,
} from "react-icons/si";
import type { PlatformIconKey } from "@/data/services";

type PlatformIconProps = {
  iconKey: PlatformIconKey;
};

type IconVisual = {
  icon: IconType;
  label: string;
  color: string;
  background: string;
  glow: string;
  iconSize: number;
};

const iconVisualMap: Record<PlatformIconKey, IconVisual> = {
  x: {
    icon: SiX,
    label: "X",
    color: "#f8fafc",
    background: "linear-gradient(145deg, #1f2937 0%, #111827 60%, #0b1120 100%)",
    glow: "0 14px 32px rgba(71, 85, 105, 0.2)",
    iconSize: 21,
  },
  instagram: {
    icon: SiInstagram,
    label: "Instagram",
    color: "#fff7ed",
    background:
      "linear-gradient(145deg, rgba(244,114,182,0.95) 0%, rgba(249,115,22,0.92) 52%, rgba(147,51,234,0.94) 100%)",
    glow: "0 14px 32px rgba(217, 70, 239, 0.18)",
    iconSize: 19,
  },
  facebook: {
    icon: SiFacebook,
    label: "Facebook",
    color: "#eff6ff",
    background: "linear-gradient(145deg, #4f8df7 0%, #2563eb 100%)",
    glow: "0 14px 32px rgba(59, 130, 246, 0.22)",
    iconSize: 19,
  },
  telegram: {
    icon: SiTelegram,
    label: "Telegram",
    color: "#f8fbff",
    background: "linear-gradient(145deg, #38bdf8 0%, #0284c7 100%)",
    glow: "0 14px 32px rgba(56, 189, 248, 0.22)",
    iconSize: 19,
  },
  tiktok: {
    icon: SiTiktok,
    label: "TikTok",
    color: "#f8fafc",
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(17,24,39,0.98) 56%, rgba(31,41,55,0.98) 100%)",
    glow: "0 14px 32px rgba(34, 211, 238, 0.14)",
    iconSize: 20,
  },
  discord: {
    icon: SiDiscord,
    label: "Discord",
    color: "#eef2ff",
    background: "linear-gradient(145deg, #818cf8 0%, #6366f1 100%)",
    glow: "0 14px 32px rgba(129, 140, 248, 0.24)",
    iconSize: 21,
  },
  threads: {
    icon: SiThreads,
    label: "Threads",
    color: "#f8fafc",
    background: "linear-gradient(145deg, #334155 0%, #111827 62%, #020617 100%)",
    glow: "0 14px 32px rgba(51, 65, 85, 0.22)",
    iconSize: 23,
  },
  binance: {
    icon: SiBinance,
    label: "Binance",
    color: "#1f2937",
    background: "linear-gradient(145deg, #fbbf24 0%, #f59e0b 100%)",
    glow: "0 14px 32px rgba(251, 191, 36, 0.2)",
    iconSize: 22,
  },
};

export function PlatformIcon({ iconKey }: PlatformIconProps) {
  const visual = iconVisualMap[iconKey];
  const Icon = visual.icon;

  return (
    <div
      className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.025] shadow-[0_10px_24px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.06)]"
      aria-label={visual.label}
    >
      <div
        className="absolute inset-[3px] rounded-[13px] ring-1 ring-white/10"
        style={{
          background: visual.background,
          boxShadow: `${visual.glow}, inset 0 1px 0 rgba(255,255,255,0.14)`,
        }}
      />
      <span
        className="relative z-10 inline-flex items-center justify-center"
        style={{
          color: visual.color,
          width: `${visual.iconSize}px`,
          height: `${visual.iconSize}px`,
          filter:
            iconKey === "tiktok"
              ? "drop-shadow(0 0 10px rgba(34,211,238,0.16))"
              : "none",
        }}
      >
        <Icon className="h-full w-full" aria-hidden="true" />
      </span>
    </div>
  );
}
