"use client";

import { CategoryPreviewCard } from "@/components/CategoryPreviewCard";
import { useLocale } from "@/components/LocaleProvider";
import type { CategoryPreview } from "@/data/categories";
import { getLocalizedCategoryPreview } from "@/locales/content";

type CategoryPreviewSectionProps = {
  categories: CategoryPreview[];
  showHeader?: boolean;
};

export function CategoryPreviewSection({
  categories,
  showHeader = true,
}: CategoryPreviewSectionProps) {
  const { locale, messages } = useLocale();
  const localizedCategories = categories.map((category) =>
    getLocalizedCategoryPreview(category, locale),
  );

  return (
    <section
      id="service-categories"
      className="scroll-mt-32 flex flex-col gap-4 sm:gap-6 lg:gap-7"
    >
      {showHeader ? (
        <div className="max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-accent-strong/72">
            {messages.home.categories.kicker}
          </p>
          <h2 className="mt-2 text-[1.9rem] font-semibold tracking-tight text-foreground sm:text-4xl">
            {messages.home.categories.title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted sm:mt-2.5 sm:text-lg sm:leading-8">
            {messages.home.categories.description}
          </p>
        </div>
      ) : null}

      <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        {localizedCategories.map((category) => (
          <CategoryPreviewCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
