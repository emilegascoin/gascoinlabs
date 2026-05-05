# Handoff prompt — Personal portfolio (gascoinlabs.com)

> Paste the contents of this file into a fresh Claude Code session on a new machine to bring it up to speed without re-explaining anything.

---

I'm continuing work on my personal portfolio website. The repo is on GitHub at https://github.com/emilegascoin/gascoinlabs and the live site is at https://gascoinlabs.com (deployed via Vercel, auto-deploys from `main`). I'm switching machines for this session.

## First step: clone the repo locally

```bash
git clone https://github.com/emilegascoin/gascoinlabs.git
cd gascoinlabs
npm install
```

Then copy `.env.example` to `.env.local` and fill in values from the Vercel dashboard.

## Project overview

- **Domain:** gascoinlabs.com (Porkbun, with Porkbun nameservers, DNS records pointing at Vercel — fully live)
- **Stack:** React 19 + Vite, Tailwind, React Router, Vercel Serverless Functions (Node), Vitest
- **AI provider:** Provider-agnostic adapter at `src/lib/aiProvider.js`. Default = Gemini 2.5 Flash. Claude swappable via `AI_PROVIDER` env var.
- **Storage:** Upstash Redis (rate limit counters + daily spend tracking)
- **Bot protection:** Cloudflare Turnstile in smart mode (see chatbot section below)
- **Hosting:** Vercel (single project, billing-enabled Google Cloud project for Gemini)
- **Analytics:** Vercel Analytics (`@vercel/analytics/react`)

## How the chatbot works (current state)

The `/api/ask` endpoint runs in this order:

1. **Turnstile (smart check)** — if a token is provided AND fails verification we block with a "looks like a bot" message. If no token at all is provided we allow the request (real users with privacy extensions blocking the script). Verified tokens pass through.
2. **Per-IP rate limit** — 150 requests/day per IP via Upstash Redis. Generous so real users never hit it. `RATE_LIMIT_PER_DAY` env var.
3. **Daily spend cap** — global $1/day in Redis. Polite fallback message when hit. `DAILY_SPEND_CAP_USD` env var.
4. **Token trim** — keeps recent messages under a token budget.
5. **AI provider** — streams Gemini chunks back to the client.
6. **Record spend** — logs cost back to Redis after the stream completes.

The frontend (`src/pages/Ask.jsx`) reads chunks live and pipes them into a typewriter effect with adaptive speed (`charDelay()` and `typewriterStep()` at the top of the file). Loading dots show while waiting for the first chunk, then a blinking cursor while typing.

## What's been built

- Live site at https://gascoinlabs.com with all routes working
- Home page (`/`) with hero, about, experience, education, AI workflow, skills, reference, contact
- `/work` projects index page that pulls from a `projects` array in `content.js`. Adding a new project is one entry plus a page file.
- `/work/elecdes` — Elecdes Design Suite redesign project page
- `/work/gascoinlabs` — this site's own project page, includes a "New to me on this project" section listing what I picked up beyond my Scada stack
- `/ask` — full chat page with smart Turnstile, streaming responses and typewriter effect
- Floating "Ask Emile" widget on every page (except `/ask` itself) that routes to `/ask` with prefilled prompt
- `/api/ask` and `/api/health` serverless functions
- TDD for the API surface — rate limit, spend cap, Turnstile verifier and message trimmer all have Vitest tests
- Site copy lives in `src/lib/content.js` as the single source of truth. The chatbot system prompt is generated from the same data via `src/lib/claudeContext.js`, so the bot can never claim something the site does not say.
- Personal context expanded so the bot can answer questions like "why software development", "what did you do before tech", "why Melbourne", "how do you work", etc.
- Font loading optimised with preconnect to fonts.gstatic.com so there is no FOUT flash
- ScrollToTop component on every route change

## Read these for full context

- `CLAUDE.md` — project brief, about me, tone rules, AI workflow context
- `src/lib/content.js` — single source of truth for all site copy
- `src/lib/claudeContext.js` — how the system prompt is built from content
- `docs/superpowers/specs/2026-04-27-personal-website-design.md` — original design spec
- `docs/superpowers/plans/2026-04-27-personal-website-implementation.md` — original 32-task plan (largely shipped)

## What's left to do

1. **Drop project assets** into `public/work/elecdes/` (before/after screenshots of elecdes.com vs beta.elecdes.com hero, category tiles, BlueScope feature etc.). Then wire them into `src/pages/work/Elecdes.jsx` where the placeholder note currently sits.
2. **Decide where to put the Whisper transcription tool** on the site. It was used at Scada Systems for video subtitles, separate from the elecdes redesign. Maybe its own project page under `/work` or a sidebar mention on the elecdes page. Currently mentioned in the experience bullet only.
3. **Recruiter feedback** — waiting on a recruiter to give input on the site. Likely will trigger copy tweaks across hero, about, project pages.
4. **Optional later** — Anthropic/Claude provider activation. The adapter is ready, just need an Anthropic API key in env vars and `AI_PROVIDER=claude`.

## Workflow preferences (important)

- **I am the senior developer.** When you make code changes, prep the commit and STAGE them with `git add`, then stop and let me review and push. Do not run `git commit` or `git push` yourself unless I explicitly ask.
- Subagent-driven development for non-trivial work. Fresh subagent per task, two-stage review (spec compliance, then code quality).
- One logical change per commit so the history is readable.
- TDD for API/protection logic. Not for static React components — that is over-engineering for a portfolio site.
- I am still learning React and modern web dev. Explain things when relevant. I will ask about commits I do not understand.

## Tone rules for any new copy

- No em dashes (use a colon, full stop or comma instead). Date ranges with — are fine.
- No Oxford commas
- No corporate fluff
- Direct, conversational, short
- Do not overclaim on minor contributions
- Verify against the actual sites or sources before writing case study content. The original is at https://elecdes.com and my redesign is at https://beta.elecdes.com.

## Secrets

All env vars are set in the Vercel dashboard for Production and Preview. I will set up `.env.local` locally by copying `.env.example` and filling in values myself. Do not ask me to paste secrets into chat.

## Start here

Ask me what I want to work on next. Likely candidates: project assets, recruiter feedback once it lands, Whisper tool placement, or polishing existing copy.
