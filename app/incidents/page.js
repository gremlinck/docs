'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SeverityBadge from '@/components/SeverityBadge';
import { getIndex, clearAll } from '@/lib/storage/incidents';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    setIncidents(getIndex());
  }, []);

  const handleClear = () => {
    if (confirm('Clear all saved incidents? This cannot be undone.')) {
      clearAll();
      setIncidents([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF8F4' }}>
      <NavBar />

      <div className="flex-1 px-4 py-10 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="font-bold"
                style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', color: '#0F0E0C', letterSpacing: '-0.5px' }}
              >
                Incident History
              </h1>
              <p className="text-sm mt-0.5" style={{ color: '#6B6860' }}>
                {incidents.length} incident{incidents.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <div className="flex gap-3">
              {incidents.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-xs font-semibold px-3 py-1.5 rounded transition-opacity hover:opacity-70"
                  style={{ color: '#DC2626', border: '1.5px solid #DC2626' }}
                >
                  Clear All
                </button>
              )}
              <Link
                href="/incidents/new"
                className="text-xs font-semibold px-4 py-1.5 rounded text-white transition-opacity hover:opacity-80"
                style={{ background: '#1A3FA8' }}
              >
                + New Alert
              </Link>
            </div>
          </div>

          {incidents.length === 0 ? (
            <div
              className="rounded-lg p-12 text-center"
              style={{ border: '1.5px dashed #E4E0D8' }}
            >
              <p className="text-sm" style={{ color: '#6B6860' }}>
                No incidents yet. Analyse an alert to get started.
              </p>
              <Link
                href="/incidents/new"
                className="inline-block mt-4 text-sm font-semibold"
                style={{ color: '#1A3FA8' }}
              >
                Analyse Alert →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.map((inc) => (
                <IncidentRow key={inc.id} incident={inc} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IncidentRow({ incident }) {
  const savedAt = new Date(incident.savedAt);
  const timeStr = savedAt.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <Link
      href={`/incidents/${incident.id}`}
      className="block rounded-lg bg-white transition-shadow hover:shadow-md"
      style={{ border: '1.5px solid #E4E0D8', textDecoration: 'none' }}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs" style={{ color: '#1A3FA8' }}>
              {incident.id}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-widest"
              style={{
                background: incident.mode === 'AUTOPILOT' ? '#1A3FA8' : '#065F46',
                color: 'white',
                fontSize: '10px',
              }}
            >
              {incident.mode}
            </span>
          </div>
          <p
            className="text-sm font-semibold leading-snug truncate"
            style={{ color: '#0F0E0C' }}
          >
            {incident.alertSummary}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs" style={{ color: '#6B6860' }}>
              {incident.mitreId}
            </span>
            <span className="text-xs" style={{ color: '#6B6860' }}>
              · {timeStr}
            </span>
          </div>
        </div>
        <div className="shrink-0">
          <SeverityBadge label={incident.severityLabel} score={incident.severityScore} />
        </div>
      </div>
    </Link>
  );
}
