import { Link } from 'react-router-dom'
import { projects } from '../lib/content'

export default function Work() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">/work</p>
        <h1 className="font-serif text-4xl text-navy">Projects</h1>
        <p className="text-sm text-muted mt-3">Things I have built or led. More to be added.</p>
      </header>

      <div className="flex flex-col gap-6">
        {projects.map((p) => (
          <Link
            key={p.href}
            to={p.href}
            className="group block border border-rule rounded-2xl p-6 bg-white hover:border-navy transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-xl text-navy group-hover:underline underline-offset-4 mb-2">
                  {p.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed mb-5">{p.subtitle}</p>

                <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-5">
                  <div>
                    <dt className="text-xs text-muted uppercase tracking-widest">Role</dt>
                    <dd>{p.role}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted uppercase tracking-widest">Dates</dt>
                    <dd>{p.dates}</dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="text-xs px-2 py-1 border border-rule rounded-full text-muted">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <span className="text-muted group-hover:text-navy transition-colors text-xl mt-1">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
