import { describe, it, expect, vi, beforeEach } from 'vitest'

const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

const { verifyTurnstile } = await import('./turnstile.js')

describe('verifyTurnstile', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    process.env.TURNSTILE_SECRET_KEY = 'test-secret'
  })

  it('returns true on success', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    expect(await verifyTurnstile('token', '1.2.3.4')).toBe(true)
  })

  it('returns false on Cloudflare failure response', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }) })
    expect(await verifyTurnstile('token', '1.2.3.4')).toBe(false)
  })

  it('returns false if fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('network'))
    expect(await verifyTurnstile('token', '1.2.3.4')).toBe(false)
  })

  it('returns false on missing token', async () => {
    expect(await verifyTurnstile('', '1.2.3.4')).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
