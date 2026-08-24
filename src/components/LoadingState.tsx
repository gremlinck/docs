'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  { label: 'Assessing context...', detail: 'Parsing scenario against known OT incident archetypes' },
  { label: 'Mapping to kill chain...', detail: 'Positioning in the ICS Cyber Kill Chain (SANS/Dragos framework)' },
  { label: 'Evaluating physical impact...', detail: 'Reasoning from protocol behaviour to process consequence' },
  { label: 'Generating recommendations...', detail: 'Prioritising actions with safety constraints applied' },
  { label: 'Validating output...', detail: 'Checking confidence levels, assumptions, and data gaps' },
];

export default function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1)), 14000);
    const progressTimer = setInterval(() => {
      setProgress((p) => p >= 92 ? p + 0.02 : p + (92 - p) * 0.016);
    }, 250);
    return () => { clearInterval(stepTimer); clearInterval(progressTimer); };
  }, []);

  return (
    <div className="py-16 animate-fade-up">
      <div className="h-px bg-border rounded-full mb-12 overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot shrink-0" />
          <span className="font-medium text-ink text-sm">{STEPS[stepIndex].label}</span>
        </div>
        <p className="text-sm text-ink-muted pl-[18px]">{STEPS[stepIndex].detail}</p>
      </div>
      <div className="space-y-2 pl-px">
        {STEPS.slice(0, stepIndex).map((step) => (
          <div key={step.label} className="flex items-center gap-3 opacity-40">
            <svg className="w-3.5 h-3.5 text-severity-low shrink-0" viewBox="0 0 14 14" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm text-ink-muted">{step.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-10 text-xs text-ink-subtle">Complex scenarios take up to 90 seconds. Varo is reasoning through every layer of the Purdue model.</p>
    </div>
  );
}
