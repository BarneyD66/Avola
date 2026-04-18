type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <section className="rounded-[26px] border border-rose-300/15 bg-rose-400/5 p-5 sm:p-6">
      <p className="text-sm font-medium text-rose-200 sm:text-base">{message}</p>
    </section>
  );
}
