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
    <div className="mt-3.5 sm:mt-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">
        {messages.home.categories.packagePreview}
      </p>
      <div className="mt-2 divide-y divide-white/8">
        {visibleItems.map((item) => (
          <div
            key={`${item.title}-${item.price}`}
            className="flex items-start justify-between gap-3 py-2 sm:gap-4"
          >
            <div className="min-w-0">
              <p className="line-clamp-2 text-[13px] font-medium leading-5 text-foreground sm:truncate sm:text-[14px]">
                {item.title}
              </p>
              <p className="mt-0.5 text-[11px] leading-5 text-muted sm:text-xs">
                {item.result}
              </p>
            </div>
            <span className="shrink-0 pt-0.5 text-[13px] font-semibold text-accent-strong sm:text-[14px]">
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
