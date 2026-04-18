"use client";

import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { LocaleToggle } from "@/components/LocaleToggle";
import { useLocale } from "@/components/LocaleProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const { messages } = useLocale();

  const navItems = [
    { href: "/track", label: messages.header.track },
    { href: "/login", label: messages.header.login },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex w-[calc(100%-1.25rem)] max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:mt-5 sm:w-[calc(100%-2rem)] sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center transition hover:opacity-90"
          aria-label={messages.header.homeAriaLabel}
        >
          <BrandWordmark size="header" />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <LocaleToggle />
          <ThemeToggle />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-transparent px-4 py-2 text-sm text-zinc-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white active:scale-[0.98]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
