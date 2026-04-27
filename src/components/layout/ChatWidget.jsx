import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { askEmileWidget } from '../../lib/content'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/ask') return null

  function submit(prompt) {
    if (!prompt.trim()) return
    navigate('/ask', { state: { initialPrompt: prompt.trim() } })
    setOpen(false)
    setDraft('')
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit(draft)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-3 w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-rule bg-cream shadow-xl p-5">
          <p className="font-serif text-navy mb-3">{askEmileWidget.greeting}</p>
          <div className="flex flex-col gap-2 mb-3">
            {askEmileWidget.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="text-left text-sm px-3 py-2 border border-rule rounded-lg hover:bg-navy hover:text-cream hover:border-navy transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Or ask anything..."
            rows={2}
            className="w-full text-sm border border-rule rounded-lg p-2 resize-none focus:outline-none focus:border-navy"
          />
          <button
            onClick={() => submit(draft)}
            className="mt-2 w-full bg-navy text-cream rounded-full text-sm py-2 hover:bg-navy-dark"
          >
            Ask Emile →
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-navy text-cream rounded-full px-5 py-3 shadow-lg hover:bg-navy-dark text-sm font-medium"
        aria-label="Open chat"
      >
        {open ? 'Close' : 'Ask Emile'}
      </button>
    </div>
  )
}
