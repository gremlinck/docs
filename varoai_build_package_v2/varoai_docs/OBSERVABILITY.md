# OBSERVABILITY.md — Varo AI Monitoring & Error Handling
**Version:** 1.0 | **Owner:** Hi Kim, CEO

---

## Purpose

Observability means you always know what the product is doing, when something breaks, and how fast the AI is responding. As a solo founder, you cannot watch the system 24/7 — these rules make the system watch itself.

---

## What to Monitor

### 1. AI Response Time (Most Important)
```
Metric:    Time from alert submission to report display
Target:    P50 ≤ 45 seconds, P95 ≤ 90 seconds
Alert if:  Any response exceeds 120 seconds

How to measure:
  const startTime = Date.now();
  const report = await callVaroAnalyst(prompt, alertText);
  const duration = Date.now() - startTime;
  
  // Log to Firestore
  await db.collection('performance').add({
    module: 'incident_analyst',
    durationMs: duration,
    timestamp: serverTimestamp(),
    userId: user.uid,
    success: !report.error
  });
```

### 2. AI Parse Failures
```
Metric:    JSON parse failure rate
Target:    <2% of all requests
Alert if:  >5% failure rate in any 1-hour window

Log every parse failure:
  await db.collection('errors').add({
    type: 'json_parse_failure',
    module: module,
    rawResponse: rawResponse.substring(0, 500), // first 500 chars only
    timestamp: serverTimestamp(),
    userId: user.uid
  });
```

### 3. User Actions in COPILOT Mode
```
Track per incident:
  - Steps approved vs. skipped vs. modified
  - Time between report display and first approval
  - Incidents closed vs. left open

This data tells you: are analysts trusting the recommendations?
If skip rate > 50%, the response steps need refinement.
```

### 4. Demo Scenario Performance
```
The three demo scenarios must ALWAYS work.
Run these automatically every 24 hours as a health check.

// Scheduled Firebase Function (daily)
exports.demoHealthCheck = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    for (const scenario of DEMO_SCENARIOS) {
      const start = Date.now();
      const result = await callVaroAnalyst(SYSTEM_PROMPT, scenario.alert);
      const duration = Date.now() - start;
      
      await db.collection('healthChecks').add({
        scenario: scenario.name,
        success: !result.error,
        durationMs: duration,
        severityScore: result.severityScore,
        timestamp: serverTimestamp()
      });
    }
  });
```

---

## Error Messages (What Users See)

### AI Timeout (>90 seconds)
```
"The Varo AI Analyst is processing a complex scenario.
 This is taking slightly longer than usual.
 Your alert has been saved — analysis will complete shortly."

[Progress bar continues]
[Cancel and try again] button appears at 120 seconds
```

### JSON Parse Failure
```
"Varo AI Analyst encountered an issue processing this alert.
 Retrying automatically..."

[Automatic retry — once only]

If retry fails:
"We were unable to analyse this alert automatically.
 Your alert has been saved with ID [VAR-2026-XXXX].
 Please try again or contact support."
```

### Network Error
```
"Connection interrupted.
 Your alert has been saved locally.
 We'll retry automatically when connection is restored."
```

### Firebase Auth Error
```
"Sign-in failed. Please try again."
[Try again] button → restart Google Auth flow
```

### AUTOPILOT Safety Override Triggered
```
"⚠ SAFETY CHECK: This alert has been escalated to COPILOT mode.
 Automated actions are not permitted for alerts that may affect 
 physical processes. Please review and approve each step manually."

[Review Alert]
```

---

## Audit Log — What Gets Logged

Every user action and AI action is logged. This is essential for:
- Enterprise customers who need compliance evidence
- Debugging when something goes wrong
- Demonstrating to NextEra that the system is trustworthy

```javascript
// Log structure for every action
const auditEntry = {
  userId: string,
  incidentId: string,
  action: string,           // 'report_generated' | 'step_approved' | 'step_skipped' | 
                            //  'autopilot_executed' | 'mode_changed' | 'incident_closed'
  mode: 'COPILOT' | 'AUTOPILOT',
  automated: boolean,       // true if AUTOPILOT executed this
  outcome: string,          // human-readable description
  durationMs: number,       // how long the action took
  timestamp: serverTimestamp()
};
```

---

## Firebase Analytics Events

Track these custom events in Firebase Analytics:

```javascript
// User engagement
analytics.logEvent('alert_submitted', { input_method, facility_type });
analytics.logEvent('report_viewed', { severity_score, duration_ms });
analytics.logEvent('step_approved', { incident_id, step_number });
analytics.logEvent('step_skipped', { incident_id, step_number });
analytics.logEvent('copilot_message_sent', { incident_id });
analytics.logEvent('simulation_started', { scenario_type });
analytics.logEvent('autopilot_activated', { alert_category });

// Demo tracking (for investor conversations)
analytics.logEvent('demo_scenario_run', { scenario_name });
analytics.logEvent('demo_completed', { scenario_name, duration_ms });
```

---

## What to Check Every Morning (2-minute review)

Open Firebase Console → Check:

1. **Firestore** → `errors` collection → any new entries overnight?
2. **Analytics** → active users, alert submissions
3. **performance** collection → any responses >90 seconds?
4. **healthChecks** → did overnight demo check pass?

If all four look clean — you're good. If anything looks wrong — check `errors` collection for the raw failure log.

---

## Before Every Demo — 5-Minute Pre-Flight Check

```
□ Run Demo Scenario 1 (Modbus) — confirm output in <90 seconds
□ Open browser DevTools → Console tab — zero red errors
□ Check Firebase Console — Auth working, Firestore reachable
□ Verify GEMINI_API_KEY environment variable is set
□ Close all unnecessary browser tabs
□ Test on the actual device/screen you'll use for the demo
□ Have Demo Scenario 2 ready to run as backup
```

---

*References: ai_rules.md, architecture.md, SYSTEM_BEHAVIOR.md*
