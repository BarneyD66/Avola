"use client";

import { usePathname } from "next/navigation";
import { LocaleToggle } from "@/components/LocaleToggle";
import { useLocale } from "@/components/LocaleProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardHeader() {
  const pathname = usePathname();
  const { messages } = useLocale();

  const title =
    pathname === "/dashboard"
      ? messages.dashboard.pageTitles.overview
      : pathname === "/dashboard/orders"
        ? messages.dashboard.pageTitles.orders
        : pathname.startsWith("/dashboard/orders/")
          ? messages.dashboard.pageTitles.detail
          : messages.dashboard.pageTitles.default;

  return (
    <header className="surface-panel rounded-[28px] border border-white/8 px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
            {messages.dashboard.headerEyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <LocaleToggle />
          <ThemeToggle />
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-200">
            {messages.dashboard.demoUser}
          </div>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.08] active:scale-[0.98]"
          >
            {messages.dashboard.logout}
          </button>
        </div>
      </div>
    </header>
  );
}
