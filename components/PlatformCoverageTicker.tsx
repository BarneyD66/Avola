"use client";

import type { IconType } from "react-icons";
import type { IconBaseProps } from "react-icons";
import { FiDownload } from "react-icons/fi";
import {
  SiBinance,
  SiCoinmarketcap,
  SiDiscord,
  SiFacebook,
  SiGithub,
  SiGoogleplay,
  SiInstagram,
  SiOkx,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiX,
} from "react-icons/si";
import { useLocale } from "@/components/LocaleProvider";

type CoverageItem = {
  label: string;
  icon: IconType;
};

const PumpFunIcon: IconType = (props: IconBaseProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7.2 4.8h4.4a4.4 4.4 0 0 1 4.4 4.4v1.1a4.4 4.4 0 0 1-4.4 4.4H7.2a2.4 2.4 0 0 1-2.4-2.4V7.2a2.4 2.4 0 0 1 2.4-2.4Z" />
    <path d="M16.1 9.1 9.2 16" />
    <path d="M9 11.2c.9 0 1.6-.7 1.6-1.6S9.9 8 9 8s-1.6.7-1.6 1.6.7 1.6 1.6 1.6Z" />
    <path d="M14.7 16c.9 0 1.6-.7 1.6-1.6s-.7-1.6-1.6-1.6-1.6.7-1.6 1.6.7 1.6 1.6 1.6Z" />
  </svg>
);

const DexScreenerIcon: IconType = (props: IconBaseProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 16.5 12 6l6 10.5" />
    <path d="M8.1 13.3 12 10.9l3.9 2.4" />
    <path d="M9.6 18.1c.8-.8 1.5-1.2 2.4-1.2s1.6.4 2.4 1.2" />
    <circle cx="9.4" cy="10.1" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="14.6" cy="10.1" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

const PancakeSwapIcon: IconType = (props: IconBaseProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M8.2 8.2V6.7a1.8 1.8 0 1 1 3.6 0v1" />
    <path d="M12.2 7.7v-1a1.8 1.8 0 1 1 3.6 0v1.5" />
    <path d="M6.4 12.5c0-3.4 2.7-6.2 6-6.2s6 2.8 6 6.2c0 3.5-2.7 6.1-6 6.1s-6-2.6-6-6.1Z" />
    <circle cx="10.4" cy="12.2" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="14.6" cy="12.2" r="0.7" fill="currentColor" stroke="none" />
    <path d="M9.8 15.2c.8.7 1.5 1 2.2 1s1.4-.3 2.2-1" />
  </svg>
);

const FourMemeIcon: IconType = (props: IconBaseProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.6 4.8v14.4" />
    <path d="M7.4 13.3 14.6 4.8" />
    <path d="M7.4 13.3h9.2" />
  </svg>
);

export function PlatformCoverageTicker() {
  const { messages } = useLocale();

  const coverageItems: CoverageItem[] = [
    { label: messages.home.coverage.items.x, icon: SiX },
    { label: messages.home.coverage.items.telegram, icon: SiTelegram },
    { label: messages.home.coverage.items.discord, icon: SiDiscord },
    { label: messages.home.coverage.items.github, icon: SiGithub },
    { label: messages.home.coverage.items.instagram, icon: SiInstagram },
    { label: messages.home.coverage.items.facebook, icon: SiFacebook },
    { label: messages.home.coverage.items.tiktok, icon: SiTiktok },
    { label: messages.home.coverage.items.threads, icon: SiThreads },
    { label: messages.home.coverage.items.binance, icon: SiBinance },
    { label: messages.home.coverage.items.okx, icon: SiOkx },
    { label: messages.home.coverage.items.coinMarketCap, icon: SiCoinmarketcap },
    { label: messages.home.coverage.items.dexScreener, icon: DexScreenerIcon },
    { label: messages.home.coverage.items.pumpFun, icon: PumpFunIcon },
    { label: messages.home.coverage.items.fourMeme, icon: FourMemeIcon },
    { label: messages.home.coverage.items.pancakeSwap, icon: PancakeSwapIcon },
    { label: messages.home.coverage.items.googlePlay, icon: SiGoogleplay },
    { label: messages.home.coverage.items.appStores, icon: FiDownload },
  ];

  return (
    <section className="platform-coverage-band section-atmosphere relative overflow-hidden rounded-[28px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-accent-strong/74">
            {messages.home.coverage.eyebrow}
          </p>
          <p className="max-w-[34rem] text-[13px] leading-6 text-muted sm:text-[14px] sm:text-right">
            {messages.home.coverage.title}
          </p>
        </div>

        <div className="platform-coverage-marquee">
          <div className="platform-coverage-track">
            {[0, 1].map((loopIndex) => (
              <div key={loopIndex} className="platform-coverage-row">
                {coverageItems.map((item) => (
                  <div key={`${loopIndex}-${item.label}`} className="platform-coverage-item">
                    <span className="platform-coverage-icon-shell">
                      <span className="platform-coverage-icon">
                        <item.icon className="h-[0.98rem] w-[0.98rem]" />
                      </span>
                    </span>
                    <span className="platform-coverage-label">{item.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
