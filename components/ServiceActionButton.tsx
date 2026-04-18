import Link from "next/link";

type ServiceActionButtonProps = {
  label: string;
  slug: string;
  featured?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export function ServiceActionButton({
  label,
  slug,
  featured = false,
  fullWidth = false,
  className = "",
}: ServiceActionButtonProps) {
  return (
    <Link
      href={`/service/${slug}`}
      className={`inline-flex min-h-11 items-center justify-center rounded-2xl border px-4 py-3 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${
        featured
          ? "border-accent/34 bg-accent/12 text-accent-strong hover:border-accent/50 hover:bg-accent/18 hover:text-white"
          : "border-white/10 bg-white/[0.04] text-zinc-200 hover:-translate-y-0.5 hover:border-accent/22 hover:bg-white/[0.07] hover:text-white active:translate-y-0"
      } ${fullWidth ? "w-full" : "w-full"} ${className}`}
    >
      {label}
    </Link>
  );
}
