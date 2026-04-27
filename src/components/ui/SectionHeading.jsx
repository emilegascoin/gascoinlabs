export default function SectionHeading({ label, title, id }) {
  return (
    <header id={id} className="mb-10">
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
        {label}
      </p>
      <h2 className="font-serif text-3xl sm:text-4xl text-navy">{title}</h2>
    </header>
  )
}
