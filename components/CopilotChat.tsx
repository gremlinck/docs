'use client'

import { useState, useRef, useEffect } from 'react'
import type { IncidentReport } from '@/types/varo'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface CopilotChatProps {
  report: IncidentReport
}

const MAX_MESSAGES = 20

export default function CopilotChat({ report }: CopilotChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `I've analysed this alert. Ask me anything about what it means for your specific process or equipment.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const atLimit = messages.length >= MAX_MESSAGES

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading || atLimit) return

    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const res = await fetch('/api/varo/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, report }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Copilot unavailable')
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to reach the Varo AI Analyst. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div
      className="flex flex-col rounded-lg border overflow-hidden"
      style={{
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE',
        height: '100%',
        minHeight: '400px',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: '#BFDBFE', backgroundColor: '#DBEAFE' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#1A3FA8' }}>
          Engineer Copilot
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#6B6860' }}>
          {report.incidentId} · Ask me anything about this incident
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed"
              style={
                msg.role === 'user'
                  ? {
                      backgroundColor: '#1A3FA8',
                      color: '#FFFFFF',
                      borderRadius: '12px 12px 4px 12px',
                    }
                  : {
                      backgroundColor: '#FFFFFF',
                      color: '#0F0E0C',
                      border: '1.5px solid #E4E0D8',
                      borderRadius: '12px 12px 12px 4px',
                    }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="px-4 py-2.5 rounded-xl text-sm"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#6B6860',
                border: '1.5px solid #E4E0D8',
                borderRadius: '12px 12px 12px 4px',
              }}
            >
              Analysing...
            </div>
          </div>
        )}

        {atLimit && (
          <p className="text-xs text-center py-2" style={{ color: '#6B6860' }}>
            This conversation has reached the session limit. Start a new analysis to continue.
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 text-xs" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
          {error}
        </div>
      )}

      {/* Input */}
      <div
        className="p-3 border-t flex gap-2 items-end"
        style={{ borderColor: '#BFDBFE', backgroundColor: '#FFFFFF' }}
      >
        <textarea
          className="flex-1 text-sm resize-none rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
          style={{
            borderColor: '#E4E0D8',
            color: '#0F0E0C',
            minHeight: '40px',
            maxHeight: '100px',
          }}
          placeholder={atLimit ? 'Session limit reached' : 'Ask about this incident...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || atLimit}
          rows={1}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading || atLimit}
          className="px-4 py-2 rounded-md text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
          style={{ backgroundColor: '#1A3FA8' }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
