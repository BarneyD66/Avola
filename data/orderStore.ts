import { seedOrders } from "@/data/mockOrders";
import type { Service, ServicePackage } from "@/data/services";
import { generateTgTaskCode } from "@/data/tgTaskTemplate";

export type OrderStatus = "pending" | "running" | "completed" | "issue";

export type PaymentStatus =
  | "pending_payment"
  | "awaiting_transfer"
  | "payment_confirming"
  | "paid"
  | "paid_mock"
  | "payment_failed"
  | "expired"
  | "cancelled";

export type PublicPaymentStatus = Exclude<PaymentStatus, "paid_mock">;

export type TgDispatchStatus =
  | "tg_pending"
  | "tg_ready"
  | "tg_dispatched"
  | "tg_failed";

export type OrderTimelineItem = {
  label: string;
  time: string;
  done: boolean;
};

export type Order = {
  id: string;
  serviceName: string;
  serviceSlug: string;
  status: OrderStatus;
  amount: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  estimatedCompletion: string;
  queryPassword: string;
  summary: string;
  timeline: OrderTimelineItem[];
  selectedPackageId?: string;
  selectedPackageLabel?: string;
  selectedPackagePrice?: string;
  selectedPackageResult?: string;
  selectedPackageDeliveryTime?: string;
  deliveryTime?: string;
  formValues?: Record<string, string>;
  targetLink?: string;
  additionalRequirement?: string;
  contact?: string;
  paymentProvider?: "unipay";
  paymentMethod?: "crypto";
  paymentStatus?: PaymentStatus;
  paymentAmount?: string;
  paymentCurrency?: string;
  paymentChain?: string;
  paymentAddress?: string;
  paymentQrCode?: string;
  paymentSessionId?: string;
  paymentReference?: string;
  paymentExpiresAt?: string;
  receivedAmount?: string;
  paidAt?: string;
  tgDispatchStatus?: TgDispatchStatus;
  tgTaskType?: string;
  tgTargetChannel?: string;
  tgMessageId?: string;
  tgDispatchError?: string;
  tgGeneratedAt?: string;
  tgDispatchedAt?: string;
  tgTaskCode?: string;
  tgTemplateVersion?: string;
};

export const ORDER_STORAGE_KEY = "avola-orders";
const ORDER_STORE_EVENT = "avola-orders-updated";
const SIMULATION_COOLDOWN_MS = 800;
const DEFAULT_PAYMENT_CURRENCY = "USDT";
const DEFAULT_PAYMENT_CHAIN = "Polygon";
const PAYMENT_WINDOW_MINUTES = 30;
const DEFAULT_TG_CHANNEL = "@avolatest";
const simulationTimestamps = new Map<string, number>();
let cachedOrdersSnapshot: Order[] | null = null;
let cachedOrdersRaw: string | null = null;
let serverOrdersSnapshot: Order[] | null = null;

const ORDER_TIMELINE_LABELS = [
  "订单已创建",
  "已进入执行队列",
  "执行中",
  "已完成",
] as const;

export const orderStatusMeta = {
  pending: {
    label: "待开始",
    description: "当前订单已接收，等待进入执行流程。",
    className: "border-zinc-400/20 bg-zinc-400/10 text-zinc-200",
  },
  running: {
    label: "执行中",
    description: "当前订单正在推进，请稍后查看最新进度。",
    className: "border-blue-400/20 bg-blue-400/10 text-blue-200",
  },
  completed: {
    label: "已完成",
    description: "当前订单已完成交付。",
    className: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  },
  issue: {
    label: "异常处理中",
    description: "当前订单存在异常，正在处理中。",
    className: "border-rose-300/20 bg-rose-300/10 text-rose-100",
  },
} satisfies Record<
  OrderStatus,
  { label: string; description: string; className: string }
>;

