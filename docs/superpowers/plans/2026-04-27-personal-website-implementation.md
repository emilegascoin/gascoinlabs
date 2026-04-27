# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Emile Gascoin's personal portfolio website at gascoinlabs.com — single-scroll home, elecdes case study, "Ask Emile" chatbot with abuse protection — deployed on Vercel.

**Architecture:** Vite + React frontend (single repo), Tailwind for styling, React Router for routes, Vercel Serverless Functions for API. Provider-agnostic AI adapter (Gemini default, Claude swappable). Upstash Redis for rate limit + spend tracking, Cloudflare Turnstile for bot protection.

**Tech Stack:** React 18, Vite 5, React Router 6, Tailwind 3, Node 20 (Vercel functions), Anthropic SDK, Google GenAI SDK, Upstash Redis, Cloudflare Turnstile, Vitest.

---

## Spec reference
The full design spec lives at [`docs/superpowers/specs/2026-04-27-personal-website-design.md`](../specs/2026-04-27-personal-website-design.md). This plan implements that spec exactly.

## Notes for the implementing engineer

- **Frequent commits.** Each task ends with a commit. Don't batch.
- **TDD where it pays off.** API logic (rate limiter, spend cap, Turnstile verifier, provider adapter) is unit-tested first. Static React components are not TDD'd — visual changes are reviewed in the browser.
- **No CLI prompts.** When `npm create vite` etc. would prompt interactively, use the documented non-interactive flags shown in the steps.
- **All copy is placeholder until Emile provides final content.** Use the placeholder strings shown in the steps. Emile will replace them in `src/lib/content.js` later. Do NOT inline copy elsewhere.
- **Project root** for all relative paths in this plan: `/Users/emile/Desktop/Personal Projects/Personal Website/`.

---

## Phase 1 — Foundations

### Task 1: Scaffold Vite + React project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/styles/index.css`

- [ ] **Step 1: Scaffold the Vite project in the current directory**

```bash
cd "/Users/emile/Desktop/Personal Projects/Personal Website"
npm create vite@latest . -- --template react
```

If prompted "Current directory is not empty", choose **"Ignore files and continue"**. Vite preserves `CLAUDE.md`, `docs/`, `scripts/`, `.git/`.

- [ ] **Step 2: Install base dependencies**

```bash
npm install
```

- [ ] **Step 3: Install runtime dependencies we know we'll need**

```bash
npm install react-router-dom@6
```

- [ ] **Step 4: Install dev dependencies**

```bash
npm install -D tailwindcss@3 postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite prints `Local:   http://localhost:5173/` and the default page loads. Stop with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React project"
```

---

### Task 2: Configure Tailwind with the editorial theme

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/styles/index.css` (rename from `src/index.css`)
- Modify: `src/main.jsx`

- [ ] **Step 1: Initialise Tailwind config files**

```bash
npx tailwindcss init -p
```

- [ ] **Step 2: Replace `tailwind.config.js` with theme config**

