"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";

type OrderCreatedActionsProps = {
  orderId: string;
  queryPassword: string;
};

export function OrderCreatedActions({
  orderId,
  queryPassword,
}: OrderCreatedActionsProps) {
  const router = useRouter();
  const { messages } = useLocale();

  const handleTrackOrder = () => {
    const params = new URLSearchParams({
      orderId,
      password: queryPassword,
    });

    router.push(`/track?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleTrackOrder}
        className="inline-flex items-center justify-center rounded-full border border-accent/40 bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(59,130,246,0.22)] hover:bg-[#4f90f7] active:scale-[0.98]"
      >
        {messages.created.actions.track}
      </button>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98]"
      >
        {messages.created.actions.home}
      </Link>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-transparent px-6 py-3 text-sm font-medium text-zinc-300 hover:border-white/16 hover:bg-white/[0.03] hover:text-white active:scale-[0.98]"
      >
        {messages.created.actions.repurchase}
      </Link>
    </div>
  );
}
