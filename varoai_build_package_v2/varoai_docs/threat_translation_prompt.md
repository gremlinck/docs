# threat_translation_prompt.md — OT Threat Language Translation
**Version:** 1.0 | **Owner:** Hi Kim, CEO

---

## Purpose

This file solves the core communication gap in OT security:
**IT security language ↔ Industrial operational language.**

The Varo AI Analyst uses these translation patterns to convert cyber threat terminology into language that control engineers and plant operators understand — and to convert engineer descriptions back into security assessments.

---

## Translation Layer 1 — Protocol Anomaly to Plain Language

When the AI detects a specific protocol event, it translates using these patterns:

### Modbus

| Raw Alert Signal | Translated Meaning |
|-----------------|-------------------|
| FC06 Write Single Register to setpoint address | "An external command attempted to change [equipment] operating speed/pressure/temperature from [safe value] to [dangerous value]" |
| FC05 Write Single Coil to output address | "A command was sent to turn [equipment] ON or OFF remotely — without operator action" |
| FC16 Write Multiple Registers | "Multiple control parameters on [asset] were changed simultaneously — consistent with attacker configuring equipment for abnormal operation" |
| FC01/02 Read Coil/Discrete Input at high rate | "Someone is silently monitoring the ON/OFF state of your equipment — mapping your process before acting" |
| Unsolicited response from non-master | "A device that should only receive commands is now sending them — it may have been compromised and is now issuing orders" |

### DNP3

| Raw Alert Signal | Translated Meaning |
|-----------------|-------------------|
| Direct Operate command from unauthorised source | "A remote open/close command was sent to [equipment] — breakers, valves, or switches could be affected" |
| Unsolicited response flood | "Your field devices are being overwhelmed with false responses — operators may lose accurate visibility of real-time status" |
| Authentication failure on DNP3 Secure Auth | "Someone is attempting to bypass the authentication protecting commands to your grid equipment" |
| Data link layer reset | "Communications with [field device] were forcibly reset — this can be used to cause a momentary loss of control" |

### IEC 61850

| Raw Alert Signal | Translated Meaning |
|-----------------|-------------------|
| GOOSE message injection | "Fake protective relay messages are being sent — could cause breakers to trip or fail to trip when needed" |
| MMS write to control block | "An unauthorised command reached a substation control system — protective equipment settings may have been altered" |
| Sampled values manipulation | "The measurements your protection relays rely on to make tripping decisions may have been falsified" |

### OPC-UA

| Raw Alert Signal | Translated Meaning |
|-----------------|-------------------|
| Bulk node read — high rate | "Large amounts of process data are being harvested — an attacker is mapping your entire operation before striking" |
| Write to method node | "A command was executed on [system] without operator involvement — equivalent to an operator taking action without being present" |
| Session anomaly — unusual client | "An unrecognised system is communicating with your process historian or data server" |

---

## Translation Layer 2 — Attack Scenario to Operational Impact

Use these templates to translate attack patterns into consequence language:

### Template: Setpoint Manipulation
```
ATTACK: Attacker modifies [parameter] setpoint on [asset] from [safe value] to [dangerous value].

OPERATIONAL IMPACT: [Equipment name] will operate at [X]% above/below safe parameters. 
At this level, [specific consequence — bearing failure / pressure buildup / temperature 
exceedance / flow starvation] occurs within [timeframe]. This affects [downstream process] 
and will cause [production line / safety system / dependent equipment] to [specific outcome].

RECOVERY: [Manual reset / parts replacement / full restart] required. 
Estimated time: [X hours]. Estimated cost: [range].
```

### Template: Visibility Loss (HMI/Historian attack)
```
ATTACK: Operators lose visibility of [system/area] via [HMI compromise / historian 
corruption / display manipulation].

OPERATIONAL IMPACT: Operators cannot see [specific readings — pressures, temperatures, 
flow rates, valve positions] for [affected area]. Without this visibility, operators 
cannot detect [specific dangerous condition] developing. Normal response to [alarm type] 
requires operator action within [X minutes] — this is now impossible without manual 
field inspection.

RECOVERY: Deploy field operators to manually verify all readings. Estimated time 
to restore visibility: [X hours]. Risk during blind period: [specific scenarios].
```

### Template: Authentication Attack (Brute Force / Credential Theft)
```
ATTACK: Attacker gains [or is attempting to gain] access to [HMI / Engineering 
Workstation / Historian / Control Server] using [stolen / brute-forced] credentials.

OPERATIONAL IMPACT: With access to [system], an attacker can [specific actions: 
modify setpoints / download process data / push new PLC programs / disable alarms / 
trip breakers]. The most dangerous action from this access point is [highest impact 
action] which would cause [specific consequence] within [timeframe].

RECOVERY: Change all credentials on [affected system and connected systems]. 
Audit all changes made in the past [X hours]. Verify all setpoints and program 
versions against known-good baseline.
```

### Template: Network Reconnaissance (Pre-attack stage)
```
ATTACK: Attacker is mapping your OT network — identifying assets, protocols, 
and communication patterns — before launching an operational attack.

OPERATIONAL IMPACT: This stage itself causes no direct operational impact. 
However, it indicates an attacker has access to your OT network and is 
preparing a targeted operational attack. Based on the data being collected 
([specific data types]), the most likely targets are [assets] and the most 
likely attack type is [manipulation / ransomware / physical impact].

TIME TO ACT: Reconnaissance typically precedes an operational attack by 
[hours to weeks]. Treat this as an active incident requiring immediate 
network isolation investigation.
```

---

## Translation Layer 3 — Engineer Description to Security Assessment

When a control engineer describes a problem in operational terms, translate to security assessment:

```
SYSTEM PROMPT ADDITION FOR COPILOT MODE:

When an engineer describes operational anomalies in process terms, 
translate their description into a security assessment:

Engineer says: "The pump is running faster than I set it"
→ Assess: Possible Modbus register write to speed setpoint. 
   Check: last write to relevant register, source IP, timestamp.

Engineer says: "My HMI is showing readings that don't match the field"
→ Assess: Possible display manipulation, historian attack, or 
   MMS write to display values. Check: historian data vs. field readings.

Engineer says: "We got an unexpected trip and no one touched anything"
→ Assess: Possible GOOSE injection (IEC 61850), DNP3 Direct Operate, 
   or coil write (Modbus FC05). Check: protection relay logs, DNP3 master.

Engineer says: "The PLC program looks different from what I uploaded"
→ Assess: Engineering workstation compromise or direct PLC access. 
   HIGH SEVERITY. Isolate immediately. Do not restart.
```

---

## Translation Layer 4 — Severity to Business Language

```
Severity 9–10 (Critical):
→ "This requires immediate action. If unaddressed in the next 
   [X minutes], [specific physical/financial consequence]. 
   Stop what you're doing and act now."

Severity 7–8 (High):
→ "This requires action within the next [X minutes/hours]. 
   [Specific consequence] is likely if not addressed today. 
   Alert your supervisor and OT security team now."

Severity 5–6 (Medium):
→ "This requires investigation within [X hours]. 
   No immediate operational risk, but this pattern suggests 
   [attacker activity / system misconfiguration] that should 
   be understood before it escalates."

Severity 3–4 (Low):
→ "This is worth noting and logging. No immediate risk. 
   Review during your next security check-in and verify 
   this is expected behaviour for [asset]."

Severity 1–2 (Informational):
→ "Log this for trend analysis. No action required today. 
   If you see this pattern repeat [X] times, escalate."
```

---

*References: system_prompt.md, THREAT_DATASET.md, ai_rules.md*
