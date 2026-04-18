import type { ReactNode } from "react";

type SectionBlockProps = {
  title: string;
  children: ReactNode;
};

export function SectionBlock({ title, children }: SectionBlockProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-white/[0.02] p-6 shadow-[0_14px_36px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-7">
      <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
