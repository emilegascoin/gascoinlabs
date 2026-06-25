import { hero, profile } from '../../lib/content'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section id="hero" className="mx-auto max-w-6xl px-6 pt-20 pb-24">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
        // {profile.location.toLowerCase()}
      </p>
      <h1 className="font-serif text-5xl sm:text-6xl text-navy leading-[1.05] tracking-normal">
        {hero.headline}
      </h1>
      <p className="mt-6 max-w-prose text-lg text-ink/80 leading-relaxed">
        {hero.sub}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        {hero.ctas.map((cta) => (
          <Button key={cta.label} to={cta.to} primary={cta.primary}>
            {cta.label}
          </Button>
        ))}
      </div>
    </section>
  )
}
