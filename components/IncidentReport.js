'use client';

import { useState } from 'react';
import SeverityBadge from './SeverityBadge';
import ResponseStep from './ResponseStep';

const SEVERITY_BORDER = {
  Critical: '#DC2626',
  High:     '#EA580C',
  Medium:   '#D97706',
  Low:      '#16A34A',
};

const REGULATIONS = [
  { value: 'CIRCIA', label: 'CIRCIA 72-hr Report' },
  { value: 'NERC_CIP', label: 'NERC CIP-008 Report' },
  { value: 'TSA_PIPELINE', label: 'TSA Pipeline Report' },
];

export default function IncidentReport({ report, mode = 'COPILOT', facilityProfile }) {
  const borderColor = SEVERITY_BORDER[report.severityLabel] || '#6B6860';
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [complianceResult, setComplianceResult] = useState(null);
  const [selectedReg, setSelectedReg] = useState('CIRCIA');

  const generateCompliance = async () => {
    setComplianceLoading(true);
    setComplianceResult(null);
    try {
      const res = await fetch('/api/varo/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentReport: report, regulation: selectedReg, facilityProfile }),
      });
      const data = await res.json();
      setComplianceResult(data);
    } catch {
      setComplianceResult({ error: true, message: 'Failed to generate compliance report.' });
    } finally {
      setComplianceLoading(false);
    }
  };

  return (
    <div
      className="bg-white rounded-lg animate-fadeUp"
      style={{
        border: '1.5px solid #E4E0D8',
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <span className="font-mono text-xs" style={{ color: '#1A3FA8' }}>
            {report.incidentId}
          </span>
          <h2
            className="text-xl font-bold mt-1 leading-snug"
            style={{ fontFamily: 'Syne, sans-serif', color: '#0F0E0C' }}
          >
            {report.alertSummary}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
          <SeverityBadge label={report.severityLabel} score={report.severityScore} />
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#6B6860' }}
          >
            {report.confidenceLevel} confidence
          </span>
        </div>
      </div>

      {/* Operational Impact — prominent */}
      <div className="mx-6 mb-5 p-4 rounded-lg" style={{ background: '#FAFAF8', border: '1.5px solid #E4E0D8' }}>
        <Label>Operational Impact</Label>
        <p className="text-base leading-relaxed mt-1" style={{ color: '#0F0E0C' }}>
          {report.operationalImpact}
        </p>
      </div>

      {/* Two-column fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-6 mb-5">
        <Field label="Protocol Context">{report.protocolContext}</Field>
        <Field label="Attack Scenario">{report.attackScenario}</Field>
        <Field label="Financial Exposure">{report.financialExposure}</Field>
        <Field label="Escalation">{report.escalationRecommendation}</Field>

        <Field label="MITRE Technique">
          <span className="font-mono text-sm" style={{ color: '#1A3FA8' }}>
            {report.mitreId} — {report.mitreTechnique}
          </span>
        </Field>

        <Field label="Affected Assets">
          <div className="flex flex-wrap gap-1 mt-0.5">
            {(report.affectedAssets || []).map((asset, i) => (
              <span
                key={i}
                className="font-mono text-xs px-2 py-0.5 rounded"
                style={{ background: '#EFF6FF', color: '#1A3FA8', border: '1px solid #BFDBFE' }}
              >
                {asset}
              </span>
            ))}
          </div>
        </Field>
      </div>

      {/* Response Steps */}
      <div className="px-6 mb-5">
        <Label>Response Steps — {mode}</Label>
        <div className="mt-2">
          {(report.responseSteps || []).map((step, i) => (
            <ResponseStep key={i} step={step} index={i} />
          ))}
        </div>
      </div>

      {/* Compliance Report Generator */}
      <div className="mx-6 mb-5 p-4 rounded-lg" style={{ background: '#FAFAF8', border: '1.5px solid #E4E0D8' }}>
        <Label>Generate Compliance Report</Label>
        <p className="text-xs mt-1 mb-3" style={{ color: '#6B6860' }}>
          Draft a regulatory incident report — CIRCIA, NERC CIP-008, or TSA Pipeline.
        </p>
        <div className="flex gap-2 flex-wrap">
          {REGULATIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setSelectedReg(r.value)}
              className="px-3 py-1.5 rounded text-xs font-semibold transition-all"
              style={
                selectedReg === r.value
                  ? { background: '#1A3FA8', color: 'white' }
                  : { border: '1.5px solid #E4E0D8', color: '#6B6860', background: 'white' }
              }
            >
              {r.label}
            </button>
          ))}
          <button
            onClick={generateCompliance}
            disabled={complianceLoading}
            className="px-4 py-1.5 rounded text-xs font-semibold text-white transition-opacity disabled:opacity-40"
            style={{ background: '#065F46' }}
          >
            {complianceLoading ? 'Generating...' : 'Generate Draft →'}
          </button>
        </div>

        {complianceResult && !complianceResult.error && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: '#065F46' }}>
                ✓ {complianceResult.templateName} — draft ready
              </span>
              <span className="text-xs" style={{ color: '#6B6860' }}>
                Report to: {complianceResult.reportingAuthority} · Deadline: {complianceResult.deadline}
              </span>
            </div>
            <pre
              className="text-xs rounded p-3 overflow-auto font-mono"
              style={{ background: '#F0FFF4', border: '1.5px solid #065F46', color: '#0F0E0C', maxHeight: '300px' }}
            >
              {JSON.stringify(complianceResult.complianceReport, null, 2)}
            </pre>
          </div>
        )}

        {complianceResult?.error && (
          <p className="mt-3 text-xs" style={{ color: '#DC2626' }}>{complianceResult.message}</p>
        )}
      </div>

      {/* Confidence reason */}
      <div
        className="px-6 py-4 rounded-b-lg text-xs leading-relaxed"
        style={{ borderTop: '1.5px solid #E4E0D8', color: '#6B6860' }}
      >
        {report.confidenceReason}
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div
      className="text-xs font-semibold uppercase tracking-widest mb-1"
      style={{ color: '#6B6860', letterSpacing: '0.1em' }}
    >
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="text-sm leading-relaxed" style={{ color: '#0F0E0C' }}>
        {children}
      </div>
    </div>
  );
}
