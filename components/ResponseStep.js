'use client';

import { useState } from 'react';

export default function ResponseStep({ step, index, onAction }) {
  const [status, setStatus] = useState('pending');
  const [editText, setEditText] = useState(step);

  const approve = (text = editText) => {
    setStatus('approved');
    onAction?.({ index, action: 'approved', text });
  };

  const skip = () => {
    setStatus('skipped');
    onAction?.({ index, action: 'skipped', text: step });
  };

  const num = String(index + 1).padStart(2, '0');

  if (status === 'approved') {
    return (
      <div
        className="flex items-start gap-3 p-3 rounded-md mb-2"
        style={{ background: '#F0FFF4', borderLeft: '3px solid #065F46' }}
      >
        <span className="font-mono text-xs min-w-6" style={{ color: '#1A3FA8' }}>{num}</span>
        <span className="text-sm flex-1" style={{ color: '#0F0E0C' }}>{editText}</span>
        <span className="text-xs font-semibold shrink-0" style={{ color: '#065F46' }}>✓ APPROVED</span>
      </div>
    );
  }

  if (status === 'skipped') {
    return (
      <div
        className="flex items-start gap-3 p-3 rounded-md mb-2 opacity-50"
        style={{ background: '#F9F9F9', border: '1.5px solid #E4E0D8' }}
      >
        <span className="font-mono text-xs min-w-6" style={{ color: '#1A3FA8' }}>{num}</span>
        <span className="text-sm flex-1 line-through" style={{ color: '#0F0E0C' }}>{step}</span>
        <span className="text-xs font-semibold shrink-0" style={{ color: '#6B6860' }}>SKIPPED</span>
      </div>
    );
  }

  if (status === 'editing') {
    return (
      <div
        className="flex flex-col gap-2 p-3 rounded-md mb-2"
        style={{ border: '1.5px solid #1A3FA8', background: '#FAFAF8' }}
      >
        <div className="flex items-start gap-3">
          <span className="font-mono text-xs min-w-6 pt-2" style={{ color: '#1A3FA8' }}>{num}</span>
          <textarea
            className="text-sm flex-1 p-2 rounded resize-none outline-none"
            style={{ border: '1.5px solid #E4E0D8', lineHeight: '1.65' }}
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => approve(editText)}
            className="px-3 py-1.5 rounded text-xs font-semibold text-white transition-all"
            style={{ background: '#065F46' }}
          >
            Save & Approve
          </button>
          <button
            onClick={() => setStatus('pending')}
            className="px-3 py-1.5 rounded text-xs font-semibold transition-all"
            style={{ border: '1.5px solid #E4E0D8', color: '#6B6860', background: 'white' }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-md mb-2 transition-all"
      style={{ background: '#FAFAF8', border: '1.5px solid #E4E0D8' }}
    >
      <span className="font-mono text-xs min-w-6 pt-0.5" style={{ color: '#1A3FA8' }}>{num}</span>
      <span className="text-sm flex-1 leading-relaxed" style={{ color: '#0F0E0C' }}>{step}</span>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => approve(step)}
          className="px-3 py-1.5 rounded text-xs font-semibold text-white transition-all"
          style={{ background: '#065F46' }}
        >
          APPROVE
        </button>
        <button
          onClick={() => setStatus('editing')}
          className="px-3 py-1.5 rounded text-xs font-semibold transition-all"
          style={{ border: '1.5px solid #1A3FA8', color: '#1A3FA8', background: 'white' }}
        >
          MODIFY
        </button>
        <button
          onClick={skip}
          className="px-3 py-1.5 rounded text-xs font-semibold transition-all"
          style={{ border: '1.5px solid #E4E0D8', color: '#6B6860', background: 'white' }}
        >
          SKIP
        </button>
      </div>
    </div>
  );
}
