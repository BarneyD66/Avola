import { normalizeRedisHash, redisCommand } from "@/lib/redis";

type RaffleSession = {
  orderId: string;
  chatId: string;
  taskMessageId?: string;
  raffleMessageId?: string;
  targetParticipants: number;
  participantIds: number[];
  createdAt: number;
  updatedAt: number;
};

type RaffleGlobal = typeof globalThis & {
  __realjoinRaffleSessions?: Map<string, RaffleSession>;
};

const globalForRaffles = globalThis as RaffleGlobal;

function getRaffleKey(orderId: string) {
  return `realjoin:raffle:${orderId}`;
}

function getRaffleParticipantsKey(orderId: string) {
  return `realjoin:raffle:${orderId}:participants`;
}

function getRaffleMap() {
  globalForRaffles.__realjoinRaffleSessions ??= new Map();
  return globalForRaffles.__realjoinRaffleSessions;
}

export function parseParticipantTarget(value?: string | number | null) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  const matched = String(value ?? "").match(/\d[\d,]*/);

  if (!matched) {
    return 0;
  }

  return Number(matched[0].replace(/,/g, ""));
}

function parseStoredSession(
  orderId: string,
  value: Record<string, string> | null,
): Omit<RaffleSession, "participantIds"> | null {
  if (!value || Object.keys(value).length === 0) {
    return null;
  }

  return {
    orderId,
    chatId: value.chatId ?? "",
    taskMessageId: value.taskMessageId || undefined,
    raffleMessageId: value.raffleMessageId || undefined,
    targetParticipants: parseParticipantTarget(value.targetParticipants),
    createdAt: Number(value.createdAt || Date.now()),
    updatedAt: Number(value.updatedAt || Date.now()),
  };
}

async function getRedisSession(orderId: string) {
  const hash = normalizeRedisHash(
    await redisCommand<unknown>("hgetall", getRaffleKey(orderId)),
  );
  return parseStoredSession(orderId, hash);
}

async function saveRedisSession(
  session: Omit<RaffleSession, "participantIds">,
) {
  await redisCommand(
    "hset",
    getRaffleKey(session.orderId),
    "orderId",
    session.orderId,
    "chatId",
    session.chatId,
    "taskMessageId",
    session.taskMessageId ?? "",
    "raffleMessageId",
    session.raffleMessageId ?? "",
    "targetParticipants",
    session.targetParticipants,
    "createdAt",
    session.createdAt,
    "updatedAt",
    session.updatedAt,
  );
}

export async function createRaffleSession({
  orderId,
  chatId,
  taskMessageId,
  raffleMessageId,
  targetParticipants,
}: {
  orderId: string;
  chatId: string;
  taskMessageId?: string;
  raffleMessageId?: string;
  targetParticipants?: number;
}) {
  const now = Date.now();
  const existing = getRaffleMap().get(orderId);
  const redisExisting = await getRedisSession(orderId);
  const baseCreatedAt = redisExisting?.createdAt ?? existing?.createdAt ?? now;
  const resolvedTarget =
    targetParticipants ??
    redisExisting?.targetParticipants ??
    existing?.targetParticipants ??
    0;
  const session: RaffleSession = {
    orderId,
    chatId,
    taskMessageId,
    raffleMessageId,
    targetParticipants: resolvedTarget,
    participantIds: existing?.participantIds ?? [],
    createdAt: baseCreatedAt,
    updatedAt: now,
  };

  getRaffleMap().set(orderId, session);
  await saveRedisSession(session);
  return session;
}

export async function updateRaffleMessageId(
  orderId: string,
  raffleMessageId?: string,
) {
  const session = getRaffleMap().get(orderId);
  const redisSession = await getRedisSession(orderId);

  if (!session && !redisSession) {
    return null;
  }

  const nextSession = {
    orderId,
    chatId: session?.chatId ?? redisSession?.chatId ?? "",
    taskMessageId: session?.taskMessageId ?? redisSession?.taskMessageId,
    raffleMessageId,
    targetParticipants:
      session?.targetParticipants ?? redisSession?.targetParticipants ?? 0,
    participantIds: session?.participantIds ?? [],
    createdAt: session?.createdAt ?? redisSession?.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  };

  getRaffleMap().set(orderId, nextSession);
  await saveRedisSession(nextSession);
  return nextSession;
}

export async function recordRaffleParticipant({
  orderId,
  chatId,
  raffleMessageId,
  participantId,
}: {
  orderId: string;
  chatId: string;
  raffleMessageId?: string;
  participantId: number;
}) {
  const now = Date.now();
  const existing = getRaffleMap().get(orderId);
  const redisSession = await getRedisSession(orderId);
  const added = await redisCommand<number>(
    "sadd",
    getRaffleParticipantsKey(orderId),
    participantId,
  );
  const redisCount = await redisCommand<number>(
    "scard",
    getRaffleParticipantsKey(orderId),
  );
  const alreadyParticipating =
    added === null ? Boolean(existing?.participantIds.includes(participantId)) : added === 0;
  const participantIds = existing?.participantIds ?? [];
  const nextParticipantIds =
    added === null && !alreadyParticipating
      ? [...participantIds, participantId]
      : participantIds;
  const count = redisCount ?? nextParticipantIds.length;

  const session: RaffleSession = {
    orderId,
    chatId: existing?.chatId ?? redisSession?.chatId ?? chatId,
    taskMessageId: existing?.taskMessageId ?? redisSession?.taskMessageId,
    raffleMessageId:
      existing?.raffleMessageId ?? redisSession?.raffleMessageId ?? raffleMessageId,
    targetParticipants:
      existing?.targetParticipants ?? redisSession?.targetParticipants ?? 0,
    participantIds: nextParticipantIds,
    createdAt: existing?.createdAt ?? redisSession?.createdAt ?? now,
    updatedAt: now,
  };

  getRaffleMap().set(orderId, session);
  await saveRedisSession(session);

  return {
    session,
    count,
    alreadyParticipating,
  };
}

export async function getRaffleProgress(orderId: string) {
  const session = getRaffleMap().get(orderId);
  const redisSession = await getRedisSession(orderId);
  const redisCount = await redisCommand<number>(
    "scard",
    getRaffleParticipantsKey(orderId),
  );
  const targetParticipants =
    redisSession?.targetParticipants ?? session?.targetParticipants ?? 0;
  const currentParticipants = redisCount ?? session?.participantIds.length ?? 0;

  if (!session && !redisSession) {
    return null;
  }

  return {
    orderId,
    currentParticipants,
    targetParticipants,
    progress:
      targetParticipants > 0
        ? Math.min(
            100,
            Math.round((currentParticipants / targetParticipants) * 100),
          )
        : 0,
    updatedAt: redisSession?.updatedAt ?? session?.updatedAt ?? Date.now(),
  };
}

export function buildRaffleStatusMessage(count: number) {
  return [
    "Raffle has begun! Press the button below to participate. The winner will be randomly selected from the participants when an admin replies to this message. Good luck!",
    "",
    `Number of participants: ${count}`,
  ].join("\n");
}
