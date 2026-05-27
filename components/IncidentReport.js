import SeverityBadge from './SeverityBadge';
import ResponseStep from './ResponseStep';

const SEVERITY_BORDER = {
  Critical: '#DC2626',
  High:     '#EA580C',
  Medium:   '#D97706',
  Low:      '#16A34A',
};

export default function IncidentReport({ report, mode = 'COPILOT' }) {
  const borderColor = SEVERITY_BORDER[report.severityLabel] || '#6B6860';

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
