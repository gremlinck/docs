export default function ComplianceDocument({ result }) {
  const { complianceReport, templateName, reportingAuthority, deadline } = result;

  return (
    <div className="mt-4">
      {/* Header banner */}
      <div
        className="flex items-center justify-between px-4 py-2 rounded-t-lg"
        style={{ background: '#065F46', color: 'white' }}
      >
        <span className="text-xs font-bold uppercase tracking-widest">
          ✓ {templateName}
        </span>
        <span className="text-xs opacity-80">
          Report to: {reportingAuthority} · Deadline: {deadline}
        </span>
      </div>

      {/* Document body */}
      <div
        className="rounded-b-lg overflow-auto"
        style={{ border: '1.5px solid #065F46', borderTop: 'none', background: '#F0FFF4', maxHeight: '420px' }}
      >
        <div className="p-4 space-y-4">
          {Object.entries(complianceReport).map(([key, value]) => (
            <Section key={key} fieldKey={key} value={value} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ fieldKey, value }) {
  const label = fieldKey
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (value === null || value === undefined || value === '') return null;

  if (Array.isArray(value)) {
    return (
      <div>
        <SectionLabel>{label}</SectionLabel>
        <ul className="mt-1 space-y-1">
          {value.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs" style={{ color: '#0F0E0C' }}>
              <span style={{ color: '#065F46', flexShrink: 0 }}>•</span>
              <span className="leading-relaxed">
                {typeof item === 'object' ? JSON.stringify(item) : String(item)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div>
        <SectionLabel>{label}</SectionLabel>
        <div className="mt-1 space-y-1">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex gap-2 text-xs" style={{ color: '#0F0E0C' }}>
              <span className="font-semibold shrink-0 capitalize" style={{ color: '#065F46', minWidth: '120px' }}>
                {k.replace(/_/g, ' ')}:
              </span>
              <span className="leading-relaxed">{String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: '#0F0E0C' }}>
        {String(value)}
      </p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      className="text-xs font-bold uppercase tracking-widest pb-1"
      style={{ color: '#065F46', borderBottom: '1px solid #A7F3D0', letterSpacing: '0.08em' }}
    >
      {children}
    </div>
  );
}
