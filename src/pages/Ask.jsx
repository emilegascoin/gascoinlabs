import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getTurnstileToken } from '../lib/turnstileClient'
import { askEmileWidget } from '../lib/content'

const CONSULTING_START = '[[CONSULTING_INTENT]]'
const CONSULTING_PATTERN = /\[\[CONSULTING_INTENT\]\]([\s\S]*?)\[\[\/CONSULTING_INTENT\]\]/
const PREFILL_LIMITS = {
  name: 100,
  email: 254,
  company: 150,
  scope: 4000,
}

// Catch-up step size — how many chars to advance when the buffer is ahead.
// Larger thresholds than before because RAF ticks at 60fps and each tick
// can naturally handle more chars than a per-character setTimeout could.
function typewriterStep(charsBehind) {
  if (charsBehind > 160) return 8
  if (charsBehind > 80) return 5
  if (charsBehind > 40) return 3
  return 1
}

function visibleBuffer(text) {
  const markerIndex = text.indexOf(CONSULTING_START)
  if (markerIndex !== -1) return text.slice(0, markerIndex)

  for (let i = Math.min(text.length, CONSULTING_START.length - 1); i > 0; i -= 1) {
    if (CONSULTING_START.startsWith(text.slice(-i))) {
      return text.slice(0, -i)
    }
  }

  return text
}

function parseConsultingPrefill(text) {
  const match = text.match(CONSULTING_PATTERN)
  if (!match) return null

  try {
    const parsed = JSON.parse(match[1])
    return Object.fromEntries(
      Object.entries(PREFILL_LIMITS).map(([key, limit]) => [
        key,
        String(parsed?.[key] ?? '').slice(0, limit),
      ])
    )
  } catch {
    return null
  }
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
const MessageBubble = memo(function MessageBubble({ role, content, isActive, showConsultingCta, onConsultingClick }) {
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
      {showConsultingCta && (
        <div className="mt-2">
          <button
            type="button"
            onClick={onConsultingClick}
            className="bg-navy text-cream rounded-full px-5 py-3 text-sm hover:bg-navy-dark disabled:opacity-50"
          >
            Get in touch with Emile
          </button>
        </div>
      )}
    </div>
  )
})

export default function Ask() {
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [consultingPrefill, setConsultingPrefill] = useState(null)
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

  // Auto-scroll only fires when a message is sent or settled (the messages
  // array changes). Firing it on every streamDisplay tick was scheduling a
  // fresh smooth-scroll animation 50+ times per second during streaming,
  // which Safari's compositor couldn't keep up with and showed up as
  // gradually worsening scroll lag the longer the page stayed open.
  // Using 'auto' (instant) behaviour also avoids competing with the user's
  // own scrolling.
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages.length])

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

    // Typewriter: drips characters from buffer to the display using RAF.
    //
    // Why RAF instead of setTimeout:
    //   - RAF fires in sync with the display refresh so there is no timer
    //     jitter. On Safari and slow connections setTimeout fires irregularly,
    //     making the old random-delay approach look patchy and stuttery.
    //   - A time-based character budget (elapsed ms / ms-per-char) keeps the
    //     perceived typing speed steady even when frames are dropped. If Safari
    //     misses a frame the next frame advances enough chars to compensate.
    //
    // Random per-character delay was removed intentionally. The natural
    // variation in SSE chunk arrival gives the stream enough organic feel
    // without adding extra jitter on top.
    function runTypewriter() {
      return new Promise(resolve => {
        const CHARS_PER_SEC = 60
        const MS_PER_CHAR = 1000 / CHARS_PER_SEC
        let lastTime = 0
        let charBudget = 0
        let started = false

        const tick = (now) => {
          if (!started) {
            // First RAF tick — initialise the clock without advancing anything
            started = true
            lastTime = now
            typewriterRef.current = requestAnimationFrame(tick)
            return
          }

          // Cap elapsed to 100ms so switching back to a background tab doesn't
          // cause the text to jump forward by several seconds worth of chars.
          const elapsed = Math.min(now - lastTime, 100)
          lastTime = now

          const behind = state.buffer.length - state.displayed

          if (behind > 0) {
            charBudget += elapsed / MS_PER_CHAR
            const budgetStep = Math.floor(charBudget)
            if (budgetStep > 0) {
              const step = Math.min(budgetStep, typewriterStep(behind))
              state.displayed = Math.min(state.displayed + step, state.buffer.length)
              charBudget -= step
              setStreamDisplay(visibleBuffer(state.buffer.slice(0, state.displayed)).trimStart())
            }
          } else {
            // Buffer empty — reset budget so we don't stockpile time while
            // waiting for the next SSE chunk to arrive.
            charBudget = 0
          }

          if (state.done && state.displayed >= state.buffer.length) {
            typewriterRef.current = null
            resolve()
          } else {
            typewriterRef.current = requestAnimationFrame(tick)
          }
        }

        // Give the stream a 400ms head start before the typewriter begins,
        // same as before, so there is always something to display immediately.
        typewriterRef.current = setTimeout(() => {
          typewriterRef.current = requestAnimationFrame(tick)
        }, 400)
      })
    }

    // Run both concurrently. Promise.all resolves when both have finished.
    await Promise.all([runStreamer(), runTypewriter()])

    setStreamDisplay(null)
    const visibleContent = visibleBuffer(state.buffer).trim()
    const parsedPrefill = consultingPrefill ? null : parseConsultingPrefill(state.buffer)
    const shouldShowConsultingCta = Boolean(parsedPrefill)
    if (state.error) {
      const partial = visibleContent
      // If we got partial content before the error, show it with a short note
      // rather than replacing everything with a generic error message.
      const content = partial
        ? `${partial}\n\n(Something cut out there - email me at emilegascoin@gmail.com if it keeps happening.)`
        : (state.error.message || 'Something went wrong on my end. Email me at emilegascoin@gmail.com.')
      setMessages([...next, { role: 'assistant', content: content.trim() }])
    } else {
      setMessages([...next, {
        role: 'assistant',
        content: visibleContent,
        showConsultingCta: shouldShowConsultingCta,
      }])
      if (parsedPrefill) setConsultingPrefill(parsedPrefill)
    }
    setPending(false)
  }

  // Merge committed messages with the active streaming bubble. Memoised so
  // the array reference is stable across re-renders that don't actually
  // change the underlying data (e.g. a keystroke in the input box).
  const displayMessages = useMemo(() => (
    streamDisplay !== null
      ? [...messages, { role: 'assistant', content: streamDisplay, isActive: true }]
      : messages
  ), [messages, streamDisplay])

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
            showConsultingCta={m.showConsultingCta && consultingPrefill}
            onConsultingClick={() => navigate('/', {
              state: { prefill: consultingPrefill, scrollTo: 'consulting' },
            })}
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
