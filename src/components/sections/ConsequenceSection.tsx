import type { AnalysisOutput } from '@/lib/types';

export default function ConsequenceSection({ consequence, delay = 0 }: { consequence: AnalysisOutput['consequenceAnalysis']; delay?: number }) {
  return (
    <section className="bg-surface rounded-xl border border-border p-5 section-reveal" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="text-xs font-mono text-ink-subtle uppercase tracking-widest mb-4">01 &middot; Consequence Analysis</h3>
      <p className="text-ink leading-relaxed mb-5">{consequence.summary}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[{ label: 'Safety Impact', value: consequence.safetyImpact, cls: 'text-severity-critical' },
          { label: 'Availability Impact', value: consequence.availabilityImpact, cls: 'text-severity-high' },
          { label: 'Productivity Impact', value: consequence.productivityImpact, cls: 'text-severity-medium' }].map(({ label, value, cls }) => (
          <div key={label} className="bg-surface-raised rounded-lg p-4">
            <div className={`text-xs font-mono uppercase tracking-wide mb-2 ${cls}`}>{label}</div>
            <p className="text-sm text-ink leading-snug">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
