import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('aiProvider', () => {
  beforeEach(() => {
    vi.resetModules()
    delete process.env.AI_PROVIDER
    delete process.env.GOOGLE_API_KEY
    delete process.env.ANTHROPIC_API_KEY
  })

  it('throws if AI_PROVIDER is unset', async () => {
    const { aiProvider } = await import('./aiProvider.js')
    await expect(aiProvider.send({ systemPrompt: 'x', messages: [] }))
      .rejects.toThrow(/AI_PROVIDER/)
  })

  it('throws on unknown provider', async () => {
    process.env.AI_PROVIDER = 'banana'
    const { aiProvider } = await import('./aiProvider.js')
    await expect(aiProvider.send({ systemPrompt: 'x', messages: [] }))
      .rejects.toThrow(/unknown provider/i)
  })

  it('throws if Gemini chosen with no GOOGLE_API_KEY', async () => {
    process.env.AI_PROVIDER = 'gemini'
    const { aiProvider } = await import('./aiProvider.js')
    await expect(aiProvider.send({ systemPrompt: 'x', messages: [] }))
      .rejects.toThrow(/GOOGLE_API_KEY/)
  })

  it('throws if Claude chosen with no ANTHROPIC_API_KEY', async () => {
    process.env.AI_PROVIDER = 'claude'
    const { aiProvider } = await import('./aiProvider.js')
    await expect(aiProvider.send({ systemPrompt: 'x', messages: [] }))
      .rejects.toThrow(/ANTHROPIC_API_KEY/)
  })
})
