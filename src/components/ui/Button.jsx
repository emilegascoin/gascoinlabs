import { Link } from 'react-router-dom'

export default function Button({ to, href, primary = false, children, className = '' }) {
  const base = 'inline-block px-5 py-2.5 rounded-full text-sm transition-colors'
  const variant = primary
    ? 'bg-navy text-cream hover:bg-navy-dark'
    : 'border border-navy bg-white text-navy hover:bg-navy hover:text-cream'

  if (href) {
    return <a href={href} className={`${base} ${variant} ${className}`}>{children}</a>
  }
  return <Link to={to} className={`${base} ${variant} ${className}`}>{children}</Link>
}
