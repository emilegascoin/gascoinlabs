import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockIncr = vi.fn()
const mockExpire = vi.fn()
vi.mock('./redis.js', () => ({
  getRedis: () => ({ incr: mockIncr, expire: mockExpire }),
  todayKey: (prefix) => `${prefix}:2026-04-27`,
}))

const { checkRateLimit } = await import('./rateLimit.js')

describe('checkRateLimit', () => {
  beforeEach(() => {
    mockIncr.mockReset()
    mockExpire.mockReset()
    process.env.RATE_LIMIT_PER_DAY = '20'
  })

  it('allows the first request', async () => {
    mockIncr.mockResolvedValue(1)
    const result = await checkRateLimit('1.2.3.4')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(19)
  })

  it('sets TTL on first request', async () => {
    mockIncr.mockResolvedValue(1)
    await checkRateLimit('1.2.3.4')
    expect(mockExpire).toHaveBeenCalledWith('ratelimit:1.2.3.4:2026-04-27', 86400)
  })

  it('does not reset TTL on subsequent requests', async () => {
    mockIncr.mockResolvedValue(5)
    await checkRateLimit('1.2.3.4')
    expect(mockExpire).not.toHaveBeenCalled()
  })

  it('blocks when count exceeds cap', async () => {
    mockIncr.mockResolvedValue(21)
    const result = await checkRateLimit('1.2.3.4')
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })
})
