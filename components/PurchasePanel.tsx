"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DynamicFieldRenderer } from "@/components/DynamicFieldRenderer";
import { useLocale } from "@/components/LocaleProvider";
import { PackageSelector } from "@/components/PackageSelector";
import { PurchaseSummary } from "@/components/PurchaseSummary";
import { addOrder, createOrderFromService } from "@/data/orderStore";
import {
  getDefaultServicePackage,
  type Service,
  type ServiceField,
} from "@/data/services";
import { getLocalizedService } from "@/locales/content";

type PurchasePanelProps = {
  service: Service;
};

type ErrorMap = Record<string, string>;

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getSelectableFields(service: Service) {
  if (!service.packages?.length) {
    return service.fields;
  }

  return service.fields.filter((field) => field.key !== "quantity");
}

export function PurchasePanel({ service }: PurchasePanelProps) {
  const router = useRouter();
  const { locale, messages } = useLocale();
  const localizedService = useMemo(
    () => getLocalizedService(service, locale),
    [locale, service],
  );
  const fixedFields = useMemo(
    () =>
      [
        {
          key: "contact",
          label: messages.service.contact,
          type: "text",
          required: false,
          placeholder: messages.service.contactPlaceholder,
        },
        {
          key: "extraRequirements",
          label: messages.service.extraRequirements,
          type: "textarea",
          required: false,
          placeholder: messages.service.extraRequirementsPlaceholder,
        },
        {
          key: "queryPassword",
          label: messages.service.queryPassword,
          type: "password",
          required: true,
          placeholder: messages.service.queryPasswordPlaceholder,
        },
      ] as const,
    [messages.service.contact, messages.service.contactPlaceholder, messages.service.extraRequirements, messages.service.extraRequirementsPlaceholder, messages.service.queryPassword, messages.service.queryPasswordPlaceholder],
  );
  const displayFields = useMemo(
    () => getSelectableFields(localizedService),
    [localizedService],
  );
  const defaultPackage = useMemo(
    () => getDefaultServicePackage(localizedService.packages),
    [localizedService.packages],
  );
  const [selectedPackageId, setSelectedPackageId] = useState(
    defaultPackage?.id ?? "",
  );
  const [values, setValues] = useState<Record<string, string>>({
    contact: "",
    extraRequirements: "",
    queryPassword: "",
  });
  const [errors, setErrors] = useState<ErrorMap>({});

  const selectedPackage =
    localizedService.packages?.find((item) => item.id === selectedPackageId) ??
    null;
  const rawSelectedPackage =
    service.packages?.find((item) => item.id === selectedPackageId) ?? null;
  const resolvedPrice = selectedPackage?.price ?? localizedService.price;
  const resolvedDeliveryTime =
    selectedPackage?.deliveryTime ?? localizedService.deliveryTime;

  const validateField = (
    field: ServiceField | (typeof fixedFields)[number],
    value: string,
  ) => {
    if (field.required && !value.trim()) {
      return messages.service.validations.required;
    }

    if (field.type === "url" && value.trim() && !isValidUrl(value.trim())) {
      return messages.service.validations.url;
    }

    if (field.type === "number" && value.trim() && !/^\d+$/.test(value.trim())) {
      return messages.service.validations.number;
    }

    return "";
  };

  const setFieldValue = (key: string, value: string) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[key];
      return nextErrors;
    });
  };

  const handlePackageChange = (id: string) => {
    setSelectedPackageId(id);

    setErrors((current) => {
      if (!current.selectedPackage) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors.selectedPackage;
      return nextErrors;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: ErrorMap = {};

    if (localizedService.packages?.length && !selectedPackage) {
      nextErrors.selectedPackage = messages.service.validations.package;
    }

    for (const field of fixedFields) {
      const error = validateField(field, values[field.key] ?? "");

      if (error) {
        nextErrors[field.key] = error;
      }
    }

    for (const field of displayFields) {
      const error = validateField(field, values[field.key] ?? "");

      if (error) {
        nextErrors[field.key] = error;
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const order = createOrderFromService(
      service,
      values.queryPassword,
      rawSelectedPackage,
    );

    addOrder(order);
    router.push(`/checkout/${order.id}`);
  };

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="surface-panel rounded-[24px] border border-white/8 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.2)] sm:rounded-[28px] sm:p-7">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent-strong/80">
            {messages.service.orderRequest}
          </p>
          <h2 className="mt-3 text-[1.45rem] font-semibold tracking-tight text-white sm:mt-4 sm:text-2xl">
            {messages.service.buyNow}
          </h2>
          <p className="mt-2.5 max-w-[30rem] text-sm leading-7 text-zinc-400 sm:mt-3">
            {messages.service.noLoginDescription}
          </p>
        </div>

        <form className="mt-6 space-y-4 sm:mt-7 sm:space-y-5" onSubmit={handleSubmit} noValidate>
          {displayFields.map((field) => (
            <DynamicFieldRenderer
              key={field.key}
              field={field}
              value={values[field.key] ?? ""}
              error={errors[field.key]}
              onChange={setFieldValue}
            />
          ))}

          {localizedService.packages?.length ? (
            <div className="rounded-[20px] border border-white/8 bg-white/[0.02] p-3.5 sm:rounded-[24px] sm:p-5">
              <PackageSelector
                packages={localizedService.packages}
                selectedPackageId={selectedPackageId}
                error={errors.selectedPackage}
                onChange={handlePackageChange}
              />
            </div>
          ) : null}

          <div className="pt-1">
            <label htmlFor="contact" className="text-sm font-medium text-zinc-200">
              {messages.service.contact}
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              value={values.contact}
              placeholder={messages.service.contactPlaceholder}
              onChange={(event) => setFieldValue("contact", event.target.value)}
              className="ui-input mt-2"
            />
          </div>

          <div>
            <label
              htmlFor="extraRequirements"
              className="text-sm font-medium text-zinc-200"
            >
              {messages.service.extraRequirements}
            </label>
            <textarea
              id="extraRequirements"
              name="extraRequirements"
              value={values.extraRequirements}
              placeholder={messages.service.extraRequirementsPlaceholder}
              onChange={(event) =>
                setFieldValue("extraRequirements", event.target.value)
              }
              rows={3}
              className="ui-input mt-2 resize-y"
            />
          </div>

          <div className="border-t border-white/8 pt-5">
            <label
              htmlFor="queryPassword"
              className="text-sm font-medium text-zinc-200"
            >
              {messages.service.queryPassword}
              <span className="ml-1 text-accent-strong">*</span>
            </label>
            <input
              id="queryPassword"
              name="queryPassword"
              type="password"
              value={values.queryPassword}
              placeholder={messages.service.queryPasswordPlaceholder}
              onChange={(event) =>
                setFieldValue("queryPassword", event.target.value)
              }
              className={`ui-input mt-2 ${
                errors.queryPassword ? "ui-input--error" : ""
              }`}
            />
            {errors.queryPassword ? (
              <p className="mt-2 text-sm text-rose-300">{errors.queryPassword}</p>
            ) : null}
          </div>

          <PurchaseSummary
            price={resolvedPrice}
            deliveryTime={resolvedDeliveryTime}
            packageLabel={selectedPackage?.label}
            packageResult={selectedPackage?.result}
          />

          <button
            type="submit"
            className="ui-primary-button w-full px-5 py-3.5 text-sm font-semibold"
          >
            {messages.service.buyNow}
          </button>
        </form>
      </div>
    </aside>
  );
}
