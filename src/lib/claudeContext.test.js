import { describe, it, expect } from 'vitest'
import { buildSystemPrompt } from './claudeContext.js'

describe('buildSystemPrompt', () => {
  it('includes Emile identity statement', () => {
    expect(buildSystemPrompt()).toMatch(/You are Emile Gascoin/)
  })

  it('includes the no-fabrication rule', () => {
    expect(buildSystemPrompt()).toMatch(/Don't invent/i)
  })

  it('directs people to the contact form without exposing an email', () => {
    const prompt = buildSystemPrompt()
    expect(prompt).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
    expect(prompt).toMatch(/contact form/i)
  })

  it('includes content from content.js (e.g. company name)', () => {
    expect(buildSystemPrompt()).toMatch(/Scada Systems/)
  })

  it('includes tone rules (no em dashes, no Oxford commas)', () => {
    const p = buildSystemPrompt()
    expect(p).toMatch(/em dash/i)
    expect(p).toMatch(/Oxford comma/i)
  })
})
