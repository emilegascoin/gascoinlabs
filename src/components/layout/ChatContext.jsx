import { createContext, useContext, useState } from 'react'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  return (
    <ChatContext.Provider value={{ open, setOpen, draft, setDraft }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used inside ChatProvider')
  return ctx
}
