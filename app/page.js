import Link from 'next/link';
import NavBar from '@/components/NavBar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF8F4' }}>
      <NavBar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-xl">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#6B6860', letterSpacing: '0.12em' }}
          >
            Cyber-Physical Consequence Intelligence
          </span>
          <h1
            className="font-extrabold mt-3 mb-4 leading-tight"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '48px',
              color: '#0F0E0C',
              letterSpacing: '-1.5px',
            }}
          >
            What does this alert<br />mean for your plant?
          </h1>
          <p className="text-base mb-10 leading-relaxed" style={{ color: '#6B6860' }}>
            Paste any OT security alert. Get a plain-language consequence report
            with response steps in under 90&nbsp;seconds.
          </p>
          <Link
            href="/incidents/new"
            className="inline-block px-8 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: '#1A3FA8' }}
          >
            Analyse an Alert →
          </Link>
        </div>
      </main>
    </div>
  );
}
