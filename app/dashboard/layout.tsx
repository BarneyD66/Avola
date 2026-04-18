import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main className="relative flex-1 px-5 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <DashboardHeader />
        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <DashboardSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
