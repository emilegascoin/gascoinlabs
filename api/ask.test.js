import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./_lib/turnstile.js', () => ({ verifyTurnstile: vi.fn() }))
vi.mock('./_lib/rateLimit.js', () => ({ checkRateLimit: vi.fn() }))
vi.mock('./_lib/spendCap.js', () => ({ checkSpendCap: vi.fn(), recordSpend: vi.fn() }))
vi.mock('../src/lib/aiProvider.js', () => ({ aiProvider: { send: vi.fn() } }))

const { verifyTurnstile } = await import('./_lib/turnstile.js')
const { checkRateLimit } = await import('./_lib/rateLimit.js')
const { checkSpendCap, recordSpend } = await import('./_lib/spendCap.js')
const { aiProvider } = await import('../src/lib/aiProvider.js')
const handler = (await import('./ask.js')).default

function mockRes() {
  return {
    statusCode: 200,
    body: '',
    headers: {},
    status(c) { this.statusCode = c; return this },
    json(obj) { this.body = JSON.stringify(obj); return this },
    setHeader(k, v) { this.headers[k] = v; return this },
    write(chunk) { this.body += chunk; return true },
    end() { this.ended = true },
  }
}

function mockReq(body = {}, headers = {}) {
  return {
    method: 'POST',
    body,
    headers: { 'x-forwarded-for': '1.2.3.4', ...headers },
  }
}

describe('/api/ask', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('rejects non-POST', async () => {
    const res = mockRes()
    await handler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(405)
  })

  it('rejects when Turnstile fails', async () => {
    verifyTurnstile.mockResolvedValue(false)
    const res = mockRes()
    await handler(mockReq({ message: 'hi', turnstileToken: 't', history: [] }), res)
    expect(res.statusCode).toBe(403)
  })

  it('rejects when rate-limited', async () => {
    verifyTurnstile.mockResolvedValue(true)
    checkRateLimit.mockResolvedValue({ allowed: false, remaining: 0 })
    const res = mockRes()
    await handler(mockReq({ message: 'hi', turnstileToken: 't', history: [] }), res)
    expect(res.statusCode).toBe(429)
  })

  it('returns fallback when spend cap reached', async () => {
    verifyTurnstile.mockResolvedValue(true)
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 19 })
    checkSpendCap.mockResolvedValue({ allowed: false, spent: 1, cap: 1 })
    const res = mockRes()
    await handler(mockReq({ message: 'hi', turnstileToken: 't', history: [] }), res)
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatch(/Ask Emile is taking a break/)
  })

  it('streams response on happy path', async () => {
    verifyTurnstile.mockResolvedValue(true)
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 19 })
    checkSpendCap.mockResolvedValue({ allowed: true, spent: 0, cap: 1 })
    async function* fakeStream() { yield 'Hello'; yield ' there.' }
    aiProvider.send.mockResolvedValue({
      stream: fakeStream(),
      getUsage: () => ({ inputTokens: 10, outputTokens: 5, costUsd: 0.001 }),
    })
    const res = mockRes()
    await handler(mockReq({ message: 'hi', turnstileToken: 't', history: [] }), res)
    // Response is SSE — chunks are wrapped as `data: <json>\n\n` events.
    expect(res.headers['Content-Type']).toMatch(/text\/event-stream/)
    expect(res.body).toMatch(/data: "Hello"/)
    expect(res.body).toMatch(/data: " there\."/)
    expect(recordSpend).toHaveBeenCalledWith(0.001)
  })
})
