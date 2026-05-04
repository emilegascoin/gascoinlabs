import { GoogleGenAI } from '@google/genai'

// Pricing as of 2026 — update if Google changes it.
// Source: https://ai.google.dev/gemini-api/docs/pricing
// gemini-2.0-flash: $0.10/M input, $0.40/M output (<=200k ctx)
const PRICING = {
  inputPerMillion: 0.10,
  outputPerMillion: 0.40,
}

export async function sendGemini({ systemPrompt, messages, signal }) {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

  // Convert our message format to Gemini's contents format.
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const response = await ai.models.generateContentStream({
    model: 'gemini-2.0-flash',
    contents,
    config: {
      systemInstruction: systemPrompt,
      abortSignal: signal,
    },
  })

  let inputTokens = 0
  let outputTokens = 0

  async function* stream() {
    for await (const chunk of response) {
      const text = chunk.text
      if (text) yield text
      const usage = chunk.usageMetadata
      if (usage) {
        inputTokens = usage.promptTokenCount || inputTokens
        outputTokens = usage.candidatesTokenCount || outputTokens
      }
    }
  }

  return {
    stream: stream(),
    getUsage: () => ({
      inputTokens,
      outputTokens,
      costUsd:
        (inputTokens * PRICING.inputPerMillion + outputTokens * PRICING.outputPerMillion) / 1_000_000,
    }),
  }
}
