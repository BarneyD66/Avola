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
    <div className="segmented-shell">
      {themeOptions.map((option) => {
        const active = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className="segmented-button sm:px-4 sm:text-sm"
            data-active={active}
            aria-pressed={active}
          >
            {messages.theme[option.key]}
          </button>
        );
      })}
    </div>
  );
}
