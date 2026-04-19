"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

type CategoryItemCardProps = {
  title: string;
  slug?: string;
  description?: string;
};

export function CategoryItemCard({
  title,
  slug,
  description,
}: CategoryItemCardProps) {
  const { messages } = useLocale();

  const content = (
    <article className="surface-panel flex h-full flex-col rounded-[24px] border border-white/8 p-4 sm:rounded-[26px] sm:p-7">
      <div className="h-1.5 w-14 rounded-full bg-gradient-to-r from-accent to-cyan-300/80" />
      <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:mt-5 sm:text-2xl">
        {title}
      </h3>
      {description ? (
        <p className="mt-3 flex-1 text-sm leading-7 text-muted sm:text-base">
          {description}
        </p>
      ) : null}
      <div className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl border border-accent/28 bg-accent/10 px-5 py-3 text-sm font-medium text-accent-strong sm:mt-6">
        {messages.home.categories.viewServiceDetails}
      </div>
    </article>
  );

  if (!slug) {
    return content;
  }

  return (
    <Link
      href={`/service/${slug}`}
      className="group h-full hover:-translate-y-0.5 active:translate-y-0"
    >
      {content}
    </Link>
  );
}
