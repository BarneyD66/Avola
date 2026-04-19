"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import type { Order } from "@/data/orderStore";
import { getLocalizedServiceName } from "@/locales/content";

type PaymentSuccessCardProps = {
  order: Order;
};

export function PaymentSuccessCard({ order }: PaymentSuccessCardProps) {
  const { locale, messages } = useLocale();
  const serviceName = getLocalizedServiceName(
    order.serviceSlug,
    order.serviceName,
    locale,
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <section className="surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
              {messages.success.eyebrow}
            </p>
            <h1 className="mt-4 text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-foreground sm:mt-5 sm:text-4xl lg:text-[3.2rem]">
              {messages.success.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
              {messages.success.description}
            </p>
            {order.paymentStatus === "paid_mock" ? (
              <p className="mt-4 text-sm leading-7 text-muted">
                {messages.success.mockNotice}
              </p>
            ) : null}
          </div>
          <PaymentStatusBadge status={order.paymentStatus ?? "paid"} />
        </div>
      </section>

      <section className="surface-panel rounded-[24px] border border-white/8 p-4 sm:rounded-[30px] sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {[
            { label: messages.order.labels.orderId, value: order.id },
            { label: messages.order.labels.serviceName, value: serviceName },
            {
              label: messages.order.labels.paymentAmount,
              value: order.paymentAmount ?? order.amount,
            },
            { label: messages.order.labels.paidAt, value: order.paidAt ?? "-" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/8 bg-white/[0.025] p-4"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                {item.label}
              </p>
              <p className="mt-3 text-sm font-medium leading-7 text-foreground sm:text-base">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/track?orderId=${order.id}&password=${order.queryPassword}`}
          className="ui-primary-button inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold sm:w-auto"
        >
          {messages.success.trackOrder}
        </Link>
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-foreground hover:bg-white/[0.08] active:scale-[0.98] sm:w-auto"
        >
          {messages.success.home}
        </Link>
      </section>
    </div>
  );
}
