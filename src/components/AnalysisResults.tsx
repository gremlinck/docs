import type { AnalysisOutput } from '@/lib/types';
import ConsequenceSection from './sections/ConsequenceSection';
import AffectedSystemsSection from './sections/AffectedSystemsSection';
import KillChainSection from './sections/KillChainSection';
import RecommendedActionsSection from './sections/RecommendedActionsSection';
import ReasoningTraceSection from './sections/ReasoningTraceSection';
import ConfidenceSection from './sections/ConfidenceSection';

export default function AnalysisResults({ result }: { result: AnalysisOutput }) {
  return (
    <div className="space-y-5">
      <div className="pb-5 border-b border-border">
        <h2 className="font-display italic text-3xl text-ink mb-1">Consequence Analysis</h2>
        <p className="text-sm text-ink-muted">Advisory report &middot; All actions require human verification before execution</p>
      </div>
      <ConfidenceSection confidence={result.confidence} delay={0} />
      <ConsequenceSection consequence={result.consequenceAnalysis} delay={80} />
      <AffectedSystemsSection systems={result.affectedSystems} delay={160} />
      <KillChainSection killChain={result.killChainPosition} delay={240} />
      <RecommendedActionsSection actions={result.recommendedActions} delay={320} />
      <ReasoningTraceSection trace={result.reasoningTrace} delay={400} />
    </div>
  );
}
