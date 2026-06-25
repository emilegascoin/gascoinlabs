import { useCallback, useEffect, useRef, useState } from 'react'
import { getTurnstileToken } from '../../lib/turnstileClient'
import SectionHeading from '../ui/SectionHeading'

const EMAIL = 'emilegascoin@gmail.com'
const EMPTY_FORM = {
  name: '',
  email: '',
  company: '',
  scope: '',
  website: '',
}

function fetchToken() {
  return Promise.race([
    getTurnstileToken(),
    new Promise(resolve => setTimeout(() => resolve(null), 8000)),
  ]).catch(() => null)
}

function initialForm(prefill) {
  return {
    ...EMPTY_FORM,
    ...prefill,
    website: '',
  }
}

export default function Consulting({ prefill }) {
  const hasPrefill = Boolean(prefill)
  const [isOpen, setIsOpen] = useState(hasPrefill)
  const [form, setForm] = useState(() => initialForm(prefill))
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const pendingToken = useRef(null)

  const refreshToken = useCallback(() => {
    const nextToken = fetchToken()
    pendingToken.current = nextToken
    nextToken.then(token => setTurnstileToken(token || ''))
    return nextToken
  }, [])

  useEffect(() => {
    refreshToken()
  }, [refreshToken])

  useEffect(() => {
    if (!prefill) return
    const timeout = setTimeout(() => {
      setForm(initialForm(prefill))
      setIsOpen(true)
    }, 0)

    return () => clearTimeout(timeout)
  }, [prefill])

  function updateField(event) {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    if (status === 'failed' || status === 'rate-limited') {
      setStatus('idle')
      setMessage('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('sending')
    setMessage('')

    try {
      // Always fetch a fresh token at submit time. Turnstile tokens are
      // short-lived (around 5 min) and the pre-warmed one from page mount
      // may have expired if the visitor sat on the page before submitting.
      const token = await fetchToken()
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          scope: form.scope,
          source: hasPrefill ? 'chatbot-handoff' : 'form',
          turnstileToken: token,
          website: form.website,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setMessage('Got it. I will get back to you within a day or two.')
        return
      }

      const serverError = await res.json().catch(() => ({}))
      if (res.status === 429) {
        setStatus('rate-limited')
        setMessage(serverError.error || `Too many submissions right now. Email me at ${EMAIL}.`)
        return
      }

      setStatus('failed')
      setMessage(`Something broke on my end. Try again or email me at ${EMAIL}.`)
    } catch {
      setStatus('failed')
      setMessage(`Something broke on my end. Try again or email me at ${EMAIL}.`)
    } finally {
      setTurnstileToken('')
      refreshToken()
    }
  }

  const isSending = status === 'sending'
  const showFallback = status === 'failed' || status === 'rate-limited'

  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule crule">
      <SectionHeading id="consulting" label="06 - consulting" title="Need a hand?" />

      <div className="max-w-prose">
        <p className="text-sm leading-7 text-ink">
          I can also help with ad-hoc consulting when you need another set of eyes. That might be debugging, architecture, automation or planning a small MVP before you spend too much time on the wrong thing.
        </p>

        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-6 inline-block px-5 py-2.5 rounded-full text-sm transition-colors bg-navy text-cream hover:bg-navy-dark"
          >
            Get in touch about consulting
          </button>
        )}

        {isOpen && status === 'sent' && (
          <p className="mt-8 border border-rule bg-cream px-5 py-4 text-sm text-navy">
            {message}
          </p>
        )}

        {isOpen && status !== 'sent' && (
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="grid gap-2 text-sm">
                <span className="font-mono text-xs uppercase tracking-widest text-muted">Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="w-full border border-rule bg-cream px-4 py-3 text-ink outline-none focus:border-navy"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-mono text-xs uppercase tracking-widest text-muted">Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  maxLength={254}
                  autoComplete="email"
                  className="w-full border border-rule bg-cream px-4 py-3 text-ink outline-none focus:border-navy"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">Company</span>
              <input
                name="company"
                value={form.company}
                onChange={updateField}
                maxLength={150}
                autoComplete="organization"
                className="w-full border border-rule bg-cream px-4 py-3 text-ink outline-none focus:border-navy"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">Scope</span>
              <textarea
                name="scope"
                value={form.scope}
                onChange={updateField}
                required
                maxLength={4000}
                rows={7}
                placeholder="What are you trying to solve? Any constraints? Timeline?"
                className="w-full resize-y border border-rule bg-cream px-4 py-3 text-ink outline-none focus:border-navy"
              />
            </label>

            <input type="hidden" name="turnstileToken" value={turnstileToken} readOnly />

            <div
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px overflow-hidden"
            >
              <label>
                Website (leave blank)
                <input
                  name="website"
                  value={form.website}
                  onChange={updateField}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            {message && (
              <p className="text-sm text-navy">
                {message}
                {showFallback && (
                  <>
                    {' '}
                    <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
                      Email me direct.
                    </a>
                  </>
                )}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={isSending}
                className="inline-block px-5 py-2.5 rounded-full text-sm transition-colors bg-navy text-cream hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? 'Sending...' : 'Send consulting enquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
