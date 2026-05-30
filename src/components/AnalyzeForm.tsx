'use client';

import { useState } from 'react';

interface Props {
  onSubmit: (scenario: string) => void;
}

const DEMO_SCENARIO =
  'At 14:23 UTC, our IDS flagged multiple Modbus TCP write coil commands (Function Code 5) ' +
  'targeting RTU-07 at our Mississippi River pump station. The source IP -- 10.87.4.219 -- ' +
  'belongs to an engineering workstation that has not been active on the network for 14 days ' +
  'and should only be present during scheduled maintenance windows. No maintenance work order ' +
  'exists for today. The RTU controls intake valve position for the primary water treatment feed. ' +
  'Normal operation is fully automated via SCADA; manual FC5 commands are unusual outside of ' +
  'commissioning. The workstation user account last authenticated at 03:41 UTC this morning. ' +
  'SCADA historian shows a 2-second gap in RTU-07 telemetry at 14:22 UTC, one minute before ' +
  'the alert. Operator at the plant reports no awareness of any activity at the station today.';

const MAX_CHARS = 5000;

export default function AnalyzeForm({ onSubmit }: Props) {
  const [scenario, setScenario] = useState('');
  const canSubmit = scenario.trim().length >= 10;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(scenario.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={scenario}
          onChange={(e) => setScenario(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Describe what you observed -- an alert, an anomaly, an asset inventory concern, or 'we just saw X, what do we do.'"
          rows={9}
          className="w-full px-4 py-4 rounded-xl bg-surface border border-border text-ink placeholder-ink-subtle text-sm leading-relaxed resize-y min-h-[160px] focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-colors"
        />
        <div className="absolute bottom-3 right-3 text-xs text-ink-subtle font-mono tabular-nums">
          {scenario.length}/{MAX_CHARS}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button type="submit" disabled={!canSubmit}
          className="sm:w-auto px-6 py-3 bg-ink text-bg font-medium text-sm rounded-lg hover:bg-ink/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          Analyze &rarr;
        </button>
        <button type="button" onClick={() => setScenario(DEMO_SCENARIO)}
          className="px-4 py-3 bg-surface border border-border text-ink-muted hover:text-ink font-medium text-sm rounded-lg transition-colors">
          Load demo scenario
        </button>
      </div>
      <p className="text-xs text-ink-subtle">Analysis typically completes in 30&ndash;90 seconds. All results are advisory -- no actions execute automatically.</p>
    </form>
  );
}
