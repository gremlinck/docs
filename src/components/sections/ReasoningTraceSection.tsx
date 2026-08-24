export default function ReasoningTraceSection({ trace, delay = 0 }: { trace: string[]; delay?: number }) {
  return (
    <section className="bg-surface rounded-xl border border-border p-5 section-reveal" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="text-xs font-mono text-ink-subtle uppercase tracking-widest mb-1">05 &middot; Reasoning Trace</h3>
      <p className="text-xs text-ink-subtle mb-5">The analytical chain. Read it. Challenge it. Correct it.</p>
      <ol className="space-y-3">
        {trace.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="shrink-0 font-mono text-xs text-ink-subtle w-5 text-right pt-px tabular-nums">{i + 1}.</span>
            <p className="text-sm text-ink-muted leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
