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

// Mask the last two octets of the IP for basic privacy
function maskIp(ip) {
  if (!ip || ip === 'unknown') return 'unknown'
  const parts = ip.split('.')
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.x.x`
  return ip.slice(0, 8) + '...' // IPv6 fallback
}

export async function logChat(req, message) {
  try {
    const redis = getRedis()
    const entry = JSON.stringify({
      ts: new Date().toISOString(),
      ip: maskIp(req.headers['x-forwarded-for']?.split(',')[0].trim() || req.headers['x-real-ip'] || 'unknown'),
      location: getLocation(req),
      referrer: req.headers['referer'] || req.headers['referrer'] || 'direct',
      message: message.slice(0, 500), // cap at 500 chars in case of anything odd
    })
    await redis.lpush(LOG_KEY, entry)
    await redis.ltrim(LOG_KEY, 0, MAX_ENTRIES - 1)
  } catch (err) {
    // Never let logging failures affect the actual response
    console.error('chatLog failed:', err)
  }
}
