'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import SeverityBadge from '@/components/SeverityBadge'
import ResponseStep from '@/components/ResponseStep'
import CopilotChat from '@/components/CopilotChat'
import { loadIncident } from '@/lib/storage'
import { forcesCopilot } from '@/lib/security'
import type { StoredIncident, StepStatus, OperatingMode } from '@/types/varo'

export default function IncidentPage() {
  const params = useParams()
  const router = useRouter()
  const id = decodeURIComponent(params.id as string)

  const [incident, setIncident] = useState<StoredIncident | null>(null)
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([])
  const [modifiedTexts, setModifiedTexts] = useState<string[]>([])
  const [allReviewed, setAllReviewed] = useState(false)

  useEffect(() => {
    const stored = loadIncident(id)
    if (!stored) {
      router.replace('/incidents/new')
      return
    }
    setIncident(stored)
    setStepStatuses(stored.report.responseSteps.map(() => 'pending'))
    setModifiedTexts(stored.report.responseSteps.slice())
  }, [id, router])

  useEffect(() => {
    if (stepStatuses.length > 0 && stepStatuses.every((s) => s !== 'pending')) {
      setAllReviewed(true)
    }
  }, [stepStatuses])

  if (!incident) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm" style={{ color: '#6B6860' }}>Loading incident...</p>
        </div>
      </div>
    )
  }

  const { report, mode } = incident
  const effectiveMode: OperatingMode = forcesCopilot(report) ? 'COPILOT' : mode
  const safetyOverride = mode === 'AUTOPILOT' && forcesCopilot(report)

  function setStep(index: number, status: StepStatus, newText?: string) {
    setStepStatuses((prev) => {
      const next = [...prev]
      next[index] = status
      return next
    })
    if (newText !== undefined) {
      setModifiedTexts((prev) => {
        const next = [...prev]
        next[index] = newText
        return next
      })
    }
  }

  function getSeverityColor(score: number): string {
    if (score >= 9) return '#DC2626'
    if (score >= 7) return '#EA580C'
    if (score >= 5) return '#D97706'
    return '#16A34A'
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <NavBar mode={effectiveMode} />

      {/* Safety override banner */}
      {safetyOverride && (
        <div
          className="px-8 py-3 flex items-center gap-3 text-sm font-medium border-b"
          style={{ backgroundColor: '#FFFBEB', borderColor: '#D97706', color: '#92400E' }}
        >
          <span className="text-base">⚠</span>
          <span>
            <strong>SAFETY OVERRIDE ACTIVE</strong> — This alert has been escalated to COPILOT mode.
            Automated actions are not permitted for alerts that may affect physical processes or safety systems.
            Review and approve each response step manually.
          </span>
        </div>
      )}

      <main className="flex-1 px-6 py-8 max-w-screen-xl mx-auto w-full">
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ─── Report column ─── */}
          <div className="flex-1 min-w-0 animate-fade-up">

            {/* Report card */}
            <div
              className="rounded-lg border bg-white overflow-hidden"
              style={{
                borderColor: '#E4E0D8',
                borderLeftWidth: '4px',
                borderLeftColor: getSeverityColor(report.severityScore),
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              {/* Card header */}
              <div
                className="flex flex-wrap items-center gap-3 px-6 py-4 border-b"
                style={{ borderColor: '#E4E0D8' }}
              >
                <span className="font-mono text-sm font-semibold" style={{ color: '#1A3FA8' }}>
                  {report.incidentId}
                </span>
                <SeverityBadge score={report.severityScore} label={report.severityLabel} size="md" />
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: '#6B6860' }}
                >
                  Confidence: {report.confidenceLevel}
                </span>
                <span className="ml-auto text-xs" style={{ color: '#6B6860' }}>
                  {new Date(incident.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="px-6 py-6 space-y-6">

                {/* Summary */}
                <FieldBlock label="Alert Summary">
                  <p className="text-sm leading-relaxed">{report.alertSummary}</p>
                </FieldBlock>

                {/* Protocol context + Attack scenario */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldBlock label="Protocol Context">
                    <p className="text-sm leading-relaxed" style={{ color: '#1E2D45' }}>
                      {report.protocolContext}
                    </p>
                  </FieldBlock>
                  <FieldBlock label="Attack Scenario">
                    <p className="text-sm leading-relaxed">{report.attackScenario}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className="font-mono text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: '#EFF6FF', color: '#1A3FA8' }}
                      >
                        {report.mitreId}
                      </span>
                      <span className="text-xs" style={{ color: '#6B6860' }}>
                        {report.mitreTechnique}
                      </span>
                    </div>
                    {report.mitreNote && (
                      <p className="text-xs mt-1" style={{ color: '#D97706' }}>
                        ⚠ {report.mitreNote}
                      </p>
                    )}
                  </FieldBlock>
                </div>

                {/* Operational Impact — full width, larger */}
                <FieldBlock label="Operational Impact">
                  <p className="leading-relaxed font-medium" style={{ fontSize: '17px', color: '#0F0E0C' }}>
                    {report.operationalImpact}
                  </p>
                </FieldBlock>

                {/* Financial exposure + Affected assets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FieldBlock label="Financial Exposure">
                    <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>
                      {report.financialExposure}
                    </p>
                  </FieldBlock>
                  <FieldBlock label="Affected Assets">
                    <div className="flex flex-wrap gap-1.5">
                      {report.affectedAssets.map((asset, i) => (
                        <span
                          key={i}
                          className="font-mono text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: '#F7F5F0', color: '#1E2D45', border: '1px solid #E4E0D8' }}
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </FieldBlock>
                </div>

                {/* Confidence reason */}
                <div
                  className="rounded-md px-4 py-3 text-sm"
                  style={{ backgroundColor: '#EFF6FF', color: '#1E2D45' }}
                >
                  <span className="font-semibold">Confidence — {report.confidenceLevel}:</span>{' '}
                  {report.confidenceReason}
                </div>

                {/* Response Steps */}
                <FieldBlock label={`Response Steps (${effectiveMode})`}>
                  {allReviewed && (
                    <div
                      className="mb-4 px-4 py-3 rounded-md text-sm font-medium"
                      style={{ backgroundColor: '#F0FFF4', color: '#065F46', border: '1px solid #BBF7D0' }}
                    >
                      ✓ All response steps reviewed. Incident logged.
                    </div>
                  )}
                  <div className="space-y-2">
                    {report.responseSteps.map((step, i) => (
                      <ResponseStep
                        key={i}
                        index={i}
                        text={step}
                        status={stepStatuses[i] ?? 'pending'}
                        hasSafetyFlag={step.includes('[SAFETY CHECK REQUIRED]') || (report.requiresSafetyCheck ?? false)}
                        onApprove={() => setStep(i, 'approved')}
                        onModify={(newText) => setStep(i, 'modified', newText)}
                        onSkip={() => setStep(i, 'skipped')}
                      />
                    ))}
                  </div>
                </FieldBlock>

                {/* Escalation */}
                <FieldBlock label="Escalation Recommendation">
                  <p className="text-sm leading-relaxed">{report.escalationRecommendation}</p>
                </FieldBlock>

              </div>
            </div>

            {/* Back link */}
            <div className="mt-6">
              <button
                onClick={() => router.push('/incidents/new')}
                className="text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: '#1A3FA8' }}
              >
                ← Analyse another alert
              </button>
            </div>
          </div>

          {/* ─── Copilot column ─── */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-6" style={{ height: 'calc(100vh - 120px)', minHeight: '500px' }}>
              <CopilotChat report={report} />
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: '#6B6860', letterSpacing: '0.1em' }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}
