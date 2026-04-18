"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { OrderStatus } from "@/data/orderStore";
import { getOrderStatusMeta } from "@/data/orderStore";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { messages } = useLocale();
  const meta = getOrderStatusMeta(status);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium ${meta.className}`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-80" />
      {messages.order.status[status].label}
    </span>
  );
}
