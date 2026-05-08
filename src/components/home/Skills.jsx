import { skills } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function Skills() {
  const groups = Object.entries(skills)
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="skills" label="05 - stack" title="What I work with" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups.map(([group, items]) => (
          <div key={group}>
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">{group}</p>
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item} className="px-3 py-1 border border-rule rounded-full text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
