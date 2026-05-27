# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Varo AI is a **Cyber-Physical Consequence Intelligence** platform for OT/ICS cybersecurity. It translates raw OT security alerts (Modbus, DNP3, IEC 61850, OPC-UA, etc.) into plain-language operational consequence reports with actionable response steps. Target users are OT security analysts, control/SCADA engineers, and CISOs at energy, manufacturing, water, and oil & gas facilities.

**Status:** Early-stage MVP. The repository currently contains comprehensive documentation and a `package.json` (mislabeled as `app/api/varo/analyze/route.js`) — application code is yet to be written.

## Dev Commands

```bash
npm run dev        # Start Next.js dev server
npm run build      # Production build
npm start          # Start production server
npm run lint       # ESLint

# Deploy
npm run build && firebase deploy --only hosting
firebase deploy --only firestore:rules   # Deploy Firestore security rules only
```

No automated test suite exists. Testing is manual via the three demo scenarios in `varoai_build_package_v2/varoai_docs/system_prompt.md` (Modbus PLC, Historian exfiltration, HMI brute-force). Run all three after any AI prompt or output parsing change.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + React 18 + TypeScript + Tailwind CSS |
| Auth / DB / Hosting | Firebase (Google SSO, Firestore, Firebase Hosting) |
| AI Engine | Gemini 2.0 Flash (MVP); `@anthropic-ai/sdk` is already in `package.json` — Claude swap is planned at Month 3 |
| Deployment target | `varoai.app` (Firebase Hosting) |

The AI engine swap from Gemini to Claude is designed to be a single-function change inside `callVaroAnalyst()`. Do not scatter AI provider logic across multiple files.

## Architecture

### API Route Pattern

Next.js App Router: `/app/api/[feature]/[action]/route.js`

### AI Call Pattern

All AI calls go through a single wrapper:

```js
const callVaroAnalyst = async (systemPrompt, userMessage, temperature = 0.2) => { ... }
```

This is the **only function that changes** when swapping Gemini → Claude. It enforces `responseMimeType: 'application/json'` at the API level to guarantee JSON output. See `architecture.md` for the exact function body.

### Firestore Collections

| Collection | Purpose |
|---|---|
| `users/` | Profile, role (`analyst`/`engineer`/`ciso`), facilityType, operating mode |
| `incidents/` | 12-field AI report + `analystActions[]` + status |
| `conversations/` | Engineer Copilot chat per incident (max 20 messages stored) |
| `simulations/` | Resilience Simulator results |
| `auditLog/` | **Immutable write-only** — `update` and `delete` are `false` in security rules, permanently |
| `performance/` | AI response timing logs |
| `errors/` | JSON parse failure logs |

### Incident Lifecycle

```
CREATED → PROCESSING → REPORTED → INVESTIGATING → CONTAINED → CLOSED
                ↓
            ERROR (retry once → save as DRAFT)
```

### Operating Modes

- **COPILOT** (default for all users): AI recommends, analyst approves each `responseStep` individually
- **AUTOPILOT** (opt-in only): Executes pre-approved playbooks automatically

AUTOPILOT has hardcoded overrides that force COPILOT regardless of user settings. See the `forcesCopilot()` logic in `SYSTEM_BEHAVIOR.md`.

## AI Modules

| Module | Temperature | SLA | Output |
|---|---|---|---|
| Incident Analyst | 0.2 | ≤90s | 12-field JSON report |
| Engineer Copilot | 0.4 | ≤8s | Conversational, loaded with active incident context |
| Resilience Simulator | 0.3 | ≤120s | Cascade failure map + resilience score (0–100) |
| Executive Summary | 0.2 | — | Board-ready JSON report |

## Critical AI Rules

These are non-negotiable and must be enforced in every AI call and in every UI component that renders AI output:

1. **JSON only** — AI responses are always JSON. Never display raw AI text to users. If parsing fails, retry once (stripping any markdown fences), then show the user-facing error message defined in `OBSERVABILITY.md`. Never show blank screens or raw error objects.

2. **Safety first** — Never recommend actions that could cause physical harm, damage equipment, disrupt safety-critical processes, or override a Safety Instrumented System (SIS). Flag any response step with physical process risk as `[SAFETY CHECK REQUIRED]` and exclude it from AUTOPILOT execution.

