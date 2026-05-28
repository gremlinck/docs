'use client'

import Link from 'next/link'
import type { OperatingMode } from '@/types/varo'

interface NavBarProps {
  mode?: OperatingMode
}

export default function NavBar({ mode = 'COPILOT' }: NavBarProps) {
  return (
    <nav
      className="h-14 flex items-center justify-between px-8"
      style={{ backgroundColor: '#0D1F3C' }}
    >
      <Link
        href="/"
        className="font-syne font-extrabold text-white tracking-[0.15em] text-lg hover:opacity-90 transition-opacity"
      >
        VARO AI
      </Link>

      <div className="flex items-center gap-4">
        <span
          className="text-xs font-semibold text-white px-3 py-1 rounded-full"
          style={{
            backgroundColor: mode === 'COPILOT' ? '#065F46' : '#1A3FA8',
          }}
        >
          {mode} ●
        </span>
      </div>
    </nav>
  )
}
