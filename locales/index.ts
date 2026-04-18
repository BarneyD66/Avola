import type { Locale } from "@/data/locale";
import { en } from "@/locales/en";
import { zhCN } from "@/locales/zh-CN";

type DeepWiden<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepWiden<U>[]
    : T extends object
      ? { [K in keyof T]: DeepWiden<T[K]> }
      : T;

export type Messages = DeepWiden<typeof zhCN>;

const messagesByLocale: Record<Locale, Messages> = {
  "zh-CN": zhCN,
  en,
};

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale];
}
