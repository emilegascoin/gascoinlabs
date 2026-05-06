import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getTurnstileToken } from '../lib/turnstileClient'
import { askEmileWidget } from '../lib/content'

// Typing speed — randomised per character for a human feel (ms per char)
function charDelay() {
  return Math.floor(Math.random() * 20) + 8 // 8-28ms, avg ~18ms
}

// Adaptive typewriter step. If the buffer is much bigger than what's been
// shown, type a few chars per tick so we don't fall behind on a fast stream.
function typewriterStep(charsBehind) {
  if (charsBehind > 100) return 3
  if (charsBehind > 40) return 2
  return 1
}

function TypingDots() {
  return (
    <span className="flex gap-1 items-center h-4">
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  )
}

export default function Ask() {
  const location = useLocation()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  // null = idle  |  '' = dots showing  |  'text…' = typing out
  const [streamDisplay, setStreamDisplay] = useState(null)
  const initialised = useRef(false)
  const scrollRef = useRef(null)
  const typewriterRef = useRef(null)

  useEffect(() => {
    if (initialised.current) return
    initialised.current = true
    const initial = location.state?.initialPrompt
    if (initial) send(initial)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamDisplay])

  async function send(content) {
    if (!content.trim() || pending) return
    setPending(true)
    setInput('')
    const next = [...messages, { role: 'user', content }]
    setMessages(next)

    // Show dots right away — before token fetch or API call
    setStreamDisplay('')

    // Try to get a Turnstile token but never block on it.
    // The rate limit and spend cap are the real abuse protection.
    let token = null
    try {
      token = await getTurnstileToken()
    } catch (err) {
      console.warn('Turnstile token unavailable, continuing without:', err?.message)
    }

    // Shared state between the streamer and the typewriter.
    // The streamer fills `buffer` with whatever Gemini sends. The typewriter
    // drips characters from `buffer` to the display at human-typing speed,
    // catching up faster if it falls behind.
    const state = {
      buffer: '',
      displayed: 0,
      done: false,
      error: null,
    }

    // Streamer: receives chunks from the API into the shared buffer
    async function runStreamer() {
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
          throw new Error(err.error || 'Something went wrong on my end.')
        }

        // Some in-app browsers (Messenger, LinkedIn) don't support
        // ReadableStream. Fall back to reading the full response at once —
        // the typewriter still runs, it just won't start until the full
        // response arrives.
        if (!res.body || typeof res.body.getReader !== 'function') {
          state.buffer = await res.text()
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          state.buffer += decoder.decode(value, { stream: true })
        }
      } catch (err) {
        state.error = err
      } finally {
        state.done = true
      }
    }

    // Typewriter: drips characters from buffer to the display.
    // Resolves only once the stream is done AND we've caught up.
    function runTypewriter() {
      return new Promise(resolve => {
        const tick = () => {
          if (state.displayed < state.buffer.length) {
            const behind = state.buffer.length - state.displayed
            const step = typewriterStep(behind)
            state.displayed = Math.min(state.displayed + step, state.buffer.length)
            // trimStart so a leading newline from the model shows as dots
            // rather than a blank line while the real content loads
            setStreamDisplay(state.buffer.slice(0, state.displayed).trimStart())
          }
          if (state.done && state.displayed >= state.buffer.length) {
            typewriterRef.current = null
            resolve()
          } else {
            typewriterRef.current = setTimeout(tick, charDelay())
          }
        }
        typewriterRef.current = setTimeout(tick, charDelay())
      })
    }

    // Run both concurrently. Promise.all resolves when both have finished.
    await Promise.all([runStreamer(), runTypewriter()])

    setStreamDisplay(null)
    if (state.error) {
      const partial = state.buffer.trim()
      // If we got partial content before the error, show it with a short note
      // rather than replacing everything with a generic error message.
      const content = partial
        ? `${partial}\n\n(Something cut out there — email me at emilegascoin@gmail.com if it keeps happening.)`
        : (state.error.message || 'Something went wrong on my end. Email me at emilegascoin@gmail.com.')
      setMessages([...next, { role: 'assistant', content: content.trim() }])
    } else {
      setMessages([...next, { role: 'assistant', content: state.buffer.trim() }])
    }
    setPending(false)
  }

  // Merge committed messages with the active streaming bubble
  const displayMessages = streamDisplay !== null
    ? [...messages, { role: 'assistant', content: streamDisplay, isActive: true }]
    : messages

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 min-h-[80vh] flex flex-col">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">/ask</p>
        <h1 className="font-serif text-3xl text-navy">Ask Emile</h1>
        <p className="text-sm text-muted mt-2">The next best thing to actually talking to me.</p>
      </header>

      {messages.length === 0 && streamDisplay === null && (
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
        {displayMessages.map((m, i) => {
          const isDots = m.isActive && !m.content
          const isTyping = m.isActive && m.content.length > 0
          return (
            <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
              <div className={`inline-block max-w-prose text-left rounded-2xl px-4 py-3 ${
                m.role === 'user' ? 'bg-navy text-cream' : 'bg-white border border-rule'
              }`}>
                {isDots ? (
                  <TypingDots />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
                    {m.content}
                    {isTyping && (
                      <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-pulse" />
                    )}
                  </p>
                )}
              </div>
            </div>
          )
        })}
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
