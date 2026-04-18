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
      ? items.slice(0, Math.min(items.length, 2))
      : items.slice(0, Math.min(items.length, 3));

  if (!visibleItems.length) {
    return null;
  }

  return (
    <div className="mt-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
        {messages.home.categories.packagePreview}
      </p>
      <div className="mt-2.5 divide-y divide-white/8">
        {visibleItems.map((item) => (
          <div
            key={`${item.title}-${item.price}`}
            className="flex items-start justify-between gap-4 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground sm:text-[15px]">
                {item.title}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-strong sm:text-[13px]">
                {item.result}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-accent-strong sm:text-[15px]">
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
