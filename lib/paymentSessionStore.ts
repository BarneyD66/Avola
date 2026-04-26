type PendingPaymentSession = {
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

function getSessionMap() {
  globalForSessions.__realjoinPaymentSessions ??= new Map();
  return globalForSessions.__realjoinPaymentSessions;
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

export function savePendingPaymentSession(session: PendingPaymentSession) {
  getSessionMap().set(session.orderId, session);
}

export function getPendingPaymentSession(orderId: string) {
  return getSessionMap().get(orderId);
}

export function markPendingPaymentSessionDispatched(orderId: string) {
  const session = getPendingPaymentSession(orderId);

  if (!session) {
    return null;
  }

  const nextSession = {
    ...session,
    dispatchedAt: Date.now(),
  };

  getSessionMap().set(orderId, nextSession);
  return nextSession;
}

function getDispatchLocks() {
  globalForSessions.__realjoinTelegramDispatchLocks ??= new Set();
  return globalForSessions.__realjoinTelegramDispatchLocks;
}

export function reserveTelegramDispatch(orderId: string) {
  const locks = getDispatchLocks();

  if (locks.has(orderId)) {
    return false;
  }

  locks.add(orderId);
  return true;
}

export function releaseTelegramDispatch(orderId: string) {
  getDispatchLocks().delete(orderId);
}
