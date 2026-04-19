"use client";

import { CategoryPreviewCard } from "@/components/CategoryPreviewCard";
import { useLocale } from "@/components/LocaleProvider";
import type { CategoryPreview } from "@/data/categories";
import { getLocalizedCategoryPreview } from "@/locales/content";

type CategoryPreviewSectionProps = {
  categories: CategoryPreview[];
};

export function CategoryPreviewSection({
  categories,
}: CategoryPreviewSectionProps) {
  const { locale, messages } = useLocale();
  const localizedCategories = categories.map((category) =>
    getLocalizedCategoryPreview(category, locale),
  );

  return (
    <section className="flex flex-col gap-4 sm:gap-6 lg:gap-7">
      <div className="max-w-3xl">
        <h2 className="text-[1.9rem] font-semibold tracking-tight text-foreground sm:text-4xl">
          {messages.home.categories.title}
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted sm:mt-2.5 sm:text-lg sm:leading-8">
          {messages.home.categories.description}
        </p>
      </div>

      <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        {localizedCategories.map((category) => (
          <CategoryPreviewCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
