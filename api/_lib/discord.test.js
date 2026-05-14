import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { sendToDiscord } = await import('./discord.js')

const ORIGINAL_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
const mockFetch = vi.fn()

function mockResponse(status, { json, retryAfter } = {}) {
  return {
    status,
    json: json || vi.fn(),
    headers: {
      get: vi.fn((name) => {
        if (name.toLowerCase() === 'retry-after') return retryAfter
        return undefined
      }),
    },
  }
}

function postedBody() {
  return JSON.parse(mockFetch.mock.calls[0][1].body)
}

function fieldValue(name) {
  return postedBody().embeds[0].fields.find((field) => field.name === name).value
}

describe('sendToDiscord', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    vi.stubGlobal('fetch', mockFetch)
    process.env.DISCORD_WEBHOOK_URL = 'https://example.test/webhook'
  })

  afterEach(() => {
    process.env.DISCORD_WEBHOOK_URL = ORIGINAL_WEBHOOK_URL
    vi.unstubAllGlobals()
  })

  it('returns message ID on 200 success', async () => {
    mockFetch.mockResolvedValue(mockResponse(200, { json: vi.fn().mockResolvedValue({ id: 'msg123' }) }))

    const result = await sendToDiscord({ name: 'A', email: 'a@example.com' })

    expect(result).toEqual({ ok: true, messageId: 'msg123' })
  })

  it('returns ok on 204 success with no message ID', async () => {
    mockFetch.mockResolvedValue(mockResponse(204))

    const result = await sendToDiscord({ name: 'A', email: 'a@example.com' })

    expect(result).toEqual({ ok: true })
  })

  it('returns retryAfter on 429 with Retry-After header', async () => {
    mockFetch.mockResolvedValue(mockResponse(429, { retryAfter: '60' }))

    const result = await sendToDiscord({ name: 'A', email: 'a@example.com' })

    expect(result).toEqual({ ok: false, status: 429, retryAfter: 60 })
  })

  it('returns status on 5xx response', async () => {
    mockFetch.mockResolvedValue(mockResponse(500))

    const result = await sendToDiscord({ name: 'A', email: 'a@example.com' })

    expect(result).toEqual({ ok: false, status: 500 })
  })

  it('returns timeout on AbortError', async () => {
    mockFetch.mockRejectedValue({ name: 'AbortError' })

    const result = await sendToDiscord({ name: 'A', email: 'a@example.com' })

    expect(result).toEqual({ ok: false, status: 0, error: 'timeout' })
  })

  it('returns network error on generic fetch failure', async () => {
    mockFetch.mockRejectedValue(new Error('network down'))

    const result = await sendToDiscord({ name: 'A', email: 'a@example.com' })

    expect(result).toEqual({ ok: false, status: 0, error: 'network' })
  })

  it('returns unconfigured without fetch when webhook URL is unset', async () => {
    delete process.env.DISCORD_WEBHOOK_URL

    const result = await sendToDiscord({ name: 'A', email: 'a@example.com' })

    expect(result).toEqual({ ok: false, status: 0, error: 'unconfigured' })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('escapes @everyone mentions', async () => {
    mockFetch.mockResolvedValue(mockResponse(204))

    await sendToDiscord({ name: '@everyone', email: 'a@example.com' })

    expect(fieldValue('Name')).toContain('@\u200beveryone')
  })

  it('escapes @here mentions', async () => {
    mockFetch.mockResolvedValue(mockResponse(204))

    await sendToDiscord({ name: '@here', email: 'a@example.com' })

    expect(fieldValue('Name')).toContain('@\u200bhere')
  })

  it('escapes user mentions', async () => {
    mockFetch.mockResolvedValue(mockResponse(204))

    await sendToDiscord({ name: '<@123>', email: 'a@example.com' })

    expect(fieldValue('Name')).toContain('<@\u200b123>')
  })

  it('escapes role mentions', async () => {
    mockFetch.mockResolvedValue(mockResponse(204))

    await sendToDiscord({ name: '<@&456>', email: 'a@example.com' })

    expect(fieldValue('Name')).toContain('<@\u200b\u200b&456>')
  })

  it('flattens markdown links', async () => {
    mockFetch.mockResolvedValue(mockResponse(204))

    await sendToDiscord({ name: '[evil](http://bad)', email: 'a@example.com' })

    expect(fieldValue('Name')).toBe('evil (http://bad)')
  })

  it('escapes backticks', async () => {
    mockFetch.mockResolvedValue(mockResponse(204))

    await sendToDiscord({ name: '`code`', email: 'a@example.com' })

    expect(fieldValue('Name')).toBe('\\`code\\`')
  })

  it('truncates scope over SCOPE_LIMIT and appends truncation marker', async () => {
    mockFetch.mockResolvedValue(mockResponse(204))
    const scope = 'a'.repeat(5000)

    await sendToDiscord({ name: 'A', email: 'a@example.com', scope })

    expect(fieldValue('Scope')).toBe(`${'a'.repeat(1000)}... (truncated)`)
  })

  it('truncates field values to FIELD_VALUE_LIMIT', async () => {
    mockFetch.mockResolvedValue(mockResponse(204))
    const name = 'a'.repeat(2000)

    await sendToDiscord({ name, email: 'a@example.com' })

    expect(fieldValue('Name')).toBe('a'.repeat(1024))
  })

  it('uses Not provided for empty fields', async () => {
    mockFetch.mockResolvedValue(mockResponse(204))

    await sendToDiscord({ name: '', email: '', company: '', source: '', scope: '' })

    expect(fieldValue('Name')).toBe('Not provided')
    expect(fieldValue('Email')).toBe('Not provided')
    expect(fieldValue('Company')).toBe('Not provided')
    expect(fieldValue('Source')).toBe('Not provided')
    expect(fieldValue('Scope')).toBe('Not provided')
  })
})
