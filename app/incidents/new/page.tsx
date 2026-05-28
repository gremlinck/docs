'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import ModeToggle from '@/components/ModeToggle'
import LoadingBar from '@/components/LoadingBar'
import { saveIncident } from '@/lib/storage'
import type { FacilityType, OperatingMode, IncidentReport } from '@/types/varo'

const DEMO_SCENARIOS = {
  modbus: `Modbus Function Code 06 (Write Single Register) detected on PLC-07 at 02:14 AM from source IP 192.168.10.44. This IP is outside the approved engineering workstation range. Target register address: 40011 (motor speed setpoint). Value written: 3400 RPM. Previous safe operating value: 1200 RPM. Activity occurred outside scheduled maintenance window. No work order found for this asset at this time.

Operating mode: COPILOT
Facility type: Energy`,
  historian: `OPC-UA bulk read request from workstation WS-22 to Historian server HIS-01. Request accessed 847 process tags in 4.2 seconds. Normal baseline read rate: 12 tags per minute. WS-22 is assigned to the maintenance team — no scheduled activity today. Tags accessed include turbine speed, pressure setpoints, valve positions, and flow rates across Units 1-4.

Operating mode: COPILOT
Facility type: Energy`,
  hmi: `14 consecutive failed login attempts on HMI-03 (Turbine Control Interface) between 03:00–03:08 AM. Source IP: 10.0.5.91 — not in asset inventory. HMI-03 controls the Unit 2 steam turbine governor including speed setpoint and emergency trip functions. All attempts used different username formats suggesting credential enumeration.

Operating mode: COPILOT
Facility type: Energy`,
}

const FACILITY_LABELS: Record<FacilityType, string> = {
  energy: 'Energy',
  manufacturing: 'Manufacturing',
  water: 'Water',
  oil_gas: 'Oil & Gas',
}

export default function NewIncidentPage() {
  const router = useRouter()
  const [alertText, setAlertText] = useState('')
  const [facilityType, setFacilityType] = useState<FacilityType>('energy')
  const [mode, setMode] = useState<OperatingMode>('COPILOT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyse() {
    if (!alertText.trim()) {
      setError('Please paste an OT security alert before analysing.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/varo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertText, facilityType, mode }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Analysis failed. Please try again.')
      }

      const report = data.report as IncidentReport
      const incidentId = report.incidentId

      saveIncident({
        id: incidentId,
        report,
        facilityType,
        mode,
        rawAlert: alertText,
        createdAt: new Date().toISOString(),
      })

      router.push(`/incidents/${encodeURIComponent(incidentId)}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.'
      setError(msg)
      setLoading(false)
    }
  }

  function loadDemo(scenario: keyof typeof DEMO_SCENARIOS) {
    setAlertText(DEMO_SCENARIOS[scenario])
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF8F4' }}>
      <NavBar mode={mode} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        {/* Heading */}
        <div className="mb-8 animate-fade-up">
          <h1 className="font-syne font-bold text-3xl tracking-tight mb-2" style={{ color: '#0F0E0C' }}>
            Analyse OT Alert
          </h1>
          <p className="text-sm" style={{ color: '#6B6860' }}>
            Paste any OT security alert below. Varo AI will return a structured consequence report in under 90 seconds.
          </p>
        </div>

        {/* Demo shortcuts */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B6860' }}>
            Load demo scenario
          </p>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { key: 'modbus', label: 'Modbus PLC Anomaly' },
                { key: 'historian', label: 'Historian Exfiltration' },
                { key: 'hmi', label: 'HMI Brute Force' },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => loadDemo(key)}
                className="text-xs px-3 py-1.5 rounded-md border font-medium transition-colors hover:border-blue hover:text-blue"
                style={{ borderColor: '#E4E0D8', color: '#6B6860' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Alert textarea */}
        <div className="mb-6">
          <textarea
            className="w-full rounded-lg border px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue resize-none"
            style={{
              borderColor: '#E4E0D8',
              backgroundColor: '#FFFFFF',
              color: '#0F0E0C',
              minHeight: '220px',
            }}
            placeholder="Paste your OT security alert here...

Example: Modbus Function Code 06 detected on PLC-07 from unauthorised source IP..."
            value={alertText}
            onChange={(e) => setAlertText(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs mt-1.5" style={{ color: '#6B6860' }}>
            {alertText.length.toLocaleString()} / 5,000 characters
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-6 mb-8">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: '#6B6860' }}>
              Facility type
            </label>
            <select
              className="text-sm rounded-md border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue"
              style={{ borderColor: '#E4E0D8', color: '#0F0E0C' }}
              value={facilityType}
              onChange={(e) => setFacilityType(e.target.value as FacilityType)}
              disabled={loading}
            >
              {(Object.entries(FACILITY_LABELS) as [FacilityType, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: '#6B6860' }}>
              Operating mode
            </label>
            <ModeToggle value={mode} onChange={setMode} />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mb-8">
            <LoadingBar
              message="Varo AI Analyst is processing your alert..."
              subMessage="Analysing OT protocol behaviour and calculating consequences..."
            />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div
            className="mb-6 px-4 py-3 rounded-lg border text-sm"
            style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626' }}
          >
            <span className="font-semibold">Analysis failed — </span>
            {error}
          </div>
        )}

        {/* CTA */}
        {!loading && (
          <button
            onClick={handleAnalyse}
            disabled={!alertText.trim()}
            className="w-full py-3.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1A3FA8' }}
          >
            Analyse Alert →
          </button>
        )}
      </main>
    </div>
  )
}
