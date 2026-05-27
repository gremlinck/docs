const SEVERITY_STYLES = {
  Critical: { bg: '#FEF2F2', border: '#DC2626', text: '#DC2626' },
  High:     { bg: '#FFF7ED', border: '#EA580C', text: '#EA580C' },
  Medium:   { bg: '#FFFBEB', border: '#D97706', text: '#D97706' },
  Low:      { bg: '#F0FDF4', border: '#16A34A', text: '#16A34A' },
};

function labelFromScore(score) {
  if (score >= 9) return 'Critical';
  if (score >= 7) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
}

export default function SeverityBadge({ label, score }) {
  const resolved = label || labelFromScore(score);
  const s = SEVERITY_STYLES[resolved] || SEVERITY_STYLES.Medium;

  return (
    <span
      className="inline-block text-xs font-bold"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
        borderRadius: '20px',
        padding: '4px 12px',
        letterSpacing: '0.04em',
      }}
    >
      {resolved.toUpperCase()} {score}/10
    </span>
  );
}
