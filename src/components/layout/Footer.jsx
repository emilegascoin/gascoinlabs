export default function Footer() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted flex flex-col sm:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} Emile Gascoin · Melbourne, VIC</p>
        <p className="font-mono text-xs">gascoinlabs.com</p>
      </div>
    </footer>
  )
}
