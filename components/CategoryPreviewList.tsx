"use client";

import { useLocale } from "@/components/LocaleProvider";

type CategoryPreviewListProps = {
  items: string[];
};

export function CategoryPreviewList({ items }: CategoryPreviewListProps) {
  const { locale } = useLocale();

  return (
    <ul
      className={`grid grid-cols-2 gap-x-3 gap-y-1.5 text-muted-strong sm:gap-x-4 sm:gap-y-2 ${
        locale === "en" ? "text-[12.5px] sm:text-[14.5px]" : "text-[13px] sm:text-[15px]"
      }`}
    >
      {items.map((item, index) => {
        const isLastOddItem = items.length % 2 === 1 && index === items.length - 1;

        return (
          <li
            key={item}
            className={`inline-flex min-w-0 items-start gap-2 leading-6 ${isLastOddItem ? "col-span-2" : ""}`}
          >
            <span
              aria-hidden="true"
              className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-strong/80"
            />
            <span className="min-w-0 break-words">{item}</span>
          </li>
        );
      })}
    </ul>
  );
}
