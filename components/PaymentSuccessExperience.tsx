"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Header } from "@/components/Header";
import { useLocale } from "@/components/LocaleProvider";
import { PaymentSuccessCard } from "@/components/PaymentSuccessCard";
import {
  getOrderById,
  getOrdersSnapshot,
  getServerOrdersSnapshot,
  markOrderPaid,
  markOrderTgDispatched,
  markOrderTgFailed,
  subscribeToOrders,
} from "@/data/orderStore";
import { buildTgTaskMessage } from "@/data/tgTaskTemplate";

type PaymentSuccessExperienceProps = {
  orderId: string;
};

export function PaymentSuccessExperience({
  orderId,
}: PaymentSuccessExperienceProps) {
  const { messages } = useLocale();
  const searchParams = useSearchParams();
  useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    getServerOrdersSnapshot,
  );
  const order = getOrderById(orderId);
  const hasReconciledPayment = useRef(false);
  const [reconcileError, setReconcileError] = useState("");

  useEffect(() => {
    if (
      !order ||
      hasReconciledPayment.current ||
      searchParams.get("cryptomus") !== "success" ||
      order.paymentStatus === "paid" ||
      order.paymentStatus === "paid_mock"
    ) {
      return;
    }

    hasReconciledPayment.current = true;
    const paidOrder = markOrderPaid(order.id);

    if (!paidOrder || paidOrder.tgDispatchStatus === "tg_dispatched") {
      return;
    }

    fetch("/api/internal/telegram/dispatch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: paidOrder.id,
        message: buildTgTaskMessage(paidOrder),
      }),
    })
      .then(async (response) => {
        const result = (await response.json()) as {
          ok?: boolean;
          messageId?: string;
          error?: string;
        };

        if (!response.ok || !result.ok) {
          throw new Error(result.error ?? "Telegram dispatch failed.");
        }

        markOrderTgDispatched(paidOrder.id, result.messageId);
      })
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : "Telegram dispatch failed.";
        markOrderTgFailed(paidOrder.id, message);
        setReconcileError(message);
      });
  }, [order, searchParams]);

  if (!order) {
    return (
      <>
        <Header />
        <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:gap-10 sm:px-6 lg:px-8">
            <section className="surface-panel rounded-[30px] border border-white/8 p-7 sm:p-9">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
                {messages.success.eyebrow}
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {messages.checkout.missingTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                {messages.checkout.missingDescription}
              </p>
            </section>
          </div>
        </main>
      </>
    );
  }

  if (order.paymentStatus !== "paid" && order.paymentStatus !== "paid_mock") {
    return (
      <>
        <Header />
        <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:gap-10 sm:px-6 lg:px-8">
            <section className="surface-panel rounded-[30px] border border-white/8 p-7 sm:p-9">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
                {messages.success.eyebrow}
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {messages.success.unpaidTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                {messages.success.unpaidDescription}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/checkout/${order.id}`}
                  className="ui-primary-button inline-flex items-center justify-center px-6 py-3 text-sm font-semibold"
                >
                  {messages.success.backToCheckout}
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-foreground hover:bg-white/[0.08] active:scale-[0.98]"
                >
                  {messages.success.home}
                </Link>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:gap-10 sm:px-6 lg:px-8">
          <PaymentSuccessCard order={order} />
          {reconcileError ? (
            <section className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
              {reconcileError}
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}
