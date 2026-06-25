import { edsCppProject } from '../../lib/content'
import { Link } from 'react-router-dom'

export default function EdsCpp() {
  const c = edsCppProject
  return (
    <article className="mx-auto max-w-6xl px-6 py-16">
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

      <section className="py-12 border-t border-rule crule crule-flush">
        <div className="max-w-prose">
          <h2 className="font-serif text-2xl text-navy mb-4">Context</h2>
          <p className="leading-relaxed">{c.context}</p>
        </div>
      </section>

      <section className="py-12 border-t border-rule crule crule-flush">
        <div className="max-w-prose">
          <h2 className="font-serif text-2xl text-navy mb-4">How the work happened</h2>
          <ol className="space-y-3 list-decimal list-inside">
            {c.process.map((p, i) => <li key={i} className="leading-relaxed">{p}</li>)}
          </ol>
        </div>
      </section>

      <section className="py-12 border-t border-rule crule crule-flush">
        <h2 className="font-serif text-2xl text-navy mb-6">A selection of issues</h2>
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
        <div className="max-w-prose">
          <h2 className="font-serif text-2xl text-navy mb-4">Outcome</h2>
          <p className="leading-relaxed">{c.outcome}</p>
        </div>
      </section>
    </article>
  )
}
