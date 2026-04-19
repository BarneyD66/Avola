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

  const baseClassName = "ui-input mt-2";

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
          className={`${baseClassName} ${error ? "ui-input--error" : ""}`}
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
          className={`${baseClassName} ${error ? "ui-input--error" : ""}`}
        />
      )}

      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
