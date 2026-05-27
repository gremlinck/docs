'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import IncidentReport from '@/components/IncidentReport';
import CopilotPanel from '@/components/CopilotPanel';
import { getIncident } from '@/lib/storage/incidents';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const stored = getIncident(id);
    if (stored) {
      setEntry(stored);
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#FAF8F4' }}>
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <p className="text-sm mb-4" style={{ color: '#6B6860' }}>
            Incident not found.
          </p>
          <Link href="/incidents" className="text-sm font-semibold" style={{ color: '#1A3FA8' }}>
            ← Back to Incidents
          </Link>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#FAF8F4' }}>
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm" style={{ color: '#6B6860' }}>Loading…</p>
        </div>
      </div>
    );
  }

  const { report, mode } = entry;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF8F4' }}>
      <NavBar mode={mode} />

      <div
        className="flex items-center px-8 shrink-0"
        style={{ height: '49px', borderBottom: '1.5px solid #E4E0D8', background: '#FAF8F4' }}
      >
        <Link
          href="/incidents"
          className="text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: '#1A3FA8' }}
        >
          ← All Incidents
        </Link>
      </div>

      <div
        className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
        style={{ height: 'calc(100vh - 105px)', minHeight: 0 }}
      >
        <div
          className="overflow-y-auto p-6 lg:p-8"
          style={{ borderRight: '1.5px solid #E4E0D8' }}
        >
          <IncidentReport report={report} mode={mode} />
        </div>
        <div className="p-6 lg:p-8 flex flex-col overflow-hidden">
          <CopilotPanel report={report} />
        </div>
      </div>
    </div>
  );
}
