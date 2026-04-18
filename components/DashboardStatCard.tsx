type DashboardStatCardProps = {
  label: string;
  value: string;
  description: string;
};

export function DashboardStatCard({
  label,
  value,
  description,
}: DashboardStatCardProps) {
  return (
    <section className="rounded-[24px] border border-white/8 bg-white/[0.025] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.18)] backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-zinc-500">{description}</p>
    </section>
  );
}
