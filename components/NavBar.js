export default function NavBar({ mode = 'COPILOT' }) {
  return (
    <nav
      className="flex items-center justify-between px-8 shrink-0"
      style={{ background: '#0D1F3C', height: '56px' }}
    >
      <span
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          color: 'white',
          letterSpacing: '2px',
          fontSize: '17px',
        }}
      >
        VARO AI
      </span>
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          background: mode === 'AUTOPILOT' ? '#1A3FA8' : '#065F46',
          color: 'white',
          letterSpacing: '0.05em',
        }}
      >
        {mode} ●
      </span>
    </nav>
  );
}
