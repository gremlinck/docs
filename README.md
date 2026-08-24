# Varo AI

**AI-native decision intelligence for OT/ICS cybersecurity. Consultant-grade analysis in 90 seconds.**

## The Thesis

OT/ICS organisations pay security consultants $50K--$500K per engagement to translate security findings into plant-level decisions. The consultant applies domain expertise, writes a report, leaves. Knowledge doesn't persist. Next incident, they pay again.

Varo replaces this loop. An AI-native platform that ingests the same inputs a senior OT security consultant would, applies the same domain reasoning, and produces decision-grade outputs available 24/7 at SaaS pricing.

The product is **not** detection. Detection exists (Dragos, Claroty, Nozomi). Varo is the advisory layer above detection where consultant-grade judgment lives.

## What v0.1 Does

Paste any OT security scenario. Within 60--90 seconds, Varo returns:

1. **Consequence Analysis** -- physical process impact (safety, availability, productivity)
2. **Affected Systems** -- assets mapped to Purdue model levels 0--5
3. **Kill Chain Position** -- ICS Cyber Kill Chain stage (SANS/Dragos 7-stage model)
4. **Recommended Actions** -- prioritized, safety-gated, human-approval flagged
5. **Reasoning Trace** -- the analytical chain, auditable and challengeable
6. **Confidence & Uncertainty** -- certainties vs. assumptions vs. data gaps

## Architecture

All AI calls go through one Genkit flow: `src/genkit/consequence-analysis.ts`. To swap the AI provider, change only the `model` string there.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| AI Engine | Gemini 2.5 Pro via Genkit |
| Auth/DB | Firebase (scaffolded, not used in v0.1) |
| Deployment | Vercel |

## Running Locally

```bash
npm install
cp .env.example .env.local
# Add GEMINI_API_KEY from https://aistudio.google.com
npm run dev
```

Visit `http://localhost:3000`. Click **Load demo scenario** on `/analyze` to test.

## Deploying to Vercel

1. Push to GitHub
2. Import at vercel.com/new
3. Add `GEMINI_API_KEY` in Vercel environment variables
4. Deploy

**Note:** `/api/analyze` sets `maxDuration = 90`. Vercel Hobby plan caps at 60s -- use Pro.

## v0.1 Scope

**In:** `/` landing, `/analyze` analysis, 6-section AI output via Gemini 2.5 Pro.

**Out:** Auth, multi-tenant, OT sensor integrations, multi-agent, AUTOPILOT, persistence, billing.

See `CLAUDE.md` for architecture decisions.
