"use client";

import { useLocale } from "@/components/LocaleProvider";
import { useTheme } from "@/components/ThemeProvider";
import type { ThemeMode } from "@/data/theme";

const themeOptions: Array<{ key: "dark" | "light"; value: ThemeMode }> = [
  { key: "dark", value: "dark" },
  { key: "light", value: "light" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { messages } = useLocale();

  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
      {themeOptions.map((option) => {
        const active = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium sm:px-4 sm:text-sm ${
              active
                ? "bg-accent text-white shadow-[0_10px_24px_rgba(59,130,246,0.22)]"
                : "text-zinc-300 hover:text-white"
            }`}
            aria-pressed={active}
          >
            {messages.theme[option.key]}
          </button>
        );
      })}
    </div>
  );
}
