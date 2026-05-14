const TIMEOUT_MS = 5000
const FIELD_VALUE_LIMIT = 1024
const SCOPE_LIMIT = 1000

function sanitizeInput(value) {
  return String(value || '')
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, '$1 ($2)')
    .replace(/@everyone/gi, '@\u200beveryone')
    .replace(/@here/gi, '@\u200bhere')
    .replace(/<@&/g, '<@\u200b&')
    .replace(/<@/g, '<@\u200b')
    .replace(/`/g, '\\`')
    .trim()
}

function truncate(value, limit) {
  if (value.length <= limit) return value
  return value.slice(0, limit)
}

function fieldValue(value, limit = FIELD_VALUE_LIMIT) {
  const sanitized = sanitizeInput(value)
  return truncate(sanitized, limit) || 'Not provided'
}

function scopeValue(value) {
  const sanitized = sanitizeInput(value)
  if (!sanitized) return 'Not provided'
  if (sanitized.length <= SCOPE_LIMIT) return sanitized
  return `${sanitized.slice(0, SCOPE_LIMIT)}... (truncated)`
}

function retryAfterFrom(res) {
  const value = res.headers.get('retry-after')
  const seconds = Number(value)
  return Number.isFinite(seconds) ? seconds : undefined
}

export async function sendToDiscord({ name, email, company, scope, source }) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return { ok: false, status: 0, error: 'unconfigured' }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Belt-and-braces: Discord-side enforcement that no mentions ever fire.
        // The string sanitizer above is the first line of defense; this is the
        // second — Discord will ignore any @everyone/@here/role/user mention
        // syntax that somehow slipped through.
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: 'New contact form submission',
            color: 0x2563eb,
            timestamp: new Date().toISOString(),
            fields: [
              { name: 'Name', value: fieldValue(name), inline: true },
              { name: 'Email', value: fieldValue(email), inline: true },
              { name: 'Company', value: fieldValue(company), inline: true },
              { name: 'Source', value: fieldValue(source), inline: true },
              { name: 'Scope', value: scopeValue(scope), inline: false },
            ],
          },
        ],
      }),
      signal: controller.signal,
    })

    if (res.status === 200 || res.status === 204) {
      let messageId
      if (res.status === 200) {
        try {
          const data = await res.json()
          messageId = data && data.id
        } catch {
          messageId = undefined
        }
      }
      return messageId ? { ok: true, messageId } : { ok: true }
    }

    if (res.status === 429) {
      return { ok: false, status: 429, retryAfter: retryAfterFrom(res) }
    }

    return { ok: false, status: res.status }
  } catch (err) {
    if (err && err.name === 'AbortError') {
      return { ok: false, status: 0, error: 'timeout' }
    }
    return { ok: false, status: 0, error: 'network' }
  } finally {
    clearTimeout(timeout)
  }
}
