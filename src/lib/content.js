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
