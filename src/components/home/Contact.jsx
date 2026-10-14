import { useCallback, useEffect, useRef, useState } from 'react'
import { profile } from '../../lib/content'
import { getTurnstileToken } from '../../lib/turnstileClient'
import SectionHeading from '../ui/SectionHeading'

const EMPTY_FORM = {
  name: '',
  contactValue: '',
  message: '',
  website: '',
}

function fetchToken() {
  return Promise.race([
    getTurnstileToken(),
    new Promise(resolve => setTimeout(() => resolve(null), 8000)),
  ]).catch(() => null)
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [contactChoice, setContactChoice] = useState('email')
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

  function clearErrorStatus() {
    if (status === 'failed' || status === 'rate-limited') {
      setStatus('idle')
      setMessage('')
    }
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    clearErrorStatus()
  }

  function updateContactChoice(event) {
    setContactChoice(event.target.value)
    clearErrorStatus()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('sending')
    setMessage('')

    try {
      const token = await fetchToken()
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: contactChoice === 'email' ? form.contactValue : '',
          phone: contactChoice === 'phone' ? form.contactValue : '',
          scope: form.message,
          source: 'contact-section',
          turnstileToken: token,
          website: form.website,
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setMessage('Got it. I will get back to you as soon as I can.')
        setForm(EMPTY_FORM)
        return
      }

      const serverError = await res.json().catch(() => ({}))
      if (res.status === 429) {
        setStatus('rate-limited')
        setMessage(serverError.error || 'Too many submissions right now. Please try again shortly.')
        return
      }

      setStatus('failed')
      setMessage('Something went wrong. Please try again shortly.')
    } catch {
      setStatus('failed')
      setMessage('Something went wrong. Please try again shortly.')
    } finally {
      setTurnstileToken('')
      refreshToken()
    }
  }

  const isSending = status === 'sending'
  const contactLabel = contactChoice === 'email' ? 'Your email' : 'Your phone'
  const contactType = contactChoice === 'email' ? 'email' : 'tel'
  const contactAutoComplete = contactChoice === 'email' ? 'email' : 'tel'

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 border-t border-rule crule">
      <SectionHeading id="contact" label="07 - contact" title="Get in touch" />

      <div className="max-w-prose">
        {status === 'sent' && (
          <p className="border border-rule bg-cream px-5 py-4 text-sm text-navy">
            {message}
          </p>
        )}

        {status !== 'sent' && (
          <form onSubmit={handleSubmit} className="grid gap-5">
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

            <fieldset className="grid gap-3 text-sm">
              <legend className="font-mono text-xs uppercase tracking-widest text-muted">How should I reach you?</legend>
              <div className="flex flex-wrap gap-3">
                {['email', 'phone'].map(choice => (
                  <label
                    key={choice}
                    className="inline-flex items-center gap-2 border border-rule bg-cream px-4 py-3 text-ink"
                  >
                    <input
                      type="radio"
                      name="contactChoice"
                      value={choice}
                      checked={contactChoice === choice}
                      onChange={updateContactChoice}
                      className="accent-navy"
                    />
                    <span>{choice === 'email' ? 'Email' : 'Phone'}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="grid gap-2 text-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">{contactLabel}</span>
              <input
                name="contactValue"
                type={contactType}
                value={form.contactValue}
                onChange={updateField}
                required
                maxLength={254}
                autoComplete={contactAutoComplete}
                className="w-full border border-rule bg-cream px-4 py-3 text-ink outline-none focus:border-navy"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-muted">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={updateField}
                required
                minLength={10}
                maxLength={4000}
                rows={7}
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
              <p className="text-sm text-navy">{message}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isSending}
                className="inline-block px-5 py-2.5 rounded-full text-sm transition-colors bg-navy text-cream hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? 'Sending...' : 'Send message'}
              </button>
            </div>
          </form>
        )}

        <dl className="mt-8 grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <dt className="font-mono text-xs uppercase tracking-widest text-muted">LinkedIn</dt>
          <dd><a href={profile.linkedin} className="text-navy underline underline-offset-4" target="_blank" rel="noreferrer">{profile.linkedin.replace('https://', '')}</a></dd>

          <dt className="font-mono text-xs uppercase tracking-widest text-muted">GitHub</dt>
          <dd><a href={profile.github} className="text-navy underline underline-offset-4" target="_blank" rel="noreferrer">{profile.github.replace('https://', '')}</a></dd>

          <dt className="font-mono text-xs uppercase tracking-widest text-muted">Location</dt>
          <dd>{profile.location} - {profile.availability}</dd>
        </dl>
      </div>
    </section>
  )
}