Path: `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#faf6ee',
        navy: {
          DEFAULT: '#1f3a5f',
          dark: '#152741',
          light: '#2d5180',
        },
        ink: '#1a1a1a',
        muted: '#6b6b6b',
        rule: '#e6e0d4',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Move and replace styles**

```bash
mkdir -p src/styles
mv src/index.css src/styles/index.css 2>/dev/null || true
```

Replace `src/styles/index.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-cream text-ink font-sans antialiased;
  }
  h1, h2, h3 {
    @apply font-serif text-navy;
  }
}
```

- [ ] **Step 4: Update `src/main.jsx` import**

Replace `import './index.css'` with `import './styles/index.css'`.

- [ ] **Step 5: Replace `src/App.jsx` with a simple Tailwind smoke test**

```jsx
export default function App() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-serif text-5xl text-navy">Emile Gascoin</h1>
    </main>
  )
}
```

- [ ] **Step 6: Run dev server, confirm cream background and navy serif heading**

```bash
npm run dev
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: configure Tailwind with editorial theme"
```

---

### Task 3: Set up React Router with placeholder pages

**Files:**
- Create: `src/pages/Home.jsx`, `src/pages/Ask.jsx`, `src/pages/work/Elecdes.jsx`, `src/pages/NotFound.jsx`
- Modify: `src/App.jsx`, `src/main.jsx`

- [ ] **Step 1: Create placeholder pages**

`src/pages/Home.jsx`:
```jsx
export default function Home() {
  return <div className="p-8">Home (placeholder)</div>
}
```

`src/pages/Ask.jsx`:
```jsx
export default function Ask() {
  return <div className="p-8">Ask Emile (placeholder)</div>
}
```

`src/pages/work/Elecdes.jsx`:
```jsx
export default function Elecdes() {
  return <div className="p-8">Elecdes case study (placeholder)</div>
}
```

`src/pages/NotFound.jsx`:
```jsx
export default function NotFound() {
  return <div className="p-8">404 — Not found</div>
}
```

- [ ] **Step 2: Replace `src/App.jsx` with router**

```jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Ask from './pages/Ask'
import Elecdes from './pages/work/Elecdes'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ask" element={<Ask />} />
      <Route path="/work/elecdes" element={<Elecdes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

- [ ] **Step 3: Wrap App in BrowserRouter in `src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

- [ ] **Step 4: Verify all four routes render**

`npm run dev`, visit `/`, `/ask`, `/work/elecdes`, `/something-bogus`. Each shows its placeholder.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: set up React Router with placeholder pages"
```

---

### Task 4: Build layout shell (Nav + Footer + global container)

**Files:**
- Create: `src/components/layout/Nav.jsx`, `src/components/layout/Footer.jsx`, `src/components/layout/Layout.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create `src/components/layout/Nav.jsx`**

```jsx
import { Link, NavLink } from 'react-router-dom'

export default function Nav() {
  const linkClass = ({ isActive }) =>
    `text-sm hover:text-navy transition-colors ${isActive ? 'text-navy font-medium' : 'text-muted'}`

  return (
    <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur border-b border-rule">
      <nav className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-xl text-navy">Emile Gascoin</Link>
        <div className="flex gap-6">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/work/elecdes" className={linkClass}>Work</NavLink>
          <NavLink to="/ask" className={linkClass}>Ask Emile</NavLink>
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Create `src/components/layout/Footer.jsx`**

```jsx
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-muted flex flex-col sm:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} Emile Gascoin · Melbourne, VIC</p>
        <p className="font-mono text-xs">gascoinlabs.com</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Create `src/components/layout/Layout.jsx`**

```jsx
import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Wrap routes in Layout in `src/App.jsx`**

```jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Ask from './pages/Ask'
import Elecdes from './pages/work/Elecdes'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/work/elecdes" element={<Elecdes />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 5: Verify nav shows on every route, footer at the bottom**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add layout shell with nav and footer"
```

---

## Phase 2 — Content source of truth + home sections

### Task 5: Create `content.js` as single source of truth

**Files:**
- Create: `src/lib/content.js`

This file is the source of truth for both the rendered site and the chatbot's grounding context. All copy lives here.

- [ ] **Step 1: Create `src/lib/content.js`**

```js
// All site copy + chatbot grounding source. Emile owns this file.
// Placeholder copy is marked [PLACEHOLDER] — replace before launch.

export const profile = {
  name: 'Emile Gascoin',
  email: 'emilegascoin@gmail.com',
  phone: '+64 21 261 0764',
  github: 'https://github.com/emilegascoin',
  location: 'Melbourne, VIC',
  availability: 'Available now',
}

export const hero = {
  // [PLACEHOLDER] one-line positioning Emile will rewrite
  headline: 'Software developer building things with AI.',
  sub: 'Based in Melbourne. 2.5 years commercial experience across C++ and full-stack web. Looking for a role where AI-assisted development is the standard.',
  ctas: [
    { label: 'Ask Emile', to: '/ask', primary: true },
    { label: 'View work', to: '/work/elecdes', primary: false },
  ],
}

export const about = {
  // [PLACEHOLDER] short personality-forward paragraph
  paragraphs: [
    'Software developer with 2.5 years of commercial experience across C++ and full-stack web development. I work extensively with AI-assisted development using Claude Code, running parallel virtual machine environments to manage multiple issues simultaneously and acting as quality gate for AI-generated code.',
    'I prefer small teams (under 10), regular check-ins over end-of-task reviews, and software product companies over contracting firms. I am drawn to environments where tasks come from team discussion rather than an endless assigned backlog.',
  ],
}

export const experience = [
  {
    company: 'Scada Systems Ltd',
    location: 'Auckland',
    title: 'Graduate Software Engineer',
    dates: 'Nov 2023 — Mar 2026',
    summary: 'Two distinct workstreams: independently leading a full redesign of the Elecdes Design Suite marketing website, and developing C++ features for the Elecdes Design Suite itself.',
    bullets: [
      'Independently redesigned elecdes.com using HTML, CSS, JavaScript, PHP and SQL — multilingual system, Google Translate API, AJAX form handling, YouTube video embedding.',
      'Built an AI transcription tool using OpenAI Whisper (C++ wrapping Python subprocess) generating transcripts and SRT subtitle files from long-form video content.',
      'Developed C++ features for Elecdes Design Suite including a multithreaded duplicate detection tool and project-wide name sequencer expansion.',
      'Investigated and resolved client-reported issues across both the C++ codebase and the website stack.',
    ],
    caseStudyHref: '/work/elecdes',
  },
]

export const education = [
  {
    school: 'University of Auckland',
    qualification: 'Programming with Web Technologies',
    dates: 'Jul–Nov 2026',
    detail: 'Svelte, Node.js, SQLite, REST APIs',
  },
  {
    school: 'Victoria University of Wellington',
    qualification: 'BSc Computer Science',
    dates: 'Nov 2023',
    detail: 'Database Systems, AI/ML, Systems Programming, UX Engineering, Cloud and Networking',
  },
]

export const aiWorkflow = {
  // [PLACEHOLDER] Emile's framing of the AI workflow story
  intro: 'I use Claude Code as a development partner, not a fancy autocomplete. Roughly 5x more productive than working without it, by my honest estimate.',
  steps: [
    'Brainstorm the problem with Claude Code.',
    'Work up a plan and get started.',
    'Run multiple VMs in parallel — each tackling a separate issue simultaneously.',
    'While one instance runs or compiles, scope and brief the next problem.',
    'Act as quality gate — review, connect, ensure best practices.',
    'Fix any underlying issues and retest.',
    'Push for review.',
  ],
}

export const skills = {
  Languages: ['C++', 'JavaScript', 'PHP', 'Java', 'C', 'Python'],
  Frontend: ['HTML', 'CSS', 'React', 'Svelte', 'Tailwind'],
  Backend: ['Node.js', 'Express', 'PHP'],
  Databases: ['SQL', 'SQLite', 'PostgreSQL', 'MS Access', 'SQL Server'],
  Tools: ['Git', 'Redmine', 'MFC', 'AutoCAD'],
  AI: ['Claude Code', 'parallel VM workflow', 'Anthropic SDK', 'Google GenAI SDK'],
}

export const reference = {
  // [PLACEHOLDER] Emile to confirm exact wording
  quote: 'Reliable, professional and competent. Works well solo and collaboratively. Recommended for any software or technology role.',
  attribution: 'David Monaghan, CEO, Scada Systems Ltd',
  date: '9 March 2026',
}

export const askEmileWidget = {
  // [PLACEHOLDER] Emile to write his own
  greeting: 'Hi — what would you like to know about me or my work?',
  suggestions: [
    'What is the elecdes redesign?',
    'How do you actually use AI?',
    'What kind of role are you looking for?',
  ],
}

export const elecdesCaseStudy = {
  // [PLACEHOLDER] Emile to flesh out
  title: 'Elecdes Design Suite — marketing site redesign',
  role: 'Sole designer and developer',
  dates: 'Late 2024 — early 2026',
  stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'OpenAI Whisper', 'Git'],
  context: 'Scada Systems Ltd needed a modernised marketing site for its flagship product, Elecdes Design Suite. The old site centred on a rotating slider and dense product copy. I was given full autonomy on the redesign.',
  process: [
    'Pitched an initial design — clean hero, category tiles, customer logos, a case study, and outcome-driven copy.',
    'Reworked the design to fit feedback from the company director, who wanted slightly more density on the homepage and the customer portal surfaced more aggressively.',
    'Iterated on layout and copy with weekly check-ins, deploying to a beta server (beta.elecdes.com) for review.',
  ],
  features: [
    { title: 'Multilingual system', detail: 'PHP-based EN/ES/FR/DE switching via GET/POST params, integrated with Google Translate API.' },
    { title: 'AJAX form handling', detail: 'Live demo and contact form submissions without page reload, validated server-side.' },
    { title: 'AI transcription tool', detail: 'C++ wrapper around Python and OpenAI Whisper, generating transcripts and SRT subtitles for long-form videos.' },
    { title: 'YouTube video embedding', detail: 'JavaScript-driven video switching with lazy-loaded thumbnails for performance.' },
    { title: 'Customer portal', detail: 'User management and download links integrated with existing licence database.' },
    { title: 'Email templates', detail: 'Designed responsive transactional templates for demo requests and contact submissions.' },
  ],
  outcome: 'The redesign is live at beta.elecdes.com. The hero section, category tiles, BlueScope Steel case study, and customer logo strip are all visible improvements over the original elecdes.com.',
  links: [
    { label: 'Original (before)', href: 'https://elecdes.com' },
    { label: 'Redesign (after)', href: 'https://beta.elecdes.com' },
  ],
}

export const all = {
  profile, hero, about, experience, education,
  aiWorkflow, skills, reference, askEmileWidget, elecdesCaseStudy,
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add content.js as single source of truth for site copy"
```

---

### Task 6: Hero section

**Files:**
- Create: `src/components/ui/Button.jsx`, `src/components/home/Hero.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Create reusable `Button` component**

`src/components/ui/Button.jsx`:
```jsx
import { Link } from 'react-router-dom'

export default function Button({ to, href, primary = false, children, className = '' }) {
  const base = 'inline-block px-5 py-2.5 rounded-full text-sm transition-colors'
  const variant = primary
    ? 'bg-navy text-cream hover:bg-navy-dark'
    : 'border border-navy text-navy hover:bg-navy hover:text-cream'

  if (href) {
    return <a href={href} className={`${base} ${variant} ${className}`}>{children}</a>
  }
  return <Link to={to} className={`${base} ${variant} ${className}`}>{children}</Link>
}
```

- [ ] **Step 2: Create `src/components/home/Hero.jsx`**

```jsx
import { hero, profile } from '../../lib/content'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section id="hero" className="mx-auto max-w-5xl px-6 pt-20 pb-24">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
        // {profile.location.toLowerCase()}
      </p>
      <h1 className="font-serif text-5xl sm:text-6xl text-navy leading-[1.05] tracking-tight">
        {hero.headline}
      </h1>
      <p className="mt-6 max-w-prose text-lg text-ink/80 leading-relaxed">
        {hero.sub}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        {hero.ctas.map((cta) => (
          <Button key={cta.label} to={cta.to} primary={cta.primary}>
            {cta.label}
          </Button>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Render Hero from `src/pages/Home.jsx`**

```jsx
import Hero from '../components/home/Hero'

export default function Home() {
  return (
    <>
      <Hero />
    </>
  )
}
```

- [ ] **Step 4: Verify in browser at `/`**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add hero section"
```

---

### Task 7: About section

**Files:**
- Create: `src/components/ui/SectionHeading.jsx`, `src/components/home/About.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Create `src/components/ui/SectionHeading.jsx`**

```jsx
export default function SectionHeading({ label, title, id }) {
  return (
    <header id={id} className="mb-10">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
        {label}
      </p>
      <h2 className="font-serif text-3xl sm:text-4xl text-navy">{title}</h2>
    </header>
  )
}
```

- [ ] **Step 2: Create `src/components/home/About.jsx`**

```jsx
import { about } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function About() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="about" label="01 — about" title="Who I am" />
      <div className="max-w-prose space-y-5 text-lg leading-relaxed">
        {about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add About to Home page**

`src/pages/Home.jsx`:
```jsx
import Hero from '../components/home/Hero'
import About from '../components/home/About'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
    </>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add about section"
```

---

### Task 8: Experience section

**Files:**
- Create: `src/components/home/Experience.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Create `src/components/home/Experience.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { experience } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function Experience() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="experience" label="02 — experience" title="Where I've worked" />
      <div className="space-y-12">
        {experience.map((job) => (
          <article key={job.company} className="grid sm:grid-cols-[180px_1fr] gap-6">
            <div>
              <p className="font-mono text-xs text-muted">{job.dates}</p>
              <p className="font-mono text-xs text-muted">{job.location}</p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-navy">{job.title}</h3>
              <p className="text-muted text-sm mb-3">{job.company}</p>
              <p className="max-w-prose mb-4">{job.summary}</p>
              <ul className="space-y-2 max-w-prose">
                {job.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-navy">→</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {job.caseStudyHref && (
                <Link
                  to={job.caseStudyHref}
                  className="inline-block mt-5 text-sm text-navy underline underline-offset-4 hover:text-navy-dark"
                >
                  Read the case study →
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add Experience to Home page**

Append to `src/pages/Home.jsx`:
```jsx
import Experience from '../components/home/Experience'
// ...
<Experience />
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add experience section"
```

---

### Task 9: Education section

**Files:**
- Create: `src/components/home/Education.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Create `src/components/home/Education.jsx`**

```jsx
import { education } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function Education() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="education" label="03 — education" title="Where I studied" />
      <div className="space-y-8">
        {education.map((e) => (
          <article key={e.school} className="grid sm:grid-cols-[180px_1fr] gap-6">
            <p className="font-mono text-xs text-muted">{e.dates}</p>
            <div>
              <h3 className="font-serif text-xl text-navy">{e.qualification}</h3>
              <p className="text-muted text-sm">{e.school}</p>
              <p className="mt-2 text-sm">{e.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to Home page**

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add education section"
```

---

### Task 10: AI Workflow section

**Files:**
- Create: `src/components/home/AIWorkflow.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Create `src/components/home/AIWorkflow.jsx`**

```jsx
import { aiWorkflow } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function AIWorkflow() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="ai-workflow" label="04 — how I work" title="AI-assisted, end to end" />
      <p className="max-w-prose text-lg leading-relaxed mb-8">{aiWorkflow.intro}</p>
      <ol className="space-y-4 max-w-prose">
        {aiWorkflow.steps.map((step, i) => (
          <li key={i} className="grid grid-cols-[40px_1fr] gap-4 items-start">
            <span className="font-mono text-xs text-navy pt-1">{String(i + 1).padStart(2, '0')}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-prose text-sm text-muted italic">
        Curious how this works in practice? Try the chat widget — it's grounded in this same context.
      </p>
    </section>
  )
}
```

- [ ] **Step 2: Add to Home page**

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add AI workflow section"
```

---

### Task 11: Skills section

**Files:**
- Create: `src/components/home/Skills.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Create `src/components/home/Skills.jsx`**

```jsx
import { skills } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function Skills() {
  const groups = Object.entries(skills)
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="skills" label="05 — stack" title="What I work with" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map(([group, items]) => (
          <div key={group}>
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">{group}</p>
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item} className="px-3 py-1 border border-rule rounded-full text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to Home page**

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add skills section"
```

---

### Task 12: Reference section

**Files:**
- Create: `src/components/home/Reference.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Create `src/components/home/Reference.jsx`**

```jsx
import { reference } from '../../lib/content'

export default function Reference() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <figure className="max-w-prose">
        <blockquote className="font-serif text-2xl sm:text-3xl text-navy leading-snug italic">
          “{reference.quote}”
        </blockquote>
        <figcaption className="mt-6 text-sm text-muted">
          — {reference.attribution}
          <span className="block font-mono text-xs mt-1">{reference.date}</span>
        </figcaption>
      </figure>
    </section>
  )
}
```

- [ ] **Step 2: Add to Home page**

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add reference quote section"
```

---

### Task 13: Contact section

**Files:**
- Create: `src/components/home/Contact.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Create `src/components/home/Contact.jsx`**

```jsx
import { profile } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function Contact() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="contact" label="06 — contact" title="Get in touch" />
      <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-8 max-w-prose text-sm">
        <dt className="font-mono text-xs uppercase tracking-widest text-muted">Email</dt>
        <dd><a href={`mailto:${profile.email}`} className="text-navy underline underline-offset-4">{profile.email}</a></dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-muted">Phone</dt>
        <dd>{profile.phone}</dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-muted">GitHub</dt>
        <dd><a href={profile.github} className="text-navy underline underline-offset-4" target="_blank" rel="noreferrer">{profile.github.replace('https://', '')}</a></dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-muted">Location</dt>
        <dd>{profile.location} · {profile.availability}</dd>
      </dl>
    </section>
  )
}
```

- [ ] **Step 2: Add to Home page (final order)**

`src/pages/Home.jsx`:
```jsx
import Hero from '../components/home/Hero'
import About from '../components/home/About'
import Experience from '../components/home/Experience'
import Education from '../components/home/Education'
import AIWorkflow from '../components/home/AIWorkflow'
import Skills from '../components/home/Skills'
import Reference from '../components/home/Reference'
import Contact from '../components/home/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Education />
      <AIWorkflow />
      <Skills />
      <Reference />
      <Contact />
    </>
  )
}
```

- [ ] **Step 3: Verify entire home page renders top-to-bottom**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add contact section and complete home page composition"
```

---

## Phase 3 — Case study page

### Task 14: Elecdes case study page

**Files:**
- Modify: `src/pages/work/Elecdes.jsx`
- Create: `public/work/elecdes/.gitkeep` (assets dropped in by Emile later)

- [ ] **Step 1: Create empty asset directory**

```bash
mkdir -p public/work/elecdes
touch public/work/elecdes/.gitkeep
```

- [ ] **Step 2: Replace `src/pages/work/Elecdes.jsx`**

```jsx
import { elecdesCaseStudy } from '../../lib/content'
import { Link } from 'react-router-dom'

export default function Elecdes() {
  const c = elecdesCaseStudy
  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <Link to="/" className="text-sm text-muted hover:text-navy">← Back home</Link>

      <header className="mt-8 pb-10 border-b border-rule">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Case study</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy leading-tight">{c.title}</h1>
        <dl className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
          <div><dt className="text-muted text-xs">Role</dt><dd>{c.role}</dd></div>
          <div><dt className="text-muted text-xs">Dates</dt><dd>{c.dates}</dd></div>
          <div><dt className="text-muted text-xs">Stack</dt><dd>{c.stack.join(', ')}</dd></div>
        </dl>
      </header>

      <section className="py-12 max-w-prose">
        <h2 className="font-serif text-2xl text-navy mb-4">Context</h2>
        <p className="leading-relaxed">{c.context}</p>
      </section>

      <section className="py-12 max-w-prose border-t border-rule">
        <h2 className="font-serif text-2xl text-navy mb-4">Process</h2>
        <ol className="space-y-3 list-decimal list-inside">
          {c.process.map((p, i) => <li key={i} className="leading-relaxed">{p}</li>)}
        </ol>
        <p className="mt-6 text-sm text-muted italic">
          [Initial design screenshot and final design screenshot will be inserted here once Emile drops the images into <code>public/work/elecdes/</code>.]
        </p>
      </section>

      <section className="py-12 border-t border-rule">
        <h2 className="font-serif text-2xl text-navy mb-6">Features shipped</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {c.features.map((f) => (
            <div key={f.title} className="border border-rule rounded-lg p-5 bg-cream">
              <h3 className="font-serif text-lg text-navy mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 max-w-prose border-t border-rule">
        <h2 className="font-serif text-2xl text-navy mb-4">Outcome</h2>
        <p className="leading-relaxed">{c.outcome}</p>
        <ul className="mt-6 flex flex-wrap gap-4">
          {c.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer" className="text-navy underline underline-offset-4">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
```

- [ ] **Step 3: Verify `/work/elecdes` renders**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add elecdes case study page structure"
```

---

## Phase 4 — AI provider adapter

### Task 15: Provider adapter scaffolding (with TDD)

**Files:**
- Create: `src/lib/aiProvider.js`, `src/lib/aiProvider.test.js`
- Create: `vitest.config.js`

- [ ] **Step 1: Create `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
})
```

- [ ] **Step 2: Add test script to `package.json`**

In `package.json` "scripts", add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Write failing test `src/lib/aiProvider.test.js`**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('aiProvider', () => {
  beforeEach(() => {
    vi.resetModules()
    delete process.env.AI_PROVIDER
    delete process.env.GOOGLE_API_KEY
    delete process.env.ANTHROPIC_API_KEY
  })

  it('throws if AI_PROVIDER is unset', async () => {
    const { aiProvider } = await import('./aiProvider.js')
    await expect(aiProvider.send({ systemPrompt: 'x', messages: [] }))
      .rejects.toThrow(/AI_PROVIDER/)
  })

  it('throws on unknown provider', async () => {
    process.env.AI_PROVIDER = 'banana'
    const { aiProvider } = await import('./aiProvider.js')
    await expect(aiProvider.send({ systemPrompt: 'x', messages: [] }))
      .rejects.toThrow(/unknown provider/i)
  })

  it('throws if Gemini chosen with no GOOGLE_API_KEY', async () => {
    process.env.AI_PROVIDER = 'gemini'
    const { aiProvider } = await import('./aiProvider.js')
    await expect(aiProvider.send({ systemPrompt: 'x', messages: [] }))
      .rejects.toThrow(/GOOGLE_API_KEY/)
  })

  it('throws if Claude chosen with no ANTHROPIC_API_KEY', async () => {
    process.env.AI_PROVIDER = 'claude'
    const { aiProvider } = await import('./aiProvider.js')
    await expect(aiProvider.send({ systemPrompt: 'x', messages: [] }))
      .rejects.toThrow(/ANTHROPIC_API_KEY/)
  })
})
```

- [ ] **Step 4: Run tests, expect failure**

```bash
npm test
```
Expected: 4 failing tests because `aiProvider.js` does not exist.

- [ ] **Step 5: Create `src/lib/aiProvider.js` skeleton**

```js
const PROVIDERS = ['gemini', 'claude']

export const aiProvider = {
  async send({ systemPrompt, messages, signal }) {
    const provider = process.env.AI_PROVIDER
    if (!provider) throw new Error('AI_PROVIDER env var not set')
    if (!PROVIDERS.includes(provider)) {
      throw new Error(`Unknown provider: ${provider}`)
    }

    if (provider === 'gemini') {
      if (!process.env.GOOGLE_API_KEY) throw new Error('GOOGLE_API_KEY not set')
      const { sendGemini } = await import('./providers/gemini.js')
      return sendGemini({ systemPrompt, messages, signal })
    }

    if (provider === 'claude') {
      if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set')
      const { sendClaude } = await import('./providers/claude.js')
      return sendClaude({ systemPrompt, messages, signal })
    }
  },
}
```

- [ ] **Step 6: Run tests, expect 4 passing**

```bash
npm test
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add AI provider adapter with env validation"
```

---

### Task 16: Gemini provider implementation

**Files:**
- Create: `src/lib/providers/gemini.js`

- [ ] **Step 1: Install Google GenAI SDK**

```bash
npm install @google/genai
```

- [ ] **Step 2: Create `src/lib/providers/gemini.js`**

```js
import { GoogleGenAI } from '@google/genai'

// Pricing as of 2026 — update if Google changes it.
// Source: https://ai.google.dev/gemini-api/docs/pricing
const PRICING = {
  inputPerMillion: 0.075,
  outputPerMillion: 0.30,
}

export async function sendGemini({ systemPrompt, messages, signal }) {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })

  // Convert our message format to Gemini's contents format.
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const response = await ai.models.generateContentStream({
    model: 'gemini-1.5-flash',
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

  // Caller iterates the stream first, then reads usage when done.
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
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Gemini provider implementation"
```

---

### Task 17: Claude provider implementation

**Files:**
- Create: `src/lib/providers/claude.js`

- [ ] **Step 1: Install Anthropic SDK**

```bash
npm install @anthropic-ai/sdk
```

- [ ] **Step 2: Create `src/lib/providers/claude.js`**

```js
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
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Claude provider implementation"
```

---

### Task 18: System prompt composition

**Files:**
- Create: `src/lib/claudeContext.js`, `src/lib/claudeContext.test.js`

- [ ] **Step 1: Write failing test `src/lib/claudeContext.test.js`**

```js
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
```

- [ ] **Step 2: Run, expect failure**

```bash
npm test
```

- [ ] **Step 3: Create `src/lib/claudeContext.js`**

```js
import { profile, hero, about, experience, education, aiWorkflow, skills, reference, elecdesCaseStudy } from './content.js'

export function buildSystemPrompt() {
  return `You are "Ask Emile" — a chatbot embedded in Emile Gascoin's personal portfolio site at gascoinlabs.com.
You answer FOR Emile based strictly on the verified context below. Speak in first person ("I", "my").

Strict rules:
- Never invent details. If something is not in the context, say so plainly:
  "I'm not sure off the top of my head — email me at ${profile.email} and I'll get back to you when I've had a think."
- Never claim Emile knows or has done something not stated below.
- Don't roleplay as a generic assistant. You are a specific developer.
- Don't answer salary questions, personal life questions, or generic coding help. Politely redirect to email.
- Follow Emile's writing rules: no em dashes, no Oxford commas, no corporate fluff. Be direct, conversational and concise.

=== VERIFIED CONTEXT ===

PROFILE
- Name: ${profile.name}
- Location: ${profile.location} (${profile.availability})
- Email: ${profile.email}
- GitHub: ${profile.github}

HEADLINE
${hero.headline}
${hero.sub}

ABOUT
${about.paragraphs.join('\n\n')}

EXPERIENCE
${experience.map((j) => `${j.company} — ${j.title} (${j.dates}, ${j.location})\nSummary: ${j.summary}\nKey work:\n${j.bullets.map((b) => `  - ${b}`).join('\n')}`).join('\n\n')}

EDUCATION
${education.map((e) => `${e.qualification}, ${e.school} (${e.dates}). ${e.detail}`).join('\n')}

AI WORKFLOW
${aiWorkflow.intro}
Steps:
${aiWorkflow.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

SKILLS
${Object.entries(skills).map(([g, items]) => `${g}: ${items.join(', ')}`).join('\n')}

REFERENCE QUOTE
"${reference.quote}" — ${reference.attribution} (${reference.date})

FEATURED PROJECT — ELECDES REDESIGN
${elecdesCaseStudy.context}
Stack: ${elecdesCaseStudy.stack.join(', ')}
Features:
${elecdesCaseStudy.features.map((f) => `  - ${f.title}: ${f.detail}`).join('\n')}
Outcome: ${elecdesCaseStudy.outcome}

=== END CONTEXT ===
`
}
```

- [ ] **Step 4: Run tests, expect 5 passing**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: compose system prompt from content.js"
```

---

## Phase 5 — Abuse protection utilities

### Task 19: Upstash Redis client wrapper

**Files:**
- Create: `api/_lib/redis.js`

- [ ] **Step 1: Install Upstash REST client**

```bash
npm install @upstash/redis
```

- [ ] **Step 2: Create `api/_lib/redis.js`**

```js
import { Redis } from '@upstash/redis'

let _redis
export function getRedis() {
  if (!_redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set')
    }
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return _redis
}

export function todayKey(prefix) {
  const d = new Date().toISOString().slice(0, 10)
  return `${prefix}:${d}`
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Upstash Redis wrapper"
```

---

### Task 20: Rate limiter with TDD

**Files:**
- Create: `api/_lib/rateLimit.js`, `api/_lib/rateLimit.test.js`

- [ ] **Step 1: Write failing test `api/_lib/rateLimit.test.js`**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockIncr = vi.fn()
const mockExpire = vi.fn()
vi.mock('./redis.js', () => ({
  getRedis: () => ({ incr: mockIncr, expire: mockExpire }),
  todayKey: (prefix) => `${prefix}:2026-04-27`,
}))

const { checkRateLimit } = await import('./rateLimit.js')

describe('checkRateLimit', () => {
  beforeEach(() => {
    mockIncr.mockReset()
    mockExpire.mockReset()
    process.env.RATE_LIMIT_PER_DAY = '20'
  })

  it('allows the first request', async () => {
    mockIncr.mockResolvedValue(1)
    const result = await checkRateLimit('1.2.3.4')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(19)
  })

  it('sets TTL on first request', async () => {
    mockIncr.mockResolvedValue(1)
    await checkRateLimit('1.2.3.4')
    expect(mockExpire).toHaveBeenCalledWith('ratelimit:1.2.3.4:2026-04-27', 86400)
  })

  it('does not reset TTL on subsequent requests', async () => {
    mockIncr.mockResolvedValue(5)
    await checkRateLimit('1.2.3.4')
    expect(mockExpire).not.toHaveBeenCalled()
  })

  it('blocks when count exceeds cap', async () => {
    mockIncr.mockResolvedValue(21)
    const result = await checkRateLimit('1.2.3.4')
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })
})
```

- [ ] **Step 2: Run, expect failure**

- [ ] **Step 3: Create `api/_lib/rateLimit.js`**

```js
import { getRedis, todayKey } from './redis.js'

export async function checkRateLimit(ip) {
  const limit = parseInt(process.env.RATE_LIMIT_PER_DAY || '20', 10)
  const redis = getRedis()
  const key = todayKey(`ratelimit:${ip}`)
  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, 86400)
  }
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    count,
    limit,
  }
}
```

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add per-IP rate limiter"
```

---

### Task 21: Daily spend cap with TDD

**Files:**
- Create: `api/_lib/spendCap.js`, `api/_lib/spendCap.test.js`

- [ ] **Step 1: Write failing test `api/_lib/spendCap.test.js`**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGet = vi.fn()
const mockIncrbyfloat = vi.fn()
const mockExpire = vi.fn()
vi.mock('./redis.js', () => ({
  getRedis: () => ({ get: mockGet, incrbyfloat: mockIncrbyfloat, expire: mockExpire }),
  todayKey: (p) => `${p}:2026-04-27`,
}))

const { checkSpendCap, recordSpend } = await import('./spendCap.js')

describe('checkSpendCap', () => {
  beforeEach(() => {
    mockGet.mockReset()
    process.env.DAILY_SPEND_CAP_USD = '1'
  })

  it('allows when under cap', async () => {
    mockGet.mockResolvedValue('0.30')
    expect(await checkSpendCap()).toEqual({ allowed: true, spent: 0.30, cap: 1 })
  })

  it('blocks when at cap', async () => {
    mockGet.mockResolvedValue('1.00')
    expect((await checkSpendCap()).allowed).toBe(false)
  })

  it('blocks when over cap', async () => {
    mockGet.mockResolvedValue('1.50')
    expect((await checkSpendCap()).allowed).toBe(false)
  })

  it('treats missing key as zero spend', async () => {
    mockGet.mockResolvedValue(null)
    expect(await checkSpendCap()).toEqual({ allowed: true, spent: 0, cap: 1 })
  })
})

describe('recordSpend', () => {
  beforeEach(() => {
    mockIncrbyfloat.mockReset()
    mockExpire.mockReset()
  })

  it('increments by the cost amount', async () => {
    mockIncrbyfloat.mockResolvedValue('0.05')
    await recordSpend(0.05)
    expect(mockIncrbyfloat).toHaveBeenCalledWith('spend:2026-04-27', 0.05)
  })

  it('sets TTL', async () => {
    mockIncrbyfloat.mockResolvedValue('0.05')
    await recordSpend(0.05)
    expect(mockExpire).toHaveBeenCalledWith('spend:2026-04-27', 86400)
  })
})
```

- [ ] **Step 2: Run, expect failure**

- [ ] **Step 3: Create `api/_lib/spendCap.js`**

```js
import { getRedis, todayKey } from './redis.js'

const KEY = () => todayKey('spend')

export async function checkSpendCap() {
  const cap = parseFloat(process.env.DAILY_SPEND_CAP_USD || '1')
  const redis = getRedis()
  const raw = await redis.get(KEY())
  const spent = raw ? parseFloat(raw) : 0
  return { allowed: spent < cap, spent, cap }
}

export async function recordSpend(costUsd) {
  if (!costUsd || costUsd <= 0) return
  const redis = getRedis()
  await redis.incrbyfloat(KEY(), costUsd)
  await redis.expire(KEY(), 86400)
}
```

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add daily spend cap tracking"
```

---

### Task 22: Turnstile verifier with TDD

**Files:**
- Create: `api/_lib/turnstile.js`, `api/_lib/turnstile.test.js`

- [ ] **Step 1: Write failing test `api/_lib/turnstile.test.js`**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'

const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

const { verifyTurnstile } = await import('./turnstile.js')

describe('verifyTurnstile', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    process.env.TURNSTILE_SECRET_KEY = 'test-secret'
  })

  it('returns true on success', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    expect(await verifyTurnstile('token', '1.2.3.4')).toBe(true)
  })

  it('returns false on Cloudflare failure response', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }) })
    expect(await verifyTurnstile('token', '1.2.3.4')).toBe(false)
  })

  it('returns false if fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('network'))
    expect(await verifyTurnstile('token', '1.2.3.4')).toBe(false)
  })

  it('returns false on missing token', async () => {
    expect(await verifyTurnstile('', '1.2.3.4')).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run, expect failure**

- [ ] **Step 3: Create `api/_lib/turnstile.js`**

```js
const ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token, ip) {
  if (!token) return false
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY not set')
    return false
  }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip || '' }),
    })
    if (!res.ok) return false
    const data = await res.json()
    return Boolean(data.success)
  } catch (err) {
    console.error('Turnstile verify error', err)
    return false
  }
}
```

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Cloudflare Turnstile server-side verifier"
```

---

### Task 23: Token-cap helper

**Files:**
- Create: `api/_lib/trimMessages.js`, `api/_lib/trimMessages.test.js`

- [ ] **Step 1: Write failing test `api/_lib/trimMessages.test.js`**

```js
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
```

- [ ] **Step 2: Run, expect failure**

- [ ] **Step 3: Create `api/_lib/trimMessages.js`**

```js
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
```

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add conversation token cap helper"
```

---

## Phase 6 — API endpoints

### Task 24: `/api/health` endpoint

**Files:**
- Create: `api/health.js`

- [ ] **Step 1: Create `api/health.js`**

```js
export default function handler(req, res) {
  res.status(200).json({ ok: true, time: new Date().toISOString() })
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add /api/health endpoint"
```

---

### Task 25: `/api/ask` endpoint integration

**Files:**
- Create: `api/ask.js`, `api/ask.test.js`

- [ ] **Step 1: Write failing integration test `api/ask.test.js`**

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./_lib/turnstile.js', () => ({ verifyTurnstile: vi.fn() }))
vi.mock('./_lib/rateLimit.js', () => ({ checkRateLimit: vi.fn() }))
vi.mock('./_lib/spendCap.js', () => ({ checkSpendCap: vi.fn(), recordSpend: vi.fn() }))
vi.mock('../src/lib/aiProvider.js', () => ({ aiProvider: { send: vi.fn() } }))

const { verifyTurnstile } = await import('./_lib/turnstile.js')
const { checkRateLimit } = await import('./_lib/rateLimit.js')
const { checkSpendCap, recordSpend } = await import('./_lib/spendCap.js')
const { aiProvider } = await import('../src/lib/aiProvider.js')
const handler = (await import('./ask.js')).default

function mockRes() {
  return {
    statusCode: 200,
    body: '',
    headers: {},
    status(c) { this.statusCode = c; return this },
    json(obj) { this.body = JSON.stringify(obj); return this },
    setHeader(k, v) { this.headers[k] = v; return this },
    write(chunk) { this.body += chunk; return true },
    end() { this.ended = true },
  }
}

function mockReq(body = {}, headers = {}) {
  return {
    method: 'POST',
    body,
    headers: { 'x-forwarded-for': '1.2.3.4', ...headers },
  }
}

describe('/api/ask', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('rejects non-POST', async () => {
    const res = mockRes()
    await handler({ method: 'GET' }, res)
    expect(res.statusCode).toBe(405)
  })

  it('rejects when Turnstile fails', async () => {
    verifyTurnstile.mockResolvedValue(false)
    const res = mockRes()
    await handler(mockReq({ message: 'hi', turnstileToken: 't', history: [] }), res)
    expect(res.statusCode).toBe(403)
  })

  it('rejects when rate-limited', async () => {
    verifyTurnstile.mockResolvedValue(true)
    checkRateLimit.mockResolvedValue({ allowed: false, remaining: 0 })
    const res = mockRes()
    await handler(mockReq({ message: 'hi', turnstileToken: 't', history: [] }), res)
    expect(res.statusCode).toBe(429)
  })

  it('returns fallback when spend cap reached', async () => {
    verifyTurnstile.mockResolvedValue(true)
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 19 })
    checkSpendCap.mockResolvedValue({ allowed: false, spent: 1, cap: 1 })
    const res = mockRes()
    await handler(mockReq({ message: 'hi', turnstileToken: 't', history: [] }), res)
    expect(res.statusCode).toBe(200)
    expect(res.body).toMatch(/Ask Emile is taking a break/)
  })

  it('streams response on happy path', async () => {
    verifyTurnstile.mockResolvedValue(true)
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 19 })
    checkSpendCap.mockResolvedValue({ allowed: true, spent: 0, cap: 1 })
    async function* fakeStream() { yield 'Hello'; yield ' there.' }
    aiProvider.send.mockResolvedValue({
      stream: fakeStream(),
      getUsage: () => ({ inputTokens: 10, outputTokens: 5, costUsd: 0.001 }),
    })
    const res = mockRes()
    await handler(mockReq({ message: 'hi', turnstileToken: 't', history: [] }), res)
    expect(res.body).toMatch(/Hello there\./)
    expect(recordSpend).toHaveBeenCalledWith(0.001)
  })
})
```

- [ ] **Step 2: Run, expect failure**

- [ ] **Step 3: Create `api/ask.js`**

```js
import { verifyTurnstile } from './_lib/turnstile.js'
import { checkRateLimit } from './_lib/rateLimit.js'
import { checkSpendCap, recordSpend } from './_lib/spendCap.js'
import { trimMessages } from './_lib/trimMessages.js'
import { aiProvider } from '../src/lib/aiProvider.js'
import { buildSystemPrompt } from '../src/lib/claudeContext.js'

const FALLBACK_SPEND_CAP = "Ask Emile is taking a break for today. Email me at emilegascoin@gmail.com and I'll get back to you when I've had a think."

function getIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string') return fwd.split(',')[0].trim()
  return req.headers['x-real-ip'] || 'unknown'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { message, history = [], turnstileToken } = req.body || {}
  const ip = getIp(req)

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Missing message' })
    return
  }

  // 1. Turnstile
  const turnstileOk = await verifyTurnstile(turnstileToken, ip)
  if (!turnstileOk) {
    res.status(403).json({ error: 'Verification failed' })
    return
  }

  // 2. Rate limit
  const rl = await checkRateLimit(ip)
  if (!rl.allowed) {
    res.status(429).json({
      error: "You've hit today's limit. Email me at emilegascoin@gmail.com if you've got more questions.",
    })
    return
  }

  // 3. Spend cap
  const spend = await checkSpendCap()
  if (!spend.allowed) {
    res.status(200).setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.write(FALLBACK_SPEND_CAP)
    res.end()
    return
  }

  // 4. Token trim
  const systemPrompt = buildSystemPrompt()
  const allMessages = [...history, { role: 'user', content: message }]
  const { messages: trimmedMessages, trimmed } = trimMessages(allMessages, systemPrompt, 8000)

  // 5. Provider
  res.status(200).setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  if (trimmed) res.write('(earlier messages trimmed)\n\n')

  let result
  try {
    result = await aiProvider.send({ systemPrompt, messages: trimmedMessages })
    for await (const chunk of result.stream) {
      res.write(chunk)
    }
  } catch (err) {
    console.error('Provider error', err)
    res.write(`\n\nSomething went wrong on my end. Email me at emilegascoin@gmail.com.`)
  } finally {
    res.end()
  }

  // 6. Record spend (after stream complete)
  if (result?.getUsage) {
    try {
      const usage = result.getUsage()
      await recordSpend(usage.costUsd)
    } catch (err) {
      console.error('recordSpend failed', err)
    }
  }
}
```

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add /api/ask endpoint with full abuse-protection pipeline"
```

