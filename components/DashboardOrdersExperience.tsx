"use client";

import { useEffect, useSyncExternalStore } from "react";
import { DashboardOrderTable } from "@/components/DashboardOrderTable";
import { useLocale } from "@/components/LocaleProvider";
import {
  getOrdersSnapshot,
  getServerOrdersSnapshot,
  simulateOrdersProgressOnce,
  subscribeToOrders,
} from "@/data/orderStore";

function parseDate(value: string) {
  return new Date(value.replace(" ", "T")).getTime();
}

export function DashboardOrdersExperience() {
  const { messages } = useLocale();
  const orders = useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    getServerOrdersSnapshot,
  );

  useEffect(() => {
    simulateOrdersProgressOnce("dashboard:orders");
  }, []);

  const sortedOrders = [...orders].sort(
    (left, right) => parseDate(right.updatedAt) - parseDate(left.updatedAt),
  );

  return (
    <div className="dashboard-orders-page flex flex-col gap-5 sm:gap-8">
      <section className="surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
          {messages.dashboard.orders.eyebrow}
        </p>
        <h2 className="mt-4 text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-white sm:mt-5 sm:text-4xl">
          {messages.dashboard.orders.title}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
          {messages.dashboard.orders.description}
        </p>
      </section>

      <DashboardOrderTable orders={sortedOrders} />
    </div>
  );
}
