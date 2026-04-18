type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.015] p-7 text-center sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
        {description}
      </p>
    </section>
  );
}
