# UI_DESIGN.md — Varo AI Visual Design Specification
**Version:** 1.0 | **Owner:** Hi Kim, CEO

---

## Design Philosophy

**"Command centre, not dashboard."**

Varo AI looks like a tool built for people who make serious decisions under pressure. Not a startup product. Not a generic SaaS app. The design communicates: *this is professional-grade infrastructure.*

Benchmark: Palantir AIP meets Linear.app — authoritative and calm.

---

## Colour Palette

```css
/* Primary */
--ink:        #0F0E0C;   /* Near-black — primary text, headers */
--cream:      #FAF8F4;   /* Off-white — page background */
--navy:       #0D1F3C;   /* Deep navy — header, dark surfaces */
--blue:       #1A3FA8;   /* Electric blue — primary accent, CTAs */

/* Severity colours — non-negotiable */
--critical:   #DC2626;   /* Red — severity 9–10 */
--high:       #EA580C;   /* Orange — severity 7–8 */
--medium:     #D97706;   /* Amber — severity 5–6 */
--low:        #16A34A;   /* Green — severity 1–4 */

/* Supporting */
--steel:      #1E2D45;   /* Dark blue-grey — secondary surfaces */
--muted:      #6B6860;   /* Mid-grey — labels, secondary text */
--rule:       #E4E0D8;   /* Warm grey — dividers, borders */
--lt-blue:    #EFF6FF;   /* Tint — info boxes, copilot background */
--lt-green:   #F0FFF4;   /* Tint — approved states, COPILOT confirmed */
--lt-red:     #FEF2F2;   /* Tint — critical alerts, warnings */
```

---

## Typography

```css
/* Headers — authority and weight */
font-family: 'Syne', sans-serif;
/* Import: https://fonts.googleapis.com/css2?family=Syne:wght@700;800 */

/* Body — readable and professional */
font-family: 'Instrument Sans', sans-serif;
/* Import: https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600 */

/* Code / IDs / Technical strings */
font-family: 'JetBrains Mono', monospace;
/* Import: https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600 */
```

### Type Scale
```
Display:    48px / Syne 800 / ink / letter-spacing -1.5px
H1:         36px / Syne 700 / ink / letter-spacing -1px
H2:         24px / Syne 700 / ink
H3:         18px / Instrument Sans 600 / ink
Body:       15px / Instrument Sans 400 / ink / line-height 1.65
Label:      11px / Instrument Sans 600 / muted / ALL CAPS / letter-spacing 0.1em
Mono:       13px / JetBrains Mono 400 / steel
```

---

## Component Specifications

### Incident Report Card
```
Background:     #FFFFFF
Border:         1.5px solid #E4E0D8
Border-left:    4px solid [severity colour]
Border-radius:  8px
Padding:        24px 28px
Shadow:         0 1px 3px rgba(0,0,0,0.06)

Header row:
  - Incident ID: mono 13px, blue
  - Severity badge: pill, coloured background
  - Confidence: label 11px
  - Timestamp: label 11px, muted

Field layout:
  - 2-column grid for most fields
  - operationalImpact: full width, slightly larger text (17px)
  - responseSteps: full width, numbered list with action buttons
```

### Severity Badge
```
Critical (9–10):  background #FEF2F2, border #DC2626, text #DC2626, bold
High (7–8):       background #FFF7ED, border #EA580C, text #EA580C, bold
Medium (5–6):     background #FFFBEB, border #D97706, text #D97706, bold
Low (1–4):        background #F0FDF4, border #16A34A, text #16A34A, bold

Shape: pill (border-radius: 20px), padding: 4px 12px, font-size: 12px
```

### Response Step (COPILOT mode)
```
Container:
  background: #FAFAF8
  border: 1.5px solid #E4E0D8
  border-radius: 6px
  padding: 14px 16px
  margin-bottom: 8px

Step number: mono 12px, blue, min-width 24px
Step text: 14px, ink, flex: 1

Action buttons (right-aligned):
  APPROVE:  background #065F46, text white, border-radius 5px, padding 6px 14px
  MODIFY:   background white, border 1.5px solid #1A3FA8, text #1A3FA8
  SKIP:     background white, border 1.5px solid #E4E0D8, text #6B6860

Approved state: background #F0FFF4, border-left 3px solid #065F46
Skipped state:  background #F9F9F9, opacity 0.6, strikethrough on text
```

