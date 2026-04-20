"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { CategoryPackageHighlight } from "@/data/categories";

type CategoryPreviewPackageListProps = {
  items: CategoryPackageHighlight[];
};

export function CategoryPreviewPackageList({
  items,
}: CategoryPreviewPackageListProps) {
  const { locale, messages } = useLocale();
  const visibleItems =
    locale === "en"
      ? items.length > 3
        ? items.slice(0, 1)
        : items.slice(0, Math.min(items.length, 2))
      : items.slice(0, Math.min(items.length, 3));

  if (!visibleItems.length) {
    return null;
  }

  return (
    <div className="mt-4 rounded-[20px] border border-white/6 bg-black/10 px-3 py-3 sm:mt-4.5 sm:px-3.5 sm:py-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">
          {messages.home.categories.packagePreview}
        </p>
        <span className="text-[10px] uppercase tracking-[0.22em] text-accent-strong/68">
          {messages.home.categories.curatedLabel}
        </span>
      </div>
      <div className="mt-2 divide-y divide-white/8">
        {visibleItems.map((item, index) => (
          <div
            key={`${item.title}-${item.price}`}
            className={`flex items-start justify-between gap-3 py-2.5 sm:gap-4 ${
              index === 0 ? "pt-0.5" : ""
            }`}
          >
            <div className="min-w-0">
              <p className="line-clamp-2 text-[13px] font-medium leading-5 text-foreground sm:truncate sm:text-[14px]">
                {item.title}
              </p>
              <p className="mt-0.5 text-[11px] leading-5 text-muted sm:text-xs">
                {item.result}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-accent/14 bg-accent-soft/35 px-2.5 py-1 text-[12px] font-semibold text-accent-strong sm:text-[13px]">
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
