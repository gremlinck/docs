'use client'

import type { OperatingMode } from '@/types/varo'

interface ModeToggleProps {
  value: OperatingMode
  onChange: (mode: OperatingMode) => void
}

export default function ModeToggle({ value, onChange }: ModeToggleProps) {
  return (
    <div
      className="inline-flex rounded-full p-1 gap-1"
      style={{ backgroundColor: '#F0EDE6' }}
    >
      {(['COPILOT', 'AUTOPILOT'] as OperatingMode[]).map((mode) => {
        const active = value === mode
        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={
              active
                ? {
                    backgroundColor: mode === 'COPILOT' ? '#065F46' : '#1A3FA8',
                    color: '#FFFFFF',
                  }
                : { color: '#6B6860' }
            }
          >
            {mode}
          </button>
        )
      })}
    </div>
  )
}
