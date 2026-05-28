# Changelog

All notable changes to Varo AI are documented here.

---

## [0.2.0] — 2026-05-28

### Added

**A.G.E.N.T. Loop™ — Python multi-agent backend**

- `agent-backend/` — FastAPI service exposing the five-step reasoning chain
- `agent-backend/agents/assessor.py` — [A] Assess: protocol identification + anomaly classification (temperature 0.1)
- `agent-backend/agents/generator.py` — [G] Generate: attack scenario + MITRE ATT&CK for ICS mapping
- `agent-backend/agents/evaluator.py` — [E] Evaluate: consequence modelling with facility-type downtime rates
- `agent-backend/agents/navigator.py` — [N] Navigate: ranked response steps + safety gate (`forces_copilot()` at application layer)
- `agent-backend/agents/translator.py` — [T] Translate: final 12-field IncidentReport assembly
- `agent-backend/agents/base.py` — ADK-compatible `Agent` base class with A2A agent card
- `agent-backend/pipeline/agent_loop.py` — `run_agent_loop()` orchestrator; `get_agent_cards()` for A2A registry
- `agent-backend/main.py` — FastAPI server: `POST /tasks/analyze`, `POST /tasks/copilot`, `GET /.well-known/agent.json` (A2A), `GET /health`
- `agent-backend/security/sanitise.py` — Python port of `sanitiseAlert`, `validateReport`, `forcesCopilot`

**Next.js routing updated for Phase 2**

- `lib/ai.ts` — `callAgentLoop()` and `callAgentCopilot()` for agent backend; direct Gemini path retained as fallback
- `app/api/varo/analyze/route.ts` — routes to agent backend when `AGENT_BACKEND_URL` is set; falls back to Phase 1
- `app/api/varo/copilot/route.ts` — same dual-path routing
- `.env.local.example` — added `AGENT_BACKEND_URL`

**Documentation expanded**

- `positioning/varo-mythos-positioning.md` — full 13-slide deck: Mythos analogy table, A.G.E.N.T. Loop™ diagram, COPILOT vs AUTOPILOT, CISO data handling Q&A, naming note
- `architecture/README.md` — updated with actual agent code, data flow diagram for security review, local run + Cloud Run deploy commands

### Architecture decisions

- Agent backend is a separate Python service (not embedded in Next.js) — enables independent scaling, language-appropriate tooling (Python ADK), and clean A2A protocol boundary
- Phase routing is zero-config: set `AGENT_BACKEND_URL` to activate Phase 2; unset to use Phase 1 direct Gemini
- Safety gate (`forcesCopilot`) is implemented in both Python (`agent-backend/security/sanitise.py`) and TypeScript (`lib/security.ts`) — belt-and-suspenders at both layers

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
