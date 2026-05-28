# Varo AI

**Cyber-Physical Consequence Intelligence for OT/ICS security.**

Varo AI translates raw industrial control system alerts (Modbus, DNP3, IEC 61850, OPC-UA) into plain-language operational consequence reports with actionable COPILOT response steps — in under 90 seconds.

---

## Deliverables

| # | Document | Description |
|---|---|---|
| 1 | [**Positioning**](varoai_build_package_v2/varoai_docs/PRD.md) | Product vision, user roles, MVP module scope, and out-of-scope boundaries |
| 2 | [**Architecture**](varoai_build_package_v2/varoai_docs/architecture.md) | Technical stack, Firestore schema, Firebase security rules, and the AI call pattern |
| 3 | [**Phase 1 Prototype**](app/) | Working Next.js 14 app — alert input → Gemini analysis → 12-field incident report with COPILOT workflow and Engineer Copilot chat |

---

## How to read this

| Audience | Reading path |
|---|---|
| **Investors** | Positioning only → [`PRD.md`](varoai_build_package_v2/varoai_docs/PRD.md) |
| **CISOs** | Positioning + Architecture §§ 1 (Overview), 2 (Stack), 6 (AI Call Pattern) → [`PRD.md`](varoai_build_package_v2/varoai_docs/PRD.md) · [`architecture.md`](varoai_build_package_v2/varoai_docs/architecture.md) · [`SECURITY_PRIVACY.md`](varoai_build_package_v2/varoai_docs/SECURITY_PRIVACY.md) |
| **Engineers** | All architecture docs + prototype → [`architecture.md`](varoai_build_package_v2/varoai_docs/architecture.md) · [`system_prompt.md`](varoai_build_package_v2/varoai_docs/system_prompt.md) · [`ai_rules.md`](varoai_build_package_v2/varoai_docs/ai_rules.md) · [`SYSTEM_BEHAVIOR.md`](varoai_build_package_v2/varoai_docs/SYSTEM_BEHAVIOR.md) · [prototype](app/) |

---

## Quick start (prototype)

```bash
cp .env.local.example .env.local
# Add GEMINI_API_KEY from aistudio.google.com
npm install
npm run dev
# Open http://localhost:3000
```

Three demo scenarios load automatically on the alert input page (Modbus PLC anomaly, Historian exfiltration, HMI brute force).

---

## Documentation index

All source-of-truth documents live in [`varoai_build_package_v2/varoai_docs/`](varoai_build_package_v2/varoai_docs/):

| File | Purpose |
|---|---|
| [`PRD.md`](varoai_build_package_v2/varoai_docs/PRD.md) | Product requirements, user roles, alert ingestion methods |
| [`architecture.md`](varoai_build_package_v2/varoai_docs/architecture.md) | Stack, Firestore schema, security rules, AI call pattern |
| [`system_prompt.md`](varoai_build_package_v2/varoai_docs/system_prompt.md) | Exact system prompts for all 4 AI modules + 3 demo test inputs |
| [`ai_rules.md`](varoai_build_package_v2/varoai_docs/ai_rules.md) | The 10 non-negotiable AI behaviour rules with code-level enforcement |
| [`SYSTEM_BEHAVIOR.md`](varoai_build_package_v2/varoai_docs/SYSTEM_BEHAVIOR.md) | Incident state machine, `forcesCopilot()` logic, AUTOPILOT overrides |
| [`UI_DESIGN.md`](varoai_build_package_v2/varoai_docs/UI_DESIGN.md) | Component specs, layout wireframes, colour palette, typography |
| [`UX_FLOW.md`](varoai_build_package_v2/varoai_docs/UX_FLOW.md) | Page routes, user flows, navigation map |
| [`SECURITY_PRIVACY.md`](varoai_build_package_v2/varoai_docs/SECURITY_PRIVACY.md) | Firestore security rules, `sanitiseAlert()`, `validateReport()`, data classification |
| [`OBSERVABILITY.md`](varoai_build_package_v2/varoai_docs/OBSERVABILITY.md) | Error message copy, audit log schema, performance monitoring |
| [`THREAT_DATASET.md`](varoai_build_package_v2/varoai_docs/THREAT_DATASET.md) | Synthetic test alerts for all sectors + QA test cases |
| [`DEMO_STORY.md`](varoai_build_package_v2/varoai_docs/DEMO_STORY.md) | 5-minute demo script, investor Q&A, break-glass fallbacks |
| [`ROADMAP.md`](varoai_build_package_v2/varoai_docs/ROADMAP.md) | Feature roadmap, AI engine swap plan (Gemini → Claude at Month 3) |
| [`plan.md`](varoai_build_package_v2/varoai_docs/plan.md) | Build phases, daily prioritisation guidance |
