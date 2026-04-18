"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { ServicePackage } from "@/data/services";

type PackageOptionCardProps = {
  item: ServicePackage;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function PackageOptionCard({
  item,
  selected,
  onSelect,
}: PackageOptionCardProps) {
  const { messages } = useLocale();

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`relative flex w-full flex-col items-start rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5 active:translate-y-0 ${
        selected
          ? "border-accent/55 bg-accent/10 shadow-[0_18px_40px_rgba(59,130,246,0.12)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]"
      }`}
    >
      {item.recommended ? (
        <span className="absolute top-3 right-3 rounded-full border border-accent/25 bg-accent/12 px-2.5 py-1 text-[11px] font-medium tracking-[0.18em] text-accent-strong uppercase">
          {messages.service.recommended}
        </span>
      ) : null}

      <span className="text-lg font-semibold tracking-tight text-white">
        {item.price}
      </span>
      <span className="mt-3 text-sm font-medium text-zinc-200">{item.result}</span>
      {item.deliveryTime ? (
        <span className="mt-2 text-sm leading-6 text-zinc-400">
          {messages.service.estimatedPrefix} {item.deliveryTime}
        </span>
      ) : null}
    </button>
  );
}
