"use client";

import { useLocale } from "@/components/LocaleProvider";
import { PackageOptionCard } from "@/components/PackageOptionCard";
import type { ServicePackage } from "@/data/services";

type PackageSelectorProps = {
  packages: ServicePackage[];
  selectedPackageId?: string;
  error?: string;
  onChange: (id: string) => void;
};

export function PackageSelector({
  packages,
  selectedPackageId,
  error,
  onChange,
}: PackageSelectorProps) {
  const { messages } = useLocale();

  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-zinc-200">
          {messages.service.selectPackage}
        </p>
        <span className="text-accent-strong">*</span>
      </div>

      <div className="mt-3 grid gap-3">
        {packages.map((item) => (
          <PackageOptionCard
            key={item.id}
            item={item}
            selected={item.id === selectedPackageId}
            onSelect={onChange}
          />
        ))}
      </div>

      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
