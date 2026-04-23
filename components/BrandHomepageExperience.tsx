"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FocusEvent as ReactFocusEvent, MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { SiTelegram } from "react-icons/si";
import { PlatformCoverageTicker } from "@/components/PlatformCoverageTicker";
import { useLocale } from "@/components/LocaleProvider";
import { ViewportReveal } from "@/components/ViewportReveal";

type GlowTarget = HTMLElement;

function AnimatedMetric({
  value,
  suffix = "+",
  className,
  play = true,
}: {
  value: number;
  suffix?: string;
  className?: string;
  play?: boolean;
}) {
  const metricRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = metricRef.current;

    if (!node) {
      return;
    }

    if (!play) {
      node.textContent = `${value}${suffix}`;
      return;
    }

    let animationFrame = 0;
    let start: number | null = null;
    const duration = 860;

    const tick = (timestamp: number) => {
      if (start === null) {
        start = timestamp;
      }

      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = `${Math.round(value * eased)}${suffix}`;

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [play, suffix, value]);

  return <span ref={metricRef} className={className}>{play ? `0${suffix}` : `${value}${suffix}`}</span>;
}

function applySectionGlowMove(target: GlowTarget, event: ReactMouseEvent<GlowTarget>) {
  const bounds = target.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
  const shiftX = ((x - 50) / 50) * 8;
  const shiftY = ((y - 50) / 50) * 6;

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

function applyMagneticMove(target: HTMLElement, event: ReactMouseEvent<HTMLElement>) {
  const bounds = target.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  const shiftX = (x - 0.5) * 2.4;
  const shiftY = (y - 0.5) * 1.8;

  target.style.setProperty("--button-move-x", `${shiftX.toFixed(2)}px`);
  target.style.setProperty("--button-move-y", `${shiftY.toFixed(2)}px`);
}

function resetMagneticMove(target: HTMLElement) {
  target.style.setProperty("--button-move-x", "0px");
  target.style.setProperty("--button-move-y", "0px");
}

export function BrandHomepageExperience() {
  const { messages, locale } = useLocale();
  const intro = messages.home.intro;
  const valueSection = messages.home.landing;
  const flowSection = messages.home.flow;
  const trustSection = messages.home.trust;
  const notice = messages.home.notice;
  const [titleLineOne = intro.title, titleLineTwo = ""] = intro.title.split("\n");
  const [activeFlowStepIndex, setActiveFlowStepIndex] = useState(0);
  const [isFlowPaused, setIsFlowPaused] = useState(false);
  const [isFlowSectionVisible, setIsFlowSectionVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [pointerEffectsEnabled, setPointerEffectsEnabled] = useState(false);
  const activeFlowStep = flowSection.steps[activeFlowStepIndex];
  const flowSectionRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isFlowPaused || prefersReducedMotion) {
      return;
    }

    const stepCount = flowSection.steps.length;
    const interval = window.setInterval(() => {
      setActiveFlowStepIndex((current) => (current + 1) % stepCount);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [flowSection.steps.length, isFlowPaused, prefersReducedMotion]);

  useEffect(() => {
    const element = flowSectionRef.current;

    if (!element || isFlowSectionVisible) {
      return;
    }

    if (prefersReducedMotion) {
      setIsFlowSectionVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFlowSectionVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.22,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isFlowSectionVisible, prefersReducedMotion]);

  const interactiveSectionProps =
    pointerEffectsEnabled && !prefersReducedMotion
      ? {
          onMouseEnter: (event: ReactMouseEvent<HTMLElement>) =>
            event.currentTarget.style.setProperty("--section-glow-opacity", "1"),
          onMouseMove: (event: ReactMouseEvent<HTMLElement>) =>
            applySectionGlowMove(event.currentTarget, event),
          onMouseLeave: (event: ReactMouseEvent<HTMLElement>) => resetSectionGlow(event.currentTarget),
        }
      : {};

  const magneticButtonProps =
    pointerEffectsEnabled && !prefersReducedMotion
      ? {
          onMouseMove: (event: ReactMouseEvent<HTMLElement>) =>
            applyMagneticMove(event.currentTarget, event),
          onMouseLeave: (event: ReactMouseEvent<HTMLElement>) =>
            resetMagneticMove(event.currentTarget),
          onBlur: (event: ReactFocusEvent<HTMLElement>) =>
            resetMagneticMove(event.currentTarget),
        }
      : {};

  return (
    <main className="brand-home-main relative flex-1 pt-30 pb-16 sm:pt-29 sm:pb-20">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-6 px-4 sm:gap-7 sm:px-6 lg:gap-8 lg:px-8">
        <section
          className="brand-home-hero interactive-section-glow section-glow-hero hero-atmosphere hero-orbit-lines relative overflow-hidden rounded-[38px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20"
          {...interactiveSectionProps}
        >
          <div className="section-cursor-glow" aria-hidden />
          <div className="brand-home-orb brand-home-orb-a absolute top-[-18%] right-[-8%] h-72 w-72 rounded-full bg-accent/8 blur-3xl sm:h-[26rem] sm:w-[26rem]" />
          <div className="brand-home-orb brand-home-orb-b absolute bottom-[-20%] left-[-10%] h-64 w-64 rounded-full bg-cyan-400/5 blur-3xl sm:h-[20rem] sm:w-[20rem]" />
          <div className="brand-home-grid absolute inset-0 opacity-30" />
          <div className="brand-hero-spotlight absolute inset-x-0 top-[18%] mx-auto h-56 w-[64%] rounded-full bg-accent/6 blur-3xl" />

          <ViewportReveal className="relative z-[1] mx-auto flex max-w-[62rem] flex-col items-center text-center">
            <h1 className="brand-hero-headline hero-reveal hero-reveal-delay-1 mx-auto flex w-full max-w-[38rem] flex-col items-center text-[1.68rem] leading-[1.08] font-semibold tracking-[-0.04em] text-foreground sm:text-[2.95rem] sm:leading-[1.04] lg:text-[3.35rem] xl:text-[3.72rem]">
              <span className="brand-hero-headline-line block whitespace-nowrap text-center">{titleLineOne}</span>
              <span className="brand-hero-headline-line mt-2 block whitespace-nowrap text-center sm:mt-2.5">{titleLineTwo}</span>
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
                {...magneticButtonProps}
              >
                {intro.primaryCta}
              </Link>
              <Link
                href="/track"
                className="ui-secondary-button hero-secondary-button inline-flex min-w-[10.9rem] items-center justify-center rounded-full px-5 py-3.5 text-sm font-medium"
                {...magneticButtonProps}
              >
                {intro.secondaryCta}
              </Link>
            </div>

            <div className="brand-story-hero-trust hero-reveal hero-reveal-delay-4 mt-9 grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-3.5">
              {intro.trustItems.map((item) => {
                const metricMatch = item.title.match(/^(\d+)\+\s*([\s\S]*)$/);

                return (
                  <div
                    key={item.title}
                    className="brand-story-hero-trust-item rounded-[24px] px-4 py-3.5 text-center sm:px-5 sm:py-4.5"
                  >
                    <span className="brand-story-hero-trust-dot mb-3 inline-flex h-2.5 w-2.5 rounded-full bg-accent/85" />
                    <div className="brand-story-hero-trust-copy mx-auto">
                      {metricMatch ? (
                        <>
                          <AnimatedMetric
                            value={Number(metricMatch[1])}
                            play={!prefersReducedMotion}
                            className="brand-story-hero-trust-metric block"
                          />
                          <p
                            className={`brand-story-hero-trust-title mt-2 font-semibold tracking-[-0.026em] text-foreground ${
                              locale !== "en"
                                ? "brand-story-hero-trust-title-mobile-singleline max-w-none whitespace-nowrap text-[0.82rem] leading-[1.1] sm:max-w-[10.8ch] sm:whitespace-pre-line sm:text-[1rem] sm:leading-[1.32]"
                                : "whitespace-pre-line text-[1rem] leading-[1.32]"
                            }`}
                          >
                            {metricMatch[2]}
                          </p>
                        </>
                      ) : (
                        <p
                          className={`brand-story-hero-trust-title font-semibold tracking-[-0.026em] text-foreground ${
                            locale !== "en"
                              ? "brand-story-hero-trust-title-mobile-singleline max-w-none whitespace-nowrap text-[0.82rem] leading-[1.1] sm:max-w-[10.8ch] sm:whitespace-pre-line sm:text-[1rem] sm:leading-[1.32]"
                              : "whitespace-pre-line text-[1rem] leading-[1.32]"
                          }`}
                        >
                          {item.title}
                        </p>
                      )}
                    </div>
                    <p className="brand-story-hero-trust-description mx-auto mt-2.5 text-[12.5px] leading-5.5 text-muted sm:mt-3 sm:text-[13.5px] sm:leading-6">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </ViewportReveal>
        </section>

        <PlatformCoverageTicker />

        <section
          className="brand-story-panel interactive-section-glow section-glow-why section-atmosphere relative overflow-hidden rounded-[32px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
          {...interactiveSectionProps}
        >
          <div className="section-cursor-glow" aria-hidden />
          <div className="relative z-[1]">
            <div className="max-w-[55rem]">
              <ViewportReveal>
                <p className="inline-flex rounded-full border border-white/6 bg-white/[0.02] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.26em] text-accent-strong/76">
                  {valueSection.eyebrow}
                </p>
              </ViewportReveal>
              <ViewportReveal delay={70}>
                <h2 className="mt-4 max-w-[22ch] text-[1.7rem] leading-[1.14] font-semibold tracking-[-0.044em] text-foreground sm:text-[2.08rem] lg:max-w-[19ch] lg:text-[2.34rem] xl:text-[2.5rem]">
                  {valueSection.title}
                </h2>
              </ViewportReveal>
              <ViewportReveal delay={120}>
                <p className="mt-5 max-w-[44rem] text-[15px] leading-8 text-muted sm:text-[16px] sm:leading-[1.95rem]">
                  {valueSection.description}
                </p>
              </ViewportReveal>
            </div>

            <ViewportReveal delay={180} className="brand-value-strip mt-10 overflow-hidden rounded-[28px]">
              {valueSection.cards.map((item, index) => (
                <ViewportReveal
                  key={item.title}
                  delay={index * 90}
                  className="brand-value-cell px-5 py-6 sm:px-6 sm:py-6.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-accent-strong/74">
                      {item.label}
                    </p>
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent-strong/62">
                      {`0${index + 1}`}
                    </span>
                  </div>
                  <h3 className="mt-5 max-w-[18ch] text-[1.1rem] leading-[1.16] font-semibold tracking-[-0.03em] text-foreground sm:text-[1.2rem]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-[25rem] text-[13px] leading-[1.74] text-muted sm:text-[14px] sm:leading-7">
                    {item.description}
                  </p>
                </ViewportReveal>
              ))}
            </ViewportReveal>
          </div>
        </section>

        <section
          className="brand-story-panel interactive-section-glow section-glow-flow section-atmosphere relative overflow-hidden rounded-[32px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
          {...interactiveSectionProps}
        >
          <div className="section-cursor-glow" aria-hidden />
          <div className="relative z-[1]">
            <div className="mx-auto max-w-[50rem] text-center">
              <ViewportReveal>
                <p className="inline-flex rounded-full border border-white/6 bg-white/[0.02] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.26em] text-accent-strong/76">
                  {flowSection.eyebrow}
                </p>
              </ViewportReveal>
              <ViewportReveal delay={70}>
                <h2 className="mt-4 text-[1.95rem] leading-[1.05] font-semibold tracking-[-0.05em] text-foreground sm:text-[2.5rem] lg:text-[2.85rem]">
                  {flowSection.title}
                </h2>
              </ViewportReveal>
              <ViewportReveal delay={120}>
                <p className="mt-4 text-[15px] leading-8 text-muted sm:text-[16px]">
                  {flowSection.description}
                </p>
              </ViewportReveal>
            </div>

            <div
              ref={flowSectionRef}
              className={`brand-flow-stage relative mt-10 ${
                isFlowSectionVisible ? "is-flow-visible" : ""
              }`}
              onMouseEnter={() => setIsFlowPaused(true)}
              onMouseLeave={() => setIsFlowPaused(false)}
            >
              <div className="brand-flow-ambient absolute inset-x-[8%] top-[6%] hidden h-40 rounded-full bg-accent/6 blur-3xl sm:block" />

              <ViewportReveal delay={180} className="sm:hidden">
                <div className="brand-flow-mobile-stack space-y-3">
                  {flowSection.steps.map((step, index) => {
                    const isActive = index === activeFlowStepIndex;
                    return (
                      <button
                        key={`${step.title}-mobile`}
                        type="button"
                        onClick={() => setActiveFlowStepIndex(index)}
                        aria-pressed={isActive}
                        aria-current={isActive ? "step" : undefined}
                        className={`brand-flow-mobile-item w-full rounded-[24px] border px-4 py-4 text-left transition-all duration-200 ${
                          isActive
                            ? "border-accent/28 bg-[linear-gradient(145deg,rgba(29,78,216,0.14),rgba(255,255,255,0.03))] shadow-[0_12px_26px_rgba(15,23,42,0.18)]"
                            : "border-white/6 bg-white/[0.015]"
                        }`}
                      >
                        <div className="brand-flow-mobile-row flex items-start gap-3">
                          <span
                            className={`brand-flow-mobile-marker inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold tracking-[0.2em] uppercase ${
                              isActive
                                ? "border-accent/30 bg-accent/12 text-accent-strong shadow-[0_0_0_6px_rgba(59,130,246,0.08)]"
                                : "border-white/10 bg-white/[0.03] text-accent-strong/88"
                            }`}
                          >
                            {`0${index + 1}`}
                          </span>
                          <div className="brand-flow-mobile-copy min-w-0 flex-1">
                            <p className="brand-flow-mobile-title text-[1rem] leading-[1.25] font-semibold tracking-[-0.02em] text-foreground">
                              {step.title}
                            </p>
                            <p className="brand-flow-mobile-description mt-2 text-[13px] leading-6 text-muted">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ViewportReveal>

              <div className="relative hidden gap-5 sm:grid xl:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] xl:items-start">
                <ViewportReveal delay={180}>
                  <div className="brand-flow-list rounded-[26px] px-5 py-5 sm:px-6 sm:py-6">
                    {flowSection.steps.map((step, index) => {
                      const isActive = index === activeFlowStepIndex;
                      return (
                        <button
                          key={step.title}
                          type="button"
                          onClick={() => setActiveFlowStepIndex(index)}
                          onMouseEnter={() => {
                            setActiveFlowStepIndex(index);
                            setIsFlowPaused(true);
                          }}
                          onFocus={() => {
                            setActiveFlowStepIndex(index);
                            setIsFlowPaused(true);
                          }}
                          onBlur={() => setIsFlowPaused(false)}
                          aria-pressed={isActive}
                          aria-current={isActive ? "step" : undefined}
                          className={`brand-flow-list-item ${isActive ? "brand-flow-list-item-active" : ""}`}
                          style={{ "--flow-step-delay": `${index * 90}ms` } as CSSProperties}
                        >
                          <div className="brand-flow-list-line" />
                          <div className="brand-flow-list-marker">
                            <span className="brand-flow-list-number">{`0${index + 1}`}</span>
                          </div>
                          <div className="brand-flow-list-copy min-w-0">
                            <p className="brand-flow-list-title text-[1rem] font-semibold tracking-[-0.024em] text-foreground sm:text-[1.04rem]">
                              {step.title}
                            </p>
                            <p className="brand-flow-list-description mt-2 text-[13px] leading-6 text-muted sm:text-[14px]">
                              {step.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ViewportReveal>

                <ViewportReveal delay={260}>
                  <article
                    key={activeFlowStep.title}
                    className="brand-flow-card brand-flow-card-active flow-detail-panel brand-flow-detail-content rounded-[28px] px-5 py-6 sm:px-7 sm:py-7"
                    style={{ "--flow-panel-delay": "360ms" } as CSSProperties}
                  >
                    <p className="brand-flow-current-label text-[10px] font-medium uppercase tracking-[0.24em] text-accent-strong/74">
                      {flowSection.currentStageLabel}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="inline-flex rounded-full border border-accent/18 bg-accent/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-accent-strong">
                        {`0${activeFlowStepIndex + 1}`}
                      </span>
                      <h3 className="brand-flow-card-title text-[1.45rem] leading-[1.08] font-semibold tracking-[-0.04em] text-foreground sm:text-[1.7rem]">
                        {activeFlowStep.title}
                      </h3>
                    </div>
                    <p className="brand-flow-card-description mt-4 max-w-[34rem] text-[15px] leading-8 text-muted sm:text-[16px]">
                      {activeFlowStep.description}
                    </p>

                    <div className="brand-flow-active-rail mt-7 grid gap-3 sm:grid-cols-2">
                      <div className="brand-flow-active-block rounded-[20px] px-4 py-4 sm:px-5">
                        <p className="brand-flow-active-label text-[10px] uppercase tracking-[0.22em] text-accent-strong/72">
                          {flowSection.completedLabel}
                        </p>
                        <p className="brand-flow-active-copy mt-3 text-[13px] leading-6 text-muted-strong sm:text-[14px] sm:leading-7">
                          {activeFlowStep.completed}
                        </p>
                      </div>

                      <div className="brand-flow-active-block rounded-[20px] px-4 py-4 sm:px-5">
                        <p className="brand-flow-active-label text-[10px] uppercase tracking-[0.22em] text-accent-strong/72">
                          {flowSection.nextLabel}
                        </p>
                        <p className="brand-flow-active-copy mt-3 text-[13px] leading-6 text-muted-strong sm:text-[14px] sm:leading-7">
                          {activeFlowStep.next}
                        </p>
                      </div>
                    </div>
                  </article>
                </ViewportReveal>
              </div>
            </div>
          </div>
        </section>

        <section
          className="brand-story-panel interactive-section-glow section-glow-scenarios section-atmosphere relative overflow-hidden rounded-[32px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
          {...interactiveSectionProps}
        >
          <div className="section-cursor-glow" aria-hidden />
          <div className="relative z-[1]">
            <div className="mx-auto max-w-[54rem] text-center">
              <ViewportReveal>
                <p className="inline-flex rounded-full border border-white/6 bg-white/[0.02] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.26em] text-accent-strong/76">
                  {trustSection.eyebrow}
                </p>
              </ViewportReveal>
              <ViewportReveal delay={70}>
                <h2
                  className={`mx-auto mt-5 text-[1.48rem] leading-[1.16] font-semibold tracking-[-0.04em] text-foreground sm:text-[1.84rem] lg:text-[2.06rem] ${
                    locale === "en"
                      ? "max-w-none whitespace-pre-line"
                      : "max-w-[22ch] sm:max-w-none sm:whitespace-nowrap"
                  }`}
                >
                  {trustSection.title}
                </h2>
              </ViewportReveal>
              <ViewportReveal delay={120}>
                <p className="mx-auto mt-6 max-w-[40rem] text-[14px] leading-7 text-muted sm:text-[15px] sm:leading-7.5">
                  {trustSection.description}
                </p>
              </ViewportReveal>
            </div>

            <ViewportReveal delay={180} className="brand-trust-grid mt-11">
              {trustSection.cards.map((item, index) => (
                <ViewportReveal
                  key={item.title}
                  delay={index * 90}
                  className="brand-trust-item px-1 py-5 sm:px-2 sm:py-6"
                >
                  <span className="brand-trust-accent-line mb-5 block" />
                  <p className="text-[0.98rem] font-semibold leading-[1.26] tracking-[-0.024em] text-foreground sm:text-[1.06rem]">
                    {item.title}
                  </p>
                  <p className="mt-5 max-w-[20rem] text-[13px] leading-[1.72] text-muted sm:text-[14px] sm:leading-7">
                    {item.description}
                  </p>
                </ViewportReveal>
              ))}
            </ViewportReveal>
          </div>
        </section>

        <section
          className="brand-story-panel interactive-section-glow section-glow-rules section-atmosphere relative overflow-hidden rounded-[32px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
          {...interactiveSectionProps}
        >
          <div className="section-cursor-glow" aria-hidden />
          <ViewportReveal className="relative z-[1] grid gap-8 xl:grid-cols-[minmax(0,0.88fr)_minmax(360px,1.12fr)] xl:items-start xl:gap-10">
            <div className="max-w-[34rem]">
              <ViewportReveal>
                <p className="inline-flex rounded-full border border-white/6 bg-white/[0.02] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.26em] text-accent-strong/76">
                  {notice.kicker}
                </p>
              </ViewportReveal>
              <ViewportReveal delay={70}>
                <h2 className="mt-4 text-[1.95rem] leading-[1.05] font-semibold tracking-[-0.05em] text-foreground sm:text-[2.5rem] lg:text-[2.8rem]">
                  {notice.moduleTitle}
                </h2>
              </ViewportReveal>
              <ViewportReveal delay={120}>
                <p className="mt-4 text-[15px] leading-8 text-muted sm:text-[16px]">
                  {notice.moduleDescription}
                </p>
              </ViewportReveal>

              <ViewportReveal delay={170} className="brand-hero-actions mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="ui-primary-button inline-flex min-w-[12.75rem] items-center justify-center px-6 py-3.5 text-sm font-semibold"
                  {...magneticButtonProps}
                >
                  {intro.primaryCta}
                </Link>
                <Link
                  href="/track"
                  className="ui-secondary-button inline-flex min-w-[10.9rem] items-center justify-center rounded-full px-5 py-3.5 text-sm font-medium"
                  {...magneticButtonProps}
                >
                  {intro.secondaryCta}
                </Link>
              </ViewportReveal>

              <ViewportReveal delay={220} className="brand-support-inline mt-8 rounded-[24px] px-5 py-4 sm:px-6">
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
              </ViewportReveal>
            </div>

            <ViewportReveal delay={200} className="brand-story-card brand-story-card-compact rounded-[26px] px-5 py-5 sm:px-6 sm:py-6">
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
            </ViewportReveal>
          </ViewportReveal>
        </section>
      </div>
    </main>
  );
}
