import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { projects } from '../lib/content'

function getProjectCompany(project) {
  return project.company || 'Personal projects'
}

export default function Work() {
  const location = useLocation()
  const availableFilters = useMemo(
    () => [...new Set(projects.map(getProjectCompany))].sort(),
    [],
  )
  const [activeFilter, setActiveFilter] = useState(() => {
    const filter = location.state?.filter
    return availableFilters.includes(filter) ? filter : ''
  })
  const filteredProjects = activeFilter
    ? projects.filter((project) => getProjectCompany(project) === activeFilter)
    : projects

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">/work</p>
        <h1 className="font-serif text-4xl text-navy">Projects</h1>
        <p className="text-sm text-muted mt-3">Things I have built or led. More to be added.</p>
      </header>

      <div className="mb-8">
        {activeFilter ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm text-cream">
            {activeFilter}
            <button
              type="button"
              aria-label="Clear filter"
              onClick={() => setActiveFilter('')}
              className="leading-none text-cream hover:text-cream/80"
            >
              ×
            </button>
          </span>
        ) : (
          <span className="relative inline-block">
            <select
              value=""
              onChange={(event) => setActiveFilter(event.target.value)}
              className="cursor-pointer appearance-none rounded-full border border-navy bg-white py-2 pl-5 pr-10 text-sm text-muted outline-none focus:border-navy"
            >
              <option value="" disabled hidden>
                Filter by company
              </option>
              {availableFilters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {filteredProjects.map((p) => (
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
                  {p.company && (
                    <div>
                      <dt className="text-xs text-muted uppercase tracking-widest">Company</dt>
                      <dd>{p.company}</dd>
                    </div>
                  )}
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
