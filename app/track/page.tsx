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
      <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:gap-10 sm:px-6 lg:px-8">
          <section className="surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
              {messages.track.pageEyebrow}
            </p>
            <h1 className="mt-4 text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-white sm:mt-5 sm:text-4xl lg:text-[3.2rem]">
              {messages.track.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400 sm:mt-4 sm:text-lg sm:leading-8">
              {messages.track.description}
            </p>
          </section>

          <Suspense
            fallback={
              <section className="surface-panel rounded-[24px] border border-white/8 p-4 sm:rounded-[30px] sm:p-8">
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
