// NERC CIP standards summary for OT incident response context
// Source: NERC CIP-002 through CIP-013
export const NERC_CIP_KNOWLEDGE = `NERC CIP STANDARDS — INCIDENT RELEVANCE:
When referencing, cite the standard and requirement number (e.g., "NERC CIP-008-6 R1").
Non-compliance penalties: up to $1,291,894 per violation per day.

CIP-002 — BES Cyber System Categorization
  Identify and categorize BES Cyber Systems as High, Medium, or Low impact.
  Relevant when: determining reporting obligations after an incident.

CIP-005 — Electronic Security Perimeters
  Define and protect Electronic Security Perimeters (ESP) around BES Cyber Systems.
  Relevant when: unauthorized access crosses network boundaries into OT zone.

CIP-007 — System Security Management
  Patch management, port/service control, security event monitoring.
  R4: Log security events. R5: System access controls (failed login management).
  Relevant when: HMI brute force, unauthorized access, anomalous login patterns.

CIP-008 — Incident Reporting and Response Planning
  R1: Incident response plan must address Cyber Security Incidents.
  R4: Report Reportable Cyber Security Incidents to E-ISAC and CISA within 1 hour of
      determining a Reportable incident occurred.
  R5: Preserve evidence of the incident.
  Relevant when: ANY incident affecting BES Cyber Systems — triggers reporting clock.

CIP-010 — Configuration Change Management
  Baseline configurations, unauthorized change detection, transient device management.
  Relevant when: unauthorized Modbus writes, PLC program changes detected.

CIP-013 — Supply Chain Risk Management
  Vendor risk assessments, software integrity verification, remote access controls.
  Relevant when: incident originates from vendor/contractor access or supply chain.`;
