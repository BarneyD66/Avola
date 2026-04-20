"use client";

import Link from "next/link";
import { SiTelegram } from "react-icons/si";
import { useLocale } from "@/components/LocaleProvider";
import { ViewportReveal } from "@/components/ViewportReveal";

export function NoticeCard() {
  const { messages } = useLocale();

  return (
    <section className="notice-home-panel notice-editorial-panel surface-panel overflow-hidden rounded-[28px] border border-white/8 px-4 py-5 sm:rounded-[32px] sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6">
        <ViewportReveal className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-accent-strong/72">
            {messages.home.notice.kicker}
          </p>
          <h2 className="mt-4 text-[1.65rem] leading-[1.08] font-semibold tracking-[-0.04em] text-foreground sm:text-[2rem]">
            {messages.home.notice.title}
          </h2>

          <div className="mt-5 space-y-2 text-sm leading-7 text-muted sm:text-[15px]">
            {messages.home.notice.paragraphs.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 rounded-[16px] border border-white/8 bg-white/[0.02] px-3.5 py-3 text-sm leading-7 sm:text-[15px]">
            <SiTelegram className="h-[15px] w-[15px] shrink-0 text-accent-strong" />
            <span className="text-muted">{messages.home.notice.supportLabel}</span>
            <Link
              href="https://t.me/Avolaofficial"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent-strong hover:text-foreground"
            >
              {messages.home.notice.supportHandle}
            </Link>
          </div>
        </ViewportReveal>

        <div className="grid gap-3">
          {messages.home.notice.rules.map((item, index) => (
            <ViewportReveal key={item} delay={index * 70}>
              <div className="notice-rule-card surface-subtle flex items-start gap-4 rounded-[22px] px-4 py-4 sm:px-5 sm:py-4.5">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-[11px] font-semibold text-accent-strong">
                  0{index + 1}
                </span>
                <span className="text-sm leading-7 text-muted-strong sm:text-[15px]">{item}</span>
              </div>
            </ViewportReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
