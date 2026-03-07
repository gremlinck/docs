# THREAT_DATASET.md — OT Threat Scenarios & Reference Dataset
**Version:** 1.0 | **Owner:** Hi Kim, CEO

---

## Purpose

This file contains the reference threat scenarios, protocol anomaly patterns, and expected AI outputs used to test and validate the Varo AI Analyst. All scenarios are synthetic — no real incident data is included.

Use this file to: test the AI, train the prompt, validate outputs, and expand the demo library.

---

## Scenario Library — Energy Sector

### E-01: Modbus Speed Setpoint Manipulation (Demo Scenario 1)
```yaml
id: E-01
industry: Energy / Power Generation
protocol: Modbus TCP
attack_type: Setpoint Manipulation
mitre_id: T0831
mitre_technique: Manipulation of Control
severity: 9 (Critical)

raw_alert: |
  Modbus Function Code 06 (Write Single Register) detected on PLC-07 
  at 02:14 AM from source IP 192.168.10.44. IP outside approved 
  engineering workstation range. Register 40011 (motor speed setpoint). 
  Value written: 3400 RPM. Previous value: 1200 RPM. 
  Outside maintenance window. No work order found.

expected_output:
  alertSummary: "Unauthorised Modbus write changed motor speed setpoint to 3x safe limit at 2AM"
  operationalImpact: "Cooling pump bearing overheats within 8-12 minutes at 3400 RPM. Line 3 emergency shutdown likely."
  financialExposure: "$1.8M–$4.2M (45–110 minute recovery, $2.3M/hr baseline)"
  severityScore: 9
  responseStep1: "Isolate PLC-07 from engineering workstation VLAN immediately"
```

### E-02: OPC-UA Historian Bulk Read (Demo Scenario 2)
```yaml
id: E-02
industry: Energy / Power Generation
protocol: OPC-UA
attack_type: Data Exfiltration / Reconnaissance
mitre_id: T0882
mitre_technique: Theft of Operational Information
severity: 7 (High)

raw_alert: |
  OPC-UA bulk read from WS-22 to Historian HIS-01. 
  847 process tags accessed in 4.2 seconds. 
  Normal rate: 12 tags/minute. WS-22 assigned to maintenance team. 
  No scheduled activity. Tags include turbine speed, pressure 
  setpoints, valve positions, flow rates — Units 1-4.

expected_output:
  alertSummary: "Maintenance workstation harvested 847 process tags in 4 seconds — 70x normal rate"
  operationalImpact: "Process data for all 4 units exfiltrated. Attacker now has complete operational map. Targeted physical attack likely to follow."
  severityScore: 7
  confidenceLevel: High
```

### E-03: HMI Turbine Control Brute Force (Demo Scenario 3)
```yaml
id: E-03
industry: Energy / Power Generation
protocol: Application Layer (HMI)
attack_type: Brute Force / Credential Access
mitre_id: T0806
mitre_technique: Brute Force I/O
severity: 9 (Critical)

raw_alert: |
  14 failed login attempts on HMI-03 (Turbine Control) 
  from 03:00–03:08 AM. Source IP 10.0.5.91 — not in asset inventory. 
  HMI-03 controls Unit 2 steam turbine governor and emergency trip. 
  Different username formats used — credential enumeration pattern.

expected_output:
  alertSummary: "14 brute force attempts on turbine control HMI from unknown IP at 3AM"
  operationalImpact: "If successful, attacker gains turbine governor control. Speed manipulation or false emergency trip possible. Unit 2 at risk."
  severityScore: 9
  responseStep1: "Block IP 10.0.5.91 at OT network firewall immediately"
```

### E-04: DNP3 Unauthorised Direct Operate
```yaml
id: E-04
industry: Electric Utility / Substation
protocol: DNP3
attack_type: Manipulation of Control
mitre_id: T0831
mitre_technique: Manipulation of Control
severity: 10 (Critical)

raw_alert: |
  DNP3 Direct Operate command received at RTU-12 from master IP 
  172.16.5.88. Expected master IP: 10.0.1.5. Command targets 
  breaker CB-7 at Substation Alpha. Timestamp: 14:32 weekday.
  No switching order exists for this breaker today.

expected_output:
  alertSummary: "Unauthorised DNP3 command targets substation breaker from spoofed master IP"
  operationalImpact: "If executed, CB-7 opens or closes unexpectedly. Possible outage affecting downstream distribution circuits. Arc flash risk if personnel near breaker."
  severityScore: 10
  responseStep1: "[SAFETY CHECK REQUIRED] Do not allow command to execute. Block IP 172.16.5.88 at substation firewall immediately."
```

