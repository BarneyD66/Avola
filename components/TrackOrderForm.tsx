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
    <section className="track-order-form-card surface-panel rounded-[24px] border border-white/8 p-3.5 sm:rounded-[30px] sm:p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent-strong/80">
          {messages.track.formEyebrow}
        </p>
        <h2 className="mt-3 text-[1.3rem] font-semibold tracking-tight text-white sm:mt-4 sm:text-3xl">
          {messages.track.formTitle}
        </h2>
        <p className="mt-2.5 text-[13.5px] leading-6.5 text-zinc-400 sm:mt-3 sm:text-base sm:leading-7">
          {messages.track.formDescription}
        </p>
      </div>

      <form
        className="mt-5 grid gap-3.5 sm:mt-8 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
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
            className={`ui-input mt-2 ${errors.orderId ? "ui-input--error" : ""}`}
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
            className={`ui-input mt-2 ${errors.password ? "ui-input--error" : ""}`}
          />
          {errors.password ? (
            <p className="mt-2 text-sm text-rose-300">{errors.password}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="ui-primary-button h-[50px] w-full px-6 text-sm font-semibold lg:w-auto"
        >
          {messages.track.submit}
        </button>
      </form>
    </section>
  );
}
