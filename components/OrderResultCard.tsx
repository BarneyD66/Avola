"use client";

import { useEffect, useState } from "react";
import { CopyableField } from "@/components/CopyableField";
import { useLocale } from "@/components/LocaleProvider";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { OrderTimeline } from "@/components/OrderTimeline";
import { ProgressBar } from "@/components/ProgressBar";
import {
  getDisplayOrderStatus,
  getDisplayPaymentStatus,
  type Order,
} from "@/data/orderStore";
import {
  getLocalizedServiceName,
  getLocalizedTimelineItems,
} from "@/locales/content";

type OrderResultCardProps = {
  order: Order;
};

type RaffleProgress = {
  currentParticipants: number;
  targetParticipants: number;
  progress: number;
};

export function OrderResultCard({ order }: OrderResultCardProps) {
  const { locale, messages } = useLocale();
  const displayStatus = getDisplayOrderStatus(order.status);
  const serviceName = getLocalizedServiceName(
    order.serviceSlug,
    order.serviceName,
    locale,
  );
  const statusMeta = messages.order.status[displayStatus];
  const paymentStatus = order.paymentStatus ?? "pending_payment";
  const paymentMeta = messages.payment.status[getDisplayPaymentStatus(paymentStatus)];
  const fallbackTarget = Number(
    String(order.selectedPackageParticipants ?? "").replace(/[^\d]/g, ""),
  );
  const [raffleProgress, setRaffleProgress] = useState<RaffleProgress | null>(
    null,
  );
  const participantTarget =
    raffleProgress?.targetParticipants || (Number.isFinite(fallbackTarget) ? fallbackTarget : 0);
  const participantCurrent = raffleProgress?.currentParticipants ?? 0;
  const deliveryProgress =
    participantTarget > 0
      ? Math.min(100, Math.round((participantCurrent / participantTarget) * 100))
      : order.progress;
  const baseInfo = [
    { label: messages.order.labels.serviceName, value: serviceName },
    { label: messages.order.labels.createdAt, value: order.createdAt },
    { label: messages.order.labels.updatedAt, value: order.updatedAt },
    {
      label: messages.order.labels.estimatedCompletion,
      value: order.estimatedCompletion,
    },
  ];

  useEffect(() => {
    let isMounted = true;

    async function fetchRaffleProgress() {
      try {
        const response = await fetch(`/api/orders/${order.id}/raffle-progress`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as Partial<RaffleProgress> & {
          ok?: boolean;
        };

        if (!isMounted || !payload.ok) {
          return;
        }

        setRaffleProgress({
          currentParticipants: Number(payload.currentParticipants ?? 0),
          targetParticipants: Number(payload.targetParticipants ?? 0),
          progress: Number(payload.progress ?? 0),
        });
      } catch {
        if (isMounted) {
          setRaffleProgress(null);
        }
      }
    }

    void fetchRaffleProgress();
    const intervalId = window.setInterval(fetchRaffleProgress, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [order.id]);

  return (
    <section className="track-order-result-card surface-panel rounded-[24px] border border-white/8 p-3.5 sm:rounded-[30px] sm:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-strong/80">
            {messages.track.resultEyebrow}
          </p>
          <h2 className="mt-3 text-[1.3rem] font-semibold tracking-tight text-white sm:mt-4 sm:text-3xl">
            {serviceName}
          </h2>
          <p className="mt-2.5 max-w-2xl text-[13.5px] leading-6.5 text-zinc-400 sm:mt-3 sm:text-base sm:leading-7">
            {statusMeta.summary}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={paymentStatus} />
          <p className="text-sm text-zinc-500">
            {participantTarget > 0
              ? `${participantCurrent} / ${participantTarget}`
              : messages.track.currentProgress.replace("{value}", String(order.progress))}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
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

      <p className="mt-3.5 text-[13px] leading-6 text-zinc-500 sm:mt-4 sm:text-sm sm:leading-7">
        {messages.track.saveInfoHint}
      </p>

      <div className="mt-5 grid gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {baseInfo.map((item) => (
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
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 sm:p-4">
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
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.track.paymentStatus}
          </p>
          <p className="mt-3 text-sm font-medium text-white sm:text-base">
            {paymentMeta.label}
          </p>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            {paymentMeta.description}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[22px] border border-white/8 bg-white/[0.02] p-3.5 sm:mt-8 sm:rounded-[24px] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="text-sm font-medium text-white">
              {messages.track.progressOverview}
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              {messages.track.progressDescription}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-white">
              {participantTarget > 0
                ? `${participantCurrent}/${participantTarget}`
                : `${order.progress}%`}
            </p>
          </div>
        </div>
        <ProgressBar className="mt-5" value={deliveryProgress} />
      </div>

      <div className="mt-5 sm:mt-8">
        <div className="mb-3.5 sm:mb-4">
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
