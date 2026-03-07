# UX_FLOW.md — Varo AI User Experience Flows
**Version:** 1.0 | **Owner:** Hi Kim, CEO

---

## Core Principle

Every flow has one job: get the user from confusion to clarity as fast as possible. No onboarding friction. No feature tours. Alert goes in — answer comes out.

---

## Flow 1 — New User Onboarding

```
Landing → Google Sign In → Role Selection → Mode Explanation → Dashboard
```

### Steps

**Step 1: Landing (varoai.app)**
- Single screen: "Analyse your first OT alert in 90 seconds"
- One button: "Sign in with Google"
- No signup form. No email/password.

**Step 2: Google Authentication**
- Firebase Auth popup
- On success → Firestore creates user document
- Redirect to Role Selection

**Step 3: Role Selection**
```
"Which best describes you?"
○ OT Security Analyst     → Primary interface: Incident Analyst
○ Control / SCADA Engineer → Primary interface: Engineer Copilot
○ CISO / Security Leader   → Primary interface: Risk Dashboard
```

**Step 4: Mode Explanation (one screen, dismissable)**
```
"Varo AI has two operating modes:

COPILOT — You're in control
AI analyses and recommends. You approve every action.
Recommended for all new users.

AUTOPILOT — AI acts on pre-approved playbooks
Faster response. Requires setup and explicit activation.
Not available for alerts with physical process risk.

You can change this anytime."

[  Start with COPILOT  ]    [  Learn more  ]
```

**Step 5: Dashboard**
- If no incidents yet: empty state with "Analyse your first alert →"
- If incidents exist: incident list

---

## Flow 2 — Incident Analysis (Primary Flow)

```
New Alert → Input → Processing → Report → Copilot → Action
```

### Step 1: Alert Input
**Three entry methods — all lead to the same output:**

**Method A: Paste text**
```
User pastes raw alert text into text area
Selects facility type (dropdown)
Clicks "Analyse Alert"
```

**Method B: Upload file**
```
User clicks "Upload from Dragos / Nozomi / Claroty"
Selects CSV or JSON file
System parses and displays parsed fields for confirmation
User clicks "Confirm and Analyse"
```

**Method C: Manual form**
```
User fills: Asset ID, Protocol (dropdown), Event Type, 
            Source IP, Timestamp, Severity, Description
Clicks "Analyse Alert"
```

### Step 2: Processing State
```
Progress bar animation — do not use spinner
Message: "Varo AI Analyst is processing your alert..."
Sub-message: "Analysing [protocol detected] behaviour..."
Duration: typically 15–45 seconds
SLA: must complete in <90 seconds
```

### Step 3: Incident Report Display
```
Report appears with fade-up animation
Severity badge immediately visible — colour-coded
operationalImpact displayed prominently — largest text
responseSteps listed with action buttons
financialExposure displayed clearly
MITRE technique shown as pill badge
```

### Step 4: COPILOT Response Flow
```
For each responseStep:

  [Step text]                    [APPROVE] [MODIFY] [SKIP]

  On APPROVE:
    → Step turns green
    → Logged to auditLog
    → Next step highlighted
    → If last step: show "All steps reviewed. Incident logged."

  On MODIFY:
    → Text becomes editable
    → User edits text
    → [Save & Approve] button appears
    → On save: logged with modification noted

  On SKIP:
    → Step greyed out with strikethrough
    → Logged as skipped with timestamp
    → Reason prompt (optional): "Reason for skipping?"
```

### Step 5: Engineer Copilot (concurrent with Step 3–4)
```
Chat panel loads alongside report
Pre-populated opening message from Varo AI Analyst:
"I've analysed this alert. Ask me anything about what it 
means for your specific process."

Engineer types question → AI responds in 5–8 seconds
Conversation continues as long as needed
All messages saved to Firestore conversations collection
```

### Step 6: Incident Resolution
```
Status dropdown in report header:
  Open → Investigating → Contained → Closed

On "Closed":
  Modal: "Mark this incident as closed?"
  Optional: "Add resolution note"
  [Close Incident] → status updated in Firestore → dashboard metrics updated
```

---

## Flow 3 — AUTOPILOT Activation

```
Mode Toggle → Warning Modal → Category Selection → Confirmation → Active
```

```
User clicks AUTOPILOT toggle

→ Modal appears:
  "You are activating AUTOPILOT mode.
  
  In this mode, Varo AI will automatically execute 
  pre-approved response actions without asking for 
  confirmation.
  
  AUTOPILOT is NOT available for alerts that may 
  affect physical processes. These will always 
  require your approval.
  
  Which alert categories should run on AUTOPILOT?"
  
  ☐ Low severity informational alerts
  ☐ Repeated known-good false positives  
  ☐ Automated escalation notifications
  ☐ Log and tag only (no response action)
  
  [  Activate AUTOPILOT  ]    [  Keep COPILOT  ]

→ On activate:
  Mode badge in top bar turns blue: "AUTOPILOT ●"
  Firestore user.mode updated to 'AUTOPILOT'
  AuditLog entry created: "AUTOPILOT activated by [userId]"
```

---

## Flow 4 — Resilience Simulation

```
Select Scenario → Describe Facility → Processing → Results → Export
```

```
Step 1: Scenario selection
  [PLC Compromise]  [HMI Ransomware]  [Historian Exfiltration]
  [Network Flat]    [EWS Compromise]  [Custom Scenario]

Step 2: Facility description
  "Describe your facility in plain language. 
   Include: what you produce, key equipment, 
   how many PLCs/HMIs, network setup."
  
  [Text area — or upload asset CSV]

Step 3: Processing (up to 120 seconds)
  "Running simulation..."

Step 4: Results
  - Resilience Score: large number, 0–100, coloured
  - Cascade failure timeline (visual step sequence)
  - Recovery time estimate
  - Financial impact range
  - Top 3 recommendations

Step 5: Export
  [Download PDF Report]  — generates board-ready one-pager
```

---

## Flow 5 — Executive One-Pager Generation

```
Dashboard → Generate Report → AI Summary → Download
```

```
From Risk Score Dashboard:
  Button: "Generate Executive Summary"
  
  → Modal: "This will generate a board-ready summary 
    of your last 30 days. Ready?"
  
  [Generate]
  
  → AI generates executiveSummary from Firestore incident data
  → Preview shown in modal
  → [Download PDF]  [Copy to clipboard]  [Email to...]
```

---

## Empty States

```
No incidents yet:
  Icon: simple shield outline
  Text: "No incidents analysed yet."
  CTA: "Analyse your first alert →"

No simulations yet:
  Icon: simple waveform
  Text: "No simulations run yet."
  CTA: "Run your first resilience simulation →"

Loading error:
  Icon: simple warning triangle
  Text: "Varo AI Analyst could not complete the analysis."
  CTA: "Try again" (retries the API call)
  Sub-text: "Your alert has been saved."
```

---

## Navigation Map

```
varoai.app/
├── /                    → Landing / Sign In
├── /dashboard           → Risk Score Dashboard (default after login)
├── /incidents           → Incident list
├── /incidents/new       → New alert input
├── /incidents/[id]      → Incident report + Copilot
├── /simulate            → Resilience Simulator
├── /simulate/[id]       → Simulation results
└── /settings            → Mode preferences, profile
```

---

*References: UI_DESIGN.md, DEMO_STORY.md, SYSTEM_BEHAVIOR.md*
