"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ContextBanner } from "@/components/ContextBanner";
import { ErrorState } from "@/components/ErrorState";
import { useLocale } from "@/components/LocaleProvider";
import { OrderResultCard } from "@/components/OrderResultCard";
import { TrackOrderForm } from "@/components/TrackOrderForm";
import type { Order } from "@/data/orderStore";
import { getOrderById, simulateOrdersProgressOnce } from "@/data/orderStore";

type TrackSource = "created" | "dashboard" | null;

export function TrackOrderExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages } = useLocale();
  const initialOrderId = searchParams.get("orderId")?.trim() ?? "";
  const initialPassword = searchParams.get("password")?.trim() ?? "";
  const sourceParam = searchParams.get("source");
  const trackSource: TrackSource =
    initialOrderId && initialPassword
      ? sourceParam === "dashboard"
        ? "dashboard"
        : "created"
      : null;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [showContextBanner, setShowContextBanner] = useState(
    () => Boolean(trackSource),
  );
  const resultRef = useRef<HTMLDivElement | null>(null);
  const hasAutoQueriedRef = useRef(false);
  const lastAutoQueryKeyRef = useRef("");

  const handleLookup = useCallback(
    async (payload: { orderId: string; password: string }) => {
      const result = getOrderById(payload.orderId.trim());

      if (!result || result.queryPassword !== payload.password.trim()) {
        setOrder(null);
        setError(messages.track.errors.notFound);
        return;
      }

      setOrder(result);
      setError("");
    },
    [messages.track.errors.notFound],
  );

  useEffect(() => {
    simulateOrdersProgressOnce(
      initialOrderId ? `track:${initialOrderId}` : "track:lookup",
      initialOrderId || undefined,
    );
  }, [initialOrderId]);

  useEffect(() => {
    if (!initialOrderId || !initialPassword) {
      return;
    }

    const autoQueryKey = `${initialOrderId}:${initialPassword}`;

    if (
      hasAutoQueriedRef.current &&
      lastAutoQueryKeyRef.current === autoQueryKey
    ) {
      return;
    }

    hasAutoQueriedRef.current = true;
    lastAutoQueryKeyRef.current = autoQueryKey;

    const timeoutId = window.setTimeout(() => {
      void handleLookup({
        orderId: initialOrderId,
        password: initialPassword,
      });
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [handleLookup, initialOrderId, initialPassword]);

  useEffect(() => {
    if (!order && !error) {
      return;
    }

    resultRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [order, error]);

  const handleClearContext = () => {
    setShowContextBanner(false);
    router.replace("/track", { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {showContextBanner && trackSource ? (
        <ContextBanner source={trackSource} onClear={handleClearContext} />
      ) : null}

      <TrackOrderForm
        defaultValues={{
          orderId: initialOrderId,
          password: initialPassword,
        }}
        onSubmit={handleLookup}
      />

      <div ref={resultRef} className="scroll-mt-28 sm:scroll-mt-32">
        {order ? (
          <OrderResultCard order={order} />
        ) : error ? (
          <ErrorState message={error} />
        ) : null}
      </div>
    </div>
  );
}
