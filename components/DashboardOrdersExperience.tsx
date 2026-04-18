"use client";

import { useEffect, useSyncExternalStore } from "react";
import { DashboardOrderTable } from "@/components/DashboardOrderTable";
import { useLocale } from "@/components/LocaleProvider";
import {
  getAllOrders,
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
    getAllOrders,
    getAllOrders,
  );

  useEffect(() => {
    simulateOrdersProgressOnce("dashboard:orders");
  }, []);

  const sortedOrders = [...orders].sort(
    (left, right) => parseDate(right.updatedAt) - parseDate(left.updatedAt),
  );

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <section className="surface-panel rounded-[30px] border border-white/8 p-7 sm:p-9">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
          {messages.dashboard.orders.eyebrow}
        </p>
        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
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