### E-05: IEC 61850 GOOSE Message Injection
```yaml
id: E-05
industry: Electric Utility
protocol: IEC 61850 GOOSE
attack_type: False Data Injection
mitre_id: T0831
mitre_technique: Manipulation of Control
severity: 10 (Critical)

raw_alert: |
  IEC 61850 GOOSE message detected from MAC 00:1A:2B:3C:4D:5F — 
  not in approved publisher list. Message type: Trip command. 
  Target: Protection relay PR-03 (Generator Step-Up Transformer). 
  Sequence number anomaly detected — potential replay attack.

expected_output:
  alertSummary: "Fake GOOSE trip command targeting generator protection relay from unknown source"
  operationalImpact: "False trip command could cause generator GSU transformer to trip offline. Reconnection takes 2-4 hours. Possible grid stability impact."
  severityScore: 10
```

---

## Scenario Library — Manufacturing Sector

### M-01: Profinet PLC Firmware Modification
```yaml
id: M-01
industry: Discrete Manufacturing
protocol: Profinet
attack_type: Modify Controller Tasking
mitre_id: T0821
mitre_technique: Modify Controller Tasking
severity: 8 (High)

raw_alert: |
  Profinet connection from engineering workstation EWS-03 to PLC 
  controller CTRL-14 on Assembly Line 7. New firmware block uploaded 
  at 22:47. No change management ticket found. EWS-03 user last 
  authenticated at 17:30 — 5+ hours before this event.

expected_output:
  alertSummary: "PLC firmware modified at 11PM from an EWS with stale session — no change ticket exists"
  operationalImpact: "Assembly Line 7 PLC running unknown firmware. Robot arm behaviour, quality control parameters, and safety interlocks may have been altered."
  severityScore: 8
  responseStep1: "Stop Assembly Line 7 immediately — do not operate with unverified PLC firmware"
```

### M-02: EtherNet/IP Quality Parameter Manipulation
```yaml
id: M-02
industry: Process Manufacturing / Pharma
protocol: EtherNet/IP
attack_type: Manipulation of Control
mitre_id: T0831
mitre_technique: Manipulation of Control
severity: 7 (High)

raw_alert: |
  EtherNet/IP explicit messaging: Write Tag command to 
  Mixing_Controller_02. Tag: BatchTemp_Setpoint. 
  Value changed from 72.0°C to 58.5°C. Source: unknown IP 
  10.5.8.201. Not in engineering workstation range.

expected_output:
  alertSummary: "Batch temperature setpoint lowered by 18.5°C from unauthorised source"
  operationalImpact: "Reduced batch temperature will fail to achieve required sterilisation in pharmaceutical process. Current batch contamination risk. Regulatory reporting may be required."
  severityScore: 7
```

---

## Scenario Library — Water / Utilities

### W-01: SCADA Chemical Dosing Manipulation
```yaml
id: W-01
industry: Water Treatment
protocol: Modbus
attack_type: Manipulation of Control
mitre_id: T0831
mitre_technique: Manipulation of Control
severity: 10 (Critical)

raw_alert: |
  Modbus write to chlorine dosing pump controller CP-04. 
  Register 300 (dosing rate) changed from 2.4 mg/L to 12.0 mg/L. 
  Source: IP 192.168.50.100 — SCADA workstation. 
  SCADA operator not on shift. Night shift supervisor not notified.

expected_output:
  alertSummary: "Chlorine dosing rate increased 5x by SCADA workstation with no operator present"
  operationalImpact: "[SAFETY CHECK REQUIRED] Chlorine level 5x safe limit is dangerous to human health. Halt dosing immediately. Notify water authority. Do not distribute treated water until tested."
  severityScore: 10
  confidenceLevel: High
```

---

## MITRE ATT&CK for ICS Reference

| ID | Technique | Common in Demo? |
|----|-----------|----------------|
| T0806 | Brute Force I/O | Demo Scenario 3 |
| T0807 | Command and Scripting Interpreter | |
| T0810 | Data from Information Repositories | |
| T0821 | Modify Controller Tasking | M-01 |
| T0826 | Loss of Availability | |
| T0828 | Loss of Productivity and Revenue | All scenarios |
| T0829 | Loss of View | |
| T0830 | Manipulation of View | |
| T0831 | Manipulation of Control | Demo Scenarios 1, 3 |
| T0836 | Modify Parameter | |
| T0843 | Program Download | |
| T0866 | Exploitation of Remote Services | |
| T0878 | Alarm Suppression | |
| T0879 | Damage to Property | |
| T0880 | Loss of Safety | |
| T0882 | Theft of Operational Information | Demo Scenario 2 |

---

## Test Cases for QA

Run these after every code change to verify the AI output quality:

```
Test 1: E-01 → Severity must be 8–10, responseStep1 must mention isolation
Test 2: E-02 → Severity must be 6–8, must mention data exfiltration
Test 3: E-03 → Severity must be 8–10, must mention turbine/governor
Test 4: W-01 → Must include [SAFETY CHECK REQUIRED] in responseSteps
Test 5: Any scenario → financialExposure must be a range (contain "–")
Test 6: Any scenario → mitreId must match pattern T[0-9]{4}
Test 7: Any scenario → report must have all 12 required fields
Test 8: Unknown protocol → confidenceLevel must be Medium or Low
```

---

*References: system_prompt.md, ai_rules.md, threat_translation_prompt.md*
