"use client";

import { CategoryItemCard } from "@/components/CategoryItemCard";
import { useLocale } from "@/components/LocaleProvider";
import type { CategoryPageData } from "@/data/categories";
import { getLocalizedCategoryPage } from "@/locales/content";

type CategoryItemsSectionProps = {
  category: CategoryPageData;
};

export function CategoryItemsSection({ category }: CategoryItemsSectionProps) {
  const { locale } = useLocale();
  const localizedCategory = getLocalizedCategoryPage(category, locale);

  if (!localizedCategory.items?.length) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {localizedCategory.title}
        </h2>
        <p className="mt-3 text-base leading-8 text-zinc-400 sm:text-lg">
          {localizedCategory.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {localizedCategory.items.map((item) => (
          <CategoryItemCard
            key={item.title}
            title={item.title}
            slug={item.slug}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}
