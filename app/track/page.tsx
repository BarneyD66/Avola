"use client";

import { Suspense } from "react";
import { Header } from "@/components/Header";
import { useLocale } from "@/components/LocaleProvider";
import { TrackOrderExperience } from "@/components/TrackOrderExperience";

export default function TrackPage() {
  const { messages } = useLocale();

  return (
    <>
      <Header />
      <main className="relative flex-1 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 sm:gap-10 sm:px-6 lg:px-8">
          <section className="surface-panel rounded-[30px] border border-white/8 p-7 sm:p-9">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
              {messages.track.pageEyebrow}
            </p>
            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-[3.2rem]">
              {messages.track.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
              {messages.track.description}
            </p>
          </section>

          <Suspense
            fallback={
              <section className="surface-panel rounded-[30px] border border-white/8 p-6 sm:p-8">
                <p className="text-sm leading-7 text-zinc-400">
                  {messages.track.loading}
                </p>
              </section>
            }
          >
            <TrackOrderExperience />
          </Suspense>
        </div>
      </main>
    </>
  );
}
