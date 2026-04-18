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
  sessionStorage.setItem(
    CREATED_ORDER_PREVIEW_STORAGE_KEY,
    JSON.stringify(preview),
  );
}

export function readCreatedOrderPreview() {
  const rawValue = sessionStorage.getItem(CREATED_ORDER_PREVIEW_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as CreatedOrderPreview;
  } catch {
    return null;
  }
}
