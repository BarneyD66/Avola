"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { DashboardStatCard } from "@/components/DashboardStatCard";
import { useLocale } from "@/components/LocaleProvider";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { PaymentStatusBadge } from "@/components/PaymentStatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import {
  getDisplayPaymentStatus,
  getOrdersSnapshot,
  getServerOrdersSnapshot,
  simulateOrdersProgressOnce,
  subscribeToOrders,
} from "@/data/orderStore";
import { getLocalizedServiceName } from "@/locales/content";

function parseAmount(amount: string) {
  return Number(amount.replace(/[^\d.]/g, ""));
}

function parseDate(value: string) {
  return new Date(value.replace(" ", "T")).getTime();
}

export function DashboardOverviewExperience() {
  const { locale, messages } = useLocale();
  const orders = useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    getServerOrdersSnapshot,
  );

  useEffect(() => {
    simulateOrdersProgressOnce("dashboard:overview");
  }, []);

  const recentOrders = [...orders]
    .sort((left, right) => parseDate(right.updatedAt) - parseDate(left.updatedAt))
    .slice(0, 3);
  const totalSpend = `$${orders
    .reduce((sum, order) => sum + parseAmount(order.amount), 0)
    .toFixed(0)}`;
  const runningOrders = orders.filter((order) =>
    ["pending", "running"].includes(order.status),
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  ).length;
  const reorderItems = [
    {
      label: messages.dashboard.overview.reorderItems[0],
      slug: "twitter-growth",
    },
    {
      label: messages.dashboard.overview.reorderItems[1],
      slug: "verified-comments",
    },
    {
      label: messages.dashboard.overview.reorderItems[2],
      slug: "github-stars",
    },
  ];

  return (
    <div className="dashboard-overview-page flex flex-col gap-5 sm:gap-8">
      <section className="surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
          {messages.dashboard.overview.eyebrow}
        </p>
        <h2 className="mt-4 text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-white sm:mt-5 sm:text-4xl">
          {messages.dashboard.overview.title}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
          {messages.dashboard.overview.description}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label={messages.dashboard.overview.stats.totalOrders.label}
          value={String(orders.length)}
          description={messages.dashboard.overview.stats.totalOrders.description}
        />
        <DashboardStatCard
          label={messages.dashboard.overview.stats.runningOrders.label}
          value={String(runningOrders)}
          description={messages.dashboard.overview.stats.runningOrders.description}
        />
        <DashboardStatCard
          label={messages.dashboard.overview.stats.completedOrders.label}
          value={String(completedOrders)}
          description={
            messages.dashboard.overview.stats.completedOrders.description
          }
        />
        <DashboardStatCard
          label={messages.dashboard.overview.stats.totalSpend.label}
          value={totalSpend}
          description={messages.dashboard.overview.stats.totalSpend.description}
        />
      </section>

      <section className="surface-panel rounded-[24px] border border-white/8 p-4 sm:rounded-[30px] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              {messages.dashboard.overview.recentOrdersTitle}
            </h3>
            <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
              {messages.dashboard.overview.recentOrdersDescription}
            </p>
          </div>
          <Link
            href="/dashboard/orders"
            className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98]"
          >
            {messages.dashboard.overview.allOrders}
          </Link>
        </div>

        <div className="mt-6 grid gap-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-[22px] border border-white/8 bg-white/[0.02] p-4 sm:rounded-[24px] sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {order.id}
                  </p>
                  <h4 className="mt-3 text-lg font-semibold text-white">
                    {getLocalizedServiceName(order.serviceSlug, order.serviceName, locale)}
                  </h4>
                </div>
                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge
                    status={order.paymentStatus ?? "pending_payment"}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_140px_140px_180px_auto] xl:items-end">
                <div>
                  <div className="flex items-center justify-between gap-4 text-sm text-zinc-300">
                    <span>{messages.order.labels.progress}</span>
                    <span>{order.progress}%</span>
                  </div>
                  <ProgressBar className="mt-3" value={order.progress} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {messages.dashboard.overview.latestUpdatedAt}
                  </p>
                  <p className="mt-2 text-sm text-zinc-200">{order.updatedAt}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {messages.order.labels.amount}
                  </p>
                  <p className="mt-2 text-sm text-zinc-200">{order.amount}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {messages.dashboard.overview.paymentStatusLabel}
                  </p>
                  <p className="mt-2 text-sm text-zinc-200">
                    {
                      messages.payment.status[
                        getDisplayPaymentStatus(
                          order.paymentStatus ?? "pending_payment",
                        )
                      ].label
                    }
                  </p>
                </div>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98] xl:justify-self-end"
                >
                  {messages.dashboard.orders.table.viewDetail}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-panel rounded-[24px] border border-white/8 p-4 sm:rounded-[30px] sm:p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {messages.dashboard.overview.quickReorderTitle}
        </h3>
        <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
          {messages.dashboard.overview.quickReorderDescription}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reorderItems.map((item) => (
            <Link
              key={item.slug}
              href={`/service/${item.slug}`}
              className="rounded-[24px] border border-white/8 bg-white/[0.02] px-5 py-5 text-base font-medium text-white hover:border-white/14 hover:bg-white/[0.04] active:scale-[0.99]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
