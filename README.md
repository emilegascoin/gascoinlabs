# Personal website — gascoinlabs.com

Static portfolio + Ask Emile chatbot. React + Vite frontend, Vercel Serverless Functions backend, Tailwind, Vitest.

## Local dev

```bash
npm install
npm install -g vercel    # one-time
cp .env.example .env.local
# fill in .env.local with real values
vercel dev               # runs Vite + functions on http://localhost:3000
```

## Tests

```bash
npm test            # one-shot
npm run test:watch  # watch mode
```

## Deploy

Pushing to `main` deploys production via Vercel GitHub integration. Branches get preview URLs.

## Layout

- `src/lib/content.js` — single source of truth for all site copy + chatbot grounding
- `src/components/home/` — the 8 home page sections
- `src/pages/work/Elecdes.jsx` — first case study (template for future projects)
- `api/ask.js` — chatbot endpoint with Turnstile + rate limit + spend cap
- `api/_lib/` — abuse protection utilities (TDD'd)
- `docs/superpowers/specs/` — design spec
- `docs/superpowers/plans/` — implementation plan
