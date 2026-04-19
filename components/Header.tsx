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
      <div className="glass-panel mx-auto mt-3 flex w-[calc(100%-1rem)] max-w-6xl flex-col gap-3 rounded-2xl px-4 py-3 sm:mt-5 sm:w-[calc(100%-2rem)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-7">
        <Link
          href="/"
          className="inline-flex w-fit items-center transition hover:opacity-90"
          aria-label={messages.header.homeAriaLabel}
        >
          <BrandWordmark size="header" />
        </Link>

        <nav className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
          <LocaleToggle />
          <ThemeToggle />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-pill active:scale-[0.98]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
