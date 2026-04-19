type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <main className="relative flex-1 pt-36 pb-14 sm:pt-32 sm:pb-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <section className="surface-panel rounded-[28px] border border-white/8 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-accent-strong/80">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-strong sm:text-lg">
            {description}
          </p>
        </section>
      </div>
    </main>
  );
}
