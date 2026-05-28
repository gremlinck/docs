'use client'

import { useState } from 'react'
import type { StepStatus } from '@/types/varo'

interface ResponseStepProps {
  index: number
  text: string
  status: StepStatus
  hasSafetyFlag: boolean
  onApprove: () => void
  onModify: (newText: string) => void
  onSkip: () => void
}

export default function ResponseStep({
  index,
  text,
  status,
  hasSafetyFlag,
  onApprove,
  onModify,
  onSkip,
}: ResponseStepProps) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(text)

  const displayText = status === 'modified' ? editText : text
  const stepNum = String(index + 1).padStart(2, '0')

  if (status === 'approved' || status === 'modified') {
    return (
      <div
        className="flex items-start gap-3 rounded-md p-4 border"
        style={{
          backgroundColor: '#F0FFF4',
          borderColor: '#E4E0D8',
          borderLeftWidth: '3px',
          borderLeftColor: '#065F46',
        }}
      >
        <span className="font-mono text-xs font-semibold pt-0.5 min-w-[24px]" style={{ color: '#1A3FA8' }}>
          {stepNum}
        </span>
        <span className="text-sm flex-1" style={{ color: '#0F0E0C' }}>
          {displayText}
        </span>
        <span className="text-xs font-semibold" style={{ color: '#065F46' }}>
          ✓ APPROVED
        </span>
      </div>
    )
  }

  if (status === 'skipped') {
    return (
      <div
        className="flex items-start gap-3 rounded-md p-4 border opacity-50"
        style={{ backgroundColor: '#F9F9F9', borderColor: '#E4E0D8' }}
      >
        <span className="font-mono text-xs font-semibold pt-0.5 min-w-[24px]" style={{ color: '#6B6860' }}>
          {stepNum}
        </span>
        <span className="text-sm flex-1 line-through" style={{ color: '#6B6860' }}>
          {text}
        </span>
        <span className="text-xs font-semibold" style={{ color: '#6B6860' }}>
          SKIPPED
        </span>
      </div>
    )
  }

  return (
    <div
      className="rounded-md border p-4"
      style={{ backgroundColor: '#FAFAF8', borderColor: '#E4E0D8' }}
    >
      {hasSafetyFlag && (
        <div
          className="text-xs font-semibold mb-2 px-2 py-1 rounded"
          style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}
        >
          ⚠ SAFETY CHECK REQUIRED — review before approving
        </div>
      )}

      <div className="flex items-start gap-3">
        <span className="font-mono text-xs font-semibold pt-0.5 min-w-[24px]" style={{ color: '#1A3FA8' }}>
          {stepNum}
        </span>

        {editing ? (
          <textarea
            className="text-sm flex-1 rounded border px-3 py-2 resize-none focus:outline-none focus:ring-2"
            style={{
              borderColor: '#1A3FA8',
              color: '#0F0E0C',
              minHeight: '72px',
            }}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
        ) : (
          <span className="text-sm flex-1" style={{ color: '#0F0E0C' }}>
            {text}
          </span>
        )}

        <div className="flex gap-2 ml-2 shrink-0">
          {editing ? (
            <>
              <button
                onClick={() => { setEditing(false); onModify(editText) }}
                className="text-xs font-semibold px-3 py-1.5 rounded-md text-white"
                style={{ backgroundColor: '#065F46' }}
              >
                Save &amp; Approve
              </button>
              <button
                onClick={() => { setEditing(false); setEditText(text) }}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border"
                style={{ borderColor: '#E4E0D8', color: '#6B6860' }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onApprove}
                className="text-xs font-semibold px-3 py-1.5 rounded-md text-white"
                style={{ backgroundColor: '#065F46' }}
              >
                APPROVE
              </button>
              <button
                onClick={() => setEditing(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border"
                style={{ borderColor: '#1A3FA8', color: '#1A3FA8' }}
              >
                MODIFY
              </button>
              <button
                onClick={onSkip}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border"
                style={{ borderColor: '#E4E0D8', color: '#6B6860' }}
              >
                SKIP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
