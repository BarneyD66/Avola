"use client";

import { useLocale } from "@/components/LocaleProvider";
import { ViewportReveal } from "@/components/ViewportReveal";

export function BrandManifestoSection() {
  const { messages } = useLocale();

  return (
    <section className="manifesto-home-panel manifesto-editorial-panel section-atmosphere surface-panel relative overflow-hidden rounded-[28px] border border-white/8 px-4 py-5 sm:rounded-[32px] sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="absolute inset-y-0 right-[-8%] w-[34%] rounded-full bg-accent/8 blur-3xl" />

      <ViewportReveal className="relative">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-10">
          <div className="max-w-[42rem]">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-accent-strong/75">
              {messages.home.manifesto.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[14ch] text-[2rem] leading-[1.02] font-semibold tracking-[-0.055em] text-foreground sm:text-[2.7rem] lg:text-[3.15rem]">
              {messages.home.manifesto.title}
            </h2>
            <p className="mt-5 max-w-[34rem] text-sm leading-7 text-muted-strong sm:text-base sm:leading-8">
              {messages.home.manifesto.description}
            </p>
            <p className="mt-5 max-w-[30rem] text-[13px] leading-6 text-muted sm:text-[14px] sm:leading-7">
              {messages.home.manifesto.note}
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {messages.home.manifesto.pillars.map((pillar, index) => (
              <div key={pillar.title} className="manifesto-line-item border-b border-white/8 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <span className="pt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-accent-strong/72">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-[1rem] leading-[1.18] font-semibold tracking-[-0.03em] text-foreground sm:text-[1.08rem]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-6 text-muted sm:text-[14px] sm:leading-7">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ViewportReveal>
    </section>
  );
}
