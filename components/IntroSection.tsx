"use client";

import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { useLocale } from "@/components/LocaleProvider";

export function IntroSection() {
  const { messages } = useLocale();
  const [primarySignal, secondarySignal, tertiarySignal] = messages.home.intro.signals;

  return (
    <section className="hero-home-panel hero-scene-panel hero-atmosphere surface-panel relative overflow-hidden rounded-[30px] border border-white/8 sm:rounded-[40px]">
      <div className="hero-wordmark-overlay pointer-events-none absolute inset-x-0 top-7 flex justify-center opacity-[0.05]">
        <BrandWordmark size="hero" className="scale-[2.25] sm:scale-[2.95] lg:scale-[3.7]" />
      </div>
      <div className="hero-aurora hero-aurora-a absolute top-[-18%] right-[-5%] h-80 w-80 rounded-full bg-accent/18 blur-3xl sm:h-[30rem] sm:w-[30rem]" />
      <div className="hero-aurora hero-aurora-b absolute bottom-[-18%] left-[-10%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl sm:h-[26rem] sm:w-[26rem]" />
      <div className="hero-aurora hero-aurora-c absolute top-[22%] left-[38%] h-44 w-44 rounded-full border border-white/6 bg-white/[0.03] blur-2xl" />
      <div className="hero-orbit-lines absolute inset-0 opacity-90" />
      <div className="hero-grid-mask absolute inset-0 opacity-90" />

      <div className="relative px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.22fr)_minmax(280px,0.78fr)] lg:gap-12">
          <div className="max-w-[48rem]">
            <div className="hero-badge hero-reveal hero-reveal-delay-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium tracking-[0.22em] text-accent-strong/80 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {messages.home.intro.badge}
            </div>

            <div className="hero-reveal hero-reveal-delay-0 mt-6 max-w-[10rem] border-t border-white/10" />
            <div className="hero-reveal hero-reveal-delay-1 mt-6 max-w-[18rem]">
              <BrandWordmark size="hero" className="text-[1.55rem] sm:text-[2rem] lg:text-[2.3rem]" />
            </div>

            <h1 className="hero-scene-title hero-reveal hero-reveal-delay-1 mt-5 max-w-[11ch] text-[3rem] leading-[0.9] font-semibold tracking-[-0.085em] text-foreground sm:text-[4.6rem] lg:text-[6rem] xl:text-[6.65rem]">
              {messages.home.intro.title}
            </h1>

            <p className="hero-reveal hero-reveal-delay-2 mt-7 max-w-[38rem] text-[1rem] leading-8 text-muted-strong sm:text-[1.05rem] lg:max-w-[34rem] lg:text-[1.08rem]">
              {messages.home.intro.description}
            </p>
            <p className="hero-reveal hero-reveal-delay-4 mt-3 max-w-[30rem] text-[13px] leading-6 text-muted sm:text-[14px] sm:leading-7">
              {messages.home.intro.note}
            </p>

            <div className="hero-reveal hero-reveal-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/services"
                className="ui-primary-button hero-primary-button inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold"
              >
                {messages.home.intro.primaryCta}
              </Link>
              <Link
                href="/track"
                className="ui-secondary-button inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-medium"
              >
                {messages.home.intro.secondaryCta}
              </Link>
            </div>

            <div className="hero-reveal hero-reveal-delay-4 mt-10 grid gap-4 border-t border-white/8 pt-5 sm:grid-cols-3">
              {messages.home.intro.sceneLabels.map((label, index) => (
                <div key={label} className="space-y-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-accent-strong/72">
                    0{index + 1}
                  </span>
                  <p className="text-[13px] font-medium text-muted-strong sm:text-[14px]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-scene-aside hero-reveal hero-reveal-delay-2 lg:pt-10">
            <div className="hero-aside-panel rounded-[30px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent-strong/80">
                  Fulfillment Layer
                </p>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">01</span>
              </div>

              <div className="mt-6 space-y-6">
                <div className="hero-aside-row border-b border-white/8 pb-5">
                  <h2 className="max-w-[16ch] text-[1.08rem] leading-[1.15] font-semibold tracking-tight text-foreground sm:text-[1.15rem]">
                    {primarySignal.title}
                  </h2>
                  <p className="mt-2.5 text-[13px] leading-6 text-muted sm:text-[14px]">
                    {primarySignal.description}
                  </p>
                </div>

                <div className="hero-aside-row border-b border-white/8 pb-5">
                  <h2 className="max-w-[16ch] text-[1.08rem] leading-[1.15] font-semibold tracking-tight text-foreground sm:text-[1.15rem]">
                    {secondarySignal.title}
                  </h2>
                  <p className="mt-2.5 text-[13px] leading-6 text-muted sm:text-[14px]">
                    {secondarySignal.description}
                  </p>
                </div>

                <div className="hero-aside-row">
                  <h2 className="max-w-[16ch] text-[1.08rem] leading-[1.15] font-semibold tracking-tight text-foreground sm:text-[1.15rem]">
                    {tertiarySignal.title}
                  </h2>
                  <p className="mt-2.5 text-[13px] leading-6 text-muted sm:text-[14px]">
                    {tertiarySignal.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
