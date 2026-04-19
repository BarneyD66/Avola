"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "@/components/LocaleProvider";
import {
  getOrderById,
  getOrdersSnapshot,
  getServerOrdersSnapshot,
  getTgDispatchStatusMeta,
  subscribeToOrders,
  updateOrderTgDispatchStatus,
  type TgDispatchStatus,
} from "@/data/orderStore";

type InternalOrderOpsPanelProps = {
  orderId: string;
};

const tgStatuses: TgDispatchStatus[] = [
  "tg_pending",
  "tg_ready",
  "tg_dispatched",
  "tg_failed",
];

export function InternalOrderOpsPanel({
  orderId,
}: InternalOrderOpsPanelProps) {
  const { messages } = useLocale();
  useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    getServerOrdersSnapshot,
  );
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <section className="surface-panel rounded-[30px] border border-white/8 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Internal Mock View
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          Order not found.
        </p>
      </section>
    );
  }

  const tgStatus = order.tgDispatchStatus ?? "tg_pending";
  const tgMeta = getTgDispatchStatusMeta(tgStatus);

  return (
    <section className="surface-panel rounded-[30px] border border-white/8 p-6 sm:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
            Internal
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            Internal Mock View
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            This view is only for local mock payment and internal TG dispatch
            testing.
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium ${tgMeta.className}`}
        >
          <span className="h-2 w-2 rounded-full bg-current opacity-80" />
          {tgMeta.label}
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: messages.order.labels.orderId, value: order.id },
          {
            label: messages.order.labels.paymentStatus,
            value: order.paymentStatus ?? "pending_payment",
          },
          { label: "TG Dispatch Status", value: tgStatus },
          { label: "TG Task Type", value: order.tgTaskType ?? "-" },
          { label: "TG Target Channel", value: order.tgTargetChannel ?? "-" },
          { label: "TG Message ID", value: order.tgMessageId ?? "-" },
          { label: "TG Generated At", value: order.tgGeneratedAt ?? "-" },
          { label: "TG Dispatched At", value: order.tgDispatchedAt ?? "-" },
          { label: "TG Dispatch Error", value: order.tgDispatchError ?? "-" },
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

      <div className="mt-8">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          TG Dispatch Controls
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {tgStatuses.map((status) => {
            const active = status === tgStatus;

            return (
              <button
                key={status}
                type="button"
                onClick={() => updateOrderTgDispatchStatus(order.id, status)}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${
                  active
                    ? "border-accent/30 bg-accent/12 text-foreground"
                    : "border-white/10 bg-white/[0.03] text-muted-strong hover:bg-white/[0.06] hover:text-foreground"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
