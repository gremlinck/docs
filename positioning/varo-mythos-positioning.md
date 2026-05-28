# Varo AI — Positioning
**Varo Mythos v0.2 | May 2026 | Internal / Design Partners**

---

## Slide 1 — Title

**Varo AI**
*Alert-to-decision in 90 seconds for the systems that can't be patched on a Tuesday.*

---

## Slide 2 — The one-line pitch

> Varo AI is the first AI analyst purpose-built for operational technology security — translating raw ICS alerts into plain-language consequence reports with step-by-step response guidance, in under 90 seconds.

---

## Slide 3 — The Mythos analogy (investor frame)

Anthropic's Mythos collapses alert-to-exploit time for IT software.
It takes a raw vulnerability signal and chains AI reasoning to produce a working exploit path.

**Varo AI does the same thing — for defenders, on physical infrastructure.**

| | Mythos | Varo AI |
|---|---|---|
| Input | CVE / vulnerability signal | OT security alert (Modbus, DNP3, OPC-UA…) |
| Chain | Exploit path reasoning | Consequence + response reasoning |
| Output | Working exploit | Decision a control engineer can act on |
| User | Red team / attacker | OT security analyst / control engineer |
| Stakes | Data breach | Turbine damage, production outage, safety event |

---

## Slide 4 — The problem

Every energy plant, water utility, and manufacturer now runs on networked control systems.
Every one of them receives OT security alerts they cannot interpret fast enough to act on.

**The gap:**
- OT security tools generate alerts in protocol language (Modbus FC06, DNP3 unsolicited response, OPC-UA bulk read)
- The people who receive them — control engineers, OT analysts — are not trained to read IT security output
- Existing SIEMs and SOAR tools are built for IT. None of them understand what a 3,400 RPM motor speed setpoint write *means* for a turbine

**The consequence of a missed alert is not a data breach. It is:**
- A turbine running at 183% of its safe speed limit
- A pressure relief valve that doesn't trip
- A $2.3M/hour production outage — or worse, a safety event

---

## Slide 5 — Why now

Three forces converging in 2025–2026:

**1. OT/IT convergence** — Legacy air-gapped control systems are now network-connected. Attack surface exploded; defensive tooling did not keep up.

**2. AI reasoning capability** — LLMs can now reliably chain industrial protocol knowledge, MITRE ATT&CK for ICS, and consequence modelling into a single auditable output. This was not possible 18 months ago.

**3. Regulatory mandate** — NERC CIP, NIS2, and IEC 62443 are requiring documented, auditable incident response for critical infrastructure. Buyers need AI-assisted workflows with immutable audit trails.

---

## Slide 6 — The A.G.E.N.T. Loop™

Varo AI's reasoning chain — five sequential AI agents, each producing typed output that feeds the next:

```
[A] Assess    Protocol identification + anomaly classification
      ↓
[G] Generate  Attack scenario + MITRE ATT&CK for ICS technique
      ↓
[E] Evaluate  Operational impact + financial exposure range
      ↓
[N] Navigate  Ranked response steps + safety gate (hardcoded)
      ↓
[T] Translate 12-field plain-language consequence report
```

**Why a chain, not a single prompt?**
Each step is independently auditable, retryable, and safety-checkable.
The [N] Navigate safety gate is enforced at the application layer — not in the prompt — so it cannot be bypassed by prompt injection or user settings.

**Built on:** Google ADK + A2A protocol | Gemini 2.0 Flash (swap to Claude at Month 3)

---

## Slide 7 — Product demo flow

**Input:** Paste any OT alert or select a preloaded demo scenario

**Processing (< 90 seconds):**
→ [A] Identifies Modbus FC06 — Unauthorised Write
→ [G] Maps to MITRE T0831 — Manipulation of Control
→ [E] Calculates $1.4M–$4.6M exposure at $2.3M/hr energy sector rate
→ [N] Generates 3 response steps, applies safety gate (severity 9 — COPILOT locked)
→ [T] Produces 12-field report in plain language

**Output:** Structured consequence report with COPILOT APPROVE / MODIFY / SKIP on each step + Engineer Copilot chat

