// MITRE ATT&CK for ICS — key techniques for OT incident analysis
// Source: https://attack.mitre.org/matrices/ics/
export const MITRE_ICS_KNOWLEDGE = `MITRE ATT&CK FOR ICS — REFERENCE TECHNIQUES:
When citing, use exact IDs and names. Never fabricate IDs.

T0831 — Manipulation of Control
  Write commands to PLCs/RTUs to change setpoints, process values, or control logic.
  Example: Modbus FC06 writes to motor speed register outside safe operating range.

T0882 — Theft of Operational Information
  Bulk exfiltration of process historian data, P&IDs, asset inventories, or control logic.
  Example: OPC-UA mass tag read at anomalous rate (200+ tags/min vs 12/min baseline).

T0806 — Brute Force I/O
  Repeated login attempts against HMI, engineering workstation, or remote access gateway.
  Safety risk: lockout of operators during active process; access to safety-critical controls.

T0866 — Exploitation of Remote Services
  Abuse of legitimate remote access tools (RDP, VNC, web HMI) to reach OT assets.

T0821 — Modify Controller Tasking
  Change PLC scan cycle, add malicious ladder logic rungs, or alter function block parameters.

T0813 — Denial of Control
  Prevent operators from issuing legitimate control commands during an incident.

T0826 — Loss of Availability
  Disrupt the ability to view or control the process (HMI blackout, historian offline).

T0879 — Damage to Property
  Actions that cause physical damage to equipment (overspeed, overpressure, thermal stress).

T0880 — Loss of Safety
  Impair or defeat safety instrumented systems (SIS/SIL) or emergency shutdown systems.

T0816 — Device Restart/Shutdown
  Force PLC/RTU reboot causing process loss during restart (up to 20 min downtime typical).

T0845 — Program Upload/Download
  Upload modified PLC program to overwrite safe operating parameters.

Cite technique IDs in this format: "MITRE ATT&CK for ICS T0831 (Manipulation of Control)"`;
