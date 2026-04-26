type RedisCommandResult<T> = {
  result?: T;
  error?: string;
};

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ""),
    token,
  };
}

export function isRedisConfigured() {
  return Boolean(getRedisConfig());
}

export async function redisCommand<T>(
  command: string,
  ...args: Array<string | number>
) {
  const config = getRedisConfig();

  if (!config) {
    return null;
  }

  const path = [command, ...args.map((arg) => encodeURIComponent(String(arg)))]
    .join("/");
  const response = await fetch(`${config.url}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
    cache: "no-store",
  });
  const payload = (await response.json()) as RedisCommandResult<T>;

  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? "Redis command failed.");
  }

  return payload.result as T;
}

export function normalizeRedisHash(value: unknown) {
  if (!value) {
    return null;
  }

  if (!Array.isArray(value) && typeof value === "object") {
    return value as Record<string, string>;
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const entries: Array<[string, string]> = [];

  for (let index = 0; index < value.length; index += 2) {
    const key = value[index];
    const fieldValue = value[index + 1];

    if (typeof key === "string") {
      entries.push([key, String(fieldValue ?? "")]);
    }
  }

  return Object.fromEntries(entries);
}
