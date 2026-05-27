'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import {
  DEFAULT_PROFILE,
  SECTOR_OPTIONS,
  MONITORING_TOOL_OPTIONS,
  REGULATION_OPTIONS,
} from '@/lib/profile/schema.js';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('varoai_profile');
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const toggle = (key, value) => {
    setProfile((p) => {
      const arr = p[key] || [];
      return {
        ...p,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const save = () => {
    const updated = { ...profile, configured: true };
    localStorage.setItem('varoai_profile', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => router.push('/incidents/new'), 800);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF8F4' }}>
      <NavBar />
      <div className="flex-1 flex items-start justify-center pt-12 px-4 pb-12">
        <div className="w-full max-w-lg">
          <h1
            className="font-bold mb-1"
            style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', color: '#0F0E0C', letterSpacing: '-0.5px' }}
          >
            Facility Profile
          </h1>
          <p className="text-sm mb-8" style={{ color: '#6B6860' }}>
            Declare your environment once. Every AI analysis will be tailored to your specific facility and regulations.
          </p>

          <div className="space-y-6">
            <Field label="Site Name (optional)">
              <input
                type="text"
                value={profile.siteName}
                onChange={(e) => setProfile((p) => ({ ...p, siteName: e.target.value }))}
                placeholder="e.g. Plant 3 — Richmond VA"
                className="w-full rounded px-3 py-2 text-sm outline-none"
                style={{ border: '1.5px solid #E4E0D8', background: 'white', color: '#0F0E0C' }}
              />
            </Field>

            <Field label="Sector">
              <select
                value={profile.sector}
                onChange={(e) => setProfile((p) => ({ ...p, sector: e.target.value }))}
                className="w-full rounded px-3 py-2 text-sm outline-none"
                style={{ border: '1.5px solid #E4E0D8', background: 'white', color: '#0F0E0C' }}
              >
                {SECTOR_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Primary OT Monitoring Tool">
              <select
                value={profile.monitoringTool}
                onChange={(e) => setProfile((p) => ({ ...p, monitoringTool: e.target.value }))}
                className="w-full rounded px-3 py-2 text-sm outline-none"
                style={{ border: '1.5px solid #E4E0D8', background: 'white', color: '#0F0E0C' }}
              >
                {MONITORING_TOOL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            <Field label="PLC / DCS Types in Use">
              <input
                type="text"
                value={profile.plcTypes}
                onChange={(e) => setProfile((p) => ({ ...p, plcTypes: e.target.value }))}
                placeholder="e.g. Siemens S7-1500, Allen Bradley ControlLogix"
                className="w-full rounded px-3 py-2 text-sm outline-none"
                style={{ border: '1.5px solid #E4E0D8', background: 'white', color: '#0F0E0C' }}
              />
            </Field>

            <Field label="Applicable Regulations">
              <div className="space-y-2 mt-1">
                {REGULATION_OPTIONS.map((o) => (
                  <label key={o.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(profile.regulations || []).includes(o.value)}
                      onChange={() => toggle('regulations', o.value)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: '#1A3FA8' }}
                    />
                    <span className="text-sm" style={{ color: '#0F0E0C' }}>{o.label}</span>
                  </label>
                ))}
              </div>
            </Field>
          </div>

          <button
            onClick={save}
            className="mt-8 w-full py-3 rounded-lg text-white font-semibold text-sm transition-all"
            style={{ background: saved ? '#065F46' : '#1A3FA8' }}
          >
            {saved ? '✓ Saved — redirecting...' : 'Save Profile & Start Analysing'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label
        className="block text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: '#6B6860', letterSpacing: '0.1em' }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
