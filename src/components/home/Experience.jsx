import { Link } from 'react-router-dom'
import { experience } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function Experience() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 border-t border-rule crule">
      <SectionHeading id="experience" label="02 - experience" title="Where I've worked" />
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
              {job.company === 'Scada Systems Ltd' && (
                <div>
                  <Link
                    to="/work"
                    state={{ filter: 'Scada Systems Ltd' }}
                    className="inline-block mt-5 text-sm text-navy underline underline-offset-4 hover:text-navy-dark"
                  >
                    View all Scada Systems projects →
                  </Link>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