3. **AUTOPILOT is permanently locked** for these categories — enforce at the application layer, not just the prompt:
   - `safety_system_interaction`
   - `physical_process_impact`
   - `turbine_governor_access`
   - `emergency_shutdown_system`
   - `pressure_relief_valve`
   - `high_severity_unknown`

4. **Severity ≥ 8 always forces COPILOT** regardless of user mode setting.

5. **Financial exposure is always a range** — never a single figure. Format: `"$X–$Y (basis)"`.

6. **MITRE IDs must be real ATT&CK for ICS IDs** — format `T[0-9]{4}`. If the correct ID cannot be verified, set to `T0000` and add a `mitreNote` flagging it for manual review. Never fabricate technique IDs.

7. **Confidence level always stated** — `High`, `Medium`, or `Low` with a one-sentence reason. `Low` confidence automatically locks the incident to COPILOT.

8. **Audit log every action** — every AI recommendation and every analyst action (approve/modify/skip/close) must write to `auditLog`. This log is immutable — no deletes, ever.

9. **Prompt injection defence** — sanitise user-supplied alert text via `sanitiseAlert()` (see `SECURITY_PRIVACY.md`) and wrap it in `<alert_content>` delimiters before injection into any AI prompt. Input limit: 5,000 characters.

10. **Validate AI output before displaying** — check all 12 required fields exist, severity is 1–10, MITRE ID matches `T[0-9]{4}`. See `validateReport()` in `SECURITY_PRIVACY.md`.

## Design System

```css
/* Core palette */
--cream:    #FAF8F4;   /* page background */
--ink:      #0F0E0C;   /* primary text */
--navy:     #0D1F3C;   /* top nav, dark surfaces */
--blue:     #1A3FA8;   /* CTAs, active states */

/* Severity — use exactly these values, no substitutions */
--critical: #DC2626;   /* severity 9–10 */
--high:     #EA580C;   /* severity 7–8 */
--medium:   #D97706;   /* severity 5–6 */
--low:      #16A34A;   /* severity 1–4 */
```

**Fonts:** Syne (headers, 700/800), Instrument Sans (body, 400/500/600), JetBrains Mono (IDs and technical strings)

Severity colours are non-negotiable — do not substitute or approximate them.

## Environment Variables

Required in `.env.local` — never commit these:

```
GEMINI_API_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## MVP Scope Limits — Do Not Build

These are explicitly out of scope and should not be implemented without a deliberate roadmap decision:

- Native OT network sensor or traffic capture
- Direct PLC/SCADA write access
- Full SIEM/SOAR integration
- Mobile native app (PWA only)
- Billing or subscription management
- Multi-tenant organisation accounts
- AI model fine-tuning
- Digital twin simulation

## Documentation Index

All source-of-truth documents are in `varoai_build_package_v2/varoai_docs/`:

| File | When to read |
|---|---|
| `architecture.md` | Firestore schema, `callVaroAnalyst()` pattern, security rules, deploy commands |
| `system_prompt.md` | Exact system prompts for all 4 modules + 3 demo scenario test inputs |
| `ai_rules.md` | All 10 AI behaviour rules with code-level implementations |
| `SYSTEM_BEHAVIOR.md` | Incident state machine, `forcesCopilot()` override logic, file upload parsing |
| `UI_DESIGN.md` | Component specs, layout wireframes, animation, responsive breakpoints |
| `UX_FLOW.md` | Page routes, user flows for all 5 major flows, navigation map |
| `SECURITY_PRIVACY.md` | Production Firestore security rules, `sanitiseAlert()`, `validateReport()` |
| `OBSERVABILITY.md` | Exact error message copy, audit log schema, performance monitoring |
| `THREAT_DATASET.md` | Synthetic test alerts for all sectors + QA test cases |
| `threat_translation_prompt.md` | Protocol anomaly translation patterns used by the Copilot |
| `PRD.md` | Product requirements, user roles, alert ingestion methods |
| `plan.md` | Build phases and daily prioritisation guidance |
| `ROADMAP.md` | Feature roadmap, AI engine swap plan, decision log |
| `DEMO_STORY.md` | 5-minute demo script, investor Q&A, break-glass fallbacks |
