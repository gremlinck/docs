'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import IncidentReport from '@/components/IncidentReport';
import CopilotPanel from '@/components/CopilotPanel';

export default function NewIncidentPage() {
  const [view, setView] = useState('input');
  const [alertText, setAlertText] = useState('');
  const [facilityType, setFacilityType] = useState('energy');
  const [mode, setMode] = useState('COPILOT');
  const [report, setReport] = useState(null);
  const [effectiveMode, setEffectiveMode] = useState('COPILOT');
  const [error, setError] = useState(null);
  const [facilityProfile, setFacilityProfile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('varoai_profile');
    if (stored) {
      const p = JSON.parse(stored);
      setFacilityProfile(p);
      if (p.facilityType) setFacilityType(p.facilityType);
    }
  }, []);

  const analyse = async () => {
    if (!alertText.trim()) return;
    setError(null);
    setView('loading');

    try {
      const res = await fetch('/api/varo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertText, mode, facilityType, facilityProfile }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.message);
        setView('input');
        return;
      }

      setReport(data.report);
      setEffectiveMode(data.mode);
      setView('report');
    } catch {
      setError('Unable to reach the Varo AI Analyst. Please check your connection and try again.');
      setView('input');
    }
  };

  const reset = () => {
    setView('input');
    setReport(null);
    setError(null);
    setEffectiveMode('COPILOT');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF8F4' }}>
      <NavBar mode={effectiveMode} />

      {/* ── Input ─────────────────────────────────────────────────── */}
      {view === 'input' && (
        <div className="flex-1 flex items-start justify-center pt-14 px-4 pb-12">
          <div className="w-full max-w-2xl">
            <h1
              className="font-bold mb-1"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: '30px', color: '#0F0E0C', letterSpacing: '-0.5px' }}
            >
              Analyse OT Alert
            </h1>
            <p className="text-sm mb-7" style={{ color: '#6B6860' }}>
              Paste any OT security alert. Get a consequence report in under 90 seconds.
            </p>

            {error && (
              <div
                className="mb-4 p-3 rounded-lg text-sm"
                style={{ background: '#FEF2F2', border: '1.5px solid #DC2626', color: '#DC2626' }}
              >
                {error}
              </div>
            )}

            <textarea
              value={alertText}
              onChange={(e) => setAlertText(e.target.value)}
              placeholder="Modbus Function Code 06 detected on PLC-07 from source IP 192.168.10.44..."
              className="w-full rounded-lg p-4 text-sm outline-none resize-none"
              style={{
                minHeight: '200px',
                border: '1.5px solid #E4E0D8',
                background: 'white',
                color: '#0F0E0C',
                lineHeight: '1.65',
              }}
            />

            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: '#6B6860' }}
                >
                  Facility Type
                </label>
                <select
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                  className="w-full rounded px-3 py-2 text-sm outline-none"
                  style={{ border: '1.5px solid #E4E0D8', background: 'white', color: '#0F0E0C' }}
                >
                  <option value="energy">Energy</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="water">Water</option>
                  <option value="oil_gas">Oil & Gas</option>
                </select>
              </div>
              <div className="flex-1">
                <label
                  className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: '#6B6860' }}
                >
                  Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full rounded px-3 py-2 text-sm outline-none"
                  style={{ border: '1.5px solid #E4E0D8', background: 'white', color: '#0F0E0C' }}
                >
                  <option value="COPILOT">COPILOT</option>
                  <option value="AUTOPILOT">AUTOPILOT</option>
                </select>
              </div>
            </div>

            <button
              onClick={analyse}
              disabled={!alertText.trim()}
              className="mt-6 w-full py-3 rounded-lg text-white font-semibold text-sm transition-opacity disabled:opacity-40"
              style={{ background: '#1A3FA8' }}
            >
              Analyse Alert →
            </button>
          </div>
        </div>
      )}

      {/* ── Loading ────────────────────────────────────────────────── */}
      {view === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <div
              className="h-1 w-full rounded-full overflow-hidden mb-7"
              style={{ background: '#E4E0D8' }}
            >
              <div
                className="h-full rounded-full progress-bar"
                style={{ background: '#1A3FA8' }}
              />
            </div>
            <p
              className="font-bold text-lg"
              style={{ fontFamily: 'Syne, sans-serif', color: '#0F0E0C' }}
            >
              Varo AI Analyst is processing your alert...
            </p>
            <p className="text-sm mt-2" style={{ color: '#6B6860' }}>
              Analysing protocol behaviour and mapping operational consequences
            </p>
          </div>
        </div>
      )}

      {/* ── Report ─────────────────────────────────────────────────── */}
      {view === 'report' && report && (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
          <div
            className="flex items-center px-8 shrink-0"
            style={{ height: '49px', borderBottom: '1.5px solid #E4E0D8', background: '#FAF8F4' }}
          >
            <button
              onClick={reset}
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: '#1A3FA8' }}
            >
              ← New Alert
            </button>
          </div>

          <div
            className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
            style={{ minHeight: 0 }}
          >
            {/* Left: incident report */}
            <div
              className="overflow-y-auto p-6 lg:p-8"
              style={{ borderRight: '1.5px solid #E4E0D8' }}
            >
              <IncidentReport report={report} mode={effectiveMode} facilityProfile={facilityProfile} />
            </div>

            {/* Right: engineer copilot */}
            <div className="p-6 lg:p-8 flex flex-col overflow-hidden">
              <CopilotPanel report={report} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
