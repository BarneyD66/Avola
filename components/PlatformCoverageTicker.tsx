"use client";

import { useEffect, useState } from "react";
import type { FocusEvent as ReactFocusEvent, MouseEvent as ReactMouseEvent } from "react";
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

type GlowTarget = HTMLElement;

function applySectionGlowMove(target: GlowTarget, event: ReactMouseEvent<GlowTarget>) {
  const bounds = target.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
  const shiftX = ((x - 50) / 50) * 6;
  const shiftY = ((y - 50) / 50) * 4;

  target.style.setProperty("--section-glow-x", `${x}%`);
  target.style.setProperty("--section-glow-y", `${y}%`);
  target.style.setProperty("--section-glow-opacity", "1");
  target.style.setProperty("--section-parallax-x", `${shiftX.toFixed(2)}px`);
  target.style.setProperty("--section-parallax-y", `${shiftY.toFixed(2)}px`);
}

function resetSectionGlow(target: GlowTarget) {
  target.style.setProperty("--section-glow-opacity", "0");
  target.style.setProperty("--section-parallax-x", "0px");
  target.style.setProperty("--section-parallax-y", "0px");
}

const PumpFunIcon: IconType = (props: IconBaseProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M8.15 4.55a4.15 4.15 0 0 0-2.95 1.23l-.72.72a4.18 4.18 0 0 0 0 5.91l7.11 7.11a4.18 4.18 0 0 0 5.91 0l2.03-2.03a4.18 4.18 0 0 0 0-5.91L12.42 4.48a4.15 4.15 0 0 0-4.27-.93Z" />
    <path d="m8.2 15.8 7.6-7.6" />
    <path d="M8.1 13.8c.32-.62.76-1.06 1.32-1.32" />
    <path d="M6.95 12.65c.17-.34.4-.65.67-.92" />
  </svg>
);

const DexScreenerIcon: IconType = (props: IconBaseProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.85 3.25c1.9 2.6 3.87 4.05 5.9 4.34l2.25 3.08 2.25-3.08c2.03-.29 4-1.74 5.9-4.34-.5 4.88-1.38 8.98-2.64 12.3L12 21.3l-5.51-5.75C5.23 12.23 4.35 8.13 3.85 3.25Zm4.2 6.06 3.08 1.22-2.04 2.2-1.04-3.42Zm7.9 0-3.08 1.22 2.04 2.2 1.04-3.42ZM12 12.12l1.18 2.22L12 16.25l-1.18-1.91L12 12.12Z"
    />
  </svg>
);

const PancakeSwapIcon: IconType = (props: IconBaseProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M8.28 3.08c1.14 0 2.08.93 2.08 2.08v3.01a10.7 10.7 0 0 1 3.28 0V5.16a2.08 2.08 0 1 1 4.16 0v5.29c1.71 1.18 2.75 2.86 2.75 4.7 0 3.54-3.83 6.42-8.55 6.42s-8.55-2.88-8.55-6.42c0-1.84 1.04-3.52 2.75-4.7V5.16c0-1.15.93-2.08 2.08-2.08Zm-2.8 12.55c.47 2.31 3.25 4.1 6.52 4.1s6.05-1.79 6.52-4.1c-1.25 1.45-3.68 2.44-6.52 2.44s-5.27-.99-6.52-2.44Z" />
    <circle cx="9.35" cy="13.15" r="1.05" fill="var(--page-bg, #0b1119)" />
    <circle cx="14.65" cy="13.15" r="1.05" fill="var(--page-bg, #0b1119)" />
  </svg>
);

const FourMemeIcon: IconType = (props: IconBaseProps) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M8.1 20.25c-1.72-.38-3.03-1.64-3.3-3.32l-.72-4.48c-.14-.86.47-1.66 1.34-1.74.64-.06 1.21.29 1.47.83V5.2a1.28 1.28 0 0 1 2.56 0v4.95-6.3a1.28 1.28 0 0 1 2.56 0v6.07-5.18a1.28 1.28 0 1 1 2.56 0v5.7-3.48a1.28 1.28 0 0 1 2.56 0v5.58l.78-1.1a1.4 1.4 0 0 1 2.31 1.58l-2.45 4.07c-1.18 1.96-3.34 3.16-5.65 3.16H8.1Z"
      fill="currentColor"
    />
    <path
      d="M7.02 12.08v3.18m2.43-5.11v4.92m2.56-5.15v5.02m2.56-4.5v4.18"
      stroke="var(--page-bg, #0b1119)"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.78"
    />
  </svg>
);

export function PlatformCoverageTicker() {
  const { messages } = useLocale();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [pointerEffectsEnabled, setPointerEffectsEnabled] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updatePreferences = () => {
      setPrefersReducedMotion(reducedMotionQuery.matches);
      setPointerEffectsEnabled(pointerQuery.matches);
    };

    updatePreferences();
    reducedMotionQuery.addEventListener("change", updatePreferences);
    pointerQuery.addEventListener("change", updatePreferences);

    return () => {
      reducedMotionQuery.removeEventListener("change", updatePreferences);
      pointerQuery.removeEventListener("change", updatePreferences);
    };
  }, []);

  const interactiveSectionProps =
    pointerEffectsEnabled && !prefersReducedMotion
      ? {
          onMouseEnter: (event: ReactMouseEvent<HTMLElement>) =>
            event.currentTarget.style.setProperty("--section-glow-opacity", "1"),
          onMouseMove: (event: ReactMouseEvent<HTMLElement>) =>
            applySectionGlowMove(event.currentTarget, event),
          onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => resetSectionGlow(event.currentTarget),
          onBlur: (event: ReactFocusEvent<HTMLElement>) => resetSectionGlow(event.currentTarget),
        }
      : {};

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
    <section
      className="platform-coverage-band interactive-section-glow section-glow-scenarios section-atmosphere relative overflow-hidden rounded-[28px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8"
      {...interactiveSectionProps}
    >
      <div className="section-cursor-glow" aria-hidden />
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
