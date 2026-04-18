"use client";

import { PlatformCard } from "@/components/PlatformCard";
import { useLocale } from "@/components/LocaleProvider";
import type { CategoryPageData } from "@/data/categories";
import { getLocalizedCategoryPage } from "@/locales/content";

type ServiceCategorySectionProps = {
  category: Pick<CategoryPageData, "title" | "description" | "platforms" | "slug">;
};

export function ServiceCategorySection({
  category,
}: ServiceCategorySectionProps) {
  const { locale } = useLocale();
  const localizedCategory = getLocalizedCategoryPage(category, locale);

  return (
    <section className="flex flex-col gap-5 sm:gap-7">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {localizedCategory.title}
        </h2>
        <p className="mt-3 text-base leading-8 text-zinc-400 sm:text-lg">
          {localizedCategory.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {localizedCategory.platforms?.map((platform) => (
          <PlatformCard key={platform.platform} platform={platform} />
        ))}
      </div>
    </section>
  );
}
