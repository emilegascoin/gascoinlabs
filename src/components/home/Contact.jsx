import { profile } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function Contact() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="contact" label="06 - contact" title="Get in touch" />
      <dl className="grid sm:grid-cols-2 gap-y-4 gap-x-8 max-w-prose text-sm">
        <dt className="font-mono text-xs uppercase tracking-widest text-muted">Email</dt>
        <dd><a href={`mailto:${profile.email}`} className="text-navy underline underline-offset-4">{profile.email}</a></dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-muted">Phone</dt>
        <dd>{profile.phone}</dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-muted">LinkedIn</dt>
        <dd><a href={profile.linkedin} className="text-navy underline underline-offset-4" target="_blank" rel="noreferrer">{profile.linkedin.replace('https://', '')}</a></dd>
        
        <dt className="font-mono text-xs uppercase tracking-widest text-muted">GitHub</dt>
        <dd><a href={profile.github} className="text-navy underline underline-offset-4" target="_blank" rel="noreferrer">{profile.github.replace('https://', '')}</a></dd>

        <dt className="font-mono text-xs uppercase tracking-widest text-muted">Location</dt>
        <dd>{profile.location} · {profile.availability}</dd>
      </dl>
    </section>
  )
}
