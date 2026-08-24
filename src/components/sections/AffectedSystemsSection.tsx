import type { AffectedSystem } from '@/lib/types';

const LEVEL_BADGE: Record<number, string> = {
  0: 'bg-severity-critical/10 text-severity-critical',
  1: 'bg-severity-high/10 text-severity-high',
  2: 'bg-severity-medium/10 text-severity-medium',
  3: 'bg-blue-50 text-blue-700',
  4: 'bg-surface-raised text-ink-muted',
  5: 'bg-surface-raised text-ink-muted',
};

export default function AffectedSystemsSection({ systems, delay = 0 }: { systems: AffectedSystem[]; delay?: number }) {
  return (
    <section className="bg-surface rounded-xl border border-border p-5 section-reveal" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="text-xs font-mono text-ink-subtle uppercase tracking-widest mb-4">02 &middot; Affected Systems</h3>
      <div className="divide-y divide-border">
        {systems.map((sys, i) => (
          <div key={i} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
            <span className={`shrink-0 text-xs font-mono px-2 py-1 rounded-md mt-0.5 ${LEVEL_BADGE[sys.purdueLevel] ?? 'bg-surface-raised text-ink-muted'}`}>L{sys.purdueLevel}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-ink">{sys.name}</div>
              <div className="text-xs text-ink-muted mt-0.5">{sys.purdueLevelLabel}</div>
              <div className="text-xs text-ink-subtle mt-0.5">{sys.role}</div>
            </div>
            <span className="shrink-0 text-xs text-ink-subtle font-mono bg-surface-raised px-2 py-1 rounded hidden sm:block">{sys.zone}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
