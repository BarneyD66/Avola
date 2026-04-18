"use client";

import Link from "next/link";
import { CategoryPreviewCTA } from "@/components/CategoryPreviewCTA";
import { CategoryPreviewIcon } from "@/components/CategoryPreviewIcon";
import { CategoryPreviewList } from "@/components/CategoryPreviewList";
import { CategoryPreviewPackageList } from "@/components/CategoryPreviewPackageList";
import { useLocale } from "@/components/LocaleProvider";
import type { CategoryPreview } from "@/data/categories";

type CategoryPreviewCardProps = {
  category: CategoryPreview;
};

export function CategoryPreviewCard({ category }: CategoryPreviewCardProps) {
  const { locale } = useLocale();

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group h-full hover:-translate-y-0.5 active:translate-y-0"
    >
      <article
        className={`surface-panel relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/8 p-5 transition sm:p-6 ${
          locale === "en" ? "min-h-[296px]" : "min-h-[312px]"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

        <div className="flex items-start gap-4">
          <CategoryPreviewIcon iconKey={category.iconKey} />
          <div className="min-w-0">
            <h3 className="text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
              {category.title}
            </h3>
            <p className="mt-2 max-w-[34ch] text-sm leading-6 text-muted sm:text-[15px]">
              {category.description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex-1">
          <CategoryPreviewList items={category.previewItems} />
          <CategoryPreviewPackageList items={category.packageHighlights} />
        </div>

        <div className="mt-6 pt-4">
          <CategoryPreviewCTA label={category.ctaLabel} />
        </div>
      </article>
    </Link>
  );
}
