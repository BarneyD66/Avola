type BrandWordmarkProps = {
  size?: "header" | "hero";
  className?: string;
};

const sizeClassMap = {
  header: "text-[1.7rem] sm:text-[1.85rem]",
  hero: "text-[2.35rem] sm:text-[2.9rem] lg:text-[3.4rem]",
};

export function BrandWordmark({
  size = "header",
  className = "",
}: BrandWordmarkProps) {
  return (
    <span
      className={`brand-wordmark inline-block leading-none ${sizeClassMap[size]} ${className}`.trim()}
    >
      AVOLA
    </span>
  );
}