export const paymentStatusMeta = {
  pending_payment: {
    label: "待支付",
    description: "订单已创建，请先完成支付后再进入处理流程。",
    className: "border-zinc-400/20 bg-zinc-400/10 text-zinc-200",
  },
  awaiting_transfer: {
    label: "等待转账",
    description: "请按页面显示金额完成转账，到账后系统会继续更新状态。",
    className: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  },
  payment_confirming: {
    label: "支付确认中",
    description: "系统正在确认支付到账情况，请稍后查看最新结果。",
    className: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  },
  paid: {
    label: "已支付",
    description: "支付已完成，订单已进入处理流程。",
    className: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  },
  paid_mock: {
    label: "已支付",
    description: "当前为测试支付成功状态，订单已进入内部处理流程。",
    className: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  },
  payment_failed: {
    label: "支付失败",
    description: "当前支付未成功完成，请重新发起支付。",
    className: "border-rose-300/20 bg-rose-300/10 text-rose-100",
  },
  expired: {
    label: "已过期",
    description: "当前支付会话已过期，请重新发起支付。",
    className: "border-orange-300/20 bg-orange-300/10 text-orange-100",
  },
  cancelled: {
    label: "已取消",
    description: "当前支付流程已取消，可重新发起支付。",
    className: "border-zinc-400/20 bg-zinc-400/10 text-zinc-200",
  },
} satisfies Record<
  PaymentStatus,
  { label: string; description: string; className: string }
>;

export const tgDispatchStatusMeta = {
  tg_pending: {
    label: "TG Pending",
    className: "border-zinc-400/20 bg-zinc-400/10 text-zinc-200",
  },
  tg_ready: {
    label: "TG Ready",
    className: "border-blue-400/20 bg-blue-400/10 text-blue-200",
  },
  tg_dispatched: {
    label: "TG Dispatched",
    className: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  },
  tg_failed: {
    label: "TG Failed",
    className: "border-rose-300/20 bg-rose-300/10 text-rose-100",
  },
} satisfies Record<
  TgDispatchStatus,
  { label: string; className: string }
>;

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function formatDateTime(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseDateTime(value: string) {
  return new Date(value.replace(" ", "T"));
}

function parseDeliveryHours(deliveryTime: string) {
  const rangeMatch = deliveryTime.match(/(\d+)\s*-\s*(\d+)/);

  if (rangeMatch) {
    return Number(rangeMatch[2]);
  }

  const singleMatch = deliveryTime.match(/(\d+)/);

  if (singleMatch) {
    return Number(singleMatch[1]);
  }

  return 24;
}

function generatePaymentSessionId(orderId: string) {
  return `upi_${orderId.toLowerCase()}`;
}

function generatePaymentReference(orderId: string) {
  return `PAY-${orderId}`;
}

function generatePaymentAddress(orderId: string) {
  const seed = orderId.replace(/[^A-Z0-9]/gi, "").toLowerCase();
  return `0x${seed.padEnd(40, "7").slice(0, 40)}`;
}

function createMockPaymentInfo(order: Order) {
  const createdAt = parseDateTime(order.updatedAt || order.createdAt);
  const expiresAt = new Date(
    createdAt.getTime() + PAYMENT_WINDOW_MINUTES * 60 * 1000,
  );

  return {
    paymentProvider: "unipay" as const,
    paymentMethod: "crypto" as const,
    paymentAmount: order.selectedPackagePrice ?? order.amount,
    paymentCurrency: DEFAULT_PAYMENT_CURRENCY,
    paymentChain: DEFAULT_PAYMENT_CHAIN,
    paymentAddress: generatePaymentAddress(order.id),
    paymentQrCode: `mock-qr:${order.id}`,
    paymentSessionId: generatePaymentSessionId(order.id),
    paymentReference: generatePaymentReference(order.id),
    paymentExpiresAt: formatDateTime(expiresAt),
  };
}

function getDefaultPaymentStatus(order: Order): PaymentStatus {
  if (order.paymentStatus) {
    return order.paymentStatus;
  }

  if (order.status === "running" || order.status === "completed" || order.status === "issue") {
    return "paid";
  }

  return "pending_payment";
}

function getDefaultTgDispatchStatus(
  order: Order,
  paymentStatus: PaymentStatus,
): TgDispatchStatus {
  if (order.tgDispatchStatus) {
    return order.tgDispatchStatus;
  }

  if (paymentStatus === "paid_mock") {
    return "tg_ready";
  }

  if (paymentStatus === "paid") {
    return order.status === "pending" ? "tg_ready" : "tg_dispatched";
  }

  return "tg_pending";
}

function normalizeOrder(order: Order): Order {
  const paymentStatus = getDefaultPaymentStatus(order);
  const paymentInfo = createMockPaymentInfo(order);
  const tgDispatchStatus = getDefaultTgDispatchStatus(order, paymentStatus);

  return {
    ...order,
    paymentProvider: order.paymentProvider ?? paymentInfo.paymentProvider,
    paymentMethod: order.paymentMethod ?? paymentInfo.paymentMethod,
    paymentStatus,
    paymentAmount: order.paymentAmount ?? order.selectedPackagePrice ?? order.amount,
    paymentCurrency: order.paymentCurrency ?? paymentInfo.paymentCurrency,
    paymentChain: order.paymentChain ?? paymentInfo.paymentChain,
    paymentAddress: order.paymentAddress ?? paymentInfo.paymentAddress,
    paymentQrCode: order.paymentQrCode ?? paymentInfo.paymentQrCode,
    paymentSessionId: order.paymentSessionId ?? paymentInfo.paymentSessionId,
    paymentReference: order.paymentReference ?? paymentInfo.paymentReference,
    paymentExpiresAt: order.paymentExpiresAt ?? paymentInfo.paymentExpiresAt,
    receivedAmount:
      order.receivedAmount ??
      (paymentStatus === "paid" || paymentStatus === "paid_mock"
        ? order.paymentAmount ?? order.amount
        : undefined),
    paidAt:
      order.paidAt ??
      (paymentStatus === "paid" || paymentStatus === "paid_mock"
        ? order.updatedAt
        : undefined),
    tgDispatchStatus,
    tgTaskType: order.tgTaskType ?? order.serviceSlug,
    tgTargetChannel: order.tgTargetChannel ?? DEFAULT_TG_CHANNEL,
  };
}

function readStoredOrders() {
  if (!canUseStorage()) {
    return seedOrders.map(normalizeOrder);
  }

  const rawValue = localStorage.getItem(ORDER_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Order[];
    return Array.isArray(parsed) ? parsed.map(normalizeOrder) : null;
  } catch {
    return null;
  }
}

function writeStoredOrders(orders: Order[]) {
  if (!canUseStorage()) {
    return;
  }

  const rawValue = JSON.stringify(orders);
  localStorage.setItem(ORDER_STORAGE_KEY, rawValue);
  cachedOrdersSnapshot = orders;
  cachedOrdersRaw = rawValue;
}

function dispatchOrderStoreUpdate() {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new Event(ORDER_STORE_EVENT));
}

