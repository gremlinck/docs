# Varo AI — Phase 1 Prototype

Working demo with synthetic OT alert chaining.

## What it does

Paste any OT security alert → Gemini 2.0 Flash analyses it → 12-field structured consequence report appears in under 90 seconds → COPILOT workflow lets the engineer approve, modify, or skip each response step → Engineer Copilot chat answers follow-up questions in operational language.

## Quick start

```bash
# From repo root
cp .env.local.example .env.local
# Add GEMINI_API_KEY= from aistudio.google.com

npm install
npm run dev
# Open http://localhost:3000
```

The app redirects to `/incidents/new`. Three demo scenarios load with one click.

## Demo scenarios (synthetic OT alert chain)

These three scenarios form a simulated multi-stage intrusion chain against an energy facility:

### Stage 1 — Initial reconnaissance (Historian exfiltration)
```
OPC-UA bulk read request from workstation WS-22 to Historian server HIS-01.
Request accessed 847 process tags in 4.2 seconds. Normal baseline read rate:
12 tags per minute. WS-22 is assigned to the maintenance team — no scheduled
activity today. Tags accessed include turbine speed, pressure setpoints, valve
positions, and flow rates across Units 1-4.
```
*What this represents:* Attacker has workstation access and is mapping the process before targeting a specific asset.

### Stage 2 — Credential attack on the target (HMI brute force)
```
14 consecutive failed login attempts on HMI-03 (Turbine Control Interface)
between 03:00–03:08 AM. Source IP: 10.0.5.91 — not in asset inventory.
HMI-03 controls the Unit 2 steam turbine governor including speed setpoint
and emergency trip functions. All attempts used different username formats
suggesting credential enumeration.
```
*What this represents:* Attacker used the process tag map from Stage 1 to identify the highest-impact target (turbine governor HMI) and is now attempting to gain control.

### Stage 3 — Control manipulation (Modbus write)
```
Modbus Function Code 06 (Write Single Register) detected on PLC-07 at 02:14 AM
from source IP 192.168.10.44. This IP is outside the approved engineering
workstation range. Target register address: 40011 (motor speed setpoint).
Value written: 3400 RPM. Previous safe operating value: 1200 RPM. Activity
occurred outside scheduled maintenance window. No work order found.
```
*What this represents:* Attacker has control and has written a dangerous speed setpoint — 183% above the safe operating limit. Physical damage is imminent without immediate response.

---

Run all three in sequence to demonstrate the chaining narrative in a live demo.

## File map

```
app/
├── page.tsx                    → redirects to /incidents/new
├── incidents/
│   ├── new/page.tsx            → alert input, mode toggle, demo scenarios
│   └── [id]/page.tsx           → report display + copilot chat
├── dashboard/page.tsx          → resilience score + incident history
└── api/varo/
    ├── analyze/route.ts        → calls Gemini, validates report
    └── copilot/route.ts        → Engineer Copilot responses

lib/
├── ai.ts                       → callVaroAnalyst() — single AI swap point
├── security.ts                 → sanitiseAlert, validateReport, forcesCopilot
└── storage.ts                  → localStorage persistence for demo

components/
├── CopilotChat.tsx
├── ResponseStep.tsx            → APPROVE / MODIFY / SKIP workflow
├── SeverityBadge.tsx
├── ModeToggle.tsx
├── NavBar.tsx
└── LoadingBar.tsx

types/varo.ts                   → IncidentReport, StoredIncident, StepStatus
```

## What is and isn't wired up

| Feature | Status |
|---|---|
| Alert input → Gemini analysis → report | ✅ Working |
| COPILOT APPROVE / MODIFY / SKIP | ✅ Working |
| Engineer Copilot chat | ✅ Working |
| Safety override (forcesCopilot) | ✅ Working |
| MITRE ID validation | ✅ Working |
| Severity colour coding | ✅ Working |
| Demo scenarios (3 preloaded) | ✅ Working |
| LocalStorage incident history | ✅ Working |
| Firebase Auth (Google SSO) | 🔜 Phase 2 |
| Firestore persistence | 🔜 Phase 2 |
| File upload (Dragos / Nozomi CSV) | 🔜 Phase 2 |
| Resilience Simulator | 🔜 Phase 2 |
| Executive Summary generator | 🔜 Phase 2 |
| ADK / A2A multi-agent chain | 🔜 Phase 2 |
