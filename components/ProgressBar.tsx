"use client";

import { useLocale } from "@/components/LocaleProvider";

type ProgressBarProps = {
  value: number;
  className?: string;
};

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const { messages } = useLocale();
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-3 w-full overflow-hidden rounded-full border border-white/8 bg-white/[0.03] ${className}`}
      aria-label={messages.order.labels.progress + ` ${safeValue}%`}
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent via-blue-400 to-cyan-300 transition-[width] duration-500 ease-out"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