function ensureOrdersInitialized() {
  const storedOrders = readStoredOrders();

  if (storedOrders && storedOrders.length > 0) {
    return storedOrders;
  }

  const orders = seedOrders.map(normalizeOrder);

  if (canUseStorage()) {
    writeStoredOrders(orders);
  }

  return orders;
}

function replaceOrder(orderId: string, updater: (order: Order) => Order) {
  const orders = getAllOrders();
  let hasChanged = false;

  const nextOrders = orders.map((order) => {
    if (order.id !== orderId) {
      return order;
    }

    const nextOrder = normalizeOrder(updater(order));

    if (JSON.stringify(nextOrder) !== JSON.stringify(order)) {
      hasChanged = true;
    }

    return nextOrder;
  });

  if (!hasChanged) {
    return null;
  }

  writeStoredOrders(nextOrders);
  dispatchOrderStoreUpdate();
  return nextOrders.find((order) => order.id === orderId) ?? null;
}

export function getAllOrders() {
  return getOrdersSnapshot();
}

export function getOrdersSnapshot() {
  if (!canUseStorage()) {
    serverOrdersSnapshot ??= seedOrders.map(normalizeOrder);
    return serverOrdersSnapshot;
  }

  const rawValue = localStorage.getItem(ORDER_STORAGE_KEY);

  if (rawValue && cachedOrdersSnapshot && cachedOrdersRaw === rawValue) {
    return cachedOrdersSnapshot;
  }

  const orders = ensureOrdersInitialized();
  const nextRawValue = localStorage.getItem(ORDER_STORAGE_KEY);
  cachedOrdersSnapshot = orders;
  cachedOrdersRaw = nextRawValue ?? JSON.stringify(orders);

  return orders;
}

export function getServerOrdersSnapshot() {
  serverOrdersSnapshot ??= seedOrders.map(normalizeOrder);
  return serverOrdersSnapshot;
}

