import type { AnalysisOutput } from '@/lib/types';

const STAGES = [
  { n: 1, short: 'Recon' }, { n: 2, short: 'Weapon' }, { n: 3, short: 'Deliver' },
  { n: 4, short: 'Exploit' }, { n: 5, short: 'Install' }, { n: 6, short: 'C2' }, { n: 7, short: 'Actions' },
];

export default function KillChainSection({ killChain, delay = 0 }: { killChain: AnalysisOutput['killChainPosition']; delay?: number }) {
  return (
    <section className="bg-surface rounded-xl border border-border p-5 section-reveal" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="text-xs font-mono text-ink-subtle uppercase tracking-widest mb-4">03 &middot; ICS Cyber Kill Chain Position</h3>
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1 -mx-1 px-1">
        {STAGES.map((stage, i) => {
          const isActive = stage.n === killChain.stageNumber;
          const isPast = stage.n < killChain.stageNumber;
          return (
            <div key={stage.n} className="flex items-center shrink-0">
              <div className={`flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-lg text-center ${
                isActive ? 'bg-accent text-white' : isPast ? 'text-ink-subtle' : 'text-border'
              }`}>
                <span className="font-mono text-[10px] leading-none">{stage.n}</span>
                <span className="text-[11px] font-medium leading-tight whitespace-nowrap">{stage.short}</span>
              </div>
              {i < STAGES.length - 1 && <div className={`w-3 h-px mx-0.5 shrink-0 ${stage.n < killChain.stageNumber ? 'bg-ink-subtle' : 'bg-border'}`} />}
            </div>
          );
        })}
      </div>
      <div className="space-y-4">
        <Field label="Current Stage" value={killChain.stageLabel} />
        <Field label="Evidence" value={killChain.evidence} />
        <div>
          <span className="text-xs font-mono text-ink-subtle uppercase tracking-wide">Next Likely Stage</span>
          <p className="text-sm text-severity-high mt-1 leading-relaxed">{killChain.nextLikelyStage}</p>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-mono text-ink-subtle uppercase tracking-wide">{label}</span>
      <p className="text-sm text-ink mt-1 leading-relaxed">{value}</p>
    </div>
  );
}
