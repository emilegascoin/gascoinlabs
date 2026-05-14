import { verifyTurnstile } from './_lib/turnstile.js'
import { checkContactRateLimit } from './_lib/contactRateLimit.js'
import { sendToDiscord } from './_lib/discord.js'
import { captureError } from './_lib/sentry.js'

const TOO_LARGE_BYTES = 8 * 1024
const DELIVERY_ERROR = 'Could not deliver right now. Email emilegascoin@gmail.com direct.'

const RATE_LIMIT_MESSAGES = {
  ip_hour: 'You have submitted too many enquiries this hour. Try again later.',
  ip_day: "You have hit today's submission limit. Try again tomorrow or email emilegascoin@gmail.com direct.",
  redis_unavailable: 'Submission temporarily unavailable. Email emilegascoin@gmail.com direct.',
}

// IP extraction: prefer x-real-ip (Vercel sets this to the trusted client IP).
// If absent, fall back to the LAST entry of x-forwarded-for — Vercel appends
// the real client IP at the end of the chain; the leftmost is user-supplied
// and spoofable, so taking [0] would let a spammer rotate the header to dodge
// rate limits.
function getIp(req) {
  const real = req.headers['x-real-ip']
  if (typeof real === 'string' && real.trim()) return real.trim()
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.trim()) {
    const parts = fwd.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length) return parts[parts.length - 1]
  }
  return 'unknown'
}

function anonymizeIp(ip) {
  if (typeof ip !== 'string') return 'unknown'
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
    return ip.split('.').slice(0, 3).join('.') + '.0'
  }
  return ip || 'unknown'
}

function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.json(body)
}

function hasControlChars(value) {
  // The whole point of this regex is to detect control chars in submitted
  // strings, so the lint rule's warning is exactly backwards here.
  // eslint-disable-next-line no-control-regex
  return /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(value)
}

function findInvalidString(value, path = 'body', seen = new Set()) {
  if (typeof value === 'string') {
    return hasControlChars(value) ? path : null
  }
  if (!value || typeof value !== 'object') return null
  if (seen.has(value)) return null
  seen.add(value)

  for (const [key, child] of Object.entries(value)) {
    const invalid = findInvalidString(child, `${path}.${key}`, seen)
    if (invalid) return invalid
  }

  return null
}

function validateString(value, field, { required = false, min = 0, max, pattern } = {}) {
  if (value === undefined || value === null) {
    if (required) return { error: `${field} is required.`, field }
    return { value: '' }
  }
  if (typeof value !== 'string') return { error: `${field} must be a string.`, field }
  if (hasControlChars(value)) return { error: `${field} contains invalid characters.`, field }

  const trimmed = value.trim()
  if (required && trimmed.length < min) return { error: `${field} is required.`, field }
  if (trimmed.length < min) return { error: `${field} is too short.`, field }
  if (max !== undefined && trimmed.length > max) return { error: `${field} is too long.`, field }
  if (pattern && !pattern.test(trimmed)) return { error: `${field} is invalid.`, field }

  return { value: trimmed }
}

function validateEmail(value) {
  const validated = validateString(value, 'email', { required: true, min: 1, max: 254 })
  if (validated.error) return validated

  const email = validated.value
  const parts = email.split('@')
  if (parts.length !== 2 || !parts[0] || !parts[1] || !parts[1].includes('.')) {
    return { error: 'email is invalid.', field: 'email' }
  }

  return { value: email }
}

function validateBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body.' }
  }

  const name = validateString(body.name, 'name', { required: true, min: 1, max: 100 })
  if (name.error) return name

  const email = validateEmail(body.email)
  if (email.error) return email

  const company = validateString(body.company, 'company', { max: 150 })
  if (company.error) return company

  const scope = validateString(body.scope, 'scope', { required: true, min: 10, max: 4000 })
  if (scope.error) return scope

  const source = validateString(body.source, 'source', { max: 50, pattern: /^[A-Za-z0-9-]*$/ })
  if (source.error) return source

  if (body.turnstileToken !== undefined && body.turnstileToken !== null) {
    const token = validateString(body.turnstileToken, 'turnstileToken')
    if (token.error) return token
  }

  return {
    value: {
      name: name.value,
      email: email.value,
      company: company.value,
      scope: scope.value,
      source: source.value,
    },
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method not allowed' })
      return
    }

    if (process.env.CONTACT_FORM_ENABLED === 'false') {
      sendJson(res, 503, { error: 'Contact form is disabled.' })
      return
    }

    const body = req.body
    const ip = getIp(req)

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      sendJson(res, 400, { error: 'Invalid request body.' })
      return
    }

    if (typeof body.website === 'string' && body.website.trim()) {
      sendJson(res, 200, { ok: true })
      return
    }

    const invalidString = findInvalidString(body)
    if (invalidString) {
      sendJson(res, 400, { error: 'Request contains invalid characters.', field: invalidString })
      return
    }

    const payloadBytes = Buffer.byteLength(JSON.stringify(body), 'utf8')
    const validated = validateBody(body)
    if (validated.error) {
      const response = validated.field
        ? { error: validated.error, field: validated.field }
        : { error: validated.error }
      sendJson(res, 400, response)
      return
    }

    if (payloadBytes > TOO_LARGE_BYTES) {
      sendJson(res, 413, { error: 'Payload too large.' })
      return
    }

    const { name, email, company, scope, source } = validated.value
    const linkCount = (scope.match(/https?:\/\//gi) || []).length
    if (linkCount > 5) {
      sendJson(res, 400, { error: 'Too many links.' })
      return
    }

    const { turnstileToken } = body
    if (!turnstileToken) {
      sendJson(res, 403, { error: 'Bot check required.' })
      return
    }

    const turnstileOk = await verifyTurnstile(turnstileToken, ip)
    if (!turnstileOk) {
      console.warn('Turnstile verification failed for IP:', anonymizeIp(ip))
      sendJson(res, 403, { error: 'Looks like a bot.' })
      return
    }

    const rl = await checkContactRateLimit({ ip })
    if (!rl.allowed) {
      const reason = RATE_LIMIT_MESSAGES[rl.reason] || RATE_LIMIT_MESSAGES.redis_unavailable
      sendJson(res, 429, { error: reason, reason: rl.reason })
      return
    }

    const result = await sendToDiscord({ name, email, company, scope, source: source || 'form' })
    if (result.ok) {
      sendJson(res, 200, { ok: true })
      return
    }

    if (result.status === 429) {
      captureError(new Error('Discord delivery rate limited'), {
        ip: anonymizeIp(ip),
        status: result.status,
        error: 'discord_rate_limited',
      })
      sendJson(res, 502, { error: DELIVERY_ERROR })
      return
    }

    captureError(new Error('Discord delivery failed'), {
      ip: anonymizeIp(ip),
      status: result.status,
      error: result.error || 'discord_failure',
    })
    sendJson(res, 502, { error: DELIVERY_ERROR })
  } catch (err) {
    captureError(err, {
      ip: anonymizeIp(getIp(req)),
      status: 500,
      error: 'unexpected',
    })
    sendJson(res, 500, { error: 'Something went wrong.' })
  }
}
