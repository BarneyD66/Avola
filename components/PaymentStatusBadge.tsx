"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { PaymentStatus } from "@/data/orderStore";
import { getDisplayPaymentStatus, getPaymentStatusMeta } from "@/data/orderStore";

type PaymentStatusBadgeProps = {
  status: PaymentStatus;
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const { messages } = useLocale();
  const displayStatus = getDisplayPaymentStatus(status);
  const meta = getPaymentStatusMeta(displayStatus);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium ${meta.className}`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-80" />
      {messages.payment.status[displayStatus].label}
    </span>
  );
}
