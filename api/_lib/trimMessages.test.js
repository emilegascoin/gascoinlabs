import { describe, it, expect } from 'vitest'
import { trimMessages, estimateTokens } from './trimMessages.js'

describe('estimateTokens', () => {
  it('approximates 4 chars per token', () => {
    expect(estimateTokens('aaaa')).toBe(1)
    expect(estimateTokens('a'.repeat(40))).toBe(10)
  })
})

describe('trimMessages', () => {
  const m = (role, content) => ({ role, content })

  it('returns input unchanged when under cap', () => {
    const msgs = [m('user', 'hi'), m('assistant', 'hello')]
    const out = trimMessages(msgs, 'system', 1000)
    expect(out.messages).toEqual(msgs)
    expect(out.trimmed).toBe(false)
  })

  it('trims oldest pairs when over cap', () => {
    const big = 'x'.repeat(4000) // ~1000 tokens
    const msgs = [
      m('user', big),
      m('assistant', big),
      m('user', big),
      m('assistant', big),
      m('user', 'recent'),
    ]
    const out = trimMessages(msgs, '', 2500)
    // Oldest pair (first 2) should be dropped
    expect(out.messages.length).toBeLessThan(msgs.length)
    expect(out.trimmed).toBe(true)
    // Last message preserved
    expect(out.messages[out.messages.length - 1].content).toBe('recent')
  })

  it('always preserves the last user message', () => {
    const big = 'x'.repeat(40000)
    const msgs = [m('user', big), m('user', 'last')]
    const out = trimMessages(msgs, '', 100)
    expect(out.messages[out.messages.length - 1].content).toBe('last')
  })
})
