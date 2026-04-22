"use client";

import { CopyableField } from "@/components/CopyableField";
import { useLocale } from "@/components/LocaleProvider";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import type { CreatedOrderPreview } from "@/data/createdOrderPreview";
import {
  getLocalizedSelectedPackage,
  getLocalizedServiceName,
} from "@/locales/content";

type CreatedOrderCardProps = {
  order: CreatedOrderPreview;
};

export function CreatedOrderCard({ order }: CreatedOrderCardProps) {
  const { locale, messages } = useLocale();
  const serviceName = getLocalizedServiceName(
    order.serviceSlug,
    order.serviceName,
    locale,
  );
  const selectedPackage = getLocalizedSelectedPackage(
    order.serviceSlug,
    order.selectedPackageId,
    order.selectedPackageLabel,
    order.selectedPackageResult,
    locale,
  );
  const items: Array<{ label: string; value: string }> = [
    { label: messages.order.labels.serviceName, value: serviceName },
    { label: messages.track.currentStatus, value: messages.order.status.pending.label },
    { label: messages.order.labels.createdAt, value: order.createdAt },
    {
      label: messages.order.labels.estimatedCompletion,
      value: order.estimatedCompletion,
    },
  ];

  if (order.selectedPackagePrice) {
    items.splice(1, 0, {
      label: messages.order.labels.packagePrice,
      value: order.selectedPackagePrice,
    });
  }

  if (selectedPackage.result) {
    items.splice(2, 0, {
      label: messages.order.labels.packageResult,
      value: selectedPackage.result,
    });
  }

  return (
    <section className="created-order-card surface-panel rounded-[24px] border border-white/8 p-3.5 sm:rounded-[30px] sm:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-strong/80">
            {messages.created.eyebrow}
          </p>
          <h2 className="mt-3 text-[1.3rem] font-semibold tracking-tight text-white sm:mt-4 sm:text-3xl">
            {messages.created.cardTitle}
          </h2>
          <p className="mt-2.5 text-[13.5px] leading-6.5 text-zinc-400 sm:mt-3 sm:text-base sm:leading-7">
            {messages.created.cardDescription}
          </p>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-5 grid gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        <CopyableField
          label={messages.order.labels.orderId}
          value={order.orderId}
          className="sm:col-span-1 xl:col-span-1"
        />
        <CopyableField
          label={messages.order.labels.queryPassword}
          value={order.queryPassword}
          masked
          className="sm:col-span-1 xl:col-span-2"
        />
      </div>

      <p className="mt-3.5 text-[13px] leading-6 text-zinc-500 sm:mt-4 sm:text-sm sm:leading-7">
        {messages.track.saveInfoHint}
      </p>

      {selectedPackage.label ? (
        <div className="mt-5 rounded-2xl border border-accent/16 bg-accent/8 p-3.5 sm:mt-6 sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-accent-strong/75">
            {messages.order.labels.selectedPackage}
          </p>
          <p className="mt-3 text-base font-semibold text-white">
            {selectedPackage.label}
          </p>
          {selectedPackage.result ? (
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              {selectedPackage.result}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 grid gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 sm:p-4"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
              {item.label}
            </p>
            <p className="mt-3 text-sm font-medium leading-7 text-white sm:text-base">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
