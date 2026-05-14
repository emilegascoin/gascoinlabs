import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./_lib/turnstile.js', () => ({ verifyTurnstile: vi.fn() }))
vi.mock('./_lib/contactRateLimit.js', () => ({ checkContactRateLimit: vi.fn() }))
vi.mock('./_lib/discord.js', () => ({ sendToDiscord: vi.fn() }))
vi.mock('./_lib/sentry.js', () => ({ captureError: vi.fn() }))

const { verifyTurnstile } = await import('./_lib/turnstile.js')
const { checkContactRateLimit } = await import('./_lib/contactRateLimit.js')
const { sendToDiscord } = await import('./_lib/discord.js')
const { captureError } = await import('./_lib/sentry.js')
const handler = (await import('./contact.js')).default

const VALID_BODY = {
  name: 'Alice',
  email: 'alice@example.com',
  company: 'Acme',
  scope: 'Need help with X for two weeks',
  turnstileToken: 'valid-token',
  website: '',
}

const DELIVERY_ERROR = 'Could not deliver right now. Email emilegascoin@gmail.com direct.'

function validBody(overrides = {}) {
  return { ...VALID_BODY, ...overrides }
}

function createReq(options = {}) {
  const method = options.method ?? 'POST'
  const body = Object.hasOwn(options, 'body') ? options.body : validBody()
  const ip = options.ip ?? '1.2.3.4'

  return {
    method,
    body,
    headers: { 'x-forwarded-for': ip },
  }
}

function createRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    status: vi.fn(function status(code) {
      this.statusCode = code
      return this
    }),
    setHeader: vi.fn(function setHeader(key, value) {
      this.headers[key] = value
      return this
    }),
    json: vi.fn(function json(body) {
      this.body = body
      return this
    }),
  }
  return res
}

async function callHandler(req) {
  const res = createRes()
  await handler(req, res)
  return res
}

