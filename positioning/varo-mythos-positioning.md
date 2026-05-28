# Varo AI — Dual-Audience Positioning
**Internal working title: Varo Mythos**
**Version:** 0.1 | **Date:** May 2026 | **Classification:** Internal / Design Partners

---

## For investors

### The one-line pitch

Varo AI is the first AI analyst purpose-built for operational technology security — translating raw industrial control system alerts into plain-language consequence reports, with step-by-step response guidance, in under 90 seconds.

### The market gap

Every energy plant, water utility, and manufacturer now runs on networked control systems. Every one of them receives OT security alerts they cannot interpret fast enough to act on.

The people who receive these alerts — OT security analysts, control engineers — are not IT security professionals. They speak in RPM setpoints and valve positions, not CVEs and MITRE techniques. Every existing security tool is built for IT. None of them speak OT.

The consequence of a missed OT alert is not a data breach. It is a turbine running at 3,400 RPM when the safe limit is 1,200. It is a pressure relief valve that doesn't trip. It is a $2.3M-per-hour production outage — or worse.

### The Mythos analogy

Anthropic's Mythos collapses alert-to-exploit time for IT software: it takes a raw vulnerability signal and chains reasoning to produce a working exploit path.

Varo AI does the same thing for operational technology — but the output is not an exploit. It is a decision. A consequence report. A ranked list of response steps that a control engineer can act on without calling the IT security team.

**Mythos is for attackers. Varo AI is for defenders who protect physical infrastructure.**

### Why now

Three forces converging in 2025–2026:

1. **OT/IT convergence** — Legacy air-gapped control systems are now network-connected. The attack surface exploded; the defensive tooling did not keep up.
2. **AI reasoning capability** — LLMs can now reliably chain industrial protocol knowledge, MITRE ATT&CK for ICS, and consequence modelling into a single output. This was not possible 18 months ago.
3. **Regulatory pressure** — NERC CIP, NIS2, and IEC 62443 are mandating documented incident response for critical infrastructure. Buyers need auditable AI-assisted workflows, not human-only processes that don't scale.

### Traction and target

**First target:** Energy sector OT security teams at utilities with 50–500 employees in the security function. They have budget, regulatory mandates, and the most to lose.

**Design partners:** NextEra Energy (pending), Lighthouse Virginia portfolio companies.

**Demo scenario:** Modbus Function Code 06 anomaly on a turbine PLC — report generated in 47 seconds, MITRE technique correctly identified (T0831 — Manipulation of Control), financial exposure calculated at $1.4M–$4.6M, three response steps produced with COPILOT approval workflow.

### Business model

SaaS, per-facility pricing. $X/month per monitored facility (pricing TBD with first design partner). Enterprise on-premise deployment at Month 4+.

---

## For CISOs and security buyers

### What Varo AI does

Varo AI is an AI-powered incident intelligence layer for OT/ICS environments. It sits between your existing OT monitoring tools (Dragos, Nozomi, Claroty) and your security operations team.

**Input:** Raw alert text, CSV/JSON export from your OT monitoring tool, or a structured form.

**Output:** A structured consequence report in under 90 seconds, containing:
- Plain-language summary of what happened and why it matters for your process
- Protocol context (what the anomaly means in Modbus / DNP3 / OPC-UA / IEC 61850 terms)
- Most likely attack scenario with verified MITRE ATT&CK for ICS technique ID
- List of affected assets
- Operational impact: which equipment, which process, what fails, and in what timeframe
- Financial exposure range
- Severity score (1–10) with confidence level and reason
- Three to five ranked response steps
- Escalation recommendation

### Operating modes

**COPILOT (default):** Every AI recommendation requires explicit analyst approval before any action is recorded. The AI cannot act autonomously. Engineers approve, modify, or skip each response step individually. All actions are logged to an immutable audit trail.

**AUTOPILOT (opt-in):** Executes pre-approved playbooks automatically for defined low-risk alert categories. **Hardcoded override:** any alert that may affect physical processes, safety systems, or assets tagged as turbine governors, emergency shutdown systems, or SIS automatically reverts to COPILOT — this cannot be overridden by user settings or API flags.

### Data handling

| Question | Answer |
|---|---|
| Where is data stored? | Google Cloud Firebase, US Central (nam5) by default. Any GCP region on request. |
| Is OT alert data used to train AI? | No. Never, without explicit written consent. |
| Who at Varo AI can see our alerts? | No one without break-glass procedure: two-person auth + immediate customer notification. |
| What happens if we cancel? | All data deleted within 30 days. Full export provided on request. |
| NERC CIP? | Supports CIP-007, CIP-008, CIP-010. Audit log is direct CIP evidence. SOC 2 Type II on Year 2 roadmap. |

### What Varo AI is not

- Not a replacement for Dragos, Nozomi, or Claroty — it is an intelligence layer on top of them.
- Not a SIEM or SOAR — it does not ingest raw network traffic or execute automated remediations at the network layer.
- Not a compliance tool — it supports your compliance programme; it does not replace it.
- Not able to access your PLCs, HMIs, or any OT assets directly.

### Security questions NextEra will ask

See [`SECURITY_PRIVACY.md`](../varoai_build_package_v2/varoai_docs/SECURITY_PRIVACY.md) Part 8 for the full Q&A, including data residency, NERC CIP alignment, and breach notification procedure.

---

*Internal use only. Do not distribute without Hi Kim's approval.*
*Owner: Hi Kim, CEO — Varo AI*
