# Varo AI -- CLAUDE.md

Context for Claude Code sessions. ~190 lines.

## What Varo Is

AI-native OT/ICS cybersecurity platform. Users paste OT security scenarios; Varo returns
consultant-grade consequence analysis in 90 seconds.

Varo is the advisory layer **above** detection (Dragos/Claroty/Nozomi handle detection).
Target users: OT security analysts, plant managers, CISOs at energy, manufacturing, water, oil & gas.

## Status

v0.1 -- public demo, no auth. Working routes: `/` (landing) + `/analyze` (analysis).
Firebase scaffolded in `src/lib/firebase.ts` but not used. Auth in v0.2.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 App Router + TypeScript + Tailwind CSS |
| AI Engine | Gemini 2.5 Pro via Genkit (server-side only) |
| Fonts | DM Serif Display (display/italic), DM Sans (body), JetBrains Mono (technical) |
| Auth/DB | Firebase -- scaffolded, not wired |
| Deployment | Vercel |

## The One Architectural Rule

All AI calls go through one Genkit flow: `src/genkit/consequence-analysis.ts`.

```
POST /api/analyze -> consequenceAnalysisFlow() -> Gemini 2.5 Pro -> AnalysisOutput
```

To swap AI providers: change only the `model` string in `consequence-analysis.ts`.
Never import `src/genkit/*` in client components -- Genkit uses Node.js APIs.

## File Map

```
src/
  app/
    page.tsx                 # Marketing landing
    analyze/page.tsx         # Analysis page ('use client')
    api/analyze/route.ts     # POST -> Genkit flow, maxDuration=90
    layout.tsx               # Root layout + fonts
    globals.css              # Tailwind + section-reveal animation
  components/
    AnalyzeForm.tsx          # Textarea + submit + demo loader
    AnalysisResults.tsx      # Composes 6 section components
    LoadingState.tsx         # Progress bar + step list
    sections/                # 6 section components (01-06)
  lib/
    types.ts                 # Zod schemas + TS types (import anywhere)
    firebase.ts              # Scaffolded, not used
  genkit/
    consequence-analysis.ts  # Genkit flow (server-only)
    system-prompt.ts         # OT consultant persona (server-only)
```

## Zod Schemas

Defined in `src/lib/types.ts`. Single source of truth.
Import types in client components, never run Zod validation client-side.

## The 6-Section Output

```
consequenceAnalysis   { summary, safetyImpact, availabilityImpact, productivityImpact }
affectedSystems[]     { name, purdueLevel 0-5, purdueLevelLabel, zone, role }
killChainPosition     { stage enum, stageNumber 1-7, stageLabel, evidence, nextLikelyStage }
recommendedActions[]  { priority, action, rationale, safetyNote?, requiresHumanApproval }
reasoningTrace        string[] (first-person, 4-10 steps)
confidence            { level high|medium|low, score 0-100, certainties[], assumptions[], dataGaps[] }
```

OT CIA triad: Safety > Availability > Integrity > Confidentiality. Never reorder.

## Design System

```
--bg:             #F8F7F5
--ink:            #0C0C0B
--ink-muted:      #6B6B68
--border:         #E4E3DF
--surface:        #FFFFFF
--surface-raised: #F1F0EC
--accent:         #1B4ED8

Severity (never substitute):
severity-critical: #DC2626
severity-high:     #EA580C
severity-medium:   #D97706
severity-low:      #16A34A
```

Section cards use `section-reveal` class + `delay` prop (ms) for staggered animation.

## Critical Rules

1. **Server-only AI**: Never import `src/genkit/*` in client components.
2. **Safety gate**: Actions touching physical process/SIS require `safetyNote` + `requiresHumanApproval: true`.
3. **Reasoning trace mandatory**: Never show recommendations without the trace.
4. **Input limit**: 5,000 chars. Enforced in schema + AnalyzeForm.
5. **maxDuration = 90**: Do not remove from route.ts.

## Out of Scope Until Explicitly Decided

- Auth / login (Firebase scaffolded only)
- Multi-agent A2A (v0.2)
- AUTOPILOT mode (advisory only)
- OT sensor / SIEM integrations (v0.3+)
- Asset persistence, historical chains, billing, analytics
