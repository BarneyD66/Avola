"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { Locale } from "@/data/locale";

const localeOptions: Array<{ value: Locale; key: "zh" | "en" }> = [
  { value: "zh-CN", key: "zh" },
  { value: "en", key: "en" },
];

export function LocaleToggle() {
  const { locale, setLocale, messages } = useLocale();

  return (
    <div className="segmented-shell">
      {localeOptions.map((option) => {
        const active = locale === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            className="segmented-button sm:px-4 sm:text-sm"
            data-active={active}
            aria-pressed={active}
          >
            {messages.locale[option.key]}
          </button>
        );
      })}
    </div>
  );
}