### Mode Toggle (COPILOT / AUTOPILOT)
```
Container: pill toggle, background #F0EDE6, border-radius 24px, padding 4px

COPILOT:
  Active:   background #065F46, text white
  Inactive: text #6B6860

AUTOPILOT:
  Active:   background #1A3FA8, text white
  Inactive: text #6B6860

Warning on AUTOPILOT activation:
  Modal with amber border: "AUTOPILOT executes pre-approved actions 
  automatically. Confirm you want to enable this for [alert category]."
```

### Engineer Copilot Chat
```
Container:
  background: #EFF6FF
  border: 1.5px solid #BFDBFE
  border-radius: 8px
  height: 320px
  overflow-y: scroll

Message bubbles:
  User:      right-aligned, background #1A3FA8, text white, border-radius 12px 12px 4px 12px
  Analyst:   left-aligned, background #FFFFFF, border 1.5px solid #E4E0D8, border-radius 12px 12px 12px 4px

Input area:
  background: white
  border-top: 1.5px solid #BFDBFE
  padding: 12px 16px
  Send button: background #1A3FA8, text white, border-radius 6px
```

### Navigation
```
Top bar:
  background: #0D1F3C (navy)
  height: 56px
  padding: 0 32px

Logo: "VARO AI" in Syne 800, white, letter-spacing 2px
Mode indicator: pill badge top-right — COPILOT (green) or AUTOPILOT (blue)

Sidebar (desktop):
  width: 240px
  background: #F7F5F0
  border-right: 1.5px solid #E4E0D8

  Nav items:
    Active:   background white, border-left 3px solid #1A3FA8, font-weight 600
    Inactive: text #6B6860
```

---

## Screen Layouts

### Screen 1 — Alert Input (Demo opening screen)
```
┌─────────────────────────────────────────────────┐
│  VARO AI                          [COPILOT ●]   │ ← navy top bar
├─────────────────────────────────────────────────┤
│                                                 │
│  Analyse OT Alert                               │ ← H1
│  Paste any OT security alert below             │ ← subtitle
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │                                          │   │
│  │  [Text area — paste alert here]          │   │ ← min-height 200px
│  │                                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Facility type: [Energy ▼]  Mode: [COPILOT ▼]  │
│                                                 │
│  [  Analyse Alert  →  ]                        │ ← primary CTA, blue
│                                                 │
└─────────────────────────────────────────────────┘
```

### Screen 2 — Incident Report (The money screen)
```
┌─────────────────────────────────────────────────┐
│  VARO AI                          [COPILOT ●]   │
├──────────────────────┬──────────────────────────┤
│                      │                          │
│  INCIDENT REPORT     │  ENGINEER COPILOT        │
│  VAR-2026-4471       │                          │
│  ─────────────────   │  [Chat messages here]    │
│                      │                          │
│  [CRITICAL] 9/10     │  "What does this mean    │
│                      │   for my Line 3?"        │
│  Summary             │                          │
│  [text]              │  [Varo AI response]      │
│                      │                          │
│  Operational Impact  │  [Input box]  [Send]     │
│  [text — larger]     │                          │
│                      │                          │
│  Response Steps      │                          │
│  1. [step] [APPROVE] │                          │
│  2. [step] [APPROVE] │                          │
│  3. [step] [APPROVE] │                          │
│                      │                          │
└──────────────────────┴──────────────────────────┘
```

### Screen 3 — Risk Score Dashboard
```
┌─────────────────────────────────────────────────┐
│  VARO AI                          [COPILOT ●]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Resilience Score                               │
│  ┌──────────────────────────────────────────┐  │
│  │   62 / 100          FAIR    ↗ Improving  │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  [Top Risks]  [Incidents 30d]  [Compliance]    │
│                                                 │
│  Recent Incidents                               │
│  ─────────────────────────────────────────────  │
│  VAR-2026-4471  [CRITICAL]  Modbus Anomaly     │
│  VAR-2026-4470  [HIGH]      OPC-UA Read        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Animation & Interaction

```css
/* Standard transition */
transition: all 0.15s ease;

/* Page entry */
animation: fadeUp 0.4s cubic-bezier(.22,.68,0,1.2);

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Loading state — while AI is analysing */
/* Show animated progress bar, not a spinner */
/* Message: "Varo AI Analyst is processing..." */
/* Never show blank screen */
```

---

## Responsive Breakpoints

```
Desktop (≥1024px):  Two-column layout (report + copilot side by side)
Tablet (768–1023px): Single column, copilot below report
Mobile (<768px):    Single column, copilot collapsed to expandable panel
```

---

*References: UX_FLOW.md, DEMO_STORY.md*
