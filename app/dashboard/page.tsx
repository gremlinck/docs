'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import SeverityBadge from '@/components/SeverityBadge'
import { listIncidents } from '@/lib/storage'
import type { StoredIncident } from '@/types/varo'

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<StoredIncident[]>([])

  useEffect(() => {
    setIncidents(listIncidents())
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <NavBar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">

        {/* Resilience score card (static for demo) */}
        <div
          className="rounded-lg border bg-white px-8 py-6 mb-8"
          style={{ borderColor: '#E4E0D8', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B6860' }}>
            Resilience Score
          </p>
          <div className="flex items-end gap-4">
            <span className="font-syne font-bold text-6xl" style={{ color: '#D97706' }}>
              68
            </span>
            <div className="pb-2">
              <p className="font-semibold text-lg" style={{ color: '#0F0E0C' }}>FAIR</p>
              <p className="text-sm" style={{ color: '#16A34A' }}>↗ Improving</p>
            </div>
            <div className="ml-auto text-right pb-2">
              <p className="text-xs" style={{ color: '#6B6860' }}>out of 100</p>
              <p className="text-xs mt-1" style={{ color: '#6B6860' }}>
                Full scoring in Phase 2
              </p>
            </div>
          </div>
        </div>

        {/* Recent incidents */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-bold text-xl" style={{ color: '#0F0E0C' }}>
            Recent Incidents
          </h2>
          <Link
            href="/incidents/new"
            className="text-sm font-semibold px-4 py-2 rounded-md text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1A3FA8' }}
          >
            Analyse New Alert →
          </Link>
        </div>

        {incidents.length === 0 ? (
          <div
            className="rounded-lg border bg-white px-8 py-16 text-center"
            style={{ borderColor: '#E4E0D8' }}
          >
            <div className="text-4xl mb-4 opacity-20">🛡</div>
            <p className="font-semibold mb-1" style={{ color: '#0F0E0C' }}>No incidents analysed yet.</p>
            <p className="text-sm mb-6" style={{ color: '#6B6860' }}>
              Paste an OT security alert to generate your first incident report.
            </p>
            <Link
              href="/incidents/new"
              className="text-sm font-semibold px-5 py-2.5 rounded-md text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#1A3FA8' }}
            >
              Analyse your first alert →
            </Link>
          </div>
        ) : (
          <div
            className="rounded-lg border bg-white overflow-hidden"
            style={{ borderColor: '#E4E0D8' }}
          >
            {incidents.map((inc, i) => (
              <Link
                key={inc.id}
                href={`/incidents/${encodeURIComponent(inc.id)}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAFAF8] transition-colors"
                style={{
                  borderBottom: i < incidents.length - 1 ? '1px solid #E4E0D8' : 'none',
                }}
              >
                <span className="font-mono text-sm font-semibold" style={{ color: '#1A3FA8' }}>
                  {inc.id}
                </span>
                <SeverityBadge
                  score={inc.report.severityScore}
                  label={inc.report.severityLabel}
                  size="sm"
                />
                <span className="text-sm flex-1 truncate" style={{ color: '#0F0E0C' }}>
                  {inc.report.alertSummary}
                </span>
                <span className="text-xs shrink-0" style={{ color: '#6B6860' }}>
                  {new Date(inc.createdAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
