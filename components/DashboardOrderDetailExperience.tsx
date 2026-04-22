"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { CopyableField } from "@/components/CopyableField";
import { useLocale } from "@/components/LocaleProvider";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { OrderTimeline } from "@/components/OrderTimeline";
import { ProgressBar } from "@/components/ProgressBar";
import {
  getDisplayOrderStatus,
  getDisplayPaymentStatus,
  getOrderById,
  getOrdersSnapshot,
  getServerOrdersSnapshot,
  simulateOrdersProgressOnce,
  subscribeToOrders,
} from "@/data/orderStore";
import {
  getLocalizedSelectedPackage,
  getLocalizedServiceName,
  getLocalizedTimelineItems,
} from "@/locales/content";

type DashboardOrderDetailExperienceProps = {
  orderId: string;
};

export function DashboardOrderDetailExperience({
  orderId,
}: DashboardOrderDetailExperienceProps) {
  const { locale, messages } = useLocale();
  useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    getServerOrdersSnapshot,
  );

  useEffect(() => {
    simulateOrdersProgressOnce(`dashboard:detail:${orderId}`, orderId);
  }, [orderId]);

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <section className="surface-panel rounded-[30px] border border-white/8 p-7 sm:p-9">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
          {messages.dashboard.detail.eyebrow}
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {messages.dashboard.detail.notFoundTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
          {messages.dashboard.detail.notFoundDescription}
        </p>
        <Link
          href="/dashboard/orders"
          className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98]"
        >
          {messages.dashboard.detail.backToOrders}
        </Link>
      </section>
    );
  }

  const displayStatus = getDisplayOrderStatus(order.status);
  const statusMeta = messages.order.status[displayStatus];
  const paymentStatus = order.paymentStatus ?? "pending_payment";
  const paymentMeta = messages.payment.status[getDisplayPaymentStatus(paymentStatus)];
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
  const infoItems = [
    { label: messages.order.labels.serviceName, value: serviceName },
    { label: messages.track.currentStatus, value: statusMeta.label },
    { label: messages.order.labels.paymentStatus, value: paymentMeta.label },
    { label: messages.order.labels.amount, value: order.amount },
    { label: messages.order.labels.createdAt, value: order.createdAt },
    { label: messages.order.labels.updatedAt, value: order.updatedAt },
    {
      label: messages.order.labels.estimatedCompletion,
      value: order.estimatedCompletion,
    },
  ];

  return (
    <div className="flex flex-col gap-5 sm:gap-8">
      <section className="surface-panel rounded-[24px] border border-white/8 p-4 sm:rounded-[30px] sm:p-9">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
              {messages.dashboard.detail.eyebrow}
            </p>
            <h2 className="mt-3 text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] text-white sm:mt-5 sm:text-4xl">
              {serviceName}
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-zinc-400 sm:mt-4 sm:text-lg sm:leading-8">
              {messages.order.labels.orderId}: {order.id}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={paymentStatus} />
          </div>
        </div>
      </section>

      <section className="surface-panel rounded-[24px] border border-white/8 p-3.5 sm:rounded-[30px] sm:p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {messages.order.labels.basicInfo}
        </h3>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          <CopyableField label={messages.order.labels.orderId} value={order.id} />
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

        <div className="mt-5 grid gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {infoItems.map((item) => (
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

      <section className="surface-panel rounded-[24px] border border-white/8 p-3.5 sm:rounded-[30px] sm:p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {messages.dashboard.detail.paymentTitle}
        </h3>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {[
            {
              label: messages.order.labels.paymentProvider,
              value: messages.payment.provider,
            },
            {
              label: messages.order.labels.paymentMethod,
              value: messages.payment.method,
            },
            {
              label: messages.order.labels.paymentAmount,
              value: order.paymentAmount ?? order.amount,
            },
            {
              label: messages.order.labels.paymentCurrency,
              value: order.paymentCurrency ?? "-",
            },
            {
              label: messages.order.labels.paymentChain,
              value: order.paymentChain ?? "-",
            },
            {
              label: messages.order.labels.paidAt,
              value: order.paidAt ?? "-",
            },
          ].map((item) => (
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

      <section className="surface-panel rounded-[24px] border border-white/8 p-3.5 sm:rounded-[30px] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              {messages.dashboard.detail.progressTitle}
            </h3>
            <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
              {statusMeta.description}
            </p>
          </div>
          <p className="text-3xl font-semibold text-white">{order.progress}%</p>
        </div>

        <ProgressBar className="mt-5 sm:mt-6" value={order.progress} />
      </section>

      <section className="surface-panel rounded-[24px] border border-white/8 p-3.5 sm:rounded-[30px] sm:p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {messages.dashboard.detail.orderSummaryTitle}
        </h3>
        <p className="mt-3.5 max-w-3xl text-[15px] leading-7 text-zinc-400 sm:mt-4 sm:text-lg sm:leading-8">
          {statusMeta.summary}
        </p>
      </section>

      <section className="surface-panel rounded-[24px] border border-white/8 p-3.5 sm:rounded-[30px] sm:p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {messages.order.labels.timeline}
        </h3>
        <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
          {messages.dashboard.detail.timelineDescription}
        </p>
        <div className="mt-5 sm:mt-6">
          <OrderTimeline items={getLocalizedTimelineItems(order.timeline, locale)} />
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/dashboard/orders"
          className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98] sm:w-auto"
        >
          {messages.dashboard.detail.backToOrders}
        </Link>
        <Link
          href={`/service/${order.serviceSlug}`}
          className="inline-flex w-full items-center justify-center rounded-full border border-accent/40 bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(59,130,246,0.22)] hover:bg-[#4f90f7] active:scale-[0.98] sm:w-auto"
        >
          {messages.dashboard.detail.repurchase}
        </Link>
        <Link
          href={`/track?orderId=${order.id}&password=${order.queryPassword}&source=dashboard`}
          className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98] sm:w-auto"
        >
          {messages.dashboard.detail.liveProgress}
        </Link>
        <Link
          href="/track"
          className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-transparent px-6 py-3 text-sm font-medium text-zinc-300 hover:border-white/16 hover:bg-white/[0.03] hover:text-white active:scale-[0.98] sm:w-auto"
        >
          {messages.dashboard.detail.goToTrack}
        </Link>
      </section>
    </div>
  );
}
