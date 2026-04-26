"use client";

import Link from "next/link";
import { BrandWordmark } from "@/components/BrandWordmark";
import { LocaleToggle } from "@/components/LocaleToggle";
import { useLocale } from "@/components/LocaleProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const { messages } = useLocale();

  const navItems = [
    { href: "/services", label: messages.header.services },
    { href: "/track", label: messages.header.track },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="header-shell glass-panel mx-auto mt-3 grid w-[calc(100%-1rem)] max-w-[88rem] grid-cols-1 gap-3 rounded-[24px] px-4 py-3 sm:mt-5 sm:w-[calc(100%-2rem)] sm:px-6 md:grid-cols-[auto_1fr_auto] md:items-center lg:px-7">
        <Link
          href="/"
          className="inline-flex w-fit items-center transition hover:opacity-90"
          aria-label={messages.header.homeAriaLabel}
        >
          <BrandWordmark size="header" />
        </Link>

        <div className="hidden md:flex justify-center">
          <nav className="header-nav items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="header-nav-link active:scale-[0.98]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="header-control-cluster flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:justify-end md:gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <LocaleToggle />
            <ThemeToggle />
          </div>
          <div className="grid gap-2 md:hidden">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <LocaleToggle />
              <ThemeToggle />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={`compact-${item.href}`}
                  href={item.href}
                  className="nav-pill header-mobile-pill active:scale-[0.98]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