---

## Phase 7 — Chat widget and Ask page

### Task 26: ChatContext for widget state

**Files:**
- Create: `src/components/layout/ChatContext.jsx`

- [ ] **Step 1: Create `src/components/layout/ChatContext.jsx`**

```jsx
import { createContext, useContext, useState } from 'react'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  return (
    <ChatContext.Provider value={{ open, setOpen, draft, setDraft }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used inside ChatProvider')
  return ctx
}
```

- [ ] **Step 2: Wrap app in `src/main.jsx`**

```jsx
import { ChatProvider } from './components/layout/ChatContext'
// ...
<BrowserRouter>
  <ChatProvider>
    <App />
  </ChatProvider>
</BrowserRouter>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add ChatContext for widget state"
```

---

### Task 27: Chat widget component

**Files:**
- Create: `src/components/layout/ChatWidget.jsx`
- Modify: `src/components/layout/Layout.jsx`

- [ ] **Step 1: Create `src/components/layout/ChatWidget.jsx`**

```jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { askEmileWidget } from '../../lib/content'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/ask') return null

  function submit(prompt) {
    if (!prompt.trim()) return
    navigate('/ask', { state: { initialPrompt: prompt.trim() } })
    setOpen(false)
    setDraft('')
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit(draft)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-3 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-rule bg-cream shadow-xl p-5">
          <p className="font-serif text-navy mb-3">{askEmileWidget.greeting}</p>
          <div className="flex flex-col gap-2 mb-3">
            {askEmileWidget.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="text-left text-sm px-3 py-2 border border-rule rounded-lg hover:bg-navy hover:text-cream hover:border-navy transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Or ask anything..."
            rows={2}
            className="w-full text-sm border border-rule rounded-lg p-2 resize-none focus:outline-none focus:border-navy"
          />
          <button
            onClick={() => submit(draft)}
            className="mt-2 w-full bg-navy text-cream rounded-full text-sm py-2 hover:bg-navy-dark"
          >
            Ask Emile →
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-navy text-cream rounded-full px-5 py-3 shadow-lg hover:bg-navy-dark text-sm font-medium"
        aria-label="Open chat"
      >
        {open ? 'Close' : 'Ask Emile'}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Add widget to Layout**

`src/components/layout/Layout.jsx`:
```jsx
import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import ChatWidget from './ChatWidget'

