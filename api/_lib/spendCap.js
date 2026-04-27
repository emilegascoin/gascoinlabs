import { getRedis, todayKey } from './redis.js'

const KEY = () => todayKey('spend')

export async function checkSpendCap() {
  const cap = parseFloat(process.env.DAILY_SPEND_CAP_USD || '1')
  const redis = getRedis()
  const raw = await redis.get(KEY())
  const spent = raw ? parseFloat(raw) : 0
  return { allowed: spent < cap, spent, cap }
}

export async function recordSpend(costUsd) {
  if (!costUsd || costUsd <= 0) return
  const redis = getRedis()
  await redis.incrbyfloat(KEY(), costUsd)
  await redis.expire(KEY(), 86400)
}
