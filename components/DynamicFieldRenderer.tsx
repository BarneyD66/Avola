"use client";

import { useLocale } from "@/components/LocaleProvider";
import type { ServiceField } from "@/data/services";

type DynamicFieldRendererProps = {
  field: ServiceField;
  value: string;
  error?: string;
  onChange: (key: string, value: string) => void;
};

export function DynamicFieldRenderer({
  field,
  value,
  error,
  onChange,
}: DynamicFieldRendererProps) {
  const { messages } = useLocale();

  const baseClassName =
    "mt-2 w-full rounded-2xl border bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-accent/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-accent/10";

  return (
    <div>
      <label htmlFor={field.key} className="text-sm font-medium text-zinc-200">
        {field.label}
        {field.required ? (
          <span className="ml-1 text-accent-strong">*</span>
        ) : null}
      </label>

      {field.type === "select" ? (
        <select
          id={field.key}
          name={field.key}
          value={value}
          onChange={(event) => onChange(field.key, event.target.value)}
          className={`${baseClassName} ${
            error ? "border-rose-400/50 ring-4 ring-rose-400/10" : "border-white/10"
          }`}
        >
          <option value="">{messages.service.selectPlaceholder}</option>
          {field.options?.map((option) => (
            <option key={option} value={option} className="bg-zinc-900">
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={field.key}
          name={field.key}
          type={field.type === "number" ? "text" : field.type}
          inputMode={field.type === "number" ? "numeric" : undefined}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => {
            const nextValue =
              field.type === "number"
                ? event.target.value.replace(/[^\d]/g, "")
                : event.target.value;

            onChange(field.key, nextValue);
          }}
          className={`${baseClassName} ${
            error ? "border-rose-400/50 ring-4 ring-rose-400/10" : "border-white/10"
          }`}
        />
      )}

      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
