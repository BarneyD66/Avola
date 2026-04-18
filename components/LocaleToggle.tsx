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
    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
      {localeOptions.map((option) => {
        const active = locale === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium sm:px-4 sm:text-sm ${
              active
                ? "bg-accent text-white shadow-[0_10px_24px_rgba(59,130,246,0.22)]"
                : "text-zinc-300 hover:text-white"
            }`}
            aria-pressed={active}
          >
            {messages.locale[option.key]}
          </button>
        );
      })}
    </div>
  );
}
