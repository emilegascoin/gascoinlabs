import { reference } from '../../lib/content'

export default function Reference() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule crule">
      <figure className="max-w-prose">
        <blockquote className="font-serif text-2xl sm:text-3xl text-navy leading-snug italic">
          "{reference.quote}"
        </blockquote>
        <figcaption className="mt-6 text-sm text-muted">
          - {reference.attribution}
          <span className="block font-mono text-xs mt-1">{reference.date}</span>
        </figcaption>
      </figure>
    </section>
  )
}
