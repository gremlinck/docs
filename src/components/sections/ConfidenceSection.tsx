import type { AnalysisOutput } from '@/lib/types';

const STYLE = {
  high: { bar: 'bg-severity-low', text: 'text-severity-low', badge: 'bg-severity-low/10 text-severity-low border-severity-low/25' },
  medium: { bar: 'bg-severity-medium', text: 'text-severity-medium', badge: 'bg-severity-medium/10 text-severity-medium border-severity-medium/25' },
  low: { bar: 'bg-severity-high', text: 'text-severity-high', badge: 'bg-severity-high/10 text-severity-high border-severity-high/25' },
};

export default function ConfidenceSection({ confidence, delay = 0 }: { confidence: AnalysisOutput['confidence']; delay?: number }) {
  const s = STYLE[confidence.level];
  return (
    <section className="bg-surface rounded-xl border border-border p-5 section-reveal" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-xs font-mono text-ink-subtle uppercase tracking-widest">06 &middot; Confidence &amp; Uncertainty</h3>
        <span className={`shrink-0 text-xs font-mono px-2.5 py-1 rounded-full border uppercase tracking-wide ${s.badge}`}>{confidence.level} confidence</span>
      </div>
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-ink-subtle">Confidence score</span>
          <span className={`text-sm font-mono font-medium ${s.text}`}>{confidence.score}/100</span>
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 delay-300 ${s.bar}`} style={{ width: `${confidence.score}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Col label="Certainties" items={confidence.certainties} cls="text-severity-low" marker="checkmark" />
        <Col label="Assumptions" items={confidence.assumptions} cls="text-severity-medium" marker="~" />
        <Col label="Data Gaps" items={confidence.dataGaps} cls="text-severity-high" marker="?" />
      </div>
    </section>
  );
}

function Col({ label, items, cls, marker }: { label: string; items: string[]; cls: string; marker: string }) {
  return (
    <div>
      <div className={`text-xs font-mono uppercase tracking-wide mb-2 ${cls}`}>{label}</div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`shrink-0 font-mono text-xs mt-0.5 ${cls}`}>{marker === 'checkmark' ? '✓' : marker}</span>
            <span className="text-xs text-ink-muted leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
