import { getRedis } from './redis.js'

const LOG_KEY = 'chatlog'
const MAX_ENTRIES = 500

// Vercel injects these headers at the edge — free location data, no GeoIP lookup needed
function getLocation(req) {
  const country = req.headers['x-vercel-ip-country'] || ''
  const city = req.headers['x-vercel-ip-city'] || ''
  const region = req.headers['x-vercel-ip-region'] || ''
  const parts = [city, region, country].filter(Boolean)
  return parts.join(', ') || 'unknown'
}


// timing: { ttft_ms, total_ms, chars } — all optional, omitted if stream errored
export async function logChat(req, message, timing = {}) {
  try {
    const redis = getRedis()
    const now = new Date()
    const ts = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
    const entry = JSON.stringify({
      ts,
      location: getLocation(req),
      message: message.slice(0, 500),
      ...timing,
    })
    await redis.lpush(LOG_KEY, entry)
    await redis.ltrim(LOG_KEY, 0, MAX_ENTRIES - 1)
  } catch (err) {
    // Never let logging failures affect the actual response
    console.error('chatLog failed:', err)
  }
}
