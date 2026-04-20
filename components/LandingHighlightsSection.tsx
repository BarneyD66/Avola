"use client";

import { useLocale } from "@/components/LocaleProvider";
import { ViewportReveal } from "@/components/ViewportReveal";

export function LandingHighlightsSection() {
  const { messages } = useLocale();
  const [firstCard, secondCard, thirdCard] = messages.home.landing.cards;

  return (
    <section className="landing-home-panel landing-editorial-panel surface-panel section-atmosphere overflow-hidden rounded-[30px] border border-white/8 px-4 py-6 sm:rounded-[36px] sm:px-7 sm:py-8 lg:px-10 lg:py-10">
      <ViewportReveal>
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10">
          <div className="max-w-[44rem]">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-accent-strong/75">
              {messages.home.landing.eyebrow}
            </p>
            <h2 className="mt-5 max-w-[14ch] text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.06em] text-foreground sm:text-[3rem] lg:text-[3.45rem]">
              {messages.home.landing.title}
            </h2>
            <p className="mt-5 max-w-[36rem] text-sm leading-7 text-muted-strong sm:text-base sm:leading-8">
              {messages.home.landing.description}
            </p>
          </div>

          <div className="space-y-4 lg:pt-2">
            <div className="landing-copy-row rounded-[20px] border border-white/8 bg-white/[0.02] px-4 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent-strong/72">
                {firstCard.label}
              </p>
              <p className="mt-3 text-[13px] font-medium text-muted-strong sm:text-[14px]">{firstCard.title}</p>
              <p className="mt-1.5 text-[13px] leading-6 text-muted sm:text-[14px] sm:leading-7">{firstCard.description}</p>
            </div>
            <div className="landing-copy-row rounded-[20px] border border-white/8 bg-white/[0.02] px-4 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent-strong/72">
                {secondCard.label}
              </p>
              <p className="mt-3 text-[13px] font-medium text-muted-strong sm:text-[14px]">{secondCard.title}</p>
              <p className="mt-1.5 text-[13px] leading-6 text-muted sm:text-[14px] sm:leading-7">{secondCard.description}</p>
            </div>
          </div>
        </div>
      </ViewportReveal>

      <ViewportReveal delay={70} className="mt-10 border-t border-white/8 pt-6">
        <div className="rounded-[20px] border border-white/8 bg-white/[0.02] px-4 py-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent-strong/72">
            {thirdCard.label}
          </p>
          <p className="mt-3 text-[13px] font-medium text-muted-strong sm:text-[14px]">{thirdCard.title}</p>
          <p className="mt-1.5 text-[13px] leading-6 text-muted sm:text-[14px] sm:leading-7">{thirdCard.description}</p>
        </div>
      </ViewportReveal>
    </section>
  );
}
