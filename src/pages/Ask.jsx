import { memo, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getTurnstileToken } from '../lib/turnstileClient'
import { askEmileWidget } from '../lib/content'

// Fixed typing speed - randomised per character for a human feel
function charDelay() {
  return Math.floor(Math.random() * 20) + 8 // 8-28ms, avg ~18ms
}

// Step size - type faster when a large backlog builds up (e.g. returning to a tab)
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

// Memoised message bubble - only re-renders if its own content/role changes.
// Without this, every keystroke in the input re-renders every bubble in the
// list, which Safari handles noticeably worse than Chrome (visible input lag
// once a few messages have accumulated).
const MessageBubble = memo(function MessageBubble({ role, content, isActive }) {
  const isDots = isActive && !content
  const isTyping = isActive && content.length > 0
  return (
    <div className={role === 'user' ? 'text-right' : ''}>
      <div className={`inline-block max-w-prose text-left rounded-2xl px-4 py-3 ${
        role === 'user' ? 'bg-navy text-cream' : 'bg-white border border-rule'
      }`}>
        {isDots ? (
          <TypingDots />
        ) : (
          <p className="text-sm whitespace-pre-wrap">
            {content}
            {isTyping && (
              <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-pulse" />
            )}
          </p>
        )}
      </div>
    </div>
  )
})

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
  // Pre-warm a Turnstile token as soon as the page loads so it's ready
  // by the time the user hits send. Refreshed after each use.
  const pendingToken = useRef(fetchToken())

  function fetchToken() {
    // Race against a hard timeout so a stuck script load never blocks send()
    return Promise.race([
      getTurnstileToken(),
      new Promise(resolve => setTimeout(() => resolve(null), 8000)),
    ]).catch(() => null)
  }

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

    // Show dots right away - before token fetch or API call
    setStreamDisplay('')

    // Use the pre-warmed token (resolves instantly if ready, waits briefly if
    // not). Start fetching the next one immediately so it's ready for the
    // following message.
    const token = await pendingToken.current
    pendingToken.current = fetchToken()

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

    // The API streams Server-Sent Events (text/event-stream). Each event is
    // a `data: <json>\n\n` block where the JSON is one chunk of text from
    // the AI. SSE was chosen because Safari refuses to render text/plain
    // streams in real time but treats SSE as a streaming format and renders
    // chunks immediately. Comment lines (starting with `:`) are ignored.
    let sseLeftover = ''
    function processEvent(event) {
      if (!event.trim() || event.startsWith(':')) return
      for (const line of event.split('\n')) {
        if (!line.startsWith('data:')) continue
        const payload = line.slice(5).trimStart()
        try {
          state.buffer += JSON.parse(payload)
        } catch {
          // Malformed event - skip silently rather than break the stream.
        }
      }
    }
    function ingestSse(raw) {
      sseLeftover += raw
      const events = sseLeftover.split('\n\n')
      sseLeftover = events.pop() || ''
      for (const event of events) processEvent(event)
    }
    function flushSse() {
      if (sseLeftover) {
        processEvent(sseLeftover)
        sseLeftover = ''
      }
    }

    // Streamer: reads SSE chunks from the API and feeds them into ingestSse,
    // which parses out the text and appends to the shared buffer.
    async function runStreamer() {
      try {
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
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
        // ReadableStream. Fall back to reading the full response at once -
        // the typewriter still runs, it just won't start until the full
        // response arrives.
        if (!res.body || typeof res.body.getReader !== 'function') {
          ingestSse(await res.text())
          flushSse()
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          ingestSse(decoder.decode(value, { stream: true }))
        }
        flushSse()
      } catch (err) {
        state.error = err
      } finally {
        state.done = true
      }
    }

    // Typewriter: drips characters from buffer to the display.
    // Waits a short initial delay so Gemini can build up a buffer before we
    // start typing - this prevents catching up mid-stream and pausing.
    // Resolves only once the stream is done AND we've caught up.
    function runTypewriter() {
      return new Promise(resolve => {
        const tick = () => {
          const behind = state.buffer.length - state.displayed
          if (behind > 0) {
            const step = typewriterStep(behind)
            state.displayed = Math.min(state.displayed + step, state.buffer.length)
            setStreamDisplay(state.buffer.slice(0, state.displayed).trimStart())
          }
          if (state.done && state.displayed >= state.buffer.length) {
            typewriterRef.current = null
            resolve()
          } else {
            typewriterRef.current = setTimeout(tick, charDelay())
          }
        }
        // Give Gemini ~400ms head start before the typewriter begins
        typewriterRef.current = setTimeout(tick, 400)
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
        ? `${partial}\n\n(Something cut out there - email me at emilegascoin@gmail.com if it keeps happening.)`
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

      <div className="flex-1 space-y-5 mb-6">
        {displayMessages.map((m, i) => (
          <MessageBubble
            key={i}
            role={m.role}
            content={m.content}
            isActive={m.isActive}
          />
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="sticky bottom-4 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {askEmileWidget.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={pending}
              className="text-left text-xs px-3 py-2 border border-rule rounded-full bg-cream hover:bg-navy hover:text-cream hover:border-navy transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="flex gap-2">
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
    </div>
  )
}
