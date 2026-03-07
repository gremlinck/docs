# SYSTEM_BEHAVIOR.md — Varo AI System Behaviour Specification
**Version:** 1.0 | **Owner:** Hi Kim, CEO

---

## Purpose

This file defines exactly how Varo AI behaves in every state, mode, and edge case. It is the source of truth for any developer building the product and for any QA testing.

---

## State Machine — Incident Lifecycle

```
CREATED → PROCESSING → REPORTED → INVESTIGATING → CONTAINED → CLOSED
                ↓
            ERROR (if AI fails — retry once, then save as DRAFT)
```

### State: CREATED
- Triggered when: user submits alert (any input method)
- What happens: alert saved to Firestore with status='created', AI call initiated
- What user sees: processing animation, "Varo AI Analyst is processing..."
- Timeout: if no response in 120 seconds → move to ERROR state

### State: PROCESSING
- Triggered when: AI call is in progress
- What happens: Gemini API call running with incident analyst system prompt
- What user sees: animated progress bar with protocol detection message
- Duration: target <90 seconds P95

### State: REPORTED
- Triggered when: AI returns valid JSON and report is displayed
- What happens: Firestore incident updated with full report object
- What user sees: full incident report with COPILOT action buttons
- Mode behaviour:
  - COPILOT: each responseStep shows [APPROVE] [MODIFY] [SKIP]
  - AUTOPILOT: pre-approved steps begin executing, user sees progress

### State: INVESTIGATING
- Triggered when: analyst approves first response step (COPILOT) or AUTOPILOT begins
- What happens: auditLog entries created for each action
- What user sees: steps turning green as approved, activity log below report

### State: CONTAINED
- Triggered when: all response steps completed (approved, modified, or skipped)
- What happens: incident status updated, summary generated
- What user sees: "All response steps reviewed. Mark as closed when resolved."

### State: CLOSED
- Triggered when: analyst clicks "Close Incident"
- What happens: final status saved, metrics updated, dashboard refreshed
- What user sees: incident moves to history, resolution note saved

### State: ERROR
- Triggered when: AI call fails or JSON parse fails twice
- What happens: alert saved as DRAFT with raw text preserved
- What user sees: friendly error message, "Try again" button, confirmation alert is saved

---

## Mode Behaviour Matrix

| Action | COPILOT | AUTOPILOT |
|--------|---------|-----------|
| Report generation | Same — AI analyses | Same — AI analyses |
| Response step display | "Recommended: [action]" + approval buttons | "Executing: [action]..." progress indicator |
| Step execution | Waits for analyst approval | Executes immediately if pre-approved |
| Step modification | Analyst can edit text before approving | Not available (pre-approved only) |
| Escalation notification | "Recommend notifying [X]" — analyst sends | Auto-sends to pre-configured contacts |
| Audit log | "Recommendation made" | "Action executed automatically" |
| Physical impact alert | Normal COPILOT flow | OVERRIDE: forces COPILOT + alert banner |
| Severity 9–10 alert | Normal COPILOT flow | OVERRIDE: forces COPILOT + alert banner |

---

## AUTOPILOT Override Triggers

When AUTOPILOT is active, the following conditions ALWAYS force COPILOT mode:

```javascript
const forcesCopilot = (report) => {
  return (
    report.severityScore >= 8 ||
    report.mitreTechnique?.includes('Safety') ||
    report.operationalImpact?.toLowerCase().includes('physical') ||
    report.operationalImpact?.toLowerCase().includes('equipment damage') ||
    report.operationalImpact?.toLowerCase().includes('emergency shutdown') ||
    report.operationalImpact?.toLowerCase().includes('personnel') ||
    report.affectedAssets?.some(a => 
      ['SIS', 'ESD', 'safety', 'turbine', 'governor'].some(k => 
        a.toLowerCase().includes(k)
      )
    )
  );
};
```

When override triggers, show this banner:
```
⚠ SAFETY OVERRIDE ACTIVE
This alert has been escalated to COPILOT mode.
Automated actions are not permitted for alerts 
that may affect physical processes or safety systems.
Review and approve each response step manually.
```

---

## Engineer Copilot Behaviour

### Context Loading
When an incident report is open, the Copilot automatically loads:
```javascript
const copilotContext = `
Active Incident: ${report.incidentId}
Summary: ${report.alertSummary}
Protocol: ${report.protocol}
Affected Assets: ${report.affectedAssets.join(', ')}
Severity: ${report.severityScore}/10 — ${report.severityLabel}
Operational Impact: ${report.operationalImpact}
`;
// Injected into every Copilot message as system context
```

### Conversation Limits
- Maximum conversation length: 20 messages per incident
- After 20 messages: "This conversation has reached the session limit. 
  Start a new session to continue your analysis."
- All messages saved to Firestore regardless

### Copilot Cannot Do
The Engineer Copilot must never:
- Execute actions directly (that is the Incident Analyst's job)
- Claim certainty about things it cannot know (e.g., "your specific PLC model")
- Give medical, legal, or financial advice
- Discuss topics unrelated to OT/ICS security and operations

---

## File Upload Behaviour

### Accepted Formats
```
.csv    — Dragos export, Nozomi export, custom
.json   — Any OT tool JSON export
.xlsx   — Spreadsheet alert logs
.txt    — Raw log files
```

### Parse Logic
```javascript
// For CSV files: detect format by column headers
const detectFormat = (headers) => {
  if (headers.includes('dragos_alert_id')) return 'dragos';
  if (headers.includes('nozomi_id')) return 'nozomi';
  if (headers.includes('clarity_id')) return 'claroty';
  return 'generic'; // attempt generic parse
};

// For generic CSV: map to internal schema
const genericMapping = {
  timestamp: ['timestamp', 'time', 'date', 'alert_time'],
  sourceIp: ['source_ip', 'src_ip', 'source', 'from'],
  destIp: ['dest_ip', 'destination', 'target'],
  eventType: ['event_type', 'alert_type', 'type', 'category'],
  severity: ['severity', 'priority', 'level', 'risk'],
  description: ['description', 'message', 'details', 'text']
};
```

### Upload Error States
- File too large (>10MB): "File exceeds maximum size. Please export a smaller date range."
- Unrecognised format: "We couldn't parse this file format. Please try CSV or paste the alert text directly."
- Empty file: "This file appears to be empty. Please check your export settings."

---

## Dashboard Behaviour

### Resilience Score Calculation (Month 2 — static for demo)
```
Demo value: Display 68/100 "Fair" with "↗ Improving" trend
Real value (Month 2):
  score = base(100)
    - (criticalIncidents × 15)
    - (highIncidents × 8)
    - (openIncidents × 5)
    - (flatNetworkFlag × 10)
    + (autopilotPlaybooksConfigured × 3)
    + (incidentsClosedThisMonth × 2)
  
  Label mapping:
    90–100: Strong (green)
    75–89:  Good (teal)
    60–74:  Fair (amber)
    40–59:  Poor (orange)
    0–39:   Critical (red)
```

### Incident List Sorting
- Default: most recent first
- Secondary sort: severity (Critical → High → Medium → Low)
- Status filter: All / Open / Investigating / Contained / Closed

---

## Notification Behaviour

```
Trigger                    → Notification
─────────────────────────────────────────────────────
New alert submitted        → None (user just submitted it)
Severity 9–10 report       → Push notification: "Critical OT Alert — action required"
AUTOPILOT action executed  → In-app notification + audit log
Incident closed            → None
Simulation complete        → In-app notification: "Simulation ready"
```

---

*References: ai_rules.md, UX_FLOW.md, architecture.md*
