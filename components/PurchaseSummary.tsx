"use client";

import { useLocale } from "@/components/LocaleProvider";

type PurchaseSummaryProps = {
  price: string;
  deliveryTime: string;
  packageLabel?: string;
  packageResult?: string;
};

export function PurchaseSummary({
  price,
  deliveryTime,
  packageLabel,
  packageResult,
}: PurchaseSummaryProps) {
  const { messages } = useLocale();

  return (
    <div className="surface-subtle rounded-2xl p-4">
      {packageLabel ? (
        <div className="mb-4 border-b border-white/8 pb-4">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.service.currentPackage}
          </p>
          <p className="mt-2 text-sm font-medium text-white">{packageLabel}</p>
          {packageResult ? (
            <p className="mt-1.5 text-sm leading-6 text-zinc-400">{packageResult}</p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-end justify-between gap-4 text-sm text-zinc-400">
        <span>{messages.service.price}</span>
        <span className="text-lg font-semibold tracking-tight text-white">{price}</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4 text-sm text-zinc-400">
        <span>{messages.service.deliveryTime}</span>
        <span className="font-medium text-white">{deliveryTime}</span>
      </div>
    </div>
  );
}
