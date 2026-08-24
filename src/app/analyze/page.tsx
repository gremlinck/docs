'use client';

import { useState } from 'react';
import Link from 'next/link';
import AnalyzeForm from '@/components/AnalyzeForm';
import AnalysisResults from '@/components/AnalysisResults';
import LoadingState from '@/components/LoadingState';
import type { AnalysisOutput } from '@/lib/types';

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function AnalyzePage() {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<AnalysisOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleAnalyze(scenario: string) {
    setStatus('loading');
    setResult(null);
    setErrorMessage('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed. Please try again.');
      setResult(data as AnalysisOutput);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  function handleReset() {
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-base text-ink hover:opacity-75 transition-opacity">Varo AI</Link>
        <span className="text-xs font-mono text-ink-subtle uppercase tracking-wider hidden sm:block">Consequence Intelligence</span>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {status === 'idle' && (
          <div className="animate-fade-up">
            <h1 className="font-display italic text-4xl md:text-5xl text-ink mb-3 leading-tight">What did you see?</h1>
            <p className="text-ink-muted mb-10 leading-relaxed">
              Describe what you observed &mdash; an alert, a network anomaly, an asset inventory concern,
              or a hypothetical scenario. Varo will return a consultant-grade consequence analysis.
            </p>
            <AnalyzeForm onSubmit={handleAnalyze} />
          </div>
        )}
        {status === 'loading' && <LoadingState />}
        {status === 'error' && (
          <div className="py-16 text-center animate-fade-up">
            <p className="text-severity-high font-medium mb-2">Analysis failed</p>
            <p className="text-sm text-ink-muted mb-6">{errorMessage}</p>
            <button onClick={handleReset} className="text-sm text-accent underline underline-offset-4 hover:opacity-75 transition-opacity">Try again</button>
          </div>
        )}
        {status === 'done' && result && (
          <div className="animate-fade-up">
            <AnalysisResults result={result} />
            <div className="mt-12 pt-8 border-t border-border text-center">
              <button onClick={handleReset} className="text-sm text-ink-muted hover:text-ink transition-colors underline underline-offset-4">&larr; Analyze another scenario</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
