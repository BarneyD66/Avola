"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Header } from "@/components/Header";
import { useLocale } from "@/components/LocaleProvider";
import { PaymentInstructions } from "@/components/PaymentInstructions";
import { PaymentSummaryCard } from "@/components/PaymentSummaryCard";
import {
  getOrderById,
  getOrdersSnapshot,
  getServerOrdersSnapshot,
  markOrderPaidMock,
  markOrderTgDispatched,
  markOrderTgFailed,
  applyOrderPaymentSession,
  subscribeToOrders,
} from "@/data/orderStore";
import { buildTgTaskMessage } from "@/data/tgTaskTemplate";

type CheckoutPageExperienceProps = {
  orderId: string;
};

export function CheckoutPageExperience({
  orderId,
}: CheckoutPageExperienceProps) {
  const router = useRouter();
  const { messages } = useLocale();
  useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    getServerOrdersSnapshot,
  );
  const order = getOrderById(orderId);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const dispatchMockPayment = async () => {
    setIsConfirming(true);
    const paidOrder = markOrderPaidMock(orderId);

    if (paidOrder) {
      try {
        const response = await fetch("/api/internal/telegram/dispatch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: paidOrder.id,
            message: buildTgTaskMessage(paidOrder),
          }),
        });
        const result = (await response.json()) as {
          ok?: boolean;
          messageId?: string;
          error?: string;
        };

        if (!response.ok || !result.ok) {
          throw new Error(result.error ?? "Telegram dispatch failed.");
        }

        markOrderTgDispatched(paidOrder.id, result.messageId);
      } catch (error) {
        markOrderTgFailed(
          paidOrder.id,
          error instanceof Error ? error.message : "Telegram dispatch failed.",
        );
      }
    }

    router.push(`/order/success/${orderId}`);
  };

  const handleContinuePayment = async () => {
    if (!order) {
      return;
    }

    setIsConfirming(true);
    setPaymentError("");

    try {
      const response = await fetch("/api/payments/cryptomus/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        paymentUrl?: string;
        paymentSessionId?: string;
        paymentReference?: string;
        paymentAmount?: string;
        paymentCurrency?: string;
        paymentExpiresAt?: string;
        error?: string;
      };

      if (response.status === 501) {
        await dispatchMockPayment();
        return;
      }

      if (!response.ok || !result.ok || !result.paymentUrl) {
        throw new Error(result.error ?? "Cryptomus payment could not be created.");
      }

      applyOrderPaymentSession(order.id, {
        paymentProvider: "cryptomus",
        paymentStatus: "awaiting_transfer",
        paymentAmount: result.paymentAmount,
        paymentCurrency: result.paymentCurrency,
        paymentSessionId: result.paymentSessionId,
        paymentReference: result.paymentReference,
        paymentExpiresAt: result.paymentExpiresAt,
      });

      window.location.assign(result.paymentUrl);
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "Payment could not be started.",
      );
      setIsConfirming(false);
    }
  };

  if (!order) {
    return (
      <>
        <Header />
        <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:gap-10 sm:px-6 lg:px-8">
            <section className="checkout-hero-card surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
                {messages.checkout.eyebrow}
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {messages.checkout.missingTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                {messages.checkout.missingDescription}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/track"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-foreground hover:bg-white/[0.08] active:scale-[0.98]"
                >
                  {messages.checkout.trackOrder}
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-transparent px-6 py-3 text-sm font-medium text-muted-strong hover:border-white/16 hover:bg-white/[0.03] hover:text-foreground active:scale-[0.98]"
                >
                  {messages.checkout.backHome}
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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:gap-10 sm:px-6 lg:px-8">
          <section className="checkout-hero-card surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
              {messages.checkout.eyebrow}
            </p>
            <h1 className="mt-4 text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-foreground sm:mt-5 sm:text-4xl lg:text-[3.2rem]">
              {messages.checkout.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
              {messages.checkout.description}
            </p>
          </section>

          <PaymentSummaryCard order={order} />
          <PaymentInstructions />

          <section className="checkout-actions-card surface-panel rounded-[24px] border border-white/8 p-4 sm:rounded-[30px] sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleContinuePayment}
                disabled={isConfirming}
                className="ui-primary-button inline-flex w-full items-center justify-center px-6 py-3 text-sm font-semibold sm:w-auto"
              >
                {messages.checkout.continuePayment}
              </button>
              <Link
                href={`/track?orderId=${order.id}&password=${order.queryPassword}`}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-transparent px-6 py-3 text-sm font-medium text-muted-strong hover:border-white/16 hover:bg-white/[0.03] hover:text-foreground active:scale-[0.98] sm:w-auto"
              >
                {messages.checkout.trackOrder}
              </Link>
            </div>
            {paymentError ? (
              <p className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm leading-6 text-rose-100">
                {paymentError}
              </p>
            ) : null}
            <div className="mt-4 grid gap-2 text-sm leading-7 text-muted sm:grid-cols-2">
              <p>{messages.checkout.continuePaymentHint}</p>
              <p>{messages.checkout.mockModeHint}</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