describe('/api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.CONTACT_FORM_ENABLED
    verifyTurnstile.mockResolvedValue(true)
    checkContactRateLimit.mockResolvedValue({ allowed: true })
    sendToDiscord.mockResolvedValue({ ok: true })
  })

  it('returns 405 for GET', async () => {
    const res = await callHandler(createReq({ method: 'GET' }))

    expect(res.statusCode).toBe(405)
    expect(res.body).toEqual({ error: 'Method not allowed' })
  })

  it('returns 503 when contact form kill switch is disabled regardless of body', async () => {
    process.env.CONTACT_FORM_ENABLED = 'false'

    const res = await callHandler(createReq({ body: undefined }))

    expect(res.statusCode).toBe(503)
    expect(res.body).toEqual({ error: 'Contact form is disabled.' })
    expect(verifyTurnstile).not.toHaveBeenCalled()
    expect(sendToDiscord).not.toHaveBeenCalled()
  })

  it('allows submissions when CONTACT_FORM_ENABLED is unset', async () => {
    const res = await callHandler(createReq())

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  it('returns 400 for missing body', async () => {
    const res = await callHandler(createReq({ body: undefined }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid request body.' })
  })

  it.each([
    ['string', 'not-json'],
    ['array', []],
  ])('returns 400 when body is a %s', async (_type, body) => {
    const res = await callHandler(createReq({ body }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Invalid request body.' })
  })

  it('returns 400 with field=name when name is missing', async () => {
    const body = validBody({ name: undefined })

    const res = await callHandler(createReq({ body }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ field: 'name' })
  })

  it('returns 400 with field=name when name is over 100 chars', async () => {
    const res = await callHandler(createReq({ body: validBody({ name: 'A'.repeat(101) }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ field: 'name' })
  })

  it('returns 400 with field=email when email is missing', async () => {
    const res = await callHandler(createReq({ body: validBody({ email: undefined }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ field: 'email' })
  })

  it('returns 400 when email is over 254 chars', async () => {
    const longEmail = `${'a'.repeat(246)}@example.com`

    const res = await callHandler(createReq({ body: validBody({ email: longEmail }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ field: 'email' })
  })

  it('returns 400 with field=email when email has no @', async () => {
    const res = await callHandler(createReq({ body: validBody({ email: 'alice.example.com' }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ field: 'email' })
  })

  it('returns 400 with field=email when email has no dot in domain', async () => {
    const res = await callHandler(createReq({ body: validBody({ email: 'alice@example' }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ field: 'email' })
  })

  it('returns 400 with field=scope when scope is missing', async () => {
    const res = await callHandler(createReq({ body: validBody({ scope: undefined }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ field: 'scope' })
  })

  it('returns 400 when scope is under 10 chars', async () => {
    const res = await callHandler(createReq({ body: validBody({ scope: 'too short' }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ field: 'scope' })
  })

  it('returns 400 when scope is over 4000 chars', async () => {
    const res = await callHandler(createReq({ body: validBody({ scope: 'A'.repeat(4001) }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ field: 'scope' })
  })

  it('returns 400 when body contains control chars', async () => {
    const res = await callHandler(createReq({ body: validBody({ name: 'A\x00B' }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Request contains invalid characters.', field: 'body.name' })
  })

  it('silently accepts honeypot submissions without sending to Discord', async () => {
    const res = await callHandler(createReq({ body: validBody({ website: 'spam-content' }) }))

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(sendToDiscord).not.toHaveBeenCalled()
  })

  it('returns 400 when scope contains more than 5 http:// links', async () => {
    const scope = Array.from({ length: 6 }, (_, index) => `http://example.com/${index}`).join(' ')

    const res = await callHandler(createReq({ body: validBody({ scope }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'Too many links.' })
  })

  it('returns 413 when body is larger than 8KB', async () => {
    const res = await callHandler(createReq({ body: validBody({ extra: 'A'.repeat(8192) }) }))

    expect(res.statusCode).toBe(413)
    expect(res.body).toEqual({ error: 'Payload too large.' })
  })

  it('returns 403 when turnstileToken is missing without verifying Turnstile', async () => {
    const res = await callHandler(createReq({ body: validBody({ turnstileToken: undefined }) }))

    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual({ error: 'Bot check required.' })
    expect(verifyTurnstile).not.toHaveBeenCalled()
  })

  it('returns 403 when Turnstile verification fails', async () => {
    verifyTurnstile.mockResolvedValue(false)

    const res = await callHandler(createReq())

    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual({ error: 'Looks like a bot.' })
  })

  it.each([
    ['ip_hour', 'You have submitted too many enquiries this hour. Try again later.'],
    ['ip_day', "You have hit today's submission limit. Try again tomorrow or email emilegascoin@gmail.com direct."],
    ['redis_unavailable', 'Submission temporarily unavailable. Email emilegascoin@gmail.com direct.'],
  ])('returns 429 with %s rate limit message', async (reason, message) => {
    checkContactRateLimit.mockResolvedValue({ allowed: false, reason })

    const res = await callHandler(createReq())

    expect(res.statusCode).toBe(429)
    expect(res.body).toEqual({ error: message, reason })
  })

  it('returns 200 and sends valid payload to Discord on happy path', async () => {
    const res = await callHandler(createReq())

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(sendToDiscord).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@example.com',
      company: 'Acme',
      scope: 'Need help with X for two weeks',
      source: 'form',
    })
  })

  it('defaults source to form when source is not provided', async () => {
    const res = await callHandler(createReq({ body: validBody({ source: undefined }) }))

    expect(res.statusCode).toBe(200)
    expect(sendToDiscord).toHaveBeenCalledWith(expect.objectContaining({ source: 'form' }))
  })

  it('passes chatbot-handoff source to Discord', async () => {
    const res = await callHandler(createReq({ body: validBody({ source: 'chatbot-handoff' }) }))

    expect(res.statusCode).toBe(200)
    expect(sendToDiscord).toHaveBeenCalledWith(expect.objectContaining({ source: 'chatbot-handoff' }))
  })

  it('returns 400 when source contains invalid chars', async () => {
    const res = await callHandler(createReq({ body: validBody({ source: 'foo!bar' }) }))

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({ error: 'source is invalid.', field: 'source' })
  })

  it('returns 502 and captures Discord rate limit failures', async () => {
    sendToDiscord.mockResolvedValue({ ok: false, status: 429, retryAfter: 60 })

    const res = await callHandler(createReq())

    expect(res.statusCode).toBe(502)
    expect(res.body).toEqual({ error: DELIVERY_ERROR })
    expect(captureError).toHaveBeenCalledWith(expect.any(Error), {
      ip: '1.2.3.0',
      status: 429,
      error: 'discord_rate_limited',
    })
  })

  it('returns 502 and captures Discord 500 failures', async () => {
    sendToDiscord.mockResolvedValue({ ok: false, status: 500 })

    const res = await callHandler(createReq())

    expect(res.statusCode).toBe(502)
    expect(res.body).toEqual({ error: DELIVERY_ERROR })
    expect(captureError).toHaveBeenCalledWith(expect.any(Error), {
      ip: '1.2.3.0',
      status: 500,
      error: 'discord_failure',
    })
  })

  it('returns 502 and captures Discord timeout failures', async () => {
    sendToDiscord.mockResolvedValue({ ok: false, status: 0, error: 'timeout' })

    const res = await callHandler(createReq())

    expect(res.statusCode).toBe(502)
    expect(res.body).toEqual({ error: DELIVERY_ERROR })
    expect(captureError).toHaveBeenCalledWith(expect.any(Error), {
      ip: '1.2.3.0',
      status: 0,
      error: 'timeout',
    })
  })

  it('returns 500 and captures unexpected Discord exceptions', async () => {
    const err = new Error('boom')
    sendToDiscord.mockRejectedValue(err)

    const res = await callHandler(createReq())

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ error: 'Something went wrong.' })
    expect(captureError).toHaveBeenCalledWith(err, {
      ip: '1.2.3.0',
      status: 500,
      error: 'unexpected',
    })
  })

  it('captures Discord failure extras without sensitive request fields', async () => {
    sendToDiscord.mockResolvedValue({ ok: false, status: 500 })

    await callHandler(createReq())

    const extras = captureError.mock.calls[0][1]
    expect(extras).toMatchObject({ ip: '1.2.3.0', status: 500 })
    expect(extras).not.toHaveProperty('name')
    expect(extras).not.toHaveProperty('email')
    expect(extras).not.toHaveProperty('scope')
    expect(extras).not.toHaveProperty('turnstileToken')
    expect(extras).not.toHaveProperty('webhookUrl')
    expect(extras).not.toHaveProperty('webhookURL')
    expect(extras).not.toHaveProperty('webhook')
  })
})
