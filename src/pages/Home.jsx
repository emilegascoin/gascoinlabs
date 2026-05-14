import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/home/Hero'
import About from '../components/home/About'
import Experience from '../components/home/Experience'
import Education from '../components/home/Education'
import AIWorkflow from '../components/home/AIWorkflow'
import Skills from '../components/home/Skills'
import Reference from '../components/home/Reference'
import Consulting from '../components/home/Consulting'
import Contact from '../components/home/Contact'

const PREFILL_LIMITS = {
  name: 100,
  email: 254,
  company: 150,
  scope: 4000,
}

function sanitizePrefill(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined

  const prefill = {}
  for (const [field, maxLength] of Object.entries(PREFILL_LIMITS)) {
    if (typeof value[field] === 'string') {
      prefill[field] = value[field].slice(0, maxLength)
    }
  }

  return prefill
}

export default function Home() {
  const location = useLocation()
  const state = location.state
  const prefillFromState = useMemo(() => sanitizePrefill(state?.prefill), [state])

  useEffect(() => {
    if (state?.scrollTo !== 'consulting') return undefined

    const timeout = setTimeout(() => {
      document.getElementById('consulting')?.scrollIntoView()
    }, 100)

    return () => clearTimeout(timeout)
  }, [state])

  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Education />
      <AIWorkflow />
      <Skills />
      <Reference />
      <Consulting prefill={prefillFromState} />
      <Contact />
    </>
  )
}