---

## Slide 8 — COPILOT vs AUTOPILOT

**COPILOT (default, all users):**
AI recommends. Engineer approves every response step individually.
Every action is logged to an immutable audit trail.

**AUTOPILOT (opt-in, low-risk categories only):**
Executes pre-approved playbooks automatically for defined alert types.

**Hardcoded safety override — cannot be disabled:**
Any alert flagged as physical-process-impacting, safety-system-adjacent, or severity ≥ 8 is automatically locked to COPILOT — regardless of user mode, API flags, or prompt instructions.

This is enforced at the **application layer** (`forcesCopilot()`), not in the prompt.

---

## Slide 9 — Traction and target

**First target:** Energy sector OT security teams at utilities with 50–500 employees in the security function.
They have budget, regulatory mandates, and the most to lose.

**Demo scenarios (all produce verifiable reports):**
- Modbus FC06 unauthorised write — turbine motor speed at 183% safe limit
- OPC-UA bulk historian read — 847 tags in 4.2 seconds (baseline: 12/min) → attacker reconnaissance
- HMI brute force on turbine governor — 14 attempts, credential enumeration pattern

**Design partners:** NextEra Energy (in conversation), Lighthouse Virginia portfolio.

---

## Slide 10 — Business model

| | Detail |
|---|---|
| Model | SaaS, per-facility pricing |
| Phase 1 | Design partner pricing (NextEra pilot) |
| Phase 2 | $X/month per monitored facility (TBD with first partner) |
| Enterprise | On-premise deployment — Phase 4 |
| Competitive moat | OT domain knowledge baked into the A.G.E.N.T. Loop™ prompts; MITRE ATT&CK for ICS validation; immutable audit trail for NERC CIP evidence |

---

## Slide 11 — Roadmap

| Phase | Timeline | Key deliverables |
|---|---|---|
| Phase 1 — Demo | Complete | Alert input → AI report → COPILOT workflow → Engineer Copilot chat |
| Phase 2 — Alpha | Month 1–2 | Firebase Auth, Firestore persistence, ADK multi-agent chain, file upload |
| Phase 3 — Beta | Month 3 | Claude swap, live Dragos/Nozomi API, PDF export, NERC CIP compliance report |
| Phase 4 — v1.0 | Month 4–6 | Enterprise on-premise, multi-tenant, full AUTOPILOT playbook library |

**AI engine swap:** Gemini → Claude is a single-function change in `lib/ai.ts`. The A.G.E.N.T. Loop™ is provider-agnostic.

---

## Slide 12 — For CISOs: data handling

| Question | Answer |
|---|---|
| Where is data stored? | Google Cloud Firebase, US Central by default. Any GCP region on request. |
| Is OT alert data used to train AI? | No. Never, without explicit written consent. |
| Who at Varo AI sees our alerts? | No one. Break-glass procedure requires two-person auth + immediate customer notification. |
| What if we cancel? | All data deleted within 30 days. Full export on request. |
| NERC CIP compliance? | Supports CIP-007, CIP-008, CIP-010. Immutable audit log is direct CIP evidence. |
| SOC 2? | Year 2 roadmap. |

---

## Slide 13 — What Varo AI is not

- Not a Dragos / Nozomi / Claroty replacement — it is an intelligence layer *on top of* them
- Not a SIEM or SOAR — no raw traffic ingestion, no network-layer automated remediation
- Not a compliance tool — supports your programme, does not replace it
- Not able to access PLCs, HMIs, or OT assets directly — read-only consequence intelligence

---

## Naming note

"Varo Mythos" is the internal working title for this development phase — it signals the lineage to Anthropic's April 2026 Mythos announcement and frames the investor narrative.

**Do not use "Mythos" publicly.**

External names:
- Product: **Varo AI**
- Framework: **A.G.E.N.T. Loop™**
- Narrative hook (in conversation only): "We're doing for OT defenders what Mythos does for attackers."

---

*Owner: Hi Kim, CEO — Varo AI | Internal / Design Partners only*
