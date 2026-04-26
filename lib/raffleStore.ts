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

export function createRaffleSession({
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
  const session: RaffleSession = {
    orderId,
    chatId,
    taskMessageId,
    raffleMessageId,
    targetParticipants: targetParticipants ?? existing?.targetParticipants ?? 0,
    participantIds: existing?.participantIds ?? [],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  getRaffleMap().set(orderId, session);
  return session;
}

export function updateRaffleMessageId(orderId: string, raffleMessageId?: string) {
  const session = getRaffleMap().get(orderId);

  if (!session) {
    return null;
  }

  const nextSession = {
    ...session,
    raffleMessageId,
    updatedAt: Date.now(),
  };

  getRaffleMap().set(orderId, nextSession);
  return nextSession;
}

export function recordRaffleParticipant({
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
  const participantIds = existing?.participantIds ?? [];
  const alreadyParticipating = participantIds.includes(participantId);
  const nextParticipantIds = alreadyParticipating
    ? participantIds
    : [...participantIds, participantId];

  const session: RaffleSession = {
    orderId,
    chatId: existing?.chatId ?? chatId,
    taskMessageId: existing?.taskMessageId,
    raffleMessageId: existing?.raffleMessageId ?? raffleMessageId,
    targetParticipants: existing?.targetParticipants ?? 0,
    participantIds: nextParticipantIds,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  getRaffleMap().set(orderId, session);

  return {
    session,
    count: nextParticipantIds.length,
    alreadyParticipating,
  };
}

export function getRaffleProgress(orderId: string) {
  const session = getRaffleMap().get(orderId);

  if (!session) {
    return null;
  }

  return {
    orderId: session.orderId,
    currentParticipants: session.participantIds.length,
    targetParticipants: session.targetParticipants,
    progress:
      session.targetParticipants > 0
        ? Math.min(
            100,
            Math.round((session.participantIds.length / session.targetParticipants) * 100),
          )
        : 0,
    updatedAt: session.updatedAt,
  };
}

export function buildRaffleStatusMessage(count: number) {
  return [
    "Raffle has begun! Press the button below to participate. The winner will be randomly selected from the participants when an admin replies to this message. Good luck!",
    "",
    `Number of participants: ${count}`,
  ].join("\n");
}
