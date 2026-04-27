import Anthropic from '@anthropic-ai/sdk'

const PRICING = {
  inputPerMillion: 3.00,
  outputPerMillion: 15.00,
  cachedInputPerMillion: 0.30,
}

export async function sendClaude({ systemPrompt, messages, signal }) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  }, { signal })

  let inputTokens = 0
  let cachedInputTokens = 0
  let outputTokens = 0

  async function* iter() {
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text
      }
      if (event.type === 'message_start') {
        const usage = event.message.usage
        inputTokens = (usage.input_tokens || 0)
        cachedInputTokens = (usage.cache_read_input_tokens || 0)
      }
      if (event.type === 'message_delta') {
        outputTokens = (event.usage.output_tokens || 0)
      }
    }
  }

  return {
    stream: iter(),
    getUsage: () => {
      const inputCost = (inputTokens - cachedInputTokens) * PRICING.inputPerMillion / 1_000_000
      const cachedCost = cachedInputTokens * PRICING.cachedInputPerMillion / 1_000_000
      const outputCost = outputTokens * PRICING.outputPerMillion / 1_000_000
      return {
        inputTokens,
        outputTokens,
        costUsd: inputCost + cachedCost + outputCost,
      }
    },
  }
}
