type CategoryPreviewListProps = {
  items: string[];
};

export function CategoryPreviewList({ items }: CategoryPreviewListProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-strong sm:text-[15px]">
      {items.map((item, index) => {
        const isLastOddItem = items.length % 2 === 1 && index === items.length - 1;

        return (
          <li
            key={item}
            className={`inline-flex items-center gap-2 leading-6 ${isLastOddItem ? "col-span-2" : ""}`}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-strong/80"
            />
            <span className="min-w-0">{item}</span>
          </li>
        );
      })}
    </ul>
  );
}
