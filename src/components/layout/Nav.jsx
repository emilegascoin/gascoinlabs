import { Link, NavLink } from 'react-router-dom'

export default function Nav() {
  const linkClass = ({ isActive }) =>
    `text-sm hover:text-navy transition-colors ${isActive ? 'text-navy font-medium' : 'text-muted'}`

  return (
    <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur border-b border-rule">
      <nav className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-xl text-navy">Emile Gascoin</Link>
        <div className="flex gap-6">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/work/elecdes" className={linkClass}>Work</NavLink>
          <NavLink to="/ask" className={linkClass}>Ask Emile</NavLink>
        </div>
      </nav>
    </header>
  )
}
