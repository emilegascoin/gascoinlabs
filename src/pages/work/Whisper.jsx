import { whisperProject } from '../../lib/content'
import { Link } from 'react-router-dom'

export default function Whisper() {
  const c = whisperProject
  return (
    <article className="mx-auto max-w-5xl px-6 py-16">
      <Link to="/work" className="text-sm text-muted hover:text-navy">&lt;- All projects</Link>

      <header className="mt-8 pb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Project</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy leading-tight">{c.title}</h1>
        <dl className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
          {c.company && <div><dt className="text-muted text-xs">Company</dt><dd>{c.company}</dd></div>}
          <div><dt className="text-muted text-xs">Role</dt><dd>{c.role}</dd></div>
          <div><dt className="text-muted text-xs">Dates</dt><dd>{c.dates}</dd></div>
          <div className="sm:col-span-3"><dt className="text-muted text-xs">Stack</dt><dd>{c.stack.join(', ')}</dd></div>
        </dl>
      </header>

      <section className="py-12 max-w-prose border-t border-rule crule crule-flush">
        <h2 className="font-serif text-2xl text-navy mb-4">Context</h2>
        <p className="leading-relaxed">{c.context}</p>
      </section>

      <section className="py-12 max-w-prose border-t border-rule crule crule-flush">
        <h2 className="font-serif text-2xl text-navy mb-4">Process</h2>
        <ol className="space-y-3 list-decimal list-inside">
          {c.process.map((p, i) => <li key={i} className="leading-relaxed">{p}</li>)}
        </ol>
      </section>

      <section className="py-12 border-t border-rule crule crule-flush">
        <h2 className="font-serif text-2xl text-navy mb-6">What I built</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {c.features.map((f) => (
            <div key={f.title} className="border border-rule rounded-lg p-5 bg-cream">
              <h3 className="font-serif text-lg text-navy mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 border-t border-rule crule crule-flush">
        <h2 className="font-serif text-2xl text-navy mb-3">New to me on this project</h2>
        <p className="text-sm text-muted max-w-prose mb-6 leading-relaxed">{c.newToMe.intro}</p>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {c.newToMe.items.map((item) => (
            <li key={item.name} className="border-l-2 border-rule pl-4">
              <p className="font-mono text-sm text-navy mb-1">{item.name}</p>
              <p className="text-sm text-muted leading-relaxed">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-12 max-w-prose border-t border-rule crule crule-flush">
        <h2 className="font-serif text-2xl text-navy mb-4">Outcome</h2>
        <p className="leading-relaxed">{c.outcome}</p>
        {c.links.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-4">
            {c.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className="text-navy underline underline-offset-4">
                  {l.label} -&gt;
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}
