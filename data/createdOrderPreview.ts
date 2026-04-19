import type { Order } from "@/data/orderStore";

export type CreatedOrderPreview = {
  orderId: string;
  serviceSlug: string;
  serviceName: string;
  queryPassword: string;
  createdAt: string;
  status: "pending";
  estimatedCompletion: string;
  selectedPackageId?: string;
  selectedPackageLabel?: string;
  selectedPackagePrice?: string;
  selectedPackageResult?: string;
};

export const CREATED_ORDER_PREVIEW_STORAGE_KEY = "avola-created-order-preview";
let cachedPreviewRaw: string | null | undefined;
let cachedPreview: CreatedOrderPreview | null | undefined;

export function createCreatedOrderPreview(order: Order): CreatedOrderPreview {
  return {
    orderId: order.id,
    serviceSlug: order.serviceSlug,
    serviceName: order.serviceName,
    queryPassword: order.queryPassword,
    createdAt: order.createdAt,
    status: "pending",
    estimatedCompletion: order.estimatedCompletion,
    selectedPackageId: order.selectedPackageId,
    selectedPackageLabel: order.selectedPackageLabel,
    selectedPackagePrice: order.selectedPackagePrice,
    selectedPackageResult: order.selectedPackageResult,
  };
}

export function saveCreatedOrderPreview(preview: CreatedOrderPreview) {
  const rawValue = JSON.stringify(preview);

  sessionStorage.setItem(
    CREATED_ORDER_PREVIEW_STORAGE_KEY,
    rawValue,
  );
  cachedPreviewRaw = rawValue;
  cachedPreview = preview;
}

export function readCreatedOrderPreview() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const rawValue = sessionStorage.getItem(CREATED_ORDER_PREVIEW_STORAGE_KEY);

  if (rawValue === cachedPreviewRaw) {
    return cachedPreview;
  }

  cachedPreviewRaw = rawValue;

  if (!rawValue) {
    cachedPreview = null;
    return null;
  }

  try {
    cachedPreview = JSON.parse(rawValue) as CreatedOrderPreview;
    return cachedPreview;
  } catch {
    cachedPreview = null;
    return null;
  }
}
