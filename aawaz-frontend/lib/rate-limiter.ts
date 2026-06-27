/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for single-instance deploys. Swap for Redis for multi-instance.
 */

interface WindowEntry {
  count: number
  resetAt: number
}

const store = new Map<string, WindowEntry>()

const CLEANUP_INTERVAL = 60_000 // every 60s
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) store.delete(key)
  }
}

export function rateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
): { allowed: boolean; remaining: number; resetIn: number } {
  cleanup()

  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowSeconds }
  }

  if (entry.count >= maxRequests) {
    const resetIn = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, resetIn }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: Math.ceil((entry.resetAt - now) / 1000) }
}
