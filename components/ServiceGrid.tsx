"use client";

import { useLocale } from "@/components/LocaleProvider";
import { ServiceCard } from "@/components/ServiceCard";
import type { Service } from "@/data/services";

type ServiceGridProps = {
  services: Service[];
};

export function ServiceGrid({ services }: ServiceGridProps) {
  const { locale } = useLocale();

  return (
    <section className="flex flex-col gap-6 sm:gap-8">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-zinc-500">
          {locale === "en" ? "Services" : "服务"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {locale === "en" ? "Service List" : "服务列表"}
        </h2>
        <p className="mt-4 text-base leading-8 text-zinc-400 sm:text-lg">
          {locale === "en"
            ? "The homepage is the service entry. Users can browse services directly and enter the corresponding detail page."
            : "首页即服务入口，用户进入后可直接浏览服务并进入对应详情页。"}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </section>
  );
}
