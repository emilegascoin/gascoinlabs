import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGet = vi.fn()
const mockIncrbyfloat = vi.fn()
const mockExpire = vi.fn()
vi.mock('./redis.js', () => ({
  getRedis: () => ({ get: mockGet, incrbyfloat: mockIncrbyfloat, expire: mockExpire }),
  todayKey: (p) => `${p}:2026-04-27`,
}))

const { checkSpendCap, recordSpend } = await import('./spendCap.js')

describe('checkSpendCap', () => {
  beforeEach(() => {
    mockGet.mockReset()
    process.env.DAILY_SPEND_CAP_USD = '1'
  })

  it('allows when under cap', async () => {
    mockGet.mockResolvedValue('0.30')
    expect(await checkSpendCap()).toEqual({ allowed: true, spent: 0.30, cap: 1 })
  })

  it('blocks when at cap', async () => {
    mockGet.mockResolvedValue('1.00')
    expect((await checkSpendCap()).allowed).toBe(false)
  })

  it('blocks when over cap', async () => {
    mockGet.mockResolvedValue('1.50')
    expect((await checkSpendCap()).allowed).toBe(false)
  })

  it('treats missing key as zero spend', async () => {
    mockGet.mockResolvedValue(null)
    expect(await checkSpendCap()).toEqual({ allowed: true, spent: 0, cap: 1 })
  })
})

describe('recordSpend', () => {
  beforeEach(() => {
    mockIncrbyfloat.mockReset()
    mockExpire.mockReset()
  })

  it('increments by the cost amount', async () => {
    mockIncrbyfloat.mockResolvedValue('0.05')
    await recordSpend(0.05)
    expect(mockIncrbyfloat).toHaveBeenCalledWith('spend:2026-04-27', 0.05)
  })

  it('sets TTL', async () => {
    mockIncrbyfloat.mockResolvedValue('0.05')
    await recordSpend(0.05)
    expect(mockExpire).toHaveBeenCalledWith('spend:2026-04-27', 43200)
  })
})
