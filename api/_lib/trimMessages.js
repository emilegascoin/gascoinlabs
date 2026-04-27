export function estimateTokens(text) {
  return Math.ceil((text || '').length / 4)
}

function totalTokens(systemPrompt, messages) {
  let t = estimateTokens(systemPrompt)
  for (const m of messages) t += estimateTokens(m.content)
  return t
}

export function trimMessages(messages, systemPrompt, maxTokens) {
  if (totalTokens(systemPrompt, messages) <= maxTokens) {
    return { messages, trimmed: false }
  }
  const out = [...messages]
  let trimmed = false
  // Drop oldest two messages at a time (a user/assistant pair) but always keep the last message.
  while (out.length > 1 && totalTokens(systemPrompt, out) > maxTokens) {
    out.shift()
    trimmed = true
  }
  return { messages: out, trimmed }
}
