"use client";

import Link from "next/link";
import { SiTelegram } from "react-icons/si";
import { useLocale } from "@/components/LocaleProvider";

export function NoticeCard() {
  const { messages } = useLocale();

  return (
    <section className="notice-home-panel surface-panel rounded-[24px] px-4 py-5 transition duration-200 sm:rounded-[26px] sm:px-8 sm:py-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-7">
        <div className="max-w-sm">
          <h2 className="text-[1.45rem] font-semibold tracking-tight text-foreground sm:text-[1.65rem]">
            {messages.home.notice.title}
          </h2>
          <div className="mt-3 space-y-1.5 text-sm leading-7 text-muted sm:mt-3.5 sm:space-y-2 sm:text-[15px]">
            {messages.home.notice.paragraphs.map((item) => (
              <p key={item}>{item}</p>
            ))}
            <div className="flex items-center gap-2.5 text-sm leading-7 sm:text-[15px]">
              <SiTelegram className="h-[15px] w-[15px] shrink-0 text-accent-strong" />
              <span className="text-muted">{messages.home.notice.supportLabel}</span>
              <Link
                href="https://t.me/Avolaofficial"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent-strong hover:text-foreground"
              >
                {messages.home.notice.supportHandle}
              </Link>
            </div>
          </div>
        </div>

        <ul className="grid flex-1 gap-2 lg:gap-2">
          {messages.home.notice.rules.map((item) => (
            <li
              key={item}
              className="surface-subtle flex items-start gap-3 rounded-xl px-3.5 py-2.5 text-sm leading-7 text-muted-strong sm:px-4 sm:text-[15px]"
            >
              <span className="mt-[0.72rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
