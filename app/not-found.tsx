"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { useLocale } from "@/components/LocaleProvider";

export default function NotFound() {
  const { messages } = useLocale();

  return (
    <>
      <Header />
      <main className="relative flex-1 pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 sm:px-6 lg:px-8">
          <section className="rounded-[30px] border border-white/8 bg-white/[0.02] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-accent-strong/80">
              {messages.notFound.eyebrow}
            </p>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {messages.notFound.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              {messages.notFound.description}
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex w-fit items-center justify-center rounded-full border border-accent/30 bg-accent-soft px-5 py-3 text-sm font-medium text-accent-strong hover:border-accent/50 hover:bg-accent/18 hover:text-white active:scale-[0.98]"
            >
              {messages.notFound.home}
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
