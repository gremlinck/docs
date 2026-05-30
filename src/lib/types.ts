// Single source of truth for all Zod schemas and inferred TypeScript types.
// Zod is a pure JS library -- safe to import anywhere (server or client).

import { z } from 'zod';

export const AnalysisInputSchema = z.object({
  scenario: z.string().min(10).max(5000),
});

const AffectedSystemSchema = z.object({
  name: z.string(),
  purdueLevel: z.number().int().min(0).max(5),
  purdueLevelLabel: z.string(),
  zone: z.string(),
  role: z.string(),
});

const RecommendedActionSchema = z.object({
  priority: z.number().int().min(1),
  action: z.string(),
  rationale: z.string(),
  safetyNote: z.string().optional(),
  requiresHumanApproval: z.boolean(),
});

export const KillChainStageEnum = z.enum([
  'reconnaissance', 'weaponization', 'delivery', 'exploitation',
  'installation', 'command_and_control', 'actions_on_objectives',
]);

export const ConfidenceLevelEnum = z.enum(['high', 'medium', 'low']);

export const AnalysisOutputSchema = z.object({
  consequenceAnalysis: z.object({
    summary: z.string(),
    safetyImpact: z.string(),
    availabilityImpact: z.string(),
    productivityImpact: z.string(),
  }),
  affectedSystems: z.array(AffectedSystemSchema).min(1),
  killChainPosition: z.object({
    stage: KillChainStageEnum,
    stageNumber: z.number().int().min(1).max(7),
    stageLabel: z.string(),
    evidence: z.string(),
    nextLikelyStage: z.string(),
  }),
  recommendedActions: z.array(RecommendedActionSchema).min(1).max(10),
  reasoningTrace: z.array(z.string()).min(1),
  confidence: z.object({
    level: ConfidenceLevelEnum,
    score: z.number().int().min(0).max(100),
    certainties: z.array(z.string()),
    assumptions: z.array(z.string()),
    dataGaps: z.array(z.string()),
  }),
});

export type AnalysisInput = z.infer<typeof AnalysisInputSchema>;
export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>;
export type AffectedSystem = z.infer<typeof AffectedSystemSchema>;
export type RecommendedAction = z.infer<typeof RecommendedActionSchema>;
export type KillChainStage = z.infer<typeof KillChainStageEnum>;
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelEnum>;
