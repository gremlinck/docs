# ROADMAP.md — Varo AI Product Roadmap
**Version:** 1.0 | **Owner:** Hi Kim, CEO

---

## Roadmap Philosophy

Build the smallest thing that proves the biggest claim. Every phase must generate learning that justifies the next phase. Never build Phase 2 features before Phase 1 is validated by real users.

---

## Phase 0 — Foundation (Days 1–3)
**Goal:** Environment ready. Nothing broken before you start.

| Task | Done? |
|------|-------|
| Firebase project created (varoai-app) | ☐ |
| Google Auth enabled | ☐ |
| Firestore in test mode (nam5) | ☐ |
| Gemini API key obtained from aistudio.google.com | ☐ |
| Environment variables set (never in Git) | ☐ |
| GitHub repo created (varoai-mvp) | ☐ |
| Firebase Studio workspace configured | ☐ |

---

## Phase 1 — Demo (Days 4–10)
**Goal:** Working demo. NextEra investor call. Lighthouse pitch.

### Must-have (demo fails without these)
| Feature | Module | Priority |
|---------|--------|----------|
| Alert text paste input | M1 | P0 |
| Gemini API call with incident analyst prompt | M1 | P0 |
| 12-field incident report display | M1 | P0 |
| Severity badge with colour coding | M1 | P0 |
| COPILOT approval buttons per step | M1 | P0 |
| Engineer Copilot chat panel | M2 | P0 |
| Mode toggle COPILOT/AUTOPILOT | Both | P0 |
| Firebase Hosting deployment at varoai.app | Infra | P0 |
| All 3 demo scenarios tested ×10 each | QA | P0 |

### Demo day checklist
- [ ] Scenario 1 (Modbus) → report in <90s
- [ ] Scenario 2 (Historian) → report in <90s
- [ ] Scenario 3 (HMI Brute Force) → report in <90s
- [ ] COPILOT flow demonstrated end-to-end
- [ ] Zero console errors
- [ ] Deployed and accessible at varoai.app

---

## Phase 2 — Alpha (Days 11–30)
**Goal:** Real product. Ready for NextEra pilot.

| Feature | Module | Priority |
|---------|--------|----------|
| Google SSO authentication | Auth | P1 |
| Firestore persistence (save all incidents) | Infra | P1 |
| File upload (CSV/JSON from Dragos/Nozomi) | M1 | P1 |
| Structured form input | M1 | P1 |
| AUTOPILOT mode with audit log | M1 | P1 |
| Conversation history saved | M2 | P1 |
| Resilience Simulator — 5 scenarios | M3 | P1 |
| Risk Score Dashboard (static score + history) | M4 | P1 |
| Push notifications (critical alerts) | Infra | P1 |
| Pre-flight health check (daily auto-test) | Ops | P1 |

### Alpha success criteria
- [ ] NextEra contact has seen demo — positive reaction
- [ ] At least 1 pilot agreement in discussion
- [ ] 10+ incidents run through the system without errors
- [ ] All P1 features working

---

## Phase 3 — Beta (Month 2–3)
**Goal:** Pilot-ready. Revenue conversations.

| Feature | Module | Priority |
|---------|--------|----------|
| Live Dragos/Nozomi API connection (webhook) | M1 | P2 |
| Live resilience score from real data | M4 | P2 |
| PDF export (incident report + simulation) | M1/M3 | P2 |
| Executive one-pager AI generator | M4 | P2 |
| Korean language support (UI + AI responses) | Global | P2 |
| Performance hardening (hit 90s SLA at P99) | Infra | P2 |
| Firestore security rules (replace test mode) | Security | P2 |

### Beta success criteria
- [ ] 1 design partner running real alerts
- [ ] Mean investigation time ≤50% of baseline
- [ ] NPS ≥7/10 from pilot users
- [ ] Zero AUTOPILOT safety overrides missed

---

## Phase 4 — v1.0 (Month 4–6)
**Goal:** Commercial product. Paying customers.

| Feature | Module | Priority |
|---------|--------|----------|
| Billing and subscription (Stripe) | Commerce | P3 |
| Multi-user organisation accounts | Auth | P3 |
| AUTOPILOT playbook library (10+ pre-built) | M1 | P3 |
| Compliance posture (NERC CIP, IEC 62443) | M4 | P3 |
| API access for enterprise integrations | Infra | P3 |
| SLA monitoring dashboard (uptime/latency) | Ops | P3 |
| On-premise deployment option | Infra | P3 |

### v1.0 success criteria
- [ ] 3 paying pilots at $2,500–$5,000/month
- [ ] 1 enterprise conversation at $50K+ ACV
- [ ] Seed round term sheet or SAFE signed

---

## AI Engine Roadmap

| Phase | Engine | Reason |
|-------|--------|--------|
| Demo → Beta | Gemini 2.0 Flash | Free tier (1,500 req/day), fast, good JSON |
| Beta → v1.0 | Evaluate: Gemini Pro or Claude Sonnet | Higher accuracy for complex scenarios |
| Enterprise | Claude (Anthropic) | Enterprise data handling commitments |

**Architecture is clean for swap** — all AI calls go through `callVaroAnalyst()` in `architecture.md`. Change the function body, nothing else changes.

---

## Feature Graveyard — Good Ideas for Later

These are real features that should not be built in the MVP:

| Feature | Why not now |
|---------|-------------|
| Native OT network sensor | Hardware dependency — kills solo build speed |
| Direct PLC/SCADA write access | Safety/regulatory barrier — Year 2 minimum |
| SIEM/SOAR full integration | Enterprise sales cycle — not MVP |
| Mobile native app | PWA is sufficient for demo |
| AI model fine-tuning | Need 10K+ incidents first |
| Multi-language (beyond Korean) | After product-market fit |
| Threat intelligence feed integration | Adds complexity, not validated need |
| Digital twin simulation | Expensive compute, need facility data |

---

## Decision Log

| Date | Decision | Reason |
|------|----------|--------|
| Mar 2026 | Gemini 2.0 Flash as AI engine | Free tier, no infrastructure cost for demo |
| Mar 2026 | Firebase as full stack | Non-technical founder — Firebase Studio enables solo build |
| Mar 2026 | COPILOT default, AUTOPILOT opt-in | Safety-first, enterprise trust building |
| Mar 2026 | Energy sector first | NextEra relationship, $2.3M/hr pain signal |
| Mar 2026 | OT Incident Analyst as wedge | Fastest MVP, clearest pain, demo-ready in 7 days |
| Mar 2026 | No hardware/sensors in scope | Keeps MVP buildable by a solo non-technical founder |

---

*References: PRD.md, plan.md, architecture.md*
