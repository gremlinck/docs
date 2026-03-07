# PRD.md — Varo AI Product Requirements Document
**Version:** 1.0 | **Status:** Draft | **Owner:** Hi Kim, CEO

---

## Product Vision

Varo AI is the first **Cyber-Physical Consequence Intelligence** platform for OT/ICS environments. Where Dragos, Nozomi, and Claroty detect and alert, Varo AI interprets, explains, simulates, and guides response — in industrial language, in real time.

**One sentence:** Varo AI tells operators not just what happened, but what it means for their process and exactly what to do next.

---

## Problem

OT security alerts require industrial protocol expertise to interpret. That expertise does not exist at scale. Investigation of a single alert takes 2–6 hours. In energy and manufacturing, every hour of unplanned downtime costs $2–5M.

---

## Users

| User | Role | Primary Need |
|------|------|-------------|
| **Primary** | OT Security Analyst | Triage alerts fast without calling a control engineer |
| **Secondary** | Control / SCADA Engineer | Understand cyber events in process terms |
| **Tertiary** | CISO / Executive | Risk score and board-ready summary |

---

## MVP Modules

### Module 1 — OT Incident Analyst (P0 — Demo)
- Input: paste alert text, upload file, or fill form
- Output: 12-field incident report in 90 seconds
- Modes: COPILOT (approve each step) / AUTOPILOT (execute pre-approved)

### Module 2 — OT Engineer Copilot (P0 — Demo)
- Conversational interface within incident view
- Answers questions in operational language, not IT security jargon
- Context-aware: loaded with active incident data

### Module 3 — Resilience Simulator (P1 — Week 2)
- Input: plain language facility description or asset CSV
- Output: cascade failure map, recovery time, resilience score 0–100
- 5 pre-built scenario templates

### Module 4 — Risk Score Dashboard (P1 — Week 2)
- Overall resilience score (static for demo, live Month 2)
- Incident history list
- Executive one-pager generator

---

## Operating Modes

| | COPILOT | AUTOPILOT |
|--|---------|-----------|
| **Control** | Human approves every action | Pre-approved playbooks execute automatically |
| **Default** | Yes — all new users | No — must be explicitly enabled |
| **Physical impact alerts** | Always | Never — hardcoded override |
| **Audit** | Recommendations logged | Actions logged |

---

## Alert Ingestion Methods

| Method | Priority | Description |
|--------|----------|-------------|
| Paste / free text | P0 | Paste raw alert into text area |
| File upload | P1 | CSV/JSON from Dragos, Nozomi, Claroty |
| Structured form | P1 | Manual entry with dropdown fields |
| API / webhook | P2 | Live connection to existing OT tools |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Next.js) + Tailwind CSS |
| AI Engine | Gemini 2.0 Flash (swap to Claude at Month 3) |
| Auth | Firebase Auth — Google SSO |
| Database | Firebase Firestore |
| Hosting | Firebase Hosting — varoai.app |
| Storage | Firebase Storage |

---

## Success Metrics

**Demo (Lighthouse — April 2026)**
- Incident report in <90 seconds live on stage
- NextEra investor sees working demo
- 3+ investor conversations initiated

**Pilot (30 days post-demo)**
- 1 design partner running real alerts through the system
- Mean investigation time reduced ≥50%
- Analyst NPS ≥7/10

**Commercial (Month 6)**
- 3 paying pilots at $2,500–$5,000/month
- 1 enterprise conversation at $50K+ ACV

---

## Out of Scope (MVP)

- Native OT network sensor or traffic capture
- Direct PLC/SCADA write access
- Full SIEM/SOAR integration suite
- Mobile native app (PWA only)
- Billing and subscription management
- Multi-tenant enterprise accounts

---

*References: architecture.md, system_prompt.md, UX_FLOW.md*
