import { education } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function Education() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="education" label="03 - education" title="Where I studied" />
      <div className="space-y-8">
        {education.map((e) => (
          <article key={e.school} className="grid sm:grid-cols-[180px_1fr] gap-6">
            <p className="font-mono text-xs text-muted">{e.dates}</p>
            <div>
              <h3 className="font-serif text-xl text-navy">{e.qualification}</h3>
              <p className="text-muted text-sm">{e.school}</p>
              <p className="mt-2 text-sm">{e.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
