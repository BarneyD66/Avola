import type { OrderTimelineItem } from "@/data/orderStore";

type OrderTimelineProps = {
  items: OrderTimelineItem[];
};

export function OrderTimeline({ items }: OrderTimelineProps) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <li
            key={`${item.label}-${item.time}`}
            className="relative rounded-2xl border border-white/8 bg-white/[0.02] p-4 pl-14"
          >
            <span
              className={`absolute left-5 top-5 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${
                item.done
                  ? "border-accent/40 bg-accent/15 text-accent-strong"
                  : "border-white/10 bg-white/[0.03] text-zinc-500"
              }`}
            >
              {item.done ? "✓" : index + 1}
            </span>

            {!isLast ? (
              <span
                className={`absolute bottom-[-13px] left-8 top-11 w-px ${
                  item.done ? "bg-accent/30" : "bg-white/8"
                }`}
              />
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-white sm:text-base">
                {item.label}
              </p>
              <p className="text-sm text-zinc-500">{item.time}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
