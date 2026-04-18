type InfoListProps = {
  items: string[];
};

export function InfoList({ items }: InfoListProps) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.025] px-4 py-3 text-sm leading-7 text-zinc-300 sm:text-base"
        >
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