export default function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
      <ChatWidget />
    </>
  )
}
```

- [ ] **Step 3: Verify widget appears bottom-right on home and case study, but not on `/ask`**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Ask Emile floating chat widget"
```

---

### Task 28: `/ask` page with conversation UI

**Files:**
- Modify: `src/pages/Ask.jsx`
- Create: `src/lib/turnstileClient.js`

- [ ] **Step 1: Create `src/lib/turnstileClient.js`**

```js
// Lazy-loads the Turnstile script and renders an invisible widget on demand.
let scriptPromise

function loadScript() {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.defer = true
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
  return scriptPromise
}

export async function getTurnstileToken() {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  if (!siteKey) throw new Error('VITE_TURNSTILE_SITE_KEY not set')
  await loadScript()

  return new Promise((resolve, reject) => {
    const container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
    window.turnstile.render(container, {
      sitekey: siteKey,
      size: 'invisible',
      callback: (token) => {
        resolve(token)
        document.body.removeChild(container)
      },
      'error-callback': () => {
        reject(new Error('Turnstile error'))
        document.body.removeChild(container)
      },
    })
  })
}
```

- [ ] **Step 2: Replace `src/pages/Ask.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getTurnstileToken } from '../lib/turnstileClient'
import { askEmileWidget } from '../lib/content'

export default function Ask() {
  const location = useLocation()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const initialised = useRef(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (initialised.current) return
    initialised.current = true
    const initial = location.state?.initialPrompt
    if (initial) send(initial)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(content) {
    if (!content.trim() || pending) return
    setPending(true)
    setInput('')
    const next = [...messages, { role: 'user', content }]
    setMessages(next)

    let token
    try {
      token = await getTurnstileToken()
    } catch {
      setMessages([...next, { role: 'assistant', content: "Couldn't verify the request. Try refreshing." }])
      setPending(false)
      return
    }

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages,
          turnstileToken: token,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setMessages([...next, { role: 'assistant', content: err.error || 'Something went wrong.' }])
        setPending(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      setMessages([...next, { role: 'assistant', content: '' }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages([...next, { role: 'assistant', content: acc }])
      }
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: 'Connection error. Email me at emilegascoin@gmail.com.' }])
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 min-h-[80vh] flex flex-col">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">/ask</p>
        <h1 className="font-serif text-3xl text-navy">Ask Emile</h1>
        <p className="text-sm text-muted mt-2">Grounded in my CV and notes. If I don't know, I'll tell you.</p>
      </header>

      {messages.length === 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {askEmileWidget.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-left text-sm px-4 py-3 border border-rule rounded-lg hover:bg-navy hover:text-cream hover:border-navy transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 space-y-5 mb-6">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block max-w-prose text-left rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-navy text-cream' : 'bg-white border border-rule'}`}>
              <p className="text-sm whitespace-pre-wrap">{m.content || (pending && i === messages.length - 1 ? '…' : '')}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="flex gap-2 sticky bottom-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={pending}
          placeholder="Ask anything..."
          className="flex-1 border border-rule bg-white rounded-full px-5 py-3 text-sm focus:outline-none focus:border-navy"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="bg-navy text-cream rounded-full px-5 py-3 text-sm hover:bg-navy-dark disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 3: Verify (cannot fully test without env vars and Vercel functions)**

