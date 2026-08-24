import type { RecommendedAction } from '@/lib/types';

export default function RecommendedActionsSection({ actions, delay = 0 }: { actions: RecommendedAction[]; delay?: number }) {
  return (
    <section className="bg-surface rounded-xl border border-border p-5 section-reveal" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="text-xs font-mono text-ink-subtle uppercase tracking-widest mb-4">04 &middot; Recommended Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <div key={action.priority} className="border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="shrink-0 font-mono text-xs text-ink-subtle bg-surface-raised px-2 py-1 rounded mt-0.5 tabular-nums">
                {String(action.priority).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-sm font-medium text-ink leading-snug">{action.action}</p>
                <p className="text-xs text-ink-muted leading-relaxed">{action.rationale}</p>
                {action.safetyNote && (
                  <div className="flex items-start gap-2 bg-severity-high/[0.05] border border-severity-high/20 rounded-lg px-3 py-2">
                    <svg className="w-3.5 h-3.5 text-severity-high shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-severity-high leading-relaxed">
                      <span className="font-mono font-medium">[SAFETY CHECK REQUIRED]</span>{' '}{action.safetyNote}
                    </p>
                  </div>
                )}
                {action.requiresHumanApproval && (
                  <span className="inline-block text-xs font-mono text-accent bg-accent/[0.07] border border-accent/20 px-2 py-0.5 rounded">
                    Requires human approval before execution
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
