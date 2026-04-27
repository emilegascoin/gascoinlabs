const PROVIDERS = ['gemini', 'claude']

export const aiProvider = {
  async send({ systemPrompt, messages, signal }) {
    const provider = process.env.AI_PROVIDER
    if (!provider) throw new Error('AI_PROVIDER env var not set')
    if (!PROVIDERS.includes(provider)) {
      throw new Error(`Unknown provider: ${provider}`)
    }

    if (provider === 'gemini') {
      if (!process.env.GOOGLE_API_KEY) throw new Error('GOOGLE_API_KEY not set')
      const { sendGemini } = await import('./providers/gemini.js')
      return sendGemini({ systemPrompt, messages, signal })
    }

    if (provider === 'claude') {
      if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set')
      const { sendClaude } = await import('./providers/claude.js')
      return sendClaude({ systemPrompt, messages, signal })
    }
  },
}
