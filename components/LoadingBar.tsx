interface LoadingBarProps {
  message?: string
  subMessage?: string
}

export default function LoadingBar({
  message = 'Varo AI Analyst is processing your alert...',
  subMessage,
}: LoadingBarProps) {
  return (
    <div className="w-full space-y-3">
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: '#E4E0D8' }}
      >
        <div
          className="h-full rounded-full animate-progress"
          style={{ backgroundColor: '#1A3FA8' }}
        />
      </div>
      <p className="text-sm font-medium" style={{ color: '#0F0E0C' }}>
        {message}
      </p>
      {subMessage && (
        <p className="text-xs" style={{ color: '#6B6860' }}>
          {subMessage}
        </p>
      )}
    </div>
  )
}
