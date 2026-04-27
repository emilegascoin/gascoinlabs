# CLAUDE.md — Emile Gascoin Personal Portfolio

## About This Project

This is a personal portfolio website for Emile Gascoin, a software developer relocating from Auckland NZ to Melbourne Australia in April 2026. The site is aimed at hiring managers and recruiters in Melbourne's tech industry. The goal is to showcase Emile's personality, projects and working style in a way that feels genuine — not like a polished corporate CV.

The site should feel like Emile: direct, confident, no fluff, a bit of personality.

---

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js with Express
- **Styling:** TBD — discuss with Emile before choosing a CSS approach
- Keep the stack clean and avoid over-engineering. This is a portfolio site, not an enterprise app.

---

## About Emile

**Contact:**
- Email: emilegascoin@gmail.com
- Phone: +64 21 261 0764
- GitHub: github.com/emilegascoin
- Location: Melbourne, VIC (relocating end of April 2026)

**Background:**
- BSc Computer Science, Victoria University of Wellington (Nov 2023)
- 2.5 years commercial experience as Graduate Software Engineer at Scada Systems Ltd, Auckland (Nov 2023 - Mar 2026)
- Currently enrolled: Programming with Web Technologies, University of Auckland (Jul-Nov 2026) covering Svelte, Node.js, SQLite and REST APIs
- NZ citizen with full Australian work rights

**Technical Skills:**
- Languages: C++, JavaScript, PHP, Java, C, Python (uni level)
- Frontend: HTML, CSS, React, Svelte
- Backend: Node.js, Express, PHP
- Databases: SQL, SQLite, PostgreSQL (uni), MS Access, SQL Server
- Tools: Git, Redmine, MFC, AutoCAD (working knowledge)
- AI workflow: Claude Code, parallel VM multitasking

---

## Key Work Experience

### Scada Systems Ltd — Graduate Software Engineer (Nov 2023 - Mar 2026)

Two distinct workstreams:

**1. EDS Website (elecdes.com / beta.elecdes.com)**
Emile independently led a full redesign of the Elecdes Design Suite marketing website with complete autonomy. This is his strongest and most relevant work.

- Modernised hero section with headline/CTAs replacing an old rotating slider
- Visual category tiles for product exploration
- Client logo strip (Tesla, Siemens, Honeywell, Schneider, BlueScope Steel etc.)
- BlueScope Steel case study section
- "Why EDS?" value proposition section
- Outcome-driven product copy rewrite
- Restructured nav with Book a Demo CTA and language dropdown
- PHP-based multilingual system supporting EN/ES/FR/DE via GET/POST params
- Google Translate API integration
- AJAX form handling for live demo and contact submissions
- YouTube video embedding with JavaScript-driven video switching
- Customer portal (user management, download links)
- Git-based deployment to beta server (beta.elecdes.com)
- SEO improvements
- Email template design
- AI transcription tool using OpenAI Whisper (C++ wrapping Python subprocess) to generate transcripts and SRT subtitle files from long-form video content

Live URLs: https://elecdes.com (original) and https://beta.elecdes.com (Emile's redesign)

**2. C++ Feature Development on EDS (Elecdes Design Suite)**
- MFC toolbars (CToolBar, CListCtrl)
- Dialog development and OnCmdMsg routing
- Duplicate detection tool using nested hashmaps and multithreading
- Name sequencer expansion across multiple dialog types
- Component deletion
- Raceway integrity checker
- Licence management
- BOM component position reporting
- Code review with senior developers
- Used Redmine for issue tracking, Microsoft SourceSafe and Git for version control

### Previous Non-Engineering Roles
- Air Solutions, Auckland — Maintenance Technician (Jan 2019 - Jan 2023)
- Karajoz Coffee Company, Auckland — Barista/Manager (May 2017 - Jan 2019)

---

## University Coursework (VUW BSc Computer Science)

Relevant papers include:
- Database Systems (SQL, PostgreSQL, relational algebra, normalisation, JDBC)
- AI and Machine Learning (neural networks, KNN, heuristics, genetic algorithms, Python)
- Systems Programming (Java, servlets, Maven)
- Scalable Software Development
- User Experience Engineering (wireframing, Ionic, React)
- Cloud and Networking (AWS)
- Software Design
- Creative Coding

---

## AI Workflow (Important — This Is a Differentiator)

Emile uses Claude Code extensively as a development partner. His workflow:
1. Brainstorm the problem with Claude Code
2. Work up a plan and get started
3. Run multiple VMs in parallel, each tackling a separate issue simultaneously
4. While one instance runs/compiles, scope and brief the next problem
5. Act as quality gate — reviewing, connecting and ensuring best practices
6. Fix any underlying issues and retest
7. Push for review

He estimates this approach makes him roughly 5x more productive than working without AI assistance. This is not just something he has tried — it is genuinely how he works.

---

## Reference

David Monaghan, CEO, Scada Systems Ltd — formal reference letter dated 9 March 2026, with company common seal. Manager Paul McSweeney described Emile's work as "very satisfactory", completing tasks within planned timeframes, high quality with very few errors. Monaghan: reliable, professional, competent, works well solo and collaboratively, friendly and easy to approach. Recommended for any software or technology role.

---

## Personality and Working Style

- Has ADHD — thrives with regular check-ins, stand-up culture and consistent feedback rather than end-of-task reviews
- Prefers small teams (at most 10 people) with real interpersonal relationships
- Wants collaborative environments where tasks come from team discussion, not an endless assigned backlog
- Prefers software product companies over contracting firms
- Strongly prefers automated testing environments — wants to act as end checker and fixer rather than manual tester
- Not fixed on industry — tech stack and team culture are the priority
- Open to remote, hybrid or in-office as long as communication is clear
- Gamer — built a Java recreation of the flash game BoxHead as a second year uni project
- Builds and fixes computers for himself and friends
- Long term goal: build something widely used, potentially start his own software company

---

## Writing and Tone Rules

These apply to ALL copy on the site — headings, body text, labels, everything:

- No em dashes
- No Oxford commas
- No corporate fluff
- No verbatim mirroring of job description language
- Direct, genuine and conversational — the way Emile actually talks
- Broad "so what" framing over granular technical details
- Do not overclaim on minor contributions
- The site should sound like a person, not a brochure

---

## Site Goals

- Primary audience: hiring managers and recruiters in Melbourne
- Secondary audience: anyone who Googles Emile's name
- Should showcase: personality, the elecdes.com redesign, AI workflow, technical breadth, honesty
- Should NOT feel like: a generic developer portfolio template, a list of buzzwords, a corporate CV
- The elecdes before/after comparison is the centrepiece of the portfolio section
- Sections TBD — discuss with Emile before building out the page structure

---

## Notes for Claude Code

- Always check with Emile before making architectural decisions
- Keep components clean and well named
- Do not over-engineer — this is a portfolio site
- If something is unclear, ask rather than assume
- Emile acts as quality gate — present work for review before moving on
- Follow the writing rules above for any generated copy
