"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { ServicesEditorialGrid } from "@/components/ServicesEditorialGrid";
import type { CategoryPreview } from "@/data/categories";

type ServicesDirectoryExperienceProps = {
  categories: CategoryPreview[];
};

export function ServicesDirectoryExperience({
  categories,
}: ServicesDirectoryExperienceProps) {
  const { locale, messages } = useLocale();

  return (
    <main className="relative flex-1 pt-34 pb-12 sm:pt-31 sm:pb-18">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:gap-7 lg:px-8">
        <section className="services-directory-hero section-atmosphere surface-panel overflow-hidden rounded-[28px] border border-white/6 px-4 py-7 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
          <div className="services-directory-hero-grid flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[42rem]">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-accent-strong/75">
                {messages.services.eyebrow}
              </p>
              <h1
                className={`mt-2.5 text-[1.72rem] leading-[1.06] font-semibold tracking-[-0.05em] text-foreground sm:text-[2.35rem] lg:text-[2.72rem] ${
                  locale === "en"
                    ? "max-w-[15.5ch] sm:max-w-[14.5ch]"
                    : "max-w-[10ch] sm:max-w-none"
                }`}
              >
                {messages.services.title}
              </h1>
              <p className="mt-3 max-w-[34rem] text-[14px] leading-6.5 text-muted-strong sm:text-[16px] sm:leading-7.5">
                {messages.services.description}
              </p>
            </div>

            <div className="services-directory-actions flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="ui-secondary-button inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-medium"
              >
                {messages.services.backHome}
              </Link>
              <Link
                href="/track"
                className="ui-primary-button inline-flex items-center justify-center px-5 py-3.5 text-sm font-semibold"
              >
                {messages.header.track}
              </Link>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <ServicesEditorialGrid categories={categories} />
        </section>
      </div>
    </main>
  );
}
