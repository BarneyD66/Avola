"use client";

import { useLocale } from "@/components/LocaleProvider";

export function PaymentInstructions() {
  const { messages } = useLocale();

  return (
    <section className="surface-panel rounded-[24px] border border-white/8 p-4 sm:rounded-[28px] sm:p-7">
      <h3 className="text-xl font-semibold tracking-tight text-foreground">
        {messages.checkout.instructionsTitle}
      </h3>
      <ul className="mt-4 grid gap-2.5">
        {messages.checkout.instructions.map((item) => (
          <li
            key={item}
            className="surface-subtle flex items-start gap-3 rounded-xl px-3.5 py-2.5 text-sm leading-7 text-muted-strong sm:px-4 sm:py-3"
          >
            <span className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