The page renders. Posting will fail until env vars are set and `vercel dev` is running. That's expected — covered in Phase 8.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add /ask conversation page with Turnstile and streaming"
```

---

## Phase 8 — Local dev wiring and deployment

### Task 29: `.env.example` and Vercel config

**Files:**
- Create: `.env.example`, `vercel.json`

- [ ] **Step 1: Create `.env.example`**

```bash
# Copy this file to .env.local for local dev. Fill in real values.
# In production, set these in the Vercel dashboard.

AI_PROVIDER=gemini

# Gemini (default)
GOOGLE_API_KEY=

# Claude (optional, only if AI_PROVIDER=claude)
ANTHROPIC_API_KEY=

# Cloudflare Turnstile
VITE_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Caps
DAILY_SPEND_CAP_USD=1
RATE_LIMIT_PER_DAY=20
```

- [ ] **Step 2: Create `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x"
    }
  }
}
```

- [ ] **Step 3: Add Vercel CLI install instruction to README**

Create `README.md`:

```markdown
# Personal website — gascoinlabs.com

## Local dev

\`\`\`bash
npm install
npm install -g vercel    # one-time
cp .env.example .env.local
# fill in .env.local with real values
vercel dev               # runs Vite + functions on http://localhost:3000
\`\`\`

## Tests

\`\`\`bash
npm test
\`\`\`

## Deploy

Pushing to \`main\` deploys production via Vercel GitHub integration. Branches get preview URLs.
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add env example, vercel config, and README"
```

