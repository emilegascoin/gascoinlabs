export const profile = {
  name: 'Emile Gascoin',
  email: 'emilegascoin@gmail.com',
  phone: '+61 405 482 025',
  github: 'https://github.com/emilegascoin',
  location: 'Melbourne, VIC',
  availability: 'Available now',
  linkedin: 'https://linkedin.com/in/emilegascoin',
}

export const hero = {
  headline: 'Software engineer focused on building useful systems.',
  sub: 'Two and a half years of commercial experience building production software, debugging real systems and shipping web work end to end. Looking for a team where I can keep growing and contribute useful work.',
  ctas: [
    { label: 'Ask Emile', to: '/ask', primary: true },
    { label: 'View projects', to: '/work', primary: false },
  ],
}

export const about = {
  paragraphs: [
    'I am a software engineer with two and a half years of commercial experience across production C++ and web development. At Scada Systems I worked on industrial design software, client-reported issues and a full marketing site redesign across HTML, CSS, JavaScript, PHP and MySQL.',
    'Across both stacks I worked on real-world client bugs, multithreaded performance problems and full feature builds. Building this portfolio extended that into a modern full stack React app with serverless functions, Redis-backed controls, monitoring and API tests.',
    'I work best with regular communication, a stand-up rhythm and tasks that come from team discussion. Beyond that I am open to a wide range of software and tech work.',
  ],
}

