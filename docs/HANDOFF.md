# Handoff prompt — Personal portfolio (gascoinlabs.com)

> Paste the contents of this file into a fresh Claude Code session on a new machine to bring it up to speed without re-explaining anything.

---

I'm continuing work on my personal portfolio website. The repo is on GitHub at https://github.com/emilegascoin/gascoinlabs and deployed via Vercel. I'm switching machines for this session.

## First step: clone the repo locally

```bash
git clone https://github.com/emilegascoin/gascoinlabs.git
cd gascoinlabs
npm install
```

## Project overview

- **Domain:** gascoinlabs.com (purchased through Porkbun)
- **Stack:** React + Vite, Tailwind, React Router, Vercel Serverless Functions, Vitest
- **AI provider:** Provider-agnostic adapter at `src/lib/aiProvider.js`. Default = Gemini Flash. Claude swappable via `AI_PROVIDER` env var.
- **Storage:** Upstash Redis (rate limit + spend tracking)
- **Bot protection:** Cloudflare Turnstile (invisible/managed mode)
- **Hosting:** Vercel (single project, auto-deploys from main)

## What's been built (32-task plan, fully shipped)

- Single-scroll home with 8 sections (`/`)
- Elecdes case study (`/work/elecdes`)
- Floating "Ask Emile" widget on every page that routes to `/ask` with prefilled prompt
- `/ask` full chat page with streaming + invisible Turnstile token grab
- `/api/ask` Vercel function: Turnstile verify, per-IP rate limit (20/day), daily spend cap ($1/day, configurable), token trim, AI call, record spend
- `/api/health`
- All abuse protection utilities are TDD'd. 32 tests passing.
- Site copy lives in `src/lib/content.js` as the single source of truth (also feeds chatbot grounding context via `src/lib/claudeContext.js`)

## Read these for full context

- `docs/superpowers/specs/2026-04-27-personal-website-design.md` — design spec
- `docs/superpowers/plans/2026-04-27-personal-website-implementation.md` — 32-task implementation plan
- `CLAUDE.md` — project brief, tone rules, AI workflow context

## Current state — where I'm stuck

The site is deployed on the ugly Vercel URL but I'm in the middle of connecting `gascoinlabs.com`. Nameservers were a mess (mixed Cloudflare + Vercel + Porkbun). I've just set them back to Porkbun's defaults (curitiba/fortaleza/maceio/salvador.ns.porkbun.com) and DNS is propagating.

The Porkbun DNS panel currently has these records:

- A (host blank) → 76.76.21.21
- CNAME www → cname.vercel-dns.com
- TXT records for SPF and ACME challenge — keep, don't touch

Also: there was a Turnstile bug — `size: 'invisible'` is no longer valid in Cloudflare's API. The fix is in `src/lib/turnstileClient.js` and committed/pushed. The widget mode now needs to be set in the Cloudflare dashboard instead (Managed or Invisible).

## What's left to do

1. **Verify DNS has propagated:**

   ```bash
   dig NS gascoinlabs.com +short
   dig gascoinlabs.com +short
   dig www.gascoinlabs.com +short
   ```

   Should show 4x porkbun.com nameservers, then 76.76.21.21, then cname.vercel-dns.com.

2. **Confirm Cloudflare Turnstile widget mode** is set to "Managed" or "Invisible" in the Cloudflare dashboard, and that `gascoinlabs.com` is on the hostname allowlist.

3. **Smoke-test the live site** at gascoinlabs.com — home page, case study, chat widget, /ask page, and `/api/health`.

4. **Replace placeholder copy** in `src/lib/content.js`. Anything marked `[PLACEHOLDER]` is mine to rewrite. Sections to rework: hero, about, AI workflow, widget greeting + chips, reference quote.

5. **Drop case study assets** into `public/work/elecdes/` (initial design screenshot, before/after of elecdes.com hero, anything for the Whisper transcription tool subsection). Then we wire them into `src/pages/work/Elecdes.jsx`.

6. **Optionally** later: Anthropic/Claude provider activation once my Australian TFN clears for billing.

## Secrets I'll handle myself

All env vars are in Vercel dashboard (Production + Preview) and in `.env.local` on my Mac. I'll set up `.env.local` on this PC by copying `.env.example` and filling in values. Don't ask me to share secrets in chat — I rotated the original ones after pasting them once.

## Tone rules for any new copy

- No em dashes
- No Oxford commas
- No corporate fluff
- Direct, conversational, short
- Don't overclaim on minor contributions

## Workflow preferences

- Subagent-driven development for non-trivial work — fresh subagent per task, two-stage review (spec compliance, then code quality).
- Frequent commits, one logical change per commit.
- TDD for API/protection logic, not for static React components.

## Start here

Help me verify DNS is propagated, then move to the smoke test.
