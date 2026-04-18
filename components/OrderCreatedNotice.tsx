"use client";

import { useLocale } from "@/components/LocaleProvider";

export function OrderCreatedNotice() {
  const { messages } = useLocale();

  return (
    <section className="rounded-[26px] border border-white/8 bg-white/[0.02] p-6 shadow-[0_14px_36px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight text-white">
        {messages.created.nextStepsTitle}
      </h2>
      <ul className="mt-4 grid gap-3">
        {messages.created.nextSteps.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.025] px-4 py-3 text-sm leading-7 text-zinc-300 sm:text-base"
          >
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
