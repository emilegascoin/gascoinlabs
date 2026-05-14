import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockIncr = vi.fn()
const mockExpire = vi.fn()
const mockGetRedis = vi.fn()

vi.mock('./redis.js', () => ({
  getRedis: mockGetRedis,
}))

const { checkContactRateLimit } = await import('./contactRateLimit.js')

const ORIGINAL_ENV = { ...process.env }

describe('checkContactRateLimit', () => {
  beforeEach(() => {
    mockIncr.mockReset()
    mockExpire.mockReset()
    mockGetRedis.mockReset()
    mockGetRedis.mockReturnValue({ incr: mockIncr, expire: mockExpire })
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-27T15:30:00.000Z'))
    process.env.CONTACT_IP_PER_HOUR = '3'
    process.env.CONTACT_IP_PER_DAY = '5'
  })

  afterEach(() => {
    vi.useRealTimers()
    process.env.CONTACT_IP_PER_HOUR = ORIGINAL_ENV.CONTACT_IP_PER_HOUR
    process.env.CONTACT_IP_PER_DAY = ORIGINAL_ENV.CONTACT_IP_PER_DAY
  })

  it('allows first request, sets TTL on first call only', async () => {
    mockIncr
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(2)

    const first = await checkContactRateLimit({ ip: '1.2.3.4' })
    const second = await checkContactRateLimit({ ip: '1.2.3.4' })

    expect(first).toEqual({ allowed: true })
    expect(second).toEqual({ allowed: true })
    expect(mockExpire).toHaveBeenCalledTimes(2)
    expect(mockExpire).toHaveBeenCalledWith('contact:ip:hour:1.2.3.4:2026-04-27-15', 3600)
    expect(mockExpire).toHaveBeenCalledWith('contact:ip:day:1.2.3.4:2026-04-27', 86400)
  })

  it('blocks on IP hourly limit', async () => {
    mockIncr.mockResolvedValueOnce(4).mockResolvedValueOnce(1)

    const result = await checkContactRateLimit({ ip: '1.2.3.4' })

    expect(result).toEqual({ allowed: false, reason: 'ip_hour' })
  })

  it('blocks on IP daily limit when only IP daily is over limit', async () => {
    mockIncr.mockResolvedValueOnce(1).mockResolvedValueOnce(6)

    const result = await checkContactRateLimit({ ip: '1.2.3.4' })

    expect(result).toEqual({ allowed: false, reason: 'ip_day' })
  })

  it('increments both counters even when hourly limit is hit', async () => {
    mockIncr.mockResolvedValueOnce(4).mockResolvedValueOnce(1)

    await checkContactRateLimit({ ip: '1.2.3.4' })

    expect(mockIncr).toHaveBeenCalledTimes(2)
  })

  it('fails closed when Redis is unavailable', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockGetRedis.mockImplementation(() => {
      throw new Error('redis unavailable')
    })

    const result = await checkContactRateLimit({ ip: '1.2.3.4' })

    expect(result).toEqual({ allowed: false, reason: 'redis_unavailable' })
    warnSpy.mockRestore()
  })

  it('uses env var override for IP hourly limit', async () => {
    process.env.CONTACT_IP_PER_HOUR = '10'
    mockIncr.mockResolvedValueOnce(10).mockResolvedValueOnce(1)

    const allowedAtOverrideLimit = await checkContactRateLimit({ ip: '1.2.3.4' })

    mockIncr.mockResolvedValueOnce(11).mockResolvedValueOnce(1)

    const blockedPastOverrideLimit = await checkContactRateLimit({ ip: '1.2.3.4' })

    expect(allowedAtOverrideLimit).toEqual({ allowed: true })
    expect(blockedPastOverrideLimit).toEqual({ allowed: false, reason: 'ip_hour' })
  })
})
