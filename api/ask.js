import { verifyTurnstile } from './_lib/turnstile.js'
import { checkRateLimit } from './_lib/rateLimit.js'
import { checkSpendCap, recordSpend } from './_lib/spendCap.js'
import { trimMessages } from './_lib/trimMessages.js'
import { logChat } from './_lib/chatLog.js'
import { captureError } from './_lib/sentry.js'
import { aiProvider } from '../src/lib/aiProvider.js'
import { buildSystemPrompt } from '../src/lib/claudeContext.js'

const FALLBACK_SPEND_CAP = "Ask Emile is taking a break for today. Email me at emilegascoin@gmail.com and I'll get back to you when I've had a think."
const SYSTEM_PROMPT = buildSystemPrompt()

function getIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string') return fwd.split(',')[0].trim()
  return req.headers['x-real-ip'] || 'unknown'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { message, history = [], turnstileToken } = req.body || {}
  const ip = getIp(req)

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Missing message' })
    return
  }

  // 1. Turnstile (smart check).
  //   Token provided AND fails  → block (likely a bot forging a token)
  //   Token provided AND passes → allow as verified
  //   No token at all           → allow (user's browser blocked the script,
  //                                spend cap is the backstop)
  if (turnstileToken) {
    const turnstileOk = await verifyTurnstile(turnstileToken, ip)
    if (!turnstileOk) {
      console.warn('Turnstile verification failed for IP:', ip)
      res.status(403).json({
        error: "Looks like a bot. If you're a real person try refreshing the page.",
      })
      return
    }
  } else {
    console.info('No Turnstile token provided for IP:', ip)
  }

  // 2 + 3. Rate limit and spend cap — run in parallel to cut Redis round trips
  const [rl, spend] = await Promise.all([checkRateLimit(ip), checkSpendCap()])

  if (!rl.allowed) {
    res.status(429).json({
      error: "You've hit today's limit. Email me at emilegascoin@gmail.com if you've got more questions.",
    })
    return
  }

  if (!spend.allowed) {
    res.status(200).setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.write(FALLBACK_SPEND_CAP)
    res.end()
    return
  }

  // 4. Token trim
  const allMessages = [...history, { role: 'user', content: message }]
  const { messages: trimmedMessages, trimmed } = trimMessages(allMessages, SYSTEM_PROMPT, 8000)

  // 5. Provider
  // Stream as Server-Sent Events. Safari aggressively buffers text/plain
  // streams (the previous 2KB whitespace pad wasn't enough to trip its
  // threshold reliably), but treats text/event-stream as a real-time feed
  // and renders chunks as they arrive. Chrome/Firefox handle either fine.
  //
  // Format per event: `data: ${JSON-encoded chunk}\n\n`. We JSON-encode so
  // chunks containing newlines don't break the SSE framing. The frontend
  // parses these on the way in.
  //
  // X-Accel-Buffering / no-transform stop reverse proxies and Vercel's edge
  // from buffering or gzipping the stream.
  res.status(200).setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('X-Accel-Buffering', 'no')
  res.setHeader('Connection', 'keep-alive')
  if (typeof res.flushHeaders === 'function') res.flushHeaders()
  // Initial comment line primes Safari to start streaming immediately.
  res.write(': stream open\n\n')

  function sendEvent(text) {
    res.write(`data: ${JSON.stringify(text)}\n\n`)
  }

  if (trimmed) sendEvent('(earlier messages trimmed)\n\n')

  let result
  const t0 = Date.now()
  let ttft_ms = null
  let chars = 0
  let streamErrored = false

  try {
    result = await aiProvider.send({ systemPrompt: SYSTEM_PROMPT, messages: trimmedMessages })
    for await (const chunk of result.stream) {
      if (ttft_ms === null) ttft_ms = Date.now() - t0
      chars += chunk.length
      sendEvent(chunk)
    }
  } catch (err) {
    streamErrored = true
    console.error('Provider error', err)
    captureError(err, { context: 'provider', ip })
    sendEvent('\n\nSomething went wrong on my end. Email me at emilegascoin@gmail.com.')
  } finally {
    res.end()
  }

  // 6. Log the question with timing — after stream so we have the numbers
  const timing = streamErrored ? {} : {
    ttft_s: ttft_ms !== null ? +(ttft_ms / 1000).toFixed(2) : null,
    total_s: +((Date.now() - t0) / 1000).toFixed(2),
    chars,
  }
  logChat(req, message, timing)

  // 7. Record spend (after stream complete)
  if (result?.getUsage) {
    try {
      const usage = result.getUsage()
      await recordSpend(usage.costUsd)
    } catch (err) {
      console.error('recordSpend failed', err)
    }
  }
}
