"use client";

import Link from "next/link";
import { CategoryPreviewIcon } from "@/components/CategoryPreviewIcon";
import { useLocale } from "@/components/LocaleProvider";
import type { CategoryPreview } from "@/data/categories";
import { getLocalizedCategoryPreview } from "@/locales/content";

type ServicesEditorialGridProps = {
  categories: CategoryPreview[];
};

export function ServicesEditorialGrid({
  categories,
}: ServicesEditorialGridProps) {
  const { locale, messages } = useLocale();
  const localizedCategories = categories.map((category) =>
    getLocalizedCategoryPreview(category, locale),
  );

  return (
    <section className="grid gap-5 lg:grid-cols-2 lg:gap-6">
      {localizedCategories.map((category) => {
        const visiblePackages =
          locale === "en"
            ? category.packageHighlights.slice(0, Math.min(2, category.packageHighlights.length))
            : category.packageHighlights.slice(0, Math.min(3, category.packageHighlights.length));

        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group block"
          >
            <article className="services-directory-card surface-panel relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/6 p-5 sm:rounded-[28px] sm:p-6 lg:p-6.5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
              <div className="absolute top-[-10%] right-[-8%] h-36 w-36 rounded-full bg-accent/7 blur-3xl opacity-70" />

              <div className="services-directory-card-header flex items-start gap-4">
                <CategoryPreviewIcon iconKey={category.iconKey} />
                <div className="min-w-0">
                  <h2 className="services-directory-card-title max-w-[16ch] text-[1.4rem] leading-[1.08] font-semibold tracking-[-0.038em] text-foreground sm:text-[1.68rem]">
                    {category.title}
                  </h2>
                  <p className="mt-3 max-w-[34rem] text-[14px] leading-7 text-muted sm:text-[14.5px] sm:leading-7.5">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.96fr)_minmax(250px,0.9fr)]">
                <div className="services-directory-card-panel rounded-[22px] px-4 py-4 sm:px-5 sm:py-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">
                    {messages.services.coverageLabel}
                  </p>
                  <div className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    {category.previewItems.map((item) => (
                      <div
                        key={item}
                        className="inline-flex min-w-0 items-start gap-2.5 text-[14px] leading-6 text-muted-strong"
                      >
                        <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-strong/80 shadow-[0_0_0_4px_rgba(59,130,246,0.06)]" />
                        <span className="min-w-0 break-words">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="services-directory-card-panel rounded-[22px] px-4 py-4 sm:px-5 sm:py-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">
                      {messages.services.representativeLabel}
                    </p>
                  </div>

                  <div className="mt-3 divide-y divide-white/7">
                    {visiblePackages.map((item, index) => (
                      <div
                        key={`${item.title}-${item.price}`}
                        className={`flex items-start justify-between gap-3 py-3 ${
                          index === 0 ? "pt-0" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-[14px] font-medium leading-6 text-foreground">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-[12px] leading-5 text-muted sm:text-[13px]">
                            {item.result}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-accent/14 bg-accent-soft/35 px-3 py-1 text-[12px] font-semibold text-accent-strong sm:text-[13px]">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-white/7 pt-4">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-accent-strong">
                  <span>{messages.services.openCategory}</span>
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </section>
  );
}

