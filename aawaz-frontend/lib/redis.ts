import Redis from "ioredis"

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

function createRedis(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url) return null

  try {
    const client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null
        return Math.min(times * 200, 2000)
      },
      lazyConnect: true,
    })

    client.on("error", (err) => {
      console.warn("[Redis] Connection error:", err.message)
    })

    return client
  } catch {
    console.warn("[Redis] Failed to create client. Running without cache.")
    return null
  }
}

export const redis = globalForRedis.redis ?? createRedis()

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis as Redis | undefined
}

export async function getCached<T>(key: string, ttl = 60): Promise<T | null> {
  if (!redis) return null
  try {
    const raw = await redis.get(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export async function setCache(key: string, data: unknown, ttl = 60): Promise<void> {
  if (!redis) return
  try {
    await redis.setex(key, ttl, JSON.stringify(data))
  } catch {
    // silent
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (!redis) return
  try {
    const keys = await redis.keys(pattern)
    if (keys.length) await redis.del(...keys)
  } catch {
    // silent
  }
}
