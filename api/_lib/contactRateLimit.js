import { getRedis } from './redis.js'

const HOUR_TTL_SECONDS = 3600
// Full 24h so a "daily" counter survives until the date-partitioned key
// itself rotates at the next UTC midnight (a 12h TTL would let the counter
// reset within the same day).
const DAY_TTL_SECONDS = 86400

function hourKeyPart() {
  return new Date().toISOString().slice(0, 13).replace('T', '-')
}

function dayKeyPart() {
  return new Date().toISOString().slice(0, 10)
}

async function incrWithExpire(redis, key, ttl) {
  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, ttl)
  }
  return count
}

// Per-IP limits only. Per-email was removed because email is never verified —
// an attacker could spam victim@example.com to lock the real owner out of the
// form. Per-IP catches the same-attacker-many-emails pattern just as well.
export async function checkContactRateLimit({ ip }) {
  const ipPerHourLimit = parseInt(process.env.CONTACT_IP_PER_HOUR || '3', 10)
  const ipPerDayLimit = parseInt(process.env.CONTACT_IP_PER_DAY || '5', 10)

  try {
    const redis = getRedis()
    const hour = hourKeyPart()
    const day = dayKeyPart()

    const ipHourKey = `contact:ip:hour:${ip}:${hour}`
    const ipDayKey = `contact:ip:day:${ip}:${day}`

    const ipHourCount = await incrWithExpire(redis, ipHourKey, HOUR_TTL_SECONDS)
    const ipDayCount = await incrWithExpire(redis, ipDayKey, DAY_TTL_SECONDS)

    if (ipHourCount > ipPerHourLimit) {
      return { allowed: false, reason: 'ip_hour' }
    }
    if (ipDayCount > ipPerDayLimit) {
      return { allowed: false, reason: 'ip_day' }
    }

    return { allowed: true }
  } catch (err) {
    console.warn('Contact rate limit unavailable', err)
    return { allowed: false, reason: 'redis_unavailable' }
  }
}
