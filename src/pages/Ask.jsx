import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getTurnstileToken } from '../lib/turnstileClient'
import { askEmileWidget } from '../lib/content'

// Minimum time to show the loading dots before typing starts
const MIN_LOADING_MS = 5000

// Typing speed — randomised per character for a human feel (ms per char)
function charDelay() {
  return Math.floor(Math.random() * 20) + 8 // 8-28ms, avg ~18ms
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
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

// Collects the full streamed response into a string
async function fetchFullResponse(content, history, token) {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content, history, turnstileToken: token }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Something went wrong on my end.')
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let acc = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    acc += decoder.decode(value, { stream: true })
  }
  return acc
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

  // Types out fullText character by character and resolves when done
  function typewriterWrite(fullText) {
    return new Promise(resolve => {
      let pos = 0

      function tick() {
        pos++
        setStreamDisplay(fullText.slice(0, pos))
        if (pos >= fullText.length) {
          typewriterRef.current = null
          resolve()
        } else {
          typewriterRef.current = setTimeout(tick, charDelay())
        }
      }

      typewriterRef.current = setTimeout(tick, charDelay())
    })
  }

  async function send(content) {
    if (!content.trim() || pending) return
    setPending(true)
    setInput('')
    const next = [...messages, { role: 'user', content }]
    setMessages(next)

    // Show dots right away — before token fetch or API call
    setStreamDisplay('')

    let token
    try {
      token = await getTurnstileToken()
    } catch {
      setStreamDisplay(null)
      setMessages([...next, { role: 'assistant', content: "Couldn't verify the request. Try refreshing." }])
      setPending(false)
      return
    }

    let fullResponse
    try {
      // Fire API call and minimum loading timer at the same time.
      // We only proceed once BOTH are done — whichever finishes last wins.
      const [text] = await Promise.all([
        fetchFullResponse(content, messages, token),
        delay(MIN_LOADING_MS),
      ])
      fullResponse = text
    } catch (err) {
      setStreamDisplay(null)
      setMessages([...next, { role: 'assistant', content: err.message || 'Connection error. Email me at emilegascoin@gmail.com.' }])
      setPending(false)
      return
    }

    // Dots phase done — type out the response
    await typewriterWrite(fullResponse)

    // Lock in the final text to the message history
    setStreamDisplay(null)
    setMessages([...next, { role: 'assistant', content: fullResponse }])
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
        <p className="text-sm text-muted mt-2">Grounded in my CV and notes. If I don't know, I'll tell you.</p>
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
