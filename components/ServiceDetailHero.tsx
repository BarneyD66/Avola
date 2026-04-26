"use client";

import { useLocale } from "@/components/LocaleProvider";
import { SectionBlock } from "@/components/SectionBlock";
import type { Service } from "@/data/services";
import { getLocalizedService } from "@/locales/content";

type ServiceDetailHeroProps = {
  service: Service;
};

export function ServiceDetailHero({ service }: ServiceDetailHeroProps) {
  const { locale, messages } = useLocale();
  const localizedService = getLocalizedService(service, locale);

  return (
    <div className="service-detail-stack space-y-4 sm:space-y-6">
      <section className="service-detail-hero-card surface-panel rounded-[24px] border border-white/8 p-4 sm:rounded-[30px] sm:p-9">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
          {messages.service.detailEyebrow}
        </p>
        <h1 className="mt-3.5 text-[1.76rem] leading-[1.1] font-semibold tracking-[-0.035em] text-white sm:mt-5 sm:text-4xl lg:text-[3.2rem]">
          {localizedService.name}
        </h1>
        <p className="mt-2.5 text-[15px] font-medium leading-7 text-zinc-200 sm:mt-4 sm:text-xl sm:leading-8">
          {localizedService.shortDesc}
        </p>
      </section>

      <SectionBlock title={messages.service.introTitle}>
        <p className="text-base leading-8 text-zinc-400 sm:text-lg">
          {localizedService.fullDesc}
        </p>
      </SectionBlock>

      <SectionBlock title={messages.service.scenariosTitle}>
        <ul className="space-y-3">
          {localizedService.scenarios.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-2xl border border-white/6 bg-white/[0.025] px-3 py-2 text-[13.5px] leading-6 text-zinc-300 sm:gap-3 sm:px-4 sm:py-3 sm:text-base sm:leading-7"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SectionBlock>

      <SectionBlock title={messages.service.notesTitle}>
        <ul className="space-y-3">
          {localizedService.notes.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-2xl border border-white/6 bg-white/[0.025] px-3 py-2 text-[13.5px] leading-6 text-zinc-300 sm:gap-3 sm:px-4 sm:py-3 sm:text-base sm:leading-7"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SectionBlock>
    </div>
  );
}
