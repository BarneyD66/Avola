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
    <aside className="surface-panel h-fit rounded-[28px] border border-white/8 p-5 lg:sticky lg:top-6">
      <Link
        href="/"
        className="text-lg font-semibold tracking-[0.18em] text-white hover:text-accent-strong"
      >
        Avola
      </Link>

      <p className="mt-3 text-sm leading-7 text-zinc-500">
        {messages.dashboard.sidebarDescription}
      </p>

      <nav className="mt-6 flex flex-col gap-2">
        {navItems.map((item) => {
          const active = item.isActive(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
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

      <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3">
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
