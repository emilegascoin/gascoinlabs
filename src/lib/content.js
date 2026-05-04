// All site copy + chatbot grounding source. Emile owns this file.
// Placeholder copy is marked [PLACEHOLDER] — replace before launch.

export const profile = {
  name: 'Emile Gascoin',
  email: 'emilegascoin@gmail.com',
  phone: '+61 405 482 025',
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
    'I prefer small teams (under 10), regular check-ins over end-of-task reviews and software product companies over contracting firms. I am drawn to environments where tasks come from team discussion rather than an endless assigned backlog.',
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
  // [PLACEHOLDER] Emile to flesh out
  title: 'Elecdes Design Suite: marketing site redesign',
  role: 'Sole designer and developer',
  dates: 'Mid 2025 - early 2026',
  stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Git'],
  context: 'Scada Systems Ltd needed a modernised marketing site for its flagship product, Elecdes Design Suite. The old site centred on a rotating slider and dense product copy. I was given full autonomy on the redesign.',
  process: [
    'Pitched an initial design: clean hero, category tiles, customer logos, a case study and outcome-driven copy.',
    'Reworked the design to fit feedback from the company director, who wanted slightly more density on the homepage and the customer portal surfaced more aggressively.',
    'Iterated on layout and copy with weekly check-ins, deploying to a beta server (beta.elecdes.com) for review.',
  ],
  features: [
    { title: 'AJAX form handling', detail: 'Live demo and contact form submissions without page reload, validated server-side.' },
    { title: 'YouTube video embedding', detail: 'JavaScript-driven video switching with lazy-loaded thumbnails for performance.' },
    { title: 'Customer portal', detail: 'User management and download links integrated with existing licence database.' },
    { title: 'Email templates', detail: 'Designed responsive transactional templates for demo requests and contact submissions.' },
    { title: 'Multilingual content', detail: 'Populated the EN/ES/FR/DE language database for the existing multilingual system across the site.' },
  ],
  outcome: 'The redesign is live at beta.elecdes.com. The hero section, category tiles, BlueScope Steel case study and customer logo strip are all visible improvements over the original elecdes.com.',
  links: [
    { label: 'Original (before)', href: 'https://elecdes.com' },
    { label: 'Redesign (after)', href: 'https://beta.elecdes.com' },
  ],
}

export const all = {
  profile, hero, about, experience, education,
  aiWorkflow, skills, reference, personal, askEmileWidget, elecdesCaseStudy,
}