---

### Task 30: First Vercel deploy (manual, by Emile)

This task is mostly Emile-driven — accounts and DNS sit outside the codebase. The implementing engineer should walk through it with Emile.

- [ ] **Step 1: Create Vercel account + connect GitHub**

Emile signs in at vercel.com, connects GitHub, and imports the repo (he'll need to push the local repo to GitHub first — `gh repo create` or via the GitHub web UI).

- [ ] **Step 2: Set environment variables in Vercel dashboard**

Paste each variable from `.env.example` with real values into Project Settings → Environment Variables. Apply to **Production** and **Preview** environments.

- [ ] **Step 3: Trigger first deploy**

Push to `main`. Vercel auto-deploys. Note the preview URL (e.g. `personal-website-abc123.vercel.app`).

- [ ] **Step 4: Smoke test**

Visit the preview URL:
- Home renders correctly
- `/ask` loads
- `/api/health` returns `{ ok: true }`
- Chat widget opens and routes to `/ask`
- Sending a message: should require Turnstile challenge (invisible) → response streams back

- [ ] **Step 5: Connect `gascoinlabs.com`**

In Vercel → Domains → Add `gascoinlabs.com`. Vercel shows the DNS records (typically A `76.76.21.21` and CNAME `cname.vercel-dns.com`). Emile updates these in his domain registrar's DNS panel. DNS propagation typically takes a few minutes to an hour.

- [ ] **Step 6: Verify production**

Visit https://gascoinlabs.com — full site loads, HTTPS works (Vercel provisions a cert automatically).

---

## Phase 9 — Pre-launch polish

### Task 31: Open-graph and meta tags

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Emile Gascoin — Software developer, Melbourne</title>
    <meta name="description" content="Personal portfolio for Emile Gascoin. Software developer based in Melbourne. AI-native workflow, full-stack web, C++ background." />
    <meta property="og:title" content="Emile Gascoin — Software developer, Melbourne" />
    <meta property="og:description" content="Software developer based in Melbourne. AI-native workflow, full-stack web, C++ background." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://gascoinlabs.com" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create a simple favicon**

Save as `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1f3a5f"/><text x="16" y="22" text-anchor="middle" font-family="Georgia,serif" font-size="20" fill="#faf6ee">E</text></svg>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: add meta tags and favicon"
```

---

### Task 32: Run all tests and final smoke test

- [ ] **Step 1: Run full test suite**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 2: Build production bundle**

```bash
npm run build
```
Expected: clean build with no warnings.

- [ ] **Step 3: Run `vercel dev` and click through entire site**

```bash
vercel dev
```

Verify:
- [ ] Home page renders all 8 sections
- [ ] All anchor links scroll correctly
- [ ] `/work/elecdes` renders
- [ ] Chat widget appears on home, case study; absent from `/ask`
- [ ] Clicking widget suggestion navigates to `/ask` with prompt prefilled
- [ ] Chat sends, Turnstile passes invisibly, response streams
- [ ] Send 21 rapid messages from same IP — last one returns rate-limit error
- [ ] Test the spend cap by manually setting `DAILY_SPEND_CAP_USD=0.0001` and sending one message — second message returns the fallback
- [ ] `/api/health` returns ok
- [ ] Mobile (DevTools responsive view): all sections look correct, widget reachable

- [ ] **Step 4: Commit (if any small fixes were needed)**

```bash
git add -A
git commit -m "chore: pre-launch polish"
```

---

## Self-review checklist (engineer should re-read this section before starting)

**Spec coverage** — every spec section is implemented:
- §2 In-scope items: ✓ home (Tasks 6–13), ✓ elecdes case study (Task 14), ✓ widget (Task 27), ✓ /ask (Task 28), ✓ provider adapter (Tasks 15–17), ✓ abuse protection (Tasks 19–23, 25), ✓ Vercel deploy (Task 30), ✓ Vitest tests on /api/ask (Task 25)
- §3 tech stack: ✓ all dependencies installed in Task 1
- §4 visual direction: ✓ Tailwind theme matches in Task 2
- §5 architecture: ✓ repo structure matches in Tasks 1, 5, 19
- §6 widget UX: ✓ Task 27 — bubble + suggestions + handoff; Task 28 — `/ask` reads `location.state.initialPrompt`
- §7 provider adapter: ✓ Tasks 15–17 with env-driven dispatch
- §8 grounding: ✓ Task 18 system prompt with no-fab rule, fallback line, tone rules
- §9 abuse protection 4 layers in order: ✓ Task 25 — Turnstile → rate limit → spend cap → token trim → provider
- §10 env vars: ✓ Task 29 `.env.example` matches the spec list
- §13 testing strategy: ✓ Vitest unit + integration tests on API; static React not unit-tested by design

**Placeholders:** the only "[PLACEHOLDER]" markers are inside `content.js` and clearly flagged for Emile to replace. No TBD/TODO in the implementation steps.

**Type consistency:** message shape `{ role, content }` is used in `aiProvider.send`, both providers, `claudeContext.js`, and `api/ask.js`. Provider returns `{ stream, getUsage }` consistently. Rate limit returns `{ allowed, remaining, count, limit }`. Spend cap returns `{ allowed, spent, cap }`.

---

## Done

After Task 32 the v1 spec is fully shipped. Items in §15 ("v2 Candidates") are deliberately not in this plan and should be brainstormed separately if/when Emile wants to add them.
