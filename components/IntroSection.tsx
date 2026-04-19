"use client";

import { useLocale } from "@/components/LocaleProvider";

export function IntroSection() {
  const { messages } = useLocale();

  return (
    <section className="hero-home-panel surface-panel overflow-hidden rounded-[24px] border border-white/8 transition duration-200 sm:rounded-[28px]">
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-7 lg:py-9">
        <div className="max-w-[66rem]">
          <h1 className="max-w-[62rem] text-[2.18rem] leading-[1.12] font-semibold tracking-[-0.05em] text-foreground sm:text-[2.95rem] lg:text-[2.78rem] lg:leading-[1.07] xl:text-[3.05rem]">
            {messages.home.intro.title}
          </h1>
          <p className="mt-4 max-w-[53rem] text-sm leading-7 text-muted-strong sm:text-base lg:text-[1rem]">
            {messages.home.intro.description}
          </p>
          <p className="mt-3 max-w-[45rem] text-[13px] leading-6 text-muted sm:text-[15px] sm:leading-7">
            {messages.home.intro.note}
          </p>
        </div>
      </div>
    </section>
  );
}
