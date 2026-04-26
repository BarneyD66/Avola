import { normalizeRedisHash, redisCommand } from "@/lib/redis";

export type PendingPaymentSession = {
  orderId: string;
  tgMessage: string;
  createdAt: number;
  dispatchedAt?: number;
  targetParticipants?: number;
};

type PaymentSessionGlobal = typeof globalThis & {
  __realjoinPaymentSessions?: Map<string, PendingPaymentSession>;
  __realjoinTaskCodeCounters?: Record<string, number>;
  __realjoinTelegramDispatchLocks?: Set<string>;
};

const globalForSessions = globalThis as PaymentSessionGlobal;

const emptyValue = "__empty__";

function getPaymentSessionKey(orderId: string) {
  return `realjoin:payment-session:${orderId}`;
}

function getPaymentDispatchLockKey(orderId: string) {
  return `realjoin:payment-dispatch-lock:${orderId}`;
}

function getSessionMap() {
  globalForSessions.__realjoinPaymentSessions ??= new Map();
  return globalForSessions.__realjoinPaymentSessions;
}

function serializeOptionalValue(value?: string | number) {
  return value === undefined || value === null ? emptyValue : String(value);
}

function parseOptionalValue(value?: string) {
  return !value || value === emptyValue ? undefined : value;
}

function parseStoredSession(
  value: Record<string, string> | null,
): PendingPaymentSession | null {
  if (!value || Object.keys(value).length === 0 || !value.orderId || !value.tgMessage) {
    return null;
  }

  return {
    orderId: value.orderId,
    tgMessage: value.tgMessage,
    createdAt: Number(value.createdAt || Date.now()),
    dispatchedAt: parseOptionalValue(value.dispatchedAt)
      ? Number(value.dispatchedAt)
      : undefined,
    targetParticipants: parseOptionalValue(value.targetParticipants)
      ? Number(value.targetParticipants)
      : undefined,
  };
}

async function saveRedisPendingPaymentSession(session: PendingPaymentSession) {
  await redisCommand(
    "hset",
    getPaymentSessionKey(session.orderId),
    "orderId",
    session.orderId,
    "tgMessage",
    session.tgMessage,
    "createdAt",
    session.createdAt,
    "dispatchedAt",
    serializeOptionalValue(session.dispatchedAt),
    "targetParticipants",
    serializeOptionalValue(session.targetParticipants),
  );
}

async function getRedisPendingPaymentSession(orderId: string) {
  const hash = normalizeRedisHash(
    await redisCommand<unknown>("hgetall", getPaymentSessionKey(orderId)),
  );

  return parseStoredSession(hash);
}

function getDatePart(date: Date) {
  return `${date.getMonth() + 1}${date.getDate().toString().padStart(2, "0")}`;
}

export function generatePaymentTaskCode(date = new Date()) {
  globalForSessions.__realjoinTaskCodeCounters ??= {};
  const datePart = getDatePart(date);
  const nextValue = (globalForSessions.__realjoinTaskCodeCounters[datePart] ?? 0) + 1;
  globalForSessions.__realjoinTaskCodeCounters[datePart] = nextValue;

  return `${datePart}${nextValue.toString().padStart(2, "0")}`;
}

export async function savePendingPaymentSession(session: PendingPaymentSession) {
  getSessionMap().set(session.orderId, session);
  await saveRedisPendingPaymentSession(session);
}

export async function getPendingPaymentSession(orderId: string) {
  return getSessionMap().get(orderId) ?? (await getRedisPendingPaymentSession(orderId));
}

export async function markPendingPaymentSessionDispatched(orderId: string) {
  const session = await getPendingPaymentSession(orderId);

  if (!session) {
    return null;
  }

  const nextSession = {
    ...session,
    dispatchedAt: Date.now(),
  };

  getSessionMap().set(orderId, nextSession);
  await saveRedisPendingPaymentSession(nextSession);
  return nextSession;
}

function getDispatchLocks() {
  globalForSessions.__realjoinTelegramDispatchLocks ??= new Set();
  return globalForSessions.__realjoinTelegramDispatchLocks;
}

export async function reserveTelegramDispatch(orderId: string) {
  const redisReserved = await redisCommand<string>(
    "set",
    getPaymentDispatchLockKey(orderId),
    "1",
    "nx",
    "ex",
    600,
  );

  if (redisReserved !== null) {
    return redisReserved === "OK";
  }

  const locks = getDispatchLocks();

  if (locks.has(orderId)) {
    return false;
  }

  locks.add(orderId);
  return true;
}

export async function releaseTelegramDispatch(orderId: string) {
  await redisCommand("del", getPaymentDispatchLockKey(orderId));
  getDispatchLocks().delete(orderId);
}
