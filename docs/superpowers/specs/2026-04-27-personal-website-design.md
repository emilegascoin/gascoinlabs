# Personal Website — Design Spec

**Date:** 2026-04-27
**Author:** Emile Gascoin (with Claude Code)
**Status:** Approved for implementation planning

---

## 1. Goal

Build Emile Gascoin's personal portfolio website. Audience is hiring managers and recruiters in Melbourne. The site should feel direct, confident, personality-forward — not a corporate CV. It should both *talk about* Emile's AI-native workflow and *demonstrate* it via a grounded chatbot.

This spec covers v1. v2 is reserved for creative additions decided once v1 is live.

## 2. Scope

**In scope (v1):**
- Single-scroll home page (Hero, About, Experience, Education, AI workflow, Skills, Reference, Contact)
- elecdes case study page (`/work/elecdes`) including initial-design vs final-design process detail
- "Ask Emile" floating chat widget on every page
- Dedicated `/ask` chat page with full conversation
- Provider-agnostic AI backend (Gemini Flash default, Claude swappable)
- Layered abuse protection (Turnstile, rate limit, token cap, daily spend cap)
- Mobile responsive
- Deploy to Vercel and connect custom domain `gascoinlabs.com`
- Vitest unit tests on the `/api/ask` endpoint

**Out of scope (v1, may revisit in v2):**
- Additional case study pages (template ready, content deferred)
- Conversation analytics dashboard
- Additional AI demos beyond Ask Emile
- Blog or writing section
- Light/dark mode toggle
- User-facing analytics
- Custom domain `gascoinlabs.com` (purchased; DNS pointed at Vercel during launch)

## 3. Tech Stack

| Layer | Choice |
| --- | --- |
| Frontend | React + Vite, React Router |
| Styling | Tailwind CSS |
| Backend | Node.js as Vercel Serverless Functions |
| AI | Provider adapter — Gemini 1.5 Flash (default) or Claude Sonnet 4.6 |
| Storage | Upstash Redis (rate limit + spend tracking) |
| Bot protection | Cloudflare Turnstile |
| Hosting | Vercel (single project, frontend + functions) |
| Source control | GitHub |
| Tests | Vitest (API), Playwright optional |

## 4. Visual & Tone Direction

**Visual:** Editorial direction matched to Emile's CV palette. Warm white background (`#faf6ee`), navy accent (`#1f3a5f`) for headings, links, buttons and the chat widget. Serif display headings, sans-serif body, generous whitespace. Single column on mobile.

**Tone (per existing CLAUDE.md):**
- No em dashes, no Oxford commas, no corporate fluff
- Direct, conversational, the way Emile actually talks
- "So what" framing over granular technical details
- Don't overclaim on minor contributions

Copy lives in `src/lib/content.js` as the single source of truth, used by both the rendered site and the chatbot's grounding context.

## 5. Architecture

### Frontend routes
- `/` — single-scroll home
- `/ask` — full-page chat
- `/work/elecdes` — case study (template reusable for future projects under `/work/*`)

### API endpoints (`/api/*`)
- `POST /api/ask` — main chat endpoint (Turnstile + rate limit + spend cap + provider call)
- `GET /api/health` — sanity ping for deploys

### Repo layout
```
personal-website/
├── api/
│   ├── ask.js
│   └── health.js
├── public/
│   └── work/elecdes/        # case study screenshots
├── src/
│   ├── main.jsx
│   ├── App.jsx              # routes + global layout
│   ├── styles/index.css     # Tailwind directives
│   ├── lib/
│   │   ├── content.js       # all site copy + grounding source
│   │   ├── claudeContext.js # system prompt composition
│   │   └── aiProvider.js    # provider-agnostic adapter
│   ├── components/
│   │   ├── layout/          # Nav, Footer, ChatWidget
│   │   ├── home/            # Hero, About, Experience, Education, AIWorkflow, Skills, Reference, Contact
│   │   └── ui/              # Button, SectionHeading, etc.
│   └── pages/
│       ├── Home.jsx
│       ├── Ask.jsx
│       └── work/Elecdes.jsx
├── tailwind.config.js
├── vite.config.js
├── vercel.json
├── package.json
├── .env.example
└── CLAUDE.md
```

## 6. Chat Widget UX

**State:** React context (`ChatContext`) holding `{ open, draftMessage, setOpen, setDraft }`. Mounted in global layout, visible on every page except `/ask`.

**Collapsed state:** small bubble bottom-right with a short greeting (Emile's words, not Claude's defaults).

**Expanded state:** small panel with greeting, input field, and three suggestion chips (e.g. "What's the elecdes redesign?", "How do you actually use AI?", "What are you looking for?"). Final chip copy owned by Emile.

**Submission:** typing or chip click triggers `navigate('/ask', { state: { initialPrompt } })`. The `/ask` page reads `location.state.initialPrompt` and auto-submits the first turn if present.

## 7. AI Provider Adapter

`src/lib/aiProvider.js` exposes a single function:
```
aiProvider.send({ systemPrompt, messages, signal }) → { stream, usage }
```

