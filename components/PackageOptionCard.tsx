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
      className={`relative flex w-full flex-col items-start rounded-2xl border px-3.5 py-3.5 text-left transition hover:-translate-y-0.5 active:translate-y-0 sm:px-4 sm:py-4 ${
        selected
          ? "border-accent/50 bg-accent/8 shadow-[0_16px_34px_rgba(59,130,246,0.1)]"
          : "border-white/10 bg-white/[0.02] hover:border-white/18 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex w-full items-start justify-between gap-3 sm:gap-4">
        <span className="text-[1.05rem] font-semibold tracking-tight text-white">
          {item.price}
        </span>
        <span
          className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${
            selected
              ? "border-accent/35 bg-accent/14 text-accent-strong"
              : "border-white/10 bg-white/[0.03] text-zinc-500"
          }`}
          aria-hidden="true"
        >
          {selected ? "✓" : ""}
        </span>
      </div>

      {item.label || item.recommended ? (
        <div className="mt-3 flex w-full flex-wrap items-center gap-1.5 sm:gap-2">
          {item.label ? (
            <span className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              {item.label}
            </span>
          ) : null}
          {item.recommended ? (
            <span className="inline-flex items-center rounded-full border border-accent/22 bg-accent/10 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-accent-strong sm:text-[10px] sm:tracking-[0.18em]">
              {messages.service.recommended}
            </span>
          ) : null}
        </div>
      ) : null}

      <span className="mt-2 text-sm font-medium leading-6 text-zinc-200">
        {item.result}
      </span>
      {item.deliveryTime ? (
        <span className="mt-2 text-sm leading-6 text-zinc-400">
          {messages.service.estimatedPrefix} {item.deliveryTime}
        </span>
      ) : null}
    </button>
  );
}
