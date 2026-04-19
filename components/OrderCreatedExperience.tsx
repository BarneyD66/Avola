"use client";

import { useSyncExternalStore } from "react";
import { CreatedOrderCard } from "@/components/CreatedOrderCard";
import { useLocale } from "@/components/LocaleProvider";
import { MissingOrderState } from "@/components/MissingOrderState";
import { OrderCreatedActions } from "@/components/OrderCreatedActions";
import { OrderCreatedNotice } from "@/components/OrderCreatedNotice";
import { readCreatedOrderPreview } from "@/data/createdOrderPreview";

function subscribe() {
  return () => undefined;
}

export function OrderCreatedExperience() {
  const { messages } = useLocale();
  const order = useSyncExternalStore(
    subscribe,
    () => readCreatedOrderPreview(),
    () => undefined,
  );

  if (!order) {
    if (order === undefined) {
      return (
        <section className="surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
            {messages.created.eyebrow}
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {messages.created.loadingTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            {messages.created.loadingDescription}
          </p>
        </section>
      );
    }

    return <MissingOrderState />;
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-8">
      <section className="surface-panel rounded-[24px] border border-white/8 p-5 sm:rounded-[30px] sm:p-9">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
          {messages.created.eyebrow}
        </p>
        <h1 className="mt-4 text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-white sm:mt-5 sm:text-4xl lg:text-[3.2rem]">
          {messages.created.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400 sm:mt-4 sm:text-lg sm:leading-8">
          {messages.created.description}
        </p>
      </section>

      <CreatedOrderCard order={order} />
      <OrderCreatedNotice />
      <OrderCreatedActions
        orderId={order.orderId}
        queryPassword={order.queryPassword}
      />
    </div>
  );
}
