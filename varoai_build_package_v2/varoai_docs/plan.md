# plan.md — Varo AI Build Plan
**Version:** 1.0 | **Owner:** Hi Kim, CEO

---

## Context

Solo founder. Non-technical. Building with Firebase Studio + AI-assisted development. Target: working demo for NextEra investor and Lighthouse Virginia pitch (April 2026).

**The rule:** Build only what the demo needs. Everything else is documented but not built yet.

---

## Phase 0 — Before You Build Anything (Day 1–3)

- [ ] Create Firebase project: `varoai-app` at console.firebase.google.com
- [ ] Enable Google Authentication provider
- [ ] Create Firestore database (test mode, region: nam5)
- [ ] Register web app → copy firebaseConfig
- [ ] Get Gemini API key from aistudio.google.com
- [ ] Set up environment variables (never commit to Git)
- [ ] Create GitHub repo: `varoai-mvp`

---

## Phase 1 — Demo Build (Day 4–10)

**Goal:** One working screen. Alert goes in. Report comes out. 90 seconds.

### Day 4 — Design the output first
- [ ] Sketch the incident report layout on paper
- [ ] Define: what does the report look like at demo size on a 15" screen?
- [ ] Reference: UI_DESIGN.md for exact visual spec

### Day 5–6 — Build the alert input screen
- [ ] Text area for alert paste (Module 1, P0)
- [ ] Facility type dropdown (Energy / Manufacturing / Water / Oil & Gas)
- [ ] Mode toggle: COPILOT / AUTOPILOT (default COPILOT)
- [ ] Submit button → calls Gemini API with system_prompt.md prompt

### Day 7–8 — Build the incident report display
- [ ] Parse JSON response from Gemini
- [ ] Display all 12 fields in clean layout (reference UI_DESIGN.md)
- [ ] COPILOT: show [APPROVE] / [MODIFY] / [SKIP] on each response step
- [ ] Severity score with colour band (Critical=red, High=orange, Medium=yellow, Low=green)

### Day 9 — Build the Engineer Copilot chat
- [ ] Chat interface below or beside the incident report
- [ ] Pre-load incident context into conversation
- [ ] Send messages to Gemini with copilot system prompt
- [ ] Display responses in conversational format

### Day 10 — Test all three demo scenarios
- [ ] Run Demo Scenario 1 (Modbus) — verify output
- [ ] Run Demo Scenario 2 (Historian) — verify output
- [ ] Run Demo Scenario 3 (HMI Brute Force) — verify output
- [ ] Complete testing checklist from system_prompt.md Part 9
- [ ] Deploy to Firebase Hosting: varoai.app

---

## Phase 2 — Alpha Build (Day 11–30)

**Goal:** Real product. Real data. Ready for pilot.

### Week 2 (Day 11–17)
- [ ] File upload ingestion (CSV/JSON from Dragos/Nozomi)
- [ ] Structured form input
- [ ] Firestore persistence (save all incidents)
- [ ] Firebase Auth — Google login
- [ ] User profile with mode preference

### Week 3 (Day 18–24)
- [ ] Resilience Simulator — 5 scenario templates
- [ ] Risk Score Dashboard — static score + incident history
- [ ] AUTOPILOT mode with audit logging
- [ ] Email/push notification on high-severity alerts

### Week 4 (Day 25–30)
- [ ] Executive one-pager generator
- [ ] Demo refinement based on NextEra feedback
- [ ] Performance optimisation (hit 90s SLA consistently)
- [ ] Prepare for pilot deployment

---

## Phase 3 — Beta (Month 2–3)

- Live Dragos/Nozomi API connection
- Live resilience score from real incident data
- PDF export for reports
- Korean language support
- Compliance posture mapping (NERC CIP, IEC 62443)

---

## Phase 4 — v1.0 (Month 4–6)

- Billing and subscription management
- Multi-user organisation accounts
- Full AUTOPILOT playbook library
- Enterprise on-premise deployment option
- SLA monitoring and uptime dashboard

---

## Firebase Studio Instructions

When using Firebase Studio to build this product, paste this instruction:

```
Build a React web application called Varo AI using Next.js and Tailwind CSS.

Use Firebase for authentication (Google SSO), Firestore for data storage, 
and Firebase Hosting for deployment.

The app has four modules: OT Incident Analyst, Engineer Copilot, 
Resilience Simulator, and Risk Score Dashboard.

The AI engine is Google Gemini 2.0 Flash. All AI calls return JSON.

Start with Module 1 only: a text area where a user pastes an OT security 
alert, clicks Analyse, and receives a structured incident report with 
12 fields within 90 seconds.

Reference PRD.md for requirements, UI_DESIGN.md for visual design, 
system_prompt.md for the AI prompts, and architecture.md for the 
data schema.
```

---

## Daily Check-In Questions

Ask yourself these every day during the build:

1. Is what I'm building today part of the Phase 1 demo?
2. Will this be visible in the 5-minute Lighthouse demo?
3. Am I building a feature or fixing a working thing?

If the answer to #1 and #2 is no — stop and come back to Phase 1.

---

*References: PRD.md, architecture.md, UI_DESIGN.md, UX_FLOW.md*
