"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

export function MissingOrderState() {
  const { messages } = useLocale();

  return (
    <section className="surface-panel rounded-[30px] border border-white/8 p-7 text-center sm:p-9">
      <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
        {messages.created.missing.eyebrow}
      </p>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {messages.created.missing.title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
        {messages.created.missing.description}
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-accent/40 bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(59,130,246,0.22)] hover:bg-[#4f90f7] active:scale-[0.98]"
        >
          {messages.created.missing.home}
        </Link>
        <Link
          href="/track"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98]"
        >
          {messages.created.missing.track}
        </Link>
      </div>
    </section>
  );
}
