"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

type TrackOrderFormProps = {
  defaultValues?: {
    orderId?: string;
    password?: string;
  };
  onSubmit: (payload: { orderId: string; password: string }) => Promise<void> | void;
};

type ErrorMap = {
  orderId?: string;
  password?: string;
};

export function TrackOrderForm({
  defaultValues,
  onSubmit,
}: TrackOrderFormProps) {
  const { messages } = useLocale();
  const [orderId, setOrderId] = useState(defaultValues?.orderId ?? "");
  const [password, setPassword] = useState(defaultValues?.password ?? "");
  const [errors, setErrors] = useState<ErrorMap>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: ErrorMap = {};

    if (!orderId.trim()) {
      nextErrors.orderId = messages.track.errors.orderId;
    }

    if (!password.trim()) {
      nextErrors.password = messages.track.errors.password;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      orderId: orderId.trim(),
      password: password.trim(),
    });
  };

  return (
    <section className="surface-panel rounded-[30px] border border-white/8 p-6 sm:p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-strong/80">
          {messages.track.formEyebrow}
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {messages.track.formTitle}
        </h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
          {messages.track.formDescription}
        </p>
      </div>

      <form
        className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <label htmlFor="orderId" className="text-sm font-medium text-zinc-200">
            {messages.track.orderId}
          </label>
          <input
            id="orderId"
            name="orderId"
            type="text"
            value={orderId}
            placeholder={messages.track.orderIdPlaceholder}
            onChange={(event) => {
              setOrderId(event.target.value);
              if (errors.orderId) {
                setErrors((current) => ({ ...current, orderId: undefined }));
              }
            }}
            className={`mt-2 w-full rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-accent/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-accent/10 ${
              errors.orderId
                ? "border-rose-400/50 ring-4 ring-rose-400/10"
                : "border-white/10"
            }`}
          />
          {errors.orderId ? (
            <p className="mt-2 text-sm text-rose-300">{errors.orderId}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-zinc-200">
            {messages.track.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            placeholder={messages.track.passwordPlaceholder}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errors.password) {
                setErrors((current) => ({ ...current, password: undefined }));
              }
            }}
            className={`mt-2 w-full rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-accent/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-accent/10 ${
              errors.password
                ? "border-rose-400/50 ring-4 ring-rose-400/10"
                : "border-white/10"
            }`}
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-rose-300">{errors.password}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="inline-flex h-[50px] items-center justify-center rounded-full border border-accent/40 bg-accent px-6 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(59,130,246,0.22)] hover:bg-[#4f90f7] active:scale-[0.98]"
        >
          {messages.track.submit}
        </button>
      </form>
    </section>
  );
}