export const experience = [
  {
    company: 'Scada Systems Ltd',
    location: 'Auckland',
    title: 'Graduate Software Engineer',
    dates: 'Nov 2023 - Mar 2026',
    summary: 'Two distinct workstreams: independently leading a full redesign of the Elecdes Design Suite marketing website and developing C++ features for the Elecdes Design Suite itself.',
    bullets: [
      'Independently redesigned elecdes.com using HTML, CSS, JavaScript, PHP, SQL, Google Translate API, AJAX form handling, YouTube video embedding.',
      'Built a standalone AI transcription tool in C++ wrapping Python and OpenAI Whisper, generating transcripts and SRT subtitle files so YouTube could auto-caption long-form product videos with accurate industry terminology.',
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
    dates: 'Jul-Nov 2025',
    detail: 'Svelte, Node.js, SQLite, REST APIs',
  },
  {
    school: 'Victoria University of Wellington',
    qualification: 'BSc Computer Science',
    dates: 'Mar 2019 - Nov 2023',
    detail: 'Database Systems, AI/ML, Systems Programming, UX Engineering, Cloud and Networking',
  },
]

export const aiWorkflow = {
  intro: 'I spent two and a half years writing production C++ and building real web features line by line. That foundation is what makes me useful: understanding the code, finding the actual problem and shipping fixes that hold up. I bring that same engineering rhythm to full stack work.',
  steps: [
    'Start with the problem. Understand the constraints, the existing code and what done actually looks like before writing anything.',
    'Plan the approach. For non-trivial work I sketch it out, pressure-check the tradeoffs and keep the change small enough to review properly.',
    'Write the change. Small focused commits, readable code and clear ownership of the result.',
    'Review properly. Read every line, check structure, naming, edge cases and how it sits in the broader codebase.',
    'Test, debug and ship. Catch issues at the unit level, then verify behaviour end to end before pushing for review.',
  ],
}

export const skills = {
  Languages: ['C++', 'JavaScript', 'PHP', 'Java', 'C', 'Python'],
  Frontend: ['HTML', 'CSS', 'React', 'Svelte', 'Tailwind'],
  Backend: ['Node.js', 'Express', 'PHP'],
  Databases: ['SQL', 'SQLite', 'PostgreSQL', 'MS Access', 'SQL Server'],
  Tools: ['Git', 'Redmine', 'MFC', 'AutoCAD'],
  'Modern tooling': ['Git workflows', 'API integrations', 'Anthropic SDK', 'Google GenAI SDK', 'OpenAI Whisper'],
}

export const reference = {
  quote: 'Emile has been reliable, professional and competent in all of his work. He has worked equally well solo and collaboratively. I would recommend Emile for any software or technology development role.',
  attribution: 'David Monaghan, CEO, Scada Systems Ltd',
  date: '9 March 2026',
}

export const askEmileWidget = {
  greeting: 'Hey, I\'m Emile. Ask me anything about my work or what I\'m looking for.',
  suggestions: [
    'What are you looking for in your next role?',
    'What does your engineering workflow look like?',
    'What did you build at Scada Systems?',
    'Why Melbourne?',
  ],
}

export const elecdesCaseStudy = {
  title: 'Elecdes Design Suite: marketing site redesign',
  subtitle: 'Near-complete rework of the Elecdes Design Suite marketing site. New design across software, services, downloads and demonstrations sections with a focus on making sales easier to reach.',
  role: 'Sole designer and developer',
  dates: 'Mid 2025 - Early 2026',
  stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Git'],
  context: 'Scada Systems Ltd needed a modernised marketing site for its Elecdes Design Suite product range. The old site centred on a rotating slider and dense product copy with a single contact form as the only way to reach sales. I was given full autonomy on the redesign and worked across almost every section of the site: software pages, services, downloads and demonstrations. The support section was the only area I did not get to.',
  process: [
    'Pitched an initial design: clean hero, category tiles, customer logos, a BlueScope Steel feature section and outcome-driven copy.',
    'Reworked the design to fit feedback from the company director, who wanted slightly more density on the homepage and the customer portal surfaced more aggressively.',
    'Iterated on layout and copy with weekly check-ins, deploying to a beta server (beta.elecdes.com) for review.',
  ],
  features: [
    { title: 'Service-specific contact forms', detail: 'The original services pages had a single text link redirecting to a generic contact page. I added an embedded enquiry form to each services page so users can contact sales directly about that specific service without leaving the page.' },
    { title: 'Demo CTAs on every software page', detail: 'Added Book a Demo and Trial our Software CTAs to every software product page, linking directly to the demonstrations section. Previously users had to find their own way there.' },
    { title: 'Demonstrations section', detail: 'Built out the demonstrations pages including a live demo request form and trial software page, giving the demo CTAs somewhere proper to land.' },
    { title: 'Full site rework', detail: 'Redesigned the homepage, all software pages, all services pages, the downloads section and all demonstrations pages. Copy, layout and structure across each.' },
    { title: 'AJAX form handling', detail: 'All contact and demo request forms submit without page reload, validated server-side.' },
    { title: 'YouTube video embedding', detail: 'JavaScript-driven video switching with lazy-loaded thumbnails for performance.' },
    { title: 'Email templates', detail: 'Designed responsive transactional templates for demo requests and contact submissions.' },
    { title: 'Multilingual content', detail: 'Populated the EN/ES/FR/DE language database for the existing multilingual system across the site.' },
  ],
  outcome: 'The redesign is live at beta.elecdes.com. Almost every section of the site was reworked. The most meaningful change was turning a site with one buried contact form into one where sales is reachable from every software and services page. The homepage, category tiles, BlueScope Steel case study and customer logo strip are all visible in the before/after comparison.',
  links: [
    { label: 'Original (before)', href: 'https://elecdes.com' },
    { label: 'Redesign (after)', href: 'https://beta.elecdes.com' },
  ],
}

export const gascoinlabsProject = {
  title: 'gascoinlabs.com: personal portfolio and chatbot',
  subtitle: 'This site. A full stack React app with a serverless backend, three-layer abuse protection, error monitoring, structured chat logging and a streaming chatbot grounded in my own context.',
  role: 'Designer and developer',
  dates: 'Early 2026',
  stack: ['React 19', 'Vite', 'Tailwind', 'React Router', 'Node.js', 'Vercel', 'Upstash Redis', 'Cloudflare Turnstile', 'Sentry', 'Google Gemini API', 'Vitest'],
  context: 'My commercial web work was vanilla JavaScript, PHP and MySQL. For this site I picked a stack closer to what I would reach for on a greenfield project today: React on the frontend, serverless Node functions on the backend, Upstash Redis for stateful counters and chat logs, Cloudflare Turnstile for bot protection, Sentry for error monitoring and Google Gemini powering the chatbot. I built it end to end, from architecture and implementation through to tests, deployment and production checks.',
  process: [
    'Scoped the whole project as a numbered task list. 32 items covering frontend pages, the API, abuse protection, logging and deployment.',
    'Wrote tests first for the API and abuse protection logic using Vitest. 32 tests passing across rate limiting, spend cap, message trimming and Turnstile verification.',
    'Broke work into small focused tasks and reviewed each change for spec compliance, code quality and fit with the rest of the app before merging anything.',
    'One logical change per commit so the history is actually readable. The git log doubles as a timeline of what was built when.',
  ],
  features: [
    { title: 'Ask Emile chatbot', detail: 'Serverless AI chatbot grounded in my CV and personal context. Provider-agnostic adapter so the model can be changed through configuration. Streams responses back to the client with an animated typewriter effect for a more human feel.' },
    { title: 'Three-layer abuse protection', detail: 'Cloudflare Turnstile runs invisibly in the background. If a token is returned and verification fails, the request is blocked because that pattern means a bot tried to forge a token. If no token is returned at all, the request still goes through because that just means the user has a privacy extension that blocked the script. Then a per-IP daily request limit (150/day) catches anyone hammering the endpoint. Finally a daily spend cap tracked in Upstash Redis is the cost-control backstop. Once the cap is hit the bot responds with a polite fallback rather than making further API calls.' },
    { title: 'TDD for the API surface', detail: 'Rate limit, spend cap, Turnstile verifier and message trimmer all have unit tests. Vitest with mocked Redis and fetch. I focused test coverage on the backend behaviour where regressions would matter most.' },
    { title: 'Streaming responses', detail: 'API uses ReadableStream to stream Gemini output back to the browser. The frontend reads chunks via a ReadableStreamDefaultReader and feeds them through a typewriter that drips characters out at randomised intervals so it reads like a person typing.' },
    { title: 'Single source of truth for content', detail: 'All site copy lives in a single content file. The chatbot system prompt is generated from the same data so the bot can never claim something the site does not say. Adding a new project is one entry in an array.' },
    { title: 'Error monitoring and observability', detail: 'Sentry wired into the API for full stack traces on provider errors and unexpected failures. Structured chat logs in Redis capture timing data (time to first token, total response time) so I can see how the system actually performs in production.' },
    { title: 'Modern tooling in the loop', detail: 'Used current AI and API tooling where it made the work faster, while keeping architecture, review, testing and shipping decisions under my own control.' },
  ],
  newToMe: {
    intro: 'Things I picked up specifically for this project that were not part of my Scada Systems stack:',
    items: [
      { name: 'React 19 with hooks', detail: 'useState, useEffect, useRef and useLocation across the SPA. Coming from vanilla JS this was the biggest jump.' },
      { name: 'Vite', detail: 'Modern bundler and dev server. Faster than anything I used before. Hot reload that actually works.' },
      { name: 'Tailwind CSS', detail: 'Utility-first styling instead of writing class names and CSS files. Took a few days to click but I would not go back.' },
      { name: 'Serverless functions on Vercel', detail: 'Replacing PHP and a traditional server with stateless Node functions that spin up on demand. Different mental model.' },
      { name: 'Upstash Redis', detail: 'Cloud key-value store for rate limiting and spend tracking. Way more appropriate than spinning up a database for what amounts to a few counters.' },
      { name: 'Cloudflare Turnstile', detail: 'Invisible bot challenge. Real users never see it, automated abuse gets blocked.' },
      { name: 'Google Gemini API', detail: 'Used the @google/genai SDK with streaming responses, cost controls and production fallbacks.' },
      { name: 'Vitest with Testing Library', detail: 'TDD workflow for the abuse protection logic. First time properly running TDD on a personal project.' },
      { name: 'AI-assisted development workflow', detail: 'Used task-scoped assistance for drafting and review support while keeping final code ownership, testing and integration decisions with me.' },
    ],
  },
  outcome: 'Live at gascoinlabs.com. The chatbot works, the abuse protection holds and at this traffic level the whole stack costs essentially nothing to run. The site is a working example of how I build full stack web today: clear architecture, focused tests, real production tooling and modern AI APIs used as part of a broader engineering workflow.',
  links: [
    { label: 'View site', href: 'https://gascoinlabs.com' },
    { label: 'GitHub', href: 'https://github.com/emilegascoin/gascoinlabs' },
  ],
}

// Add new projects here. They will appear on the /work index page automatically.
export const projects = [
  {
    href: '/work/elecdes',
    title: elecdesCaseStudy.title,
    subtitle: elecdesCaseStudy.subtitle,
    role: elecdesCaseStudy.role,
    dates: elecdesCaseStudy.dates,
    stack: elecdesCaseStudy.stack,
  },
  {
    href: '/work/gascoinlabs',
    title: gascoinlabsProject.title,
    subtitle: gascoinlabsProject.subtitle,
    role: gascoinlabsProject.role,
    dates: gascoinlabsProject.dates,
    stack: gascoinlabsProject.stack,
  },
]

export const all = {
  profile, hero, about, experience, education,
  aiWorkflow, skills, reference, askEmileWidget, elecdesCaseStudy, projects,
}
