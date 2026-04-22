"use client";

import { CopyableField } from "@/components/CopyableField";
import { useLocale } from "@/components/LocaleProvider";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { getDisplayPaymentStatus, type Order } from "@/data/orderStore";
import { getLocalizedSelectedPackage, getLocalizedServiceName } from "@/locales/content";

type PaymentSummaryCardProps = {
  order: Order;
};

export function PaymentSummaryCard({ order }: PaymentSummaryCardProps) {
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
  const paymentStatus = order.paymentStatus ?? "pending_payment";
  const displayPaymentStatus = getDisplayPaymentStatus(paymentStatus);

  return (
    <section className="surface-panel rounded-[24px] border border-white/8 p-3.5 sm:rounded-[30px] sm:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-strong/80">
            {messages.checkout.eyebrow}
          </p>
          <h2 className="mt-3 text-[1.3rem] font-semibold tracking-tight text-foreground sm:mt-4 sm:text-3xl">
            {messages.checkout.summaryTitle}
          </h2>
          <p className="mt-2.5 text-[13.5px] leading-6.5 text-muted sm:mt-3 sm:text-sm sm:leading-7">
            {messages.payment.status[displayPaymentStatus].description}
          </p>
        </div>
        <PaymentStatusBadge status={paymentStatus} />
      </div>

      <div className="mt-5 grid gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        <CopyableField label={messages.order.labels.orderId} value={order.id} />
        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.order.labels.serviceName}
          </p>
          <p className="mt-3 text-base font-semibold text-foreground sm:text-lg">
            {serviceName}
          </p>
        </div>
        <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.order.labels.paymentAmount}
          </p>
          <p className="mt-3 text-base font-semibold text-foreground sm:text-lg">
            {order.paymentAmount ?? order.amount}
          </p>
        </div>
      </div>

      {selectedPackage.label ? (
        <div className="mt-5 rounded-2xl border border-accent/16 bg-accent/8 p-3.5 sm:mt-6 sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-accent-strong/75">
            {messages.checkout.packageTitle}
          </p>
          <p className="mt-3 text-base font-semibold text-foreground">
            {selectedPackage.label}
          </p>
          {selectedPackage.result ? (
            <p className="mt-2 text-sm leading-7 text-muted">{selectedPackage.result}</p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.order.labels.paymentMethod}
          </p>
          <p className="mt-3 text-sm font-medium leading-7 text-foreground sm:text-base">
            {messages.payment.method}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.order.labels.paymentProvider}
          </p>
          <p className="mt-3 text-sm font-medium leading-7 text-foreground sm:text-base">
            {messages.payment.provider}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.order.labels.paymentChain}
          </p>
          <p className="mt-3 text-sm font-medium leading-7 text-foreground sm:text-base">
            {order.paymentChain ?? "-"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.order.labels.paymentCurrency}
          </p>
          <p className="mt-3 text-sm font-medium leading-7 text-foreground sm:text-base">
            {order.paymentCurrency ?? "-"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.order.labels.paymentReference}
          </p>
          <p className="mt-3 text-sm font-medium leading-7 text-foreground sm:text-base">
            {order.paymentReference ?? "-"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 sm:p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
            {messages.order.labels.paymentExpiresAt}
          </p>
          <p className="mt-3 text-sm font-medium leading-7 text-foreground sm:text-base">
            {order.paymentExpiresAt ?? "-"}
          </p>
        </div>
      </div>

      {order.paymentAddress ? (
        <div className="mt-5 sm:mt-6">
          <CopyableField
            label={messages.order.labels.paymentAddress}
            value={order.paymentAddress}
          />
        </div>
      ) : null}
    </section>
  );
}
