type InfoListProps = {
  items: string[];
};

export function InfoList({ items }: InfoListProps) {
  return (
    <ul className="grid gap-2 sm:gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 rounded-2xl border border-white/6 bg-white/[0.025] px-3 py-2 text-[13.5px] leading-6 text-zinc-300 sm:gap-3 sm:px-4 sm:py-3 sm:text-base sm:leading-7"
        >
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
