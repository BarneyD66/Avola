"use client";

import { CopyableField } from "@/components/CopyableField";
import { useLocale } from "@/components/LocaleProvider";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { OrderTimeline } from "@/components/OrderTimeline";
import { ProgressBar } from "@/components/ProgressBar";
import type { Order } from "@/data/orderStore";
import {
  getLocalizedServiceName,
  getLocalizedTimelineItems,
} from "@/locales/content";

type OrderResultCardProps = {
  order: Order;
};

export function OrderResultCard({ order }: OrderResultCardProps) {
  const { locale, messages } = useLocale();
  const serviceName = getLocalizedServiceName(
    order.serviceSlug,
    order.serviceName,
    locale,
  );
  const statusMeta = messages.order.status[order.status];
  const baseInfo = [
    { label: messages.order.labels.serviceName, value: serviceName },
    { label: messages.order.labels.createdAt, value: order.createdAt },
    { label: messages.order.labels.updatedAt, value: order.updatedAt },
    {
      label: messages.order.labels.estimatedCompletion,
      value: order.estimatedCompletion,
    },
  ];

  return (
    <section className="surface-panel rounded-[30px] border border-white/8 p-6 sm:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-strong/80">
            {messages.track.resultEyebrow}
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {serviceName}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            {statusMeta.summary}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <OrderStatusBadge status={order.status} />
          <p className="text-sm text-zinc-500">
            {messages.track.currentProgress.replace("{value}", String(order.progress))}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <CopyableField
          label={messages.order.labels.orderId}
          value={order.id}
          className="sm:col-span-1 xl:col-span-1"
        />
        <CopyableField
          label={messages.order.labels.queryPassword}
          value={order.queryPassword}
          masked
          className="sm:col-span-1 xl:col-span-2"
        />
      </div>

      <p className="mt-4 text-sm leading-7 text-zinc-500">
        {messages.track.saveInfoHint}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {baseInfo.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/8 bg-white/[0.025] p-4"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
              {item.label}
            </p>
            <p className="mt-3 text-sm font-medium leading-7 text-white sm:text-base">
              {item.value}
            </p>
          </div>
        ))}
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.track.currentStatus}
          </p>
          <p className="mt-3 text-sm font-medium text-white sm:text-base">
            {statusMeta.label}
          </p>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            {statusMeta.description}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white">
              {messages.track.progressOverview}
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              {messages.track.progressDescription}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-white">{order.progress}%</p>
          </div>
        </div>
        <ProgressBar className="mt-5" value={order.progress} />
      </div>

      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold tracking-tight text-white">
            {messages.track.timelineTitle}
          </h3>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            {messages.track.timelineDescription}
          </p>
        </div>
        <OrderTimeline items={getLocalizedTimelineItems(order.timeline, locale)} />
      </div>
    </section>
  );
}
