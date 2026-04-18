"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

type CopyableFieldProps = {
  label: string;
  value: string;
  masked?: boolean;
  className?: string;
};

export function CopyableField({
  label,
  value,
  masked = false,
  className = "",
}: CopyableFieldProps) {
  const { messages } = useLocale();
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(!masked);

  const displayValue = useMemo(() => {
    if (!masked || isVisible) {
      return value;
    }

    return "•".repeat(Math.max(6, value.length));
  }, [isVisible, masked, value]);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 1500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(value);
      setIsCopied(true);
    } catch (error) {
      console.warn("Failed to copy field value", error);
      setIsCopied(false);
    }
  };

  return (
    <div
      className={`rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-5 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {label}
          </p>
          <p className="mt-3 break-all text-base font-semibold tracking-[0.08em] text-white sm:text-lg">
            {displayValue}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {masked ? (
            <button
              type="button"
              onClick={() => setIsVisible((current) => !current)}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-zinc-200 hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
            >
              {isVisible ? messages.order.copy.hide : messages.order.copy.show}
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent-strong hover:bg-accent/16 hover:text-white active:scale-[0.98]"
          >
            {isCopied ? messages.order.copy.copied : messages.order.copy.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