Implementation dispatches based on `process.env.AI_PROVIDER` (`"gemini"` or `"claude"`). Both providers must support streaming responses. Usage object reports `{ inputTokens, outputTokens, costUsd }` so the spend tracker can record real costs.

**Default:** `AI_PROVIDER=gemini` (free tier).
**Switching:** changing the env var and redeploying is the entire change.

## 8. Ask Emile — Grounding & Behaviour

**System prompt** is composed in `src/lib/claudeContext.js` from the same `content.js` used by the rendered site. It includes:

- Identity statement ("You are Ask Emile, embedded on Emile Gascoin's portfolio site")
- Strict no-fabrication rule with explicit fallback line:
  *"I'm not sure off the top of my head — email me at emilegascoin@gmail.com and I'll get back to you when I've had a think."*
- First-person voice ("I", "my")
- Tone rules from CLAUDE.md (no em dashes, no Oxford commas, no fluff)
- The verified context block (CV summary, projects, working style)

**Conversation handling:**
- Last 10 turns kept client-side, sent with each request
- Server-side input cap of 8K tokens — if exceeded, oldest pairs trimmed silently with a `(earlier messages trimmed)` marker
- Streaming responses

**Won't answer:** salary expectations, personal details outside the grounding context, generic coding help (politely redirects).

## 9. Abuse Protection (layered, executed in order)

Inside `/api/ask`:

1. **Cloudflare Turnstile verification** — POST token to `siteverify`. Failure → 403.
2. **Per-IP rate limit** — Upstash counter `ratelimit:{ip}:{date}`, TTL 24h. Cap: 20 messages/IP/day. Failure → 429 with friendly message.
3. **Per-conversation token cap** — count input tokens, trim oldest if > 8K.
4. **Daily global spend cap** — Upstash counter `spend:{date}`, TTL 24h. Cap: $1 USD/day (configurable via env). At the start of each request, read today's accumulated spend; if it already exceeds the cap, short-circuit with the fallback below — no provider call made. Otherwise proceed, then after the provider call increment the counter by `inputTokens × inputRate + outputTokens × outputRate`. Fallback message: *"Ask Emile is taking a break for today. Email me at emilegascoin@gmail.com and I'll get back to you."*

**Lightweight logging:** successful and failed conversations recorded as `convo:{date}:{uuid}` with metadata only (no message content), TTL 30 days.

**Caps configurable via env:** `RATE_LIMIT_PER_DAY=20`, `DAILY_SPEND_CAP_USD=2`.

## 10. Environment Variables

```
AI_PROVIDER=gemini
GOOGLE_API_KEY=...
ANTHROPIC_API_KEY=...
TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
DAILY_SPEND_CAP_USD=1
RATE_LIMIT_PER_DAY=20
```

`.env.example` committed for reference. Real values pasted into Vercel dashboard.

## 11. Required Accounts

| Service | Purpose | Cost |
| --- | --- | --- |
| Google AI Studio | Gemini API key | Free tier (default provider) |
| Anthropic Console | Claude API key | Pay-as-you-go ($5 free credit) |
| Vercel | Hosting + functions | Free hobby tier |
| Cloudflare | Turnstile site/secret keys | Free |
| Upstash | Redis (rate limit + spend) | Free tier |
| GitHub | Source control | Free |

Realistic monthly cost: $0 with Gemini default. ~$0–5 if switched to Claude.

## 12. Dev & Deployment Workflow

**Local:** `vercel dev` runs Vite + functions together. `.env.local` provides secrets locally.

**Deployment:** Push to GitHub → Vercel auto-deploys. `main` = production. Branches = preview URLs.

**Going live, ordered:**
1. Build locally, test against Gemini free tier
2. Deploy to Vercel preview URL, share with a friend or two
3. Verify Turnstile + spend cap behave correctly
4. (Optional) Buy custom domain, point at Vercel
5. Add live URL to CV / LinkedIn / GitHub bio

## 13. Testing Strategy

- **Vitest** on `/api/ask` — unit-test abuse protection logic (rate limit math, spend tracking, token trimming, fallback messages, Turnstile stub failures). Provider call mocked.
- **Playwright** (optional, can defer) — one smoke test: home renders, widget opens, `/ask` loads.
- No tests on static React components.

## 14. Open Items Deferred to Implementation

These are decided in principle but the exact final values/copy belong to Emile and will be confirmed during implementation:

- Final hero, about, AI workflow and contact section copy
- Final widget greeting and three suggestion chips
- Suggestion chip pre-fills on `/ask` page
- Reference quote attribution wording
- Final accent colour confirmed (`#1f3a5f` navy, `#faf6ee` warm white — matched to CV)

## 15. v2 Candidates (not committed)

Ideas to revisit once v1 is live:
- Additional case studies as more projects ship
- Additional AI demos (e.g. live code review, "watch Claude work")
- Conversation analytics view (private, behind auth)
- Light/dark toggle
- Blog / writing
- Custom subtle animations

---
