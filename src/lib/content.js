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
  headline: 'Software engineer. Experienced with real code, faster with AI.',
  sub: 'Based in Melbourne. 2.5 years commercial experience across C++ and full-stack web. Looking for a role where AI-assisted development is the standard.',
  ctas: [
    { label: 'Ask Emile', to: '/ask', primary: true },
    { label: 'View projects', to: '/work', primary: false },
  ],
}

export const about = {
  paragraphs: [
    'I am a software developer with 2.5 years of commercial experience across C++ and full stack web development. I work with AI tools as a genuine part of how I develop, not as a shortcut. My job is to brainstorm, steer the output and make sure what gets built is actually good.',
    'I am looking for a role in Melbourne where I can keep growing. My background is software engineering but building this site has given me a genuine interest in full stack web development and I have really enjoyed that world. I am open to anything software or tech related as long as I am actually growing doing it. Team and culture matter more to me than the specific stack. I want somewhere with regular communication, a stand-up rhythm and tasks that come from team discussion rather than a pile of tickets assigned in isolation.',
    'Outside of work I build and fix computers, go to the gym, follow the tech and AI space and listen to music every day. I moved to Melbourne because every suburb has its own character and the tech scene here is somewhere I genuinely want to grow into.',
  ],
}

export const experience = [
  {
    company: 'Scada Systems Ltd',
    location: 'Auckland',
    title: 'Graduate Software Engineer',
    dates: 'Nov 2023 — Mar 2026',
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
    dates: 'Jul-Nov 2026',
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
  intro: 'I spent two and a half years writing C++ and building a website line by line. That foundation means I actually understand what AI-generated code is doing and whether it belongs. Now I use Claude Code as a development partner and I\'m roughly 5x more productive for it. The skill isn\'t prompting, it\'s brainstorming and working together to get the desired results.',
  steps: [
    'Brainstorm the problem with Claude Code first. Talk through edge cases, constraints and approach before writing anything.',
    'Agree on a plan then let Claude Code take a first pass at the implementation.',
    'Review the output properly. Check structure, naming, edge cases and best practices.',
    'Fix what needs fixing. Deal with the underlying issue rather than patching over it.',
    'Retest, then push for review.',
  ],
}

export const skills = {
  Languages: ['C++', 'JavaScript', 'PHP', 'Java', 'C', 'Python'],
  Frontend: ['HTML', 'CSS', 'React', 'Svelte', 'Tailwind'],
  Backend: ['Node.js', 'Express', 'PHP'],
  Databases: ['SQL', 'SQLite', 'PostgreSQL', 'MS Access', 'SQL Server'],
  Tools: ['Git', 'Redmine', 'MFC', 'AutoCAD'],
  AI: ['Claude Code', 'parallel VM workflow', 'Anthropic SDK', 'Google GenAI SDK', 'OpenAI Whisper'],
}

export const reference = {
  quote: 'Emile has been reliable, professional and competent in all of his work. He has worked equally well solo and collaboratively. I would recommend Emile for any software or technology development role.',
  attribution: 'David Monaghan, CEO, Scada Systems Ltd',
  date: '9 March 2026',
}

export const personal = {
  whyMelbourne: 'I fell in love with the culture. Every suburb has its own vibe and atmosphere, like visiting a new town each time. Job wise the tech scene here has been advancing rapidly and I wanted to be part of it and grow as a developer from being immersed in it.',
  hobbies: 'Gaming, building and fixing computers, going to the gym, running and music. I listen to music every day without fail. I have dabbled in making it with FL Studio but have never actually finished a song. Before moving to Melbourne I played squash a bit too.',
  whySoftware: 'My passion for computers started from a very young age and always pointed me toward this career. The maintenance technician and barista roles came before my degree. They were not a detour, just where I was before I had the qualifications to pursue what I always wanted to do.',
  previousRoles: 'At Air Solutions I applied technical thinking to real problems: measuring air outflow and humidity to find the right solutions. It gave me a practical understanding of applying analytical thinking in the field. At Karajoz Coffee Company I was client facing every day which built my communication and people skills. It also taught me to work under pressure. Some shifts were quiet and then 30 people would walk in at once and I had to deliver, fast and without dropping quality.',
  uniGroupProject: 'In my Programming with Web Technologies paper at the University of Auckland I worked on a group project building a full stack blog platform with authentication, article management and a comments system. I led the backend architecture and took on a senior role within the group given I had more commercial experience than my teammates. I supported others with debugging and integration across the full stack.',
  boxheadGame: 'In my third year at Victoria University of Wellington I built a Java recreation of the flash game BoxHead for a computer graphics paper. Fully functional with enemy AI, multiple weapon types, loot mechanics and escalating difficulty rounds. I built it because I grew up playing the original and wanted to recreate it. GitHub: github.com/emilegascoin',
  workingStyle: 'I thrive with regular communication and collaboration on projects rather than working in isolation through an assigned backlog. Stand-up culture and check-ins between team members to get the best result is ideal. I manage my focus by setting daily tasks and ordering them by order of magnitude. I have the ability to hyper focus when I am locked in on a problem which I consider a strength.',
  careerAmbitions: 'Long term I want to start my own software company and build something widely used. That is a long way off and I want to build up the experience to do it properly first. Right now I am looking for anything software or tech related in Melbourne. My background is software engineering but building this site has genuinely sparked an interest in full stack web development. I am open to either direction as long as I am growing. The team and the culture are what matter most.',
  personality: 'Direct, genuine and pretty low on corporate fluff. I say what I mean. I care more about the output than the credit and I work best when the people around me do too.',
}

export const askEmileWidget = {
  greeting: 'Hey, I\'m Emile. Ask me anything about my work or what I\'m looking for.',
  suggestions: [
    'What are you looking for in your next role?',
    'How do you use AI in your workflow?',
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
  subtitle: 'This site. A React portfolio with a serverless AI chatbot grounded in my CV. Built end to end using Claude Code as a development partner, the same workflow it describes.',
  role: 'Designer and developer',
  dates: 'Early 2026',
  stack: ['React 19', 'Vite', 'Tailwind', 'React Router', 'Node.js', 'Vercel', 'Upstash Redis', 'Cloudflare Turnstile', 'Google Gemini API', 'Vitest'],
  context: 'My commercial work for the Scada Systems Website was vanilla JavaScript, PHP and MySQL. For this site I wanted a stack that reflects how I would actually build something today if given the choice. React on the frontend, serverless Node functions for the backend, Redis for state, Cloudflare Turnstile for bot protection and Google Gemini powering the chatbot. The whole thing was built using Claude Code as a development partner with a subagent-driven workflow.',
  process: [
    'Started with a planning session in Claude Code to scope the whole site as a numbered task list. 32 tasks in total.',
    'Wrote tests first for the API and abuse protection logic using Vitest. 32 tests passing across rate limiting, spend cap, message trimming and Turnstile verification.',
    'Used subagent-driven development for non-trivial work. Fresh subagent per task with a two-stage review (spec compliance, then code quality).',
    'One logical change per commit so the history is actually readable. The git log doubles as a timeline of what was built when.',
    'Deployed early to Vercel and iterated on the live site rather than building everything locally first.',
  ],
  features: [
    { title: 'Ask Emile chatbot', detail: 'Serverless AI chatbot grounded in my CV and personal context. Provider-agnostic adapter so I can swap between Gemini and Claude with an env var. Streams responses back to the client with an animated typewriter effect for a more human feel.' },
    { title: 'Three-layer abuse protection', detail: 'Cloudflare Turnstile runs invisibly in the background. If a token is returned and verification fails, the request is blocked because that pattern means a bot tried to forge a token. If no token is returned at all, the request still goes through because that just means the user has a privacy extension that blocked the script. Then a per-IP daily request limit (150/day) catches anyone hammering the endpoint, and finally a daily spend cap tracked in Upstash Redis is the cost-control backstop. Once the cap is hit the bot responds with a polite fallback rather than making further API calls.' },
    { title: 'TDD for the API surface', detail: 'Rate limit, spend cap, Turnstile verifier and message trimmer all have unit tests. Vitest with mocked Redis and fetch. The static React components do not have tests because that is over-engineering for a portfolio site.' },
    { title: 'Streaming responses', detail: 'API uses ReadableStream to stream Gemini output back to the browser. The frontend reads chunks via a ReadableStreamDefaultReader and feeds them through a typewriter that drips characters out at randomised intervals so it reads like a person typing.' },
    { title: 'Single source of truth for content', detail: 'All site copy lives in a single content file. The chatbot system prompt is generated from the same data so the bot can never claim something the site does not say. Adding a new project is one entry in an array.' },
    { title: 'AI-assisted end to end', detail: 'Built using Claude Code with parallel agents tackling independent tasks while I act as quality gate. The site is a live example of the workflow it describes elsewhere on the page.' },
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
      { name: 'Google Gemini API', detail: 'Used the @google/genai SDK with streaming. Cheaper than Claude for this use case and the responses are good enough.' },
      { name: 'Vitest with Testing Library', detail: 'TDD workflow for the abuse protection logic. First time properly running TDD on a personal project.' },
      { name: 'Claude Code subagent workflow', detail: 'Fresh subagent per task with two-stage review. The biggest unlock has been treating subagents like junior developers I am quality gating.' },
    ],
  },
  outcome: 'Live at gascoinlabs.com. The chatbot works, the abuse protection holds, and at this traffic level the whole stack costs essentially nothing to run. More importantly the site is a working example of the AI-assisted workflow I describe rather than just a description of it.',
  links: [
    { label: 'View site', href: 'https://gascoinlabs.com' },
    { label: 'GitHub', href: 'https://github.com/emilegascoin/gascoinlabs' },
  ],
}

// Add new projects here — they will appear on the /work index page automatically
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
  aiWorkflow, skills, reference, personal, askEmileWidget, elecdesCaseStudy, projects,
}
