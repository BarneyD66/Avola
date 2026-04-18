"use client";

import { useLocale } from "@/components/LocaleProvider";

export function IntroSection() {
  const { messages } = useLocale();

  return (
    <section className="surface-panel overflow-hidden rounded-[28px] border border-white/8">
      <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
        <div className="max-w-[72rem]">
          <h1 className="max-w-[70rem] text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-[3.15rem] lg:text-[3rem] lg:leading-[1.06] xl:text-[3.3rem]">
            {messages.home.intro.title}
          </h1>
          <p className="mt-5 max-w-[56rem] text-[15px] leading-7 text-muted-strong sm:text-base lg:text-[1.02rem]">
            {messages.home.intro.description}
          </p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted sm:text-[15px]">
            {messages.home.intro.note}
          </p>
        </div>
      </div>
    </section>
  );
}
