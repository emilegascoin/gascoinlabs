import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function MotionObserver() {
  const { pathname } = useLocation()

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = [...document.querySelectorAll('#hero, .crule')]

    targets.forEach((target) => target.classList.add('motion-fade'))

    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'))
      return undefined
    }

    document.body.classList.add('motion-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8%' },
    )

    targets.forEach((target) => observer.observe(target))

    return () => {
      observer.disconnect()
      document.body.classList.remove('motion-ready')
      targets.forEach((target) => target.classList.remove('motion-fade', 'is-visible'))
    }
  }, [pathname])

  return null
}
