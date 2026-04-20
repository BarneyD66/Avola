"use client";

import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { useLocale } from "@/components/LocaleProvider";
import { ViewportReveal } from "@/components/ViewportReveal";

export function BrandGatewaySection() {
  const { messages } = useLocale();

  return (
    <section className="gateway-scene-panel surface-panel section-atmosphere relative overflow-hidden rounded-[28px] border border-white/8 px-4 py-6 sm:rounded-[34px] sm:px-6 sm:py-8 lg:px-8 lg:py-9">
      <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center opacity-[0.05]">
        <BrandWordmark size="hero" className="scale-[1.9] sm:scale-[2.5] lg:scale-[3.1]" />
      </div>
      <div className="absolute right-[-12%] bottom-[-22%] h-80 w-80 rounded-full bg-accent/14 blur-3xl" />

      <ViewportReveal className="relative">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
          <div className="max-w-[46rem]">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-accent-strong/75">
              {messages.home.gateway.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[14ch] text-[2.15rem] leading-[1.02] font-semibold tracking-[-0.06em] text-foreground sm:text-[2.85rem] lg:text-[3.4rem]">
              {messages.home.gateway.title}
            </h2>
            <p className="mt-4 max-w-[34rem] text-sm leading-7 text-muted sm:text-[15px] sm:leading-8">
              {messages.home.gateway.description}
            </p>
          </div>

          <div className="grid gap-3 rounded-[24px] border border-white/8 bg-white/[0.02] p-4 sm:p-5">
            <Link
              href="/services"
              className="ui-primary-button inline-flex items-center justify-center px-5 py-3.5 text-sm font-semibold"
            >
              {messages.home.gateway.primaryCta}
            </Link>
            <Link
              href="/track"
              className="ui-secondary-button inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-medium"
            >
              {messages.home.gateway.secondaryCta}
            </Link>
          </div>
        </div>
      </ViewportReveal>
    </section>
  );
}
