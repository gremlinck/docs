# Varo AI — Architecture
**Varo Mythos internal spec**
**Version:** 0.1 | **Date:** May 2026

Chain-aware reasoning layer for OT/ICS security, built on Google ADK + A2A and structured around the A.G.E.N.T. Loop™.

---

## Section 1 — Overview

Varo AI is a multi-agent reasoning system that processes OT security alerts through a structured consequence-analysis chain. Unlike a single-prompt LLM call, the A.G.E.N.T. Loop™ decomposes the analysis into discrete, auditable steps — each producing a typed output that feeds the next agent.

```
Raw OT Alert
     │
     ▼
[A] Assess        — Protocol identification + anomaly classification
     │
     ▼
[G] Generate      — Attack scenario construction (MITRE ATT&CK for ICS)
     │
     ▼
[E] Evaluate      — Consequence modelling (operational + financial impact)
     │
     ▼
[N] Navigate      — Response step generation + escalation routing
     │
     ▼
[T] Translate     — Plain-language output for the target audience (analyst / engineer / CISO)
     │
     ▼
Structured Incident Report (12 fields, validated JSON)
```

**Why a chain, not a single prompt?**
Each step can be independently audited, retried, and — crucially — safety-checked. The [N] Navigate step has a hardcoded safety gate that blocks any response step affecting physical processes from reaching AUTOPILOT execution. A single monolithic prompt cannot enforce this at the application layer.

---

## Section 2 — Stack

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│           Next.js 14 + React 18 + TypeScript             │
│           Tailwind CSS — Varo AI design system           │
│           Firebase Hosting — varoai.app                  │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   AGENT ORCHESTRATION                     │
│          Google Agent Development Kit (ADK)              │
│          Agent-to-Agent (A2A) protocol                   │
│          A.G.E.N.T. Loop™ — 5-step reasoning chain      │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                      AI ENGINE                           │
│    Gemini 2.0 Flash (MVP) → Claude swap at Month 3       │
│    Single callVaroAnalyst() wrapper in lib/ai.ts         │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                      FIREBASE                            │
│    Auth (Google SSO)  │  Firestore  │  Hosting           │
└─────────────────────────────────────────────────────────┘
```

**AI engine swap note:** `lib/ai.ts` exports a single `callVaroAnalyst(prompt, temperature)` function. Migrating from Gemini to Claude requires changing only this function — no other file references the AI provider. The function signature and return type are provider-agnostic.

---

## Section 3 — Agent definitions

| Agent | Step | Temperature | SLA | Output type |
|---|---|---|---|---|
| Protocol Assessor | [A] Assess | 0.1 | < 5 s | `{ protocol, anomalyType, confidence }` |
| Scenario Generator | [G] Generate | 0.2 | < 15 s | `{ attackScenario, mitreId, mitreTechnique }` |
| Consequence Evaluator | [E] Evaluate | 0.2 | < 20 s | `{ operationalImpact, financialExposure, severityScore }` |
| Response Navigator | [N] Navigate | 0.2 | < 20 s | `{ responseSteps[], escalationRecommendation }` |
| Language Translator | [T] Translate | 0.3 | < 10 s | Full 12-field `IncidentReport` JSON |

*Phase 1 MVP collapses all five steps into a single Gemini call. The ADK/A2A multi-agent chain is the Phase 2 architecture target.*

---

## Section 4 — Firestore schema

See [`architecture.md §3`](../varoai_build_package_v2/varoai_docs/architecture.md) for the full Firestore collection schema (`users`, `incidents`, `conversations`, `simulations`, `auditLog`).

---

## Section 5 — Safety gate specification

The [N] Navigate agent applies `forcesCopilot()` before emitting any response step. This is enforced at the application layer, not only in the prompt.

```typescript
// lib/security.ts
export function forcesCopilot(report: IncidentReport): boolean {
  return (
    report.severityScore >= 8 ||
    report.mitreTechnique?.toLowerCase().includes('safety') ||
    detectPhysicalImpact(report)   // checks operationalImpact text + asset names
  )
}
```

If `forcesCopilot()` returns `true`, the AUTOPILOT execution path is blocked and a safety override banner is displayed. This cannot be disabled by user settings, API flags, or prompt instructions.

---

## Section 6 — AI call pattern

All AI calls go through the single wrapper in `lib/ai.ts`. This is the only function that changes when swapping AI providers.

```typescript
// lib/ai.ts — current implementation (Gemini 2.0 Flash)
export async function callVaroAnalyst(
  fullPrompt: string,
  temperature = 0.2
): Promise<unknown> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    }
  )
  // ... parse and return
}
```

**Data flow for security review:**
1. User pastes alert text in browser
2. Browser POSTs to `/api/varo/analyze` (Next.js server-side route — API key never exposed to client)
3. Server calls `sanitiseAlert()` (prompt injection defence) and wraps in `<alert_content>` delimiters
4. Server calls Gemini API with `GEMINI_API_KEY` (server-side env var only)
5. Response parsed, validated by `validateReport()`, returned to browser as JSON
6. No alert content is logged by Varo AI infrastructure; Gemini processes transiently

---

## Section 7 — Deployment

```bash
npm run build
firebase deploy --only hosting

# Firestore rules
firebase deploy --only firestore:rules
```

See [`architecture.md §7`](../varoai_build_package_v2/varoai_docs/architecture.md) for full deployment commands.

---

*References: [`architecture.md`](../varoai_build_package_v2/varoai_docs/architecture.md) · [`ai_rules.md`](../varoai_build_package_v2/varoai_docs/ai_rules.md) · [`SYSTEM_BEHAVIOR.md`](../varoai_build_package_v2/varoai_docs/SYSTEM_BEHAVIOR.md) · [`SECURITY_PRIVACY.md`](../varoai_build_package_v2/varoai_docs/SECURITY_PRIVACY.md)*