export function getOrderById(id: string) {
  return getAllOrders().find((order) => order.id === id) ?? null;
}

export function addOrder(order: Order) {
  const orders = getAllOrders();
  writeStoredOrders([normalizeOrder(order), ...orders]);
  dispatchOrderStoreUpdate();
}

export function subscribeToOrders(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => callback();

  window.addEventListener(ORDER_STORE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(ORDER_STORE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getOrderStatusMeta(status: OrderStatus) {
  return orderStatusMeta[status];
}

export function getDisplayOrderStatus(status: OrderStatus): OrderStatus {
  return status;
}

export function getPaymentStatusMeta(status: PaymentStatus) {
  return paymentStatusMeta[status];
}

export function getDisplayPaymentStatus(
  status: PaymentStatus,
): PublicPaymentStatus {
  return status === "paid_mock" ? "paid" : status;
}

export function getTgDispatchStatusMeta(status: TgDispatchStatus) {
  return tgDispatchStatusMeta[status];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shouldAdvance(probability: number) {
  return Math.random() < probability;
}

function getSummaryByStatus(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "当前订单已进入待开始状态，系统会在排期完成后更新执行进度。";
    case "running":
      return "当前订单正在推进，请稍后查看最新进度。";
    case "completed":
      return "当前订单已完成交付，可根据当前节奏继续安排新的服务请求。";
    case "issue":
      return "当前订单存在异常，系统正在处理并评估后续推进节奏。";
  }
}

function createTimelineLookup(order: Order) {
  return new Map(order.timeline.map((item) => [item.label, item]));
}

function resolveTimelineTime(
  existingTime: string | undefined,
  fallbackTime: string,
  done: boolean,
) {
  if (!done) {
    return existingTime && existingTime !== "待更新" ? existingTime : "待更新";
  }

  return existingTime && existingTime !== "待更新" ? existingTime : fallbackTime;
}

function syncTimeline(
  order: Order,
  nextStatus: OrderStatus,
  changedAt: string,
): OrderTimelineItem[] {
  const currentTimeline = createTimelineLookup(order);
  const doneMap: Record<(typeof ORDER_TIMELINE_LABELS)[number], boolean> = {
    订单已创建: true,
    已进入执行队列:
      nextStatus === "running" || nextStatus === "completed" || nextStatus === "issue",
    执行中:
      nextStatus === "running" || nextStatus === "completed" || nextStatus === "issue",
    已完成: nextStatus === "completed",
  };

  return ORDER_TIMELINE_LABELS.map((label) => {
    const existing = currentTimeline.get(label);

    return {
      label,
      time: resolveTimelineTime(existing?.time, changedAt, doneMap[label]),
      done: doneMap[label],
    };
  });
}

function advanceOrder(order: Order): Order {
  if (
    order.status === "completed" ||
    order.status === "issue" ||
    (order.paymentStatus !== "paid" && order.paymentStatus !== "paid_mock")
  ) {
    return order;
  }

  const nextUpdatedAt = formatDateTime(new Date());

  if (order.status === "pending") {
    if (!shouldAdvance(0.55)) {
      return order;
    }

    return {
      ...order,
      status: "running",
      progress: randomInt(10, 20),
      updatedAt: nextUpdatedAt,
      summary: getSummaryByStatus("running"),
      timeline: syncTimeline(order, "running", nextUpdatedAt),
    };
  }

  if (order.status === "running") {
    const nextProgress = Math.min(95, order.progress + randomInt(5, 15));
    const shouldComplete =
      nextProgress >= 96 || (nextProgress >= 88 && shouldAdvance(0.35));

    if (shouldComplete) {
      return {
        ...order,
        status: "completed",
        progress: 100,
        updatedAt: nextUpdatedAt,
        summary: getSummaryByStatus("completed"),
        timeline: syncTimeline(order, "completed", nextUpdatedAt),
      };
    }

    return {
      ...order,
      progress: nextProgress,
      updatedAt: nextUpdatedAt,
      summary: getSummaryByStatus("running"),
      timeline: syncTimeline(order, "running", nextUpdatedAt),
    };
  }

  return order;
}

export function simulateOrdersProgress(targetOrderId?: string) {
  const orders = getAllOrders();
  let hasChanged = false;

  const nextOrders = orders.map((order) => {
    if (targetOrderId && order.id !== targetOrderId) {
      return order;
    }

    const nextOrder = advanceOrder(order);

    if (JSON.stringify(nextOrder) !== JSON.stringify(order)) {
      hasChanged = true;
    }

    return nextOrder;
  });

  if (!hasChanged) {
    return;
  }

  writeStoredOrders(nextOrders);
  dispatchOrderStoreUpdate();
}

export function simulateOrdersProgressOnce(
  triggerKey: string,
  targetOrderId?: string,
) {
  const now = Date.now();
  const lastTriggeredAt = simulationTimestamps.get(triggerKey) ?? 0;

  if (now - lastTriggeredAt < SIMULATION_COOLDOWN_MS) {
    return;
  }

  simulationTimestamps.set(triggerKey, now);
  simulateOrdersProgress(targetOrderId);
}

export function startOrderPayment(orderId: string) {
  return replaceOrder(orderId, (order) => {
    const updatedAt = formatDateTime(new Date());

    return {
      ...order,
      ...createMockPaymentInfo(order),
      updatedAt,
      paymentStatus: "awaiting_transfer",
      summary:
        "支付流程已发起，请按当前页面显示金额完成转账，到账后系统会继续更新支付状态。",
    };
  });
}

export function setOrderPaymentConfirming(orderId: string) {
  return replaceOrder(orderId, (order) => {
    const updatedAt = formatDateTime(new Date());

    return {
      ...order,
      ...createMockPaymentInfo(order),
      updatedAt,
      paymentStatus: "payment_confirming",
      summary:
        "支付已提交，系统正在确认到账情况。确认完成后，订单将进入正式处理流程。",
    };
  });
}

export function markOrderPaid(orderId: string) {
  return replaceOrder(orderId, (order) => {
    const paidAtDate = new Date();
    const updatedAt = formatDateTime(paidAtDate);

    return {
      ...order,
      ...createMockPaymentInfo(order),
      updatedAt,
      paymentStatus: "paid",
      paidAt: updatedAt,
      receivedAmount: order.paymentAmount ?? order.amount,
      progress: Math.max(order.progress, 12),
      tgDispatchStatus: "tg_ready",
      tgGeneratedAt: updatedAt,
      tgTaskCode: order.tgTaskCode ?? generateTgTaskCode(getAllOrders(), paidAtDate),
      tgTemplateVersion: "tg-task-template-v1",
      summary:
        "支付已完成，订单已进入处理流程。你可以通过订单查询页或用户后台继续跟踪后续进度。",
    };
  });
}

export function markOrderPaidMock(orderId: string) {
  return replaceOrder(orderId, (order) => {
    const paidAtDate = new Date();
    const updatedAt = formatDateTime(paidAtDate);

    return {
      ...order,
      ...createMockPaymentInfo(order),
      updatedAt,
      status: "running",
      progress: Math.max(order.progress, 12),
      paymentStatus: "paid_mock",
      paidAt: updatedAt,
      receivedAmount: order.paymentAmount ?? order.amount,
      tgDispatchStatus: "tg_ready",
      tgGeneratedAt: updatedAt,
      tgTaskCode: order.tgTaskCode ?? generateTgTaskCode(getAllOrders(), paidAtDate),
      tgTemplateVersion: "tg-task-template-v1",
      summary:
        "当前为测试支付模式，订单已进入内部处理流程，后续将继续更新执行进度。",
      timeline: syncTimeline(order, "running", updatedAt),
    };
  });
}

export function updateOrderTgDispatchStatus(
  orderId: string,
  tgDispatchStatus: TgDispatchStatus,
) {
  return replaceOrder(orderId, (order) => {
    const updatedAt = formatDateTime(new Date());

    return {
      ...order,
      updatedAt,
      tgDispatchStatus,
      tgGeneratedAt:
        tgDispatchStatus === "tg_ready" ? updatedAt : order.tgGeneratedAt,
      tgDispatchedAt:
        tgDispatchStatus === "tg_dispatched"
          ? updatedAt
          : order.tgDispatchedAt,
      tgDispatchError:
        tgDispatchStatus === "tg_failed"
          ? order.tgDispatchError ?? "Mock dispatch failed."
          : undefined,
      tgMessageId:
        tgDispatchStatus === "tg_dispatched"
          ? order.tgMessageId ?? `mock-msg-${order.id.toLowerCase()}`
          : order.tgMessageId,
    };
  });
}

export function markOrderTgDispatched(orderId: string, messageId?: string) {
  return replaceOrder(orderId, (order) => {
    const updatedAt = formatDateTime(new Date());

    return {
      ...order,
      updatedAt,
      tgDispatchStatus: "tg_dispatched",
      tgDispatchedAt: updatedAt,
      tgMessageId: messageId ?? order.tgMessageId ?? `tg-${order.id}`,
      tgDispatchError: undefined,
    };
  });
}

export function markOrderTgFailed(orderId: string, error: string) {
  return replaceOrder(orderId, (order) => ({
    ...order,
    updatedAt: formatDateTime(new Date()),
    tgDispatchStatus: "tg_failed",
    tgDispatchError: error,
  }));
}

const orderTargetLinkKeys = [
  "targetUrl",
  "contentUrl",
  "groupUrl",
  "accountUrl",
  "postUrl",
  "campaignUrl",
  "repoUrl",
  "siteUrl",
  "appUrl",
  "appStoreUrl",
  "playStoreUrl",
];

function cleanOrderFormValues(formValues?: Record<string, string>) {
  if (!formValues) {
    return undefined;
  }

  const entries = Object.entries(formValues)
    .filter(([key]) => key !== "queryPassword")
    .map(([key, value]) => [key, value.trim()] as const)
    .filter(([, value]) => value.length > 0);

  return entries.length ? Object.fromEntries(entries) : undefined;
}

function getTargetLinkFromFormValues(formValues?: Record<string, string>) {
  for (const key of orderTargetLinkKeys) {
    const value = formValues?.[key]?.trim();

    if (value) {
      return value;
    }
  }

  return undefined;
}

export function createOrderFromService(
  service: Service,
  queryPassword: string,
  selectedPackage?: ServicePackage | null,
  formValues?: Record<string, string>,
): Order {
  const now = new Date();
  const resolvedDeliveryTime =
    selectedPackage?.deliveryTime ?? service.deliveryTime;
  const estimatedCompletionDate = new Date(
    now.getTime() + parseDeliveryHours(resolvedDeliveryTime) * 60 * 60 * 1000,
  );
  const randomSegment = Math.random().toString(36).slice(2, 5).toUpperCase();
  const orderId = `AV${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate(),
  )}${randomSegment}`;
  const createdAt = formatDateTime(now);
  const cleanedFormValues = cleanOrderFormValues(formValues);
  const packageSummary = selectedPackage
    ? `已选择 ${selectedPackage.label}，对应结果为 ${selectedPackage.result}。`
    : "";

  return normalizeOrder({
    id: orderId,
    serviceName: service.name,
    serviceSlug: service.slug,
    status: "pending",
    amount: selectedPackage?.price ?? service.price,
    progress: 0,
    createdAt,
    updatedAt: createdAt,
    estimatedCompletion: formatDateTime(estimatedCompletionDate),
    queryPassword,
    summary: `当前订单已生成，等待完成支付后进入处理流程。${packageSummary}`,
    timeline: [
      { label: "订单已创建", time: createdAt, done: true },
      { label: "已进入执行队列", time: "待更新", done: false },
      { label: "执行中", time: "待更新", done: false },
      { label: "已完成", time: "待更新", done: false },
    ],
    selectedPackageId: selectedPackage?.id,
    selectedPackageLabel: selectedPackage?.label,
    selectedPackagePrice: selectedPackage?.price,
    selectedPackageResult: selectedPackage?.result,
    selectedPackageDeliveryTime: selectedPackage?.deliveryTime,
    deliveryTime: resolvedDeliveryTime,
    formValues: cleanedFormValues,
    targetLink: getTargetLinkFromFormValues(cleanedFormValues),
    additionalRequirement: cleanedFormValues?.extraRequirements,
    contact: cleanedFormValues?.contact,
    paymentProvider: "unipay",
    paymentMethod: "crypto",
    paymentStatus: "pending_payment",
    paymentAmount: selectedPackage?.price ?? service.price,
    tgDispatchStatus: "tg_pending",
    tgTaskType: service.slug,
    tgTargetChannel: DEFAULT_TG_CHANNEL,
  });
}


