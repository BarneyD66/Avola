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
    <section className="flex flex-col gap-4 sm:gap-7">
      <div className="max-w-3xl">
        <h2 className="text-[1.9rem] font-semibold tracking-tight text-foreground sm:text-4xl">
          {localizedCategory.title}
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted sm:mt-3 sm:text-lg sm:leading-8">
          {localizedCategory.description}
        </p>
      </div>

      <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {localizedCategory.platforms?.map((platform) => (
          <PlatformCard key={platform.platform} platform={platform} />
        ))}
      </div>
    </section>
  );
}
