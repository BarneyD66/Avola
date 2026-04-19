"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { messages } = useLocale();

  const navItems = [
    {
      href: "/dashboard",
      label: messages.dashboard.pageTitles.overview,
      isActive: (path: string) => path === "/dashboard",
    },
    {
      href: "/dashboard/orders",
      label: messages.dashboard.pageTitles.orders,
      isActive: (path: string) => path.startsWith("/dashboard/orders"),
    },
  ];

  return (
    <aside className="surface-panel h-fit rounded-[24px] border border-white/8 p-4 sm:rounded-[28px] sm:p-5 lg:sticky lg:top-6">
      <Link
        href="/"
        className="text-lg font-semibold tracking-[0.18em] text-white hover:text-accent-strong"
      >
        Avola
      </Link>

      <p className="mt-3 hidden text-sm leading-7 text-zinc-500 sm:block">
        {messages.dashboard.sidebarDescription}
      </p>

      <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 sm:mt-6 sm:flex-col sm:overflow-visible sm:pb-0">
        {navItems.map((item) => {
          const active = item.isActive(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-2xl border px-4 py-3 text-sm font-medium transition sm:shrink ${
                active
                  ? "border-accent/30 bg-accent/12 text-white"
                  : "border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 hidden rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 sm:block">
        <p className="text-sm font-medium text-zinc-500">
          {messages.dashboard.accountSettings}
        </p>
        <p className="mt-2 text-sm leading-7 text-zinc-600">
          {messages.dashboard.upcoming}
        </p>
      </div>
    </aside>
  );
}
