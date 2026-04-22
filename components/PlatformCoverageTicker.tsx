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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 4.8c1.86 0 3.68.86 5.01 2.36 1.46 1.66 2.18 3.95 2 6.3-.2 2.67-1.53 5.08-3.67 6.24-1.14.62-2.34.82-3.34.82s-2.2-.2-3.34-.82c-2.14-1.16-3.47-3.57-3.67-6.24-.18-2.35.54-4.64 2-6.3A6.72 6.72 0 0 1 12 4.8Z" />
    <path d="M8.35 11.15 12 13.5l3.65-2.35" />
    <path d="M9.15 15.6c.92.78 1.82 1.1 2.85 1.1s1.93-.32 2.85-1.1" />
    <circle cx="9.55" cy="10.15" r="0.72" fill="currentColor" stroke="none" />
    <circle cx="14.45" cy="10.15" r="0.72" fill="currentColor" stroke="none" />
  </svg>
);

const PancakeSwapIcon: IconType = (props: IconBaseProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.05 7.1V5.9a1.55 1.55 0 1 1 3.1 0v1" />
    <path d="M11.85 6.9V5.85a1.55 1.55 0 1 1 3.1 0V7.1" />
    <path d="M7.15 11.15c0-2.88 2.17-5.15 4.85-5.15s4.85 2.27 4.85 5.15c0 2.82-2.17 5.2-4.85 5.2s-4.85-2.38-4.85-5.2Z" />
    <path d="M6.25 14.5c.84 1.88 2.78 3.1 5.75 3.1s4.91-1.22 5.75-3.1" />
    <circle cx="10.2" cy="10.95" r="0.62" fill="currentColor" stroke="none" />
    <circle cx="13.8" cy="10.95" r="0.62" fill="currentColor" stroke="none" />
    <path d="M10.3 13.6c.63.48 1.14.68 1.7.68s1.07-.2 1.7-.68" />
  </svg>
);

const FourMemeIcon: IconType = (props: IconBaseProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4.4" y="4.4" width="15.2" height="15.2" rx="5" />
    <path d="M13.9 7.8v8.4" />
    <path d="M9.2 12.15h6.2" />
    <path d="m9.2 12.15 4.7-4.35" />
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
