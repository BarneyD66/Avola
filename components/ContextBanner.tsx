"use client";

import { useLocale } from "@/components/LocaleProvider";

type ContextBannerProps = {
  source: "created" | "dashboard";
  onClear: () => void;
};

export function ContextBanner({ source, onClear }: ContextBannerProps) {
  const { messages } = useLocale();

  return (
    <section className="rounded-[22px] border border-accent/12 bg-accent/8 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-7 text-accent-strong">
          {source === "created"
            ? messages.track.context.created
            : messages.track.context.dashboard}
        </p>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex w-fit items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98]"
        >
          {messages.track.context.clear}
        </button>
      </div>
    </section>
  );
}
