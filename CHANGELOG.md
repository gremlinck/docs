# Changelog

All notable changes to Varo AI are documented here.

---

## [0.1.0] — 2026-05-28

### Added

**Phase 1 prototype — complete demo build**

- `app/incidents/new` — Alert input page: textarea, facility-type selector, COPILOT/AUTOPILOT mode toggle, three preloaded demo scenarios (Modbus PLC anomaly, Historian exfiltration, HMI brute force)
- `app/incidents/[id]` — Incident report page: full 12-field AI report with severity colour band, MITRE ATT&CK badge, financial exposure, and COPILOT APPROVE / MODIFY / SKIP workflow on each response step
- `app/dashboard` — Risk Score Dashboard: static resilience score (68/100 FAIR) and incident history list; full scoring deferred to Phase 2
- `components/CopilotChat` — Engineer Copilot chat panel loaded with active incident context; 20-message session limit enforced
- `components/ResponseStep` — Per-step action buttons with inline text editing (MODIFY flow) and safety-check warning banner
- `components/SeverityBadge` — Severity pill using exact design-system colours (Critical #DC2626 / High #EA580C 7 Medium #D97706 / Low #16A34A)
- `components/NavBar`, `ModeToggle`, `LoadingBar` — Shell UI components matching the Varo AI design spec
- `app/api/varo/analyze` — Server-side API route calling Gemini 2.0 Flash; returns validated 12-field JSON report
- `app/api/varo/copilot` — Server-side API route for Engineer Copilot conversational responses
- `lib/ai.ts` — Single `callVaroAnalyst()` wrapper; isolated swap point for Gemini → Claude migration at Month 3
- `lib/security.ts` — `sanitiseAlert()`, `validateReport()`, `forcesCopilot()`, prompt-injection delimiters per `ai_rules.md`
- `lib/storage.ts` — localStorage persistence for demo incidents (no Firebase auth required for Phase 1)
- `types/varo.ts` — Shared TypeScript types: `IncidentReport`, `StoredIncident`, `OperatingMode`, `StepStatus`
- `firestore.rules` — Immutable audit-log rules and per-user data isolation, ready for Phase 2 Firebase deployment
- `README.md` — Deliverable index, audience reading guide, quick-start instructions
- Design system: Syne / Instrument Sans / JetBrains Mono via `next/font/google`; full Tailwind design token config

### Architecture decisions

- AI engine is **Gemini 2.0 Flash** for MVP; `callVaroAnalyst()` in `lib/ai.ts` is the single change point for the planned Claude swap
- AUTOPILOT safety override is enforced at the application layer (`forcesCopilot()`), not only in the prompt — severity ≥ 8 or physical-process impact always forces COPILOT regardless of user mode setting
- No Firebase Auth in Phase 1 — incidents stored in `localStorage` for zero-friction demo; Firebase scaffolding committed and ready for Phase 2

### Not included (deferred to Phase 2+)

- Firebase Auth (Google SSO)
- File upload ingestion (Dragos / Nozomi CSV/JSON)
- Resilience Simulator
- Executive Summary generator
- Live Firestore persistence
