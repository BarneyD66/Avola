export type Locale = "zh-CN" | "en";

export const LOCALE_STORAGE_KEY = "avola-locale";
export const DEFAULT_LOCALE: Locale = "zh-CN";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "zh-CN" || value === "en";
}
