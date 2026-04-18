"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import type { Service } from "@/data/services";
import { getLocalizedService } from "@/locales/content";

type ServiceCardProps = {
  service: Service;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const { locale, messages } = useLocale();
  const localizedService = getLocalizedService(service, locale);

  return (
    <Link
      href={`/service/${service.slug}`}
      className="group surface-panel flex h-full flex-col rounded-[26px] border border-white/8 p-6 hover:-translate-y-1 hover:border-white/14 hover:shadow-[0_22px_50px_rgba(0,0,0,0.26)] active:translate-y-0 active:scale-[0.995]"
    >
      <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-accent to-cyan-300/80" />

      <div className="mt-6 flex flex-1 flex-col">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-white">
            {localizedService.name}
          </h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
            {localizedService.shortDesc}
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-white/6 bg-white/[0.025] p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
              {messages.service.price}
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {localizedService.price}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
              {messages.service.deliveryTime}
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {localizedService.deliveryTime}
            </p>
          </div>
        </div>

        <div className="mt-8 inline-flex w-fit items-center justify-center rounded-full border border-accent/30 bg-accent-soft px-5 py-2.5 text-sm font-medium text-accent-strong shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] group-hover:border-accent/50 group-hover:bg-accent/18 group-hover:text-white group-active:scale-[0.98]">
          {messages.service.buyNow}
        </div>
      </div>
    </Link>
  );
}
