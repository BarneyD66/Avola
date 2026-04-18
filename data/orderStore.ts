import { seedOrders } from "@/data/mockOrders";
import type { Service, ServicePackage } from "@/data/services";

export type OrderStatus =
  | "pending"
  | "running"
  | "reviewing"
  | "completed"
  | "issue";

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
};

export const ORDER_STORAGE_KEY = "avola-orders";
const ORDER_STORE_EVENT = "avola-orders-updated";
const SIMULATION_COOLDOWN_MS = 800;
const simulationTimestamps = new Map<string, number>();
const ORDER_TIMELINE_LABELS = [
  "订单已创建",
  "已进入执行队列",
  "执行中",
  "审核中",
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
  reviewing: {
    label: "审核中",
    description: "当前订单已进入结果核验阶段。",
    className: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  },
  completed: {
    label: "已完成",
    description: "当前订单已完成交付。",
    className: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  },
  issue: {
    label: "异常处理中",
    description: "当前订单存在异常，正在处理。",
    className: "border-rose-300/20 bg-rose-300/10 text-rose-100",
  },
} satisfies Record<
  OrderStatus,
  { label: string; description: string; className: string }
>;

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function formatDateTime(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
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

function readStoredOrders() {
  if (!canUseStorage()) {
    return [...seedOrders];
  }

  const rawValue = localStorage.getItem(ORDER_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Order[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStoredOrders(orders: Order[]) {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
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

  if (!canUseStorage()) {
    return [...seedOrders];
  }

  writeStoredOrders(seedOrders);
  return [...seedOrders];
}

export function getAllOrders() {
  return ensureOrdersInitialized();
}

export function getOrderById(id: string) {
  return getAllOrders().find((order) => order.id === id) ?? null;
}

export function addOrder(order: Order) {
  const orders = getAllOrders();
  writeStoredOrders([order, ...orders]);
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
    case "reviewing":
      return "当前订单已进入结果核验阶段，系统会在核验完成后更新最终状态。";
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
      nextStatus === "running" ||
      nextStatus === "reviewing" ||
      nextStatus === "completed" ||
      nextStatus === "issue",
    执行中:
      nextStatus === "running" ||
      nextStatus === "reviewing" ||
      nextStatus === "completed" ||
      nextStatus === "issue",
    审核中: nextStatus === "reviewing" || nextStatus === "completed",
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
  if (order.status === "completed" || order.status === "issue") {
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
    const shouldMoveToReviewing =
      nextProgress >= 92 || (nextProgress >= 80 && shouldAdvance(0.35));

    if (shouldMoveToReviewing) {
      return {
        ...order,
        status: "reviewing",
        progress: Math.max(85, nextProgress),
        updatedAt: nextUpdatedAt,
        summary: getSummaryByStatus("reviewing"),
        timeline: syncTimeline(order, "reviewing", nextUpdatedAt),
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

  if (order.status === "reviewing") {
    const nextProgress = Math.min(99, order.progress + randomInt(3, 8));
    const shouldComplete = nextProgress >= 96 || shouldAdvance(0.45);

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
      summary: getSummaryByStatus("reviewing"),
      timeline: syncTimeline(order, "reviewing", nextUpdatedAt),
    };
  }

  return order;
}

export function simulateOrdersProgress(targetOrderId?: string) {
  const orders = getAllOrders();
  let hasChanged = false;

  const nextOrders: Order[] = orders.map((order) => {
    if (targetOrderId && order.id !== targetOrderId) {
      return order;
    }

    const nextOrder = advanceOrder(order);

    if (nextOrder !== order) {
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

export function createOrderFromService(
  service: Service,
  queryPassword: string,
  selectedPackage?: ServicePackage | null,
): Order {
  const now = new Date();
  const resolvedDeliveryTime =
    selectedPackage?.deliveryTime ?? service.deliveryTime;
  const estimatedCompletionDate = new Date(
    now.getTime() + parseDeliveryHours(resolvedDeliveryTime) * 60 * 60 * 1000,
  );
  const randomSegment = Math.random().toString(36).slice(2, 5).toUpperCase();
  const orderId = `AV${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${randomSegment}`;
  const createdAt = formatDateTime(now);
  const packageSummary = selectedPackage
    ? `已选择 ${selectedPackage.label}，对应结果为 ${selectedPackage.result}。`
    : "";

  return {
    id: orderId,
    serviceName: service.name,
    serviceSlug: service.slug,
    status: "pending",
    amount: selectedPackage?.price ?? service.price,
    progress: 12,
    createdAt,
    updatedAt: createdAt,
    estimatedCompletion: formatDateTime(estimatedCompletionDate),
    queryPassword,
    summary: `当前订单已生成并进入待开始状态。${packageSummary}请稍后查看后续进度更新。`,
    timeline: [
      { label: "订单已创建", time: createdAt, done: true },
      { label: "已进入执行队列", time: "待更新", done: false },
      { label: "执行中", time: "待更新", done: false },
      { label: "审核中", time: "待更新", done: false },
      { label: "已完成", time: "待更新", done: false },
    ],
    selectedPackageId: selectedPackage?.id,
    selectedPackageLabel: selectedPackage?.label,
    selectedPackagePrice: selectedPackage?.price,
    selectedPackageResult: selectedPackage?.result,
  };
}
