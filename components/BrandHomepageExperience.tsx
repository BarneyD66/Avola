"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiTelegram } from "react-icons/si";
import { PlatformCoverageTicker } from "@/components/PlatformCoverageTicker";
import { useLocale } from "@/components/LocaleProvider";
import { ViewportReveal } from "@/components/ViewportReveal";

export function BrandHomepageExperience() {
  const { messages, locale } = useLocale();
  const intro = messages.home.intro;
  const valueSection = messages.home.landing;
  const flowSection = messages.home.flow;
  const trustSection = messages.home.trust;
  const notice = messages.home.notice;
  const [titleLineOne = intro.title, titleLineTwo = ""] = intro.title.split("\n");
  const [primarySignal, ...supportingSignals] = intro.signals;
  const [activeFlowStepIndex, setActiveFlowStepIndex] = useState(0);
  const [isFlowPaused, setIsFlowPaused] = useState(false);
  const activeFlowStep = flowSection.steps[activeFlowStepIndex];
  const [, ...secondaryTrustItems] = intro.trustItems;

  useEffect(() => {
    if (isFlowPaused) {
      return;
    }

    const stepCount = flowSection.steps.length;
    const interval = window.setInterval(() => {
      setActiveFlowStepIndex((current) => (current + 1) % stepCount);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [flowSection.steps.length, isFlowPaused]);

  return (
    <main className="brand-home-main relative flex-1 pt-30 pb-16 sm:pt-29 sm:pb-20">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 sm:gap-7 sm:px-6 lg:gap-8 lg:px-8">
        <section className="brand-home-hero hero-atmosphere hero-orbit-lines relative overflow-hidden rounded-[38px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
          <div className="brand-home-orb brand-home-orb-a absolute top-[-18%] right-[-8%] h-72 w-72 rounded-full bg-accent/8 blur-3xl sm:h-[26rem] sm:w-[26rem]" />
          <div className="brand-home-orb brand-home-orb-b absolute bottom-[-20%] left-[-10%] h-64 w-64 rounded-full bg-cyan-400/5 blur-3xl sm:h-[20rem] sm:w-[20rem]" />
          <div className="brand-home-grid absolute inset-0 opacity-30" />
          <div className="brand-hero-spotlight absolute inset-x-0 top-[18%] mx-auto h-56 w-[64%] rounded-full bg-accent/6 blur-3xl" />

          <ViewportReveal className="relative mx-auto flex max-w-[62rem] flex-col items-center text-center">
            <h1 className="brand-hero-headline hero-reveal hero-reveal-delay-1 max-w-[15.2ch] text-[2.22rem] leading-[1.04] font-semibold tracking-[-0.042em] text-foreground sm:max-w-none sm:text-[2.95rem] lg:text-[3.35rem] xl:text-[3.72rem]">
              <span className="block sm:whitespace-nowrap">{titleLineOne}</span>
              <span className="mt-2.5 block sm:whitespace-nowrap">{titleLineTwo}</span>
            </h1>

            <p
              className={`brand-hero-subtitle hero-reveal hero-reveal-delay-2 mt-8 text-[1.03rem] leading-8 text-muted-strong sm:text-[1.1rem] lg:text-[1.13rem] lg:leading-[2.02rem] ${
                locale === "en" ? "max-w-[42rem]" : "max-w-[46rem]"
              }`}
            >
              {intro.description}
            </p>

            <div className="brand-hero-actions hero-reveal hero-reveal-delay-3 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/services"
                className="ui-primary-button hero-primary-button inline-flex min-w-[13rem] items-center justify-center px-6 py-3.5 text-sm font-semibold"
              >
                {intro.primaryCta}
              </Link>
              <Link
                href="/track"
                className="ui-secondary-button hero-secondary-button inline-flex min-w-[10.9rem] items-center justify-center rounded-full px-5 py-3.5 text-sm font-medium"
              >
                {intro.secondaryCta}
              </Link>
            </div>

            <p className="hero-reveal hero-reveal-delay-4 mt-6 max-w-[35rem] text-[14px] leading-7 text-muted sm:text-[15px]">
              {intro.note}
            </p>

            <div className="brand-story-hero-trust hero-reveal hero-reveal-delay-4 mt-11 grid w-full gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
              {intro.trustItems.map((item) => (
                <div
                  key={item.title}
                  className="brand-story-hero-trust-item rounded-[24px] px-4 py-4 text-center sm:px-5 sm:py-4.5"
                >
                  <span className="brand-story-hero-trust-dot mb-3 inline-flex h-2.5 w-2.5 rounded-full bg-accent/85" />
                  <p className="brand-story-hero-trust-title mx-auto text-[1rem] font-semibold leading-[1.32] tracking-[-0.026em] text-foreground">
                    {item.title}
                  </p>
                  <p className="brand-story-hero-trust-description mx-auto mt-3 text-[13px] leading-6 text-muted sm:text-[13.5px]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </ViewportReveal>
        </section>

        <PlatformCoverageTicker />

        <section className="brand-story-panel section-atmosphere relative overflow-hidden rounded-[32px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <ViewportReveal className="relative">
            <div className="max-w-[54rem]">
              <p className="inline-flex rounded-full border border-white/6 bg-white/[0.02] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.26em] text-accent-strong/76">
                {valueSection.eyebrow}
              </p>
              <h2 className="mt-4 max-w-[20ch] text-[1.74rem] leading-[1.12] font-semibold tracking-[-0.046em] text-foreground sm:text-[2.14rem] lg:max-w-[18ch] lg:text-[2.42rem] xl:text-[2.56rem]">
                {valueSection.title}
              </h2>
              <p className="mt-5 max-w-[41rem] text-[15px] leading-8 text-muted sm:text-[16px]">
                {valueSection.description}
              </p>
            </div>

            <div className="brand-value-strip mt-10 overflow-hidden rounded-[28px]">
              {[primarySignal, ...supportingSignals].map((item, index) => (
                <ViewportReveal
                  key={item.title}
                  delay={index * 90}
                  className="brand-value-cell px-5 py-6 sm:px-6 sm:py-6.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-accent-strong/72">
                      {intro.sceneLabels[index]}
                    </p>
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent-strong/62">
                      {`0${index + 1}`}
                    </span>
                  </div>
                  <h3 className="mt-5 max-w-[15ch] text-[1.08rem] leading-[1.16] font-semibold tracking-[-0.03em] text-foreground sm:text-[1.18rem]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-[24rem] text-[13px] leading-[1.72] text-muted sm:text-[14px] sm:leading-7">
                    {item.description}
                  </p>
                </ViewportReveal>
              ))}
            </div>
          </ViewportReveal>
        </section>

        <section className="brand-story-panel section-atmosphere relative overflow-hidden rounded-[32px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <ViewportReveal className="relative">
            <div className="mx-auto max-w-[50rem] text-center">
              <p className="inline-flex rounded-full border border-white/6 bg-white/[0.02] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.26em] text-accent-strong/76">
                {flowSection.eyebrow}
              </p>
              <h2 className="mt-4 text-[1.95rem] leading-[1.05] font-semibold tracking-[-0.05em] text-foreground sm:text-[2.5rem] lg:text-[2.85rem]">
                {flowSection.title}
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted sm:text-[16px]">
                {flowSection.description}
              </p>
            </div>

            <div
              className="brand-flow-stage relative mt-10 grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] xl:items-start"
              onMouseEnter={() => setIsFlowPaused(true)}
              onMouseLeave={() => setIsFlowPaused(false)}
            >
              <ViewportReveal>
                <div className="brand-flow-list rounded-[26px] px-5 py-5 sm:px-6 sm:py-6">
                  {flowSection.steps.map((step, index) => {
                    const isActive = index === activeFlowStepIndex;
                    return (
                      <button
                        key={step.title}
                        type="button"
                        onClick={() => setActiveFlowStepIndex(index)}
                        aria-pressed={isActive}
                        aria-current={isActive ? "step" : undefined}
                        className={`brand-flow-list-item ${isActive ? "brand-flow-list-item-active" : ""}`}
                      >
                        <div className="brand-flow-list-line" />
                        <div className="brand-flow-list-marker">
                          <span className="brand-flow-list-number">{`0${index + 1}`}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[1rem] font-semibold tracking-[-0.024em] text-foreground sm:text-[1.04rem]">
                            {step.title}
                          </p>
                          <p className="mt-2 text-[13px] leading-6 text-muted sm:text-[14px]">
                            {step.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ViewportReveal>

              <ViewportReveal delay={90}>
                <article
                  key={activeFlowStep.title}
                  className="brand-flow-card brand-flow-card-active flow-detail-panel rounded-[28px] px-5 py-6 sm:px-7 sm:py-7"
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-accent-strong/74">
                    {flowSection.currentStageLabel}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex rounded-full border border-accent/18 bg-accent/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-accent-strong">
                      {`0${activeFlowStepIndex + 1}`}
                    </span>
                    <h3 className="text-[1.45rem] leading-[1.08] font-semibold tracking-[-0.04em] text-foreground sm:text-[1.7rem]">
                      {activeFlowStep.title}
                    </h3>
                  </div>
                  <p className="mt-4 max-w-[34rem] text-[15px] leading-8 text-muted sm:text-[16px]">
                    {activeFlowStep.description}
                  </p>

                  <div className="brand-flow-active-rail mt-7 grid gap-3 sm:grid-cols-2">
                    <div className="brand-flow-active-block rounded-[20px] px-4 py-4 sm:px-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-accent-strong/72">
                        {flowSection.completedLabel}
                      </p>
                      <p className="mt-3 text-[13px] leading-6 text-muted-strong sm:text-[14px] sm:leading-7">
                        {activeFlowStep.completed}
                      </p>
                    </div>

                    <div className="brand-flow-active-block rounded-[20px] px-4 py-4 sm:px-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-accent-strong/72">
                        {flowSection.nextLabel}
                      </p>
                      <p className="mt-3 text-[13px] leading-6 text-muted-strong sm:text-[14px] sm:leading-7">
                        {activeFlowStep.next}
                      </p>
                    </div>
                  </div>
                </article>
              </ViewportReveal>
            </div>
          </ViewportReveal>
        </section>

        <section className="brand-story-panel section-atmosphere relative overflow-hidden rounded-[32px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <ViewportReveal className="relative">
            <div className="mx-auto max-w-[54rem] text-center">
              <p className="inline-flex rounded-full border border-white/6 bg-white/[0.02] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.26em] text-accent-strong/76">
                {trustSection.eyebrow}
              </p>
              <h2
                className={`mx-auto mt-5 text-[1.48rem] leading-[1.16] font-semibold tracking-[-0.04em] text-foreground sm:text-[1.84rem] lg:text-[2.06rem] ${
                  locale === "en"
                    ? "max-w-[18ch] lg:max-w-[15ch]"
                    : "max-w-[22ch] lg:max-w-[18ch]"
                }`}
              >
                {trustSection.title}
              </h2>
              <p className="mx-auto mt-6 max-w-[40rem] text-[14px] leading-7 text-muted sm:text-[15px] sm:leading-7.5">
                {trustSection.description}
              </p>
            </div>

            <div className="brand-trust-grid mt-11">
              <ViewportReveal className="brand-trust-item brand-trust-item-anchor px-1 py-5 sm:px-2 sm:py-6">
                <span className="brand-trust-accent-line mb-5 block" />
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-accent-strong/72">
                  {trustSection.anchorEyebrow}
                </p>
                <p className="mt-5 text-[2.18rem] leading-none font-semibold tracking-[-0.058em] text-foreground sm:text-[2.72rem]">
                  5000+
                </p>
                <h3 className="mt-4 max-w-[11ch] text-[1.08rem] leading-[1.18] font-semibold tracking-[-0.028em] text-foreground sm:text-[1.2rem]">
                  {trustSection.anchorTitle}
                </h3>
                <p className="mt-5 max-w-[21rem] text-[13px] leading-[1.72] text-muted sm:text-[14px] sm:leading-7">
                  {trustSection.anchorDescription}
                </p>
              </ViewportReveal>

              {secondaryTrustItems.map((item, index) => (
                <ViewportReveal
                  key={item.title}
                  delay={index * 90}
                  className="brand-trust-item px-1 py-5 sm:px-2 sm:py-6"
                >
                  <span className="brand-trust-accent-line mb-5 block" />
                  <p className="max-w-[12ch] text-[1rem] font-semibold leading-[1.2] tracking-[-0.024em] text-foreground sm:text-[1.08rem]">
                    {item.title}
                  </p>
                  <p className="mt-5 max-w-[18rem] text-[13px] leading-[1.72] text-muted sm:text-[14px] sm:leading-7">
                    {item.description}
                  </p>
                </ViewportReveal>
              ))}
            </div>
          </ViewportReveal>
        </section>

        <section className="brand-story-panel section-atmosphere relative overflow-hidden rounded-[32px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <ViewportReveal className="relative grid gap-8 xl:grid-cols-[minmax(0,0.88fr)_minmax(360px,1.12fr)] xl:items-start xl:gap-10">
            <div className="max-w-[34rem]">
              <p className="inline-flex rounded-full border border-white/6 bg-white/[0.02] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.26em] text-accent-strong/76">
                {notice.kicker}
              </p>
              <h2 className="mt-4 text-[1.95rem] leading-[1.05] font-semibold tracking-[-0.05em] text-foreground sm:text-[2.5rem] lg:text-[2.8rem]">
                {notice.moduleTitle}
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-muted sm:text-[16px]">
                {notice.moduleDescription}
              </p>

              <div className="brand-hero-actions mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="ui-primary-button inline-flex min-w-[12.75rem] items-center justify-center px-6 py-3.5 text-sm font-semibold"
                >
                  {intro.primaryCta}
                </Link>
                <Link
                  href="/track"
                  className="ui-secondary-button inline-flex min-w-[10.9rem] items-center justify-center rounded-full px-5 py-3.5 text-sm font-medium"
                >
                  {intro.secondaryCta}
                </Link>
              </div>

              <div className="brand-support-inline mt-8 rounded-[24px] px-5 py-4 sm:px-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent-strong/74">
                  {notice.supportTitle}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2.5 text-sm leading-7 sm:text-[15px]">
                  <SiTelegram className="h-[15px] w-[15px] shrink-0 text-accent-strong" />
                  <span className="text-muted">{notice.supportLabel}</span>
                  <Link
                    href="https://t.me/Avolaofficial"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-accent-strong hover:text-foreground"
                  >
                    {notice.supportHandle}
                  </Link>
                </div>
              </div>
            </div>

            <div className="brand-story-card brand-story-card-compact rounded-[26px] px-5 py-5 sm:px-6 sm:py-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent-strong/74">
                    {notice.title}
                  </p>
                  <div className="mt-4 space-y-2 text-[14px] leading-7 text-muted sm:text-[15px]">
                    {notice.paragraphs.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent-strong/74">
                    {notice.rulesTitle}
                  </p>
                  <div className="mt-4 space-y-3">
                    {notice.rules.map((item) => (
                      <div
                        key={item}
                        className="brand-rule-line border-t border-white/7 pt-3 first:border-t-0 first:pt-0"
                      >
                        <p className="text-[14px] leading-7 text-muted-strong sm:text-[15px]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ViewportReveal>
        </section>
      </div>
    </main>
  );
}
