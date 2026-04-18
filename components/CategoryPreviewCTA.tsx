type CategoryPreviewCTAProps = {
  label: string;
};

export function CategoryPreviewCTA({ label }: CategoryPreviewCTAProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-accent-strong transition group-hover:gap-2.5 group-hover:text-accent-strong">
      <span>{label}</span>
      <span aria-hidden="true">→</span>
    </span>
  );
}
