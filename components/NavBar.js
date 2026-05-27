import Link from 'next/link';

export default function NavBar({ mode = 'COPILOT' }) {
  return (
    <nav
      className="flex items-center justify-between px-8 shrink-0"
      style={{ background: '#0D1F3C', height: '56px' }}
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
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
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/incidents"
          className="text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          Incidents
        </Link>
        <Link
          href="/profile"
          className="text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          Facility Profile
        </Link>
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
      </div>
    </nav>
  );
}
