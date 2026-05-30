import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="fixed top-0 inset-x-0 z-50 bg-bg/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-display text-lg tracking-tight text-ink">Varo AI</span>
          <Link href="/analyze" className="text-sm font-medium text-accent hover:opacity-75 transition-opacity">
            Try it now &rarr;
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-14">
        <section className="max-w-3xl mx-auto px-6 pt-24 pb-20">
          <div className="inline-flex items-center gap-2 bg-accent/[0.06] border border-accent/20 text-accent rounded-full px-3 py-1 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            <span className="text-xs font-mono tracking-wider uppercase">Alpha &middot; OT/ICS Consequence Intelligence</span>
          </div>

          <h1 className="font-display text-[clamp(2.6rem,5.5vw,4.25rem)] leading-[1.06] tracking-tight text-ink mb-6">
            <span className="italic">Consultant-grade</span><br />
            OT security analysis.<br />
            <span className="italic">In 90 seconds.</span>
          </h1>

          <p className="text-lg text-ink-muted leading-relaxed max-w-xl mb-10">
            Paste any OT security scenario. Varo returns a structured consequence analysis with
            kill chain mapping, Purdue model impact, and safety-prioritized recommendations &mdash;
            the same outputs a senior OT consultant would produce, available 24/7.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-ink text-bg px-6 py-3 rounded-lg text-sm font-medium hover:bg-ink/90 active:scale-[0.98] transition-all"
            >
              Try it now
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span className="text-sm text-ink-subtle">No account required &middot; Results in &le;90s</span>
          </div>
        </section>

        <div className="border-t border-border" />

        <section className="max-w-3xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <ValueProp number="01" title="Replaces the consultant engagement"
              body="OT security consultants charge $50K&ndash;$500K per engagement. Varo applies the same domain reasoning on demand, at SaaS pricing." />
            <ValueProp number="02" title="Built on the A.G.E.N.T. Loop"
              body="Assess &rarr; Generate &rarr; Evaluate &rarr; Navigate &rarr; Track. A structured reasoning pipeline that mirrors how experienced OT practitioners think through live incidents." />
            <ValueProp number="03" title="Safety-first. Advisory only."
              body="Every output is a consultant&rsquo;s report, not an automation trigger. Varo never recommends actions that execute on live OT systems without explicit human approval." />
          </div>
        </section>

        <div className="border-t border-border" />
        <section className="max-w-3xl mx-auto px-6 py-14">
          <p className="text-xs font-mono text-ink-subtle uppercase tracking-widest mb-4">Example input</p>
          <blockquote className="border-l-2 border-border pl-5 text-sm text-ink-muted leading-relaxed italic max-w-2xl">
            &ldquo;At 14:23 UTC, IDS flagged Modbus write coil commands (FC5) targeting RTU-07 at our pump
            station. Source IP is an engineering workstation unused for 14 days. The RTU controls
            intake valve position for the primary water treatment feed. No maintenance work order
            exists for today...&rdquo;
          </blockquote>
          <Link href="/analyze" className="inline-block mt-5 text-sm text-accent hover:opacity-75 transition-opacity">
            See what Varo returns &rarr;
          </Link>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="font-display text-sm text-ink-muted">Varo AI</span>
          <span className="text-xs text-ink-subtle">&copy; 2026 Varo AI &middot; A.G.E.N.T. Loop&trade; is a trademark of Varo AI</span>
        </div>
      </footer>
    </div>
  );
}

function ValueProp({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div>
      <span className="font-mono text-xs text-ink-subtle mb-3 block">{number}</span>
      <h3 className="font-display text-xl italic text-ink mb-2 leading-snug">{title}</h3>
      <p className="text-sm text-ink-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}
