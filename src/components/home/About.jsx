import { about } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function About() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="about" label="01 - about" title="Who I am" />
      <div className="max-w-prose space-y-5 text-lg leading-relaxed">
        {about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  )
}
