import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getTurnstileToken } from '../lib/turnstileClient'
import { askEmileWidget } from '../lib/content'

export default function Ask() {
  const location = useLocation()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const initialised = useRef(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (initialised.current) return
    initialised.current = true
    const initial = location.state?.initialPrompt
    if (initial) send(initial)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(content) {
    if (!content.trim() || pending) return
    setPending(true)
    setInput('')
    const next = [...messages, { role: 'user', content }]
    setMessages(next)

    let token
    try {
      token = await getTurnstileToken()
    } catch {
      setMessages([...next, { role: 'assistant', content: "Couldn't verify the request. Try refreshing." }])
      setPending(false)
      return
    }

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages,
          turnstileToken: token,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setMessages([...next, { role: 'assistant', content: err.error || 'Something went wrong.' }])
        setPending(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      setMessages([...next, { role: 'assistant', content: '' }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setMessages([...next, { role: 'assistant', content: acc }])
      }
    } catch (err) {
      setMessages([...next, { role: 'assistant', content: 'Connection error. Email me at emilegascoin@gmail.com.' }])
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 min-h-[80vh] flex flex-col">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">/ask</p>
        <h1 className="font-serif text-3xl text-navy">Ask Emile</h1>
        <p className="text-sm text-muted mt-2">Grounded in my CV and notes. If I don't know, I'll tell you.</p>
      </header>

      {messages.length === 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {askEmileWidget.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-left text-sm px-4 py-3 border border-rule rounded-lg hover:bg-navy hover:text-cream hover:border-navy transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 space-y-5 mb-6">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block max-w-prose text-left rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-navy text-cream' : 'bg-white border border-rule'}`}>
              <p className="text-sm whitespace-pre-wrap">{m.content || (pending && i === messages.length - 1 ? '…' : '')}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="flex gap-2 sticky bottom-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={pending}
          placeholder="Ask anything..."
          className="flex-1 border border-rule bg-white rounded-full px-5 py-3 text-sm focus:outline-none focus:border-navy"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="bg-navy text-cream rounded-full px-5 py-3 text-sm hover:bg-navy-dark disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
