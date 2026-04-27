import { describe, it, expect } from 'vitest'
import { buildSystemPrompt } from './claudeContext.js'

describe('buildSystemPrompt', () => {
  it('includes Emile identity statement', () => {
    expect(buildSystemPrompt()).toMatch(/Ask Emile/)
  })

  it('includes the no-fabrication rule', () => {
    expect(buildSystemPrompt()).toMatch(/Never invent details/i)
  })

  it('includes the email fallback line', () => {
    expect(buildSystemPrompt()).toMatch(/emilegascoin@gmail\.com/)
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
