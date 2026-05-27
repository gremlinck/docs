'use client';

import { useState, useRef, useEffect } from 'react';

export default function CopilotPanel({ report }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "I've analysed this alert. Ask me anything about what it means for your specific process.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/varo/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, report }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.reply || 'Unable to process response.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Network error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      className="flex flex-col h-full rounded-lg overflow-hidden"
      style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE' }}
    >
      <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1.5px solid #BFDBFE' }}>
        <h3 className="font-semibold text-sm" style={{ color: '#0D1F3C' }}>
          Engineer Copilot
        </h3>
        <p className="text-xs mt-0.5" style={{ color: '#6B6860' }}>
          Ask anything about this incident
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-xs text-sm px-3 py-2 leading-relaxed"
              style={
                m.role === 'user'
                  ? { background: '#1A3FA8', color: 'white', borderRadius: '12px 12px 4px 12px' }
                  : {
                      background: 'white',
                      color: '#0F0E0C',
                      border: '1.5px solid #E4E0D8',
                      borderRadius: '12px 12px 12px 4px',
                    }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="text-sm px-3 py-2 italic"
              style={{
                background: 'white',
                color: '#6B6860',
                border: '1.5px solid #E4E0D8',
                borderRadius: '12px 12px 12px 4px',
              }}
            >
              Analysing...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 shrink-0" style={{ borderTop: '1.5px solid #BFDBFE', background: 'white' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this incident..."
            className="flex-1 px-3 py-2 rounded outline-none text-sm"
            style={{ border: '1.5px solid #E4E0D8', color: '#0F0E0C' }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-4 py-2 rounded text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
            style={{ background: '#1A3FA8' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
