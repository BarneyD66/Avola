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
    <section className="flex flex-col gap-6 sm:gap-8">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {messages.home.categories.title}
        </h2>
        <p className="mt-3 text-base leading-8 text-muted sm:text-lg">
          {messages.home.categories.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {localizedCategories.map((category) => (
          <CategoryPreviewCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
