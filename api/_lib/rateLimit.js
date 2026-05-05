import { getRedis, todayKey } from './redis.js'

export async function checkRateLimit(ip) {
  const limit = parseInt(process.env.RATE_LIMIT_PER_DAY || '150', 10)
  const redis = getRedis()
  const key = todayKey(`ratelimit:${ip}`)
  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, 43200)
  }
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    count,
    limit,
  }
}
