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
  subscribeToOrders,
} from "@/data/orderStore";

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

  const handleContinuePayment = () => {
    setIsConfirming(true);
    markOrderPaidMock(orderId);
    router.push(`/order/success/${orderId}`);
  };

  if (!order) {
    return (
      <>
        <Header />
        <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:gap-10 sm:px-6 lg:px-8">
            <section className="surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
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
          <section className="surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
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

          <section className="surface-panel rounded-[24px] border border-white/8 p-4 sm:rounded-[30px] sm:p-8">
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
