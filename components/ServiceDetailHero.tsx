"use client";

import { InfoList } from "@/components/InfoList";
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

  const deliveryItems = [
    messages.service.startingPrice.replace("{value}", localizedService.price),
    messages.service.estimatedDelivery.replace(
      "{value}",
      localizedService.deliveryTime,
    ),
    messages.service.executionMode,
    messages.service.purchaseMode,
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
          {messages.service.detailEyebrow}
        </p>
        <h1 className="mt-4 text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-white sm:mt-5 sm:text-4xl lg:text-[3.2rem]">
          {localizedService.name}
        </h1>
        <p className="mt-3 text-base font-medium leading-7 text-zinc-200 sm:mt-4 sm:text-xl sm:leading-8">
          {localizedService.shortDesc}
        </p>
      </section>

      <SectionBlock title={messages.service.introTitle}>
        <p className="text-base leading-8 text-zinc-400 sm:text-lg">
          {localizedService.fullDesc}
        </p>
      </SectionBlock>

      <SectionBlock title={messages.service.scenariosTitle}>
        <InfoList items={localizedService.scenarios} />
      </SectionBlock>

      <SectionBlock title={messages.service.deliveryTitle}>
        <InfoList items={deliveryItems} />
      </SectionBlock>

      <SectionBlock title={messages.service.notesTitle}>
        <InfoList items={localizedService.notes} />
      </SectionBlock>
    </div>
  );
}
