interface SeverityBadgeProps {
  score: number
  label: string
  size?: 'sm' | 'md' | 'lg'
}

function getSeverityColors(score: number) {
  if (score >= 9) return { bg: '#FEF2F2', border: '#DC2626', text: '#DC2626' }
  if (score >= 7) return { bg: '#FFF7ED', border: '#EA580C', text: '#EA580C' }
  if (score >= 5) return { bg: '#FFFBEB', border: '#D97706', text: '#D97706' }
  return { bg: '#F0FDF4', border: '#16A34A', text: '#16A34A' }
}

export default function SeverityBadge({ score, label, size = 'md' }: SeverityBadgeProps) {
  const colors = getSeverityColors(score)
  const sizeClass = size === 'lg' ? 'text-sm px-4 py-1.5' : size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'

  return (
    <span
      className={`inline-flex items-center rounded-full border font-bold ${sizeClass}`}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
      }}
    >
      {label.toUpperCase()} {score}/10
    </span>
  )
}
