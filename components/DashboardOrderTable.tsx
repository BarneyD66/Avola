"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { ProgressBar } from "@/components/ProgressBar";
import type { Order } from "@/data/orderStore";
import { getLocalizedServiceName } from "@/locales/content";

type DashboardOrderTableProps = {
  orders: Order[];
};

type FilterKey = "all" | "running" | "reviewing" | "completed" | "issue";

export function DashboardOrderTable({ orders }: DashboardOrderTableProps) {
  const { locale, messages } = useLocale();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const filters = useMemo(
    () =>
      [
        {
          key: "all",
          label: messages.dashboard.orders.filters.all,
          matches: () => true,
        },
        {
          key: "running",
          label: messages.dashboard.orders.filters.running,
          matches: (status) => status === "pending" || status === "running",
        },
        {
          key: "reviewing",
          label: messages.dashboard.orders.filters.reviewing,
          matches: (status) => status === "reviewing",
        },
        {
          key: "completed",
          label: messages.dashboard.orders.filters.completed,
          matches: (status) => status === "completed",
        },
        {
          key: "issue",
          label: messages.dashboard.orders.filters.issue,
          matches: (status) => status === "issue",
        },
      ] satisfies Array<{
        key: FilterKey;
        label: string;
        matches: (status: Order["status"]) => boolean;
      }>,
    [messages],
  );

  const filteredOrders = useMemo(() => {
    const currentFilter =
      filters.find((filter) => filter.key === activeFilter) ?? filters[0];

    return orders.filter((order) => currentFilter.matches(order.status));
  }, [activeFilter, filters, orders]);

  return (
    <section className="surface-panel rounded-[30px] border border-white/8 p-6 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = filter.key === activeFilter;

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                active
                  ? "border-accent/30 bg-accent/12 text-white"
                  : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 hidden overflow-hidden rounded-[24px] border border-white/8 xl:block">
        <table className="min-w-full divide-y divide-white/8">
          <thead className="bg-white/[0.03]">
            <tr className="text-left text-xs uppercase tracking-[0.2em] text-zinc-500">
              <th className="px-5 py-4">{messages.dashboard.orders.table.orderId}</th>
              <th className="px-5 py-4">{messages.dashboard.orders.table.serviceName}</th>
              <th className="px-5 py-4">{messages.dashboard.orders.table.status}</th>
              <th className="px-5 py-4">{messages.dashboard.orders.table.amount}</th>
              <th className="px-5 py-4">{messages.dashboard.orders.table.progress}</th>
              <th className="px-5 py-4">{messages.dashboard.orders.table.createdAt}</th>
              <th className="px-5 py-4">{messages.dashboard.orders.table.updatedAt}</th>
              <th className="px-5 py-4">{messages.dashboard.orders.table.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8 bg-white/[0.015]">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="align-top">
                <td className="px-5 py-4 text-sm font-medium text-white">
                  {order.id}
                </td>
                <td className="px-5 py-4 text-sm text-zinc-200">
                  {getLocalizedServiceName(order.serviceSlug, order.serviceName, locale)}
                </td>
                <td className="px-5 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-5 py-4 text-sm text-zinc-200">
                  {order.amount}
                </td>
                <td className="px-5 py-4">
                  <div className="min-w-[140px]">
                    <p className="text-sm text-zinc-300">{order.progress}%</p>
                    <ProgressBar className="mt-3" value={order.progress} />
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-zinc-400">
                  {order.createdAt}
                </td>
                <td className="px-5 py-4 text-sm text-zinc-400">
                  {order.updatedAt}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98]"
                  >
                    {messages.dashboard.orders.table.viewDetail}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 xl:hidden">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  {order.id}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {getLocalizedServiceName(order.serviceSlug, order.serviceName, locale)}
                </h3>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  {messages.dashboard.orders.table.amount}
                </p>
                <p className="mt-2 text-sm text-zinc-200">{order.amount}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  {messages.dashboard.orders.table.createdAt}
                </p>
                <p className="mt-2 text-sm text-zinc-200">{order.createdAt}</p>
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-4 text-sm text-zinc-300">
                  <span>{messages.dashboard.orders.table.progress}</span>
                  <span>{order.progress}%</span>
                </div>
                <ProgressBar className="mt-3" value={order.progress} />
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                  {messages.dashboard.orders.table.updatedAt}
                </p>
                <p className="mt-2 text-sm text-zinc-200">{order.updatedAt}</p>
              </div>
            </div>

            <Link
              href={`/dashboard/orders/${order.id}`}
              className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98]"
            >
              {messages.dashboard.orders.table.viewDetail}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
