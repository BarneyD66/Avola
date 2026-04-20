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
  const { locale, messages } = useLocale();

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group block h-full hover:-translate-y-0.5 active:translate-y-0"
    >
      <article
        className={`category-preview-card surface-panel relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/8 p-4 transition duration-200 group-hover:border-accent/18 group-hover:shadow-[0_18px_34px_rgba(0,0,0,0.18)] sm:rounded-[28px] sm:p-6 ${
          locale === "en" ? "sm:min-h-[352px]" : "sm:min-h-[366px]"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
        <div className="absolute top-[-6%] right-[-16%] h-36 w-36 rounded-full bg-accent/6 blur-3xl transition duration-200 group-hover:bg-accent/12" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent opacity-60" />

        <div className="flex items-start gap-3.5 sm:gap-4">
          <CategoryPreviewIcon iconKey={category.iconKey} />
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent-strong/68">
              {messages.home.categories.kicker}
            </p>
            <h3 className="mt-2 text-[1.2rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[2rem]">
              {category.title}
            </h3>
            <p className="mt-1.5 max-w-[34ch] text-[13px] leading-6 text-muted sm:mt-2 sm:text-[15px]">
              {category.description}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-1 flex-col sm:mt-6">
          <CategoryPreviewList items={category.previewItems} />
          <CategoryPreviewPackageList items={category.packageHighlights} />
        </div>

        <div className="mt-5 border-t border-white/8 pt-4 sm:mt-auto">
          <CategoryPreviewCTA label={category.ctaLabel} />
        </div>
      </article>
    </Link>
  );
}
