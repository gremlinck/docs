# architecture.md — Varo AI Technical Architecture
**Version:** 1.0 | **Owner:** Hi Kim, CEO

---

## Overview

Varo AI is a React PWA hosted on Firebase, powered by Google Gemini 2.0 Flash for AI analysis. All data is stored in Firestore. The architecture is designed to be built entirely within Firebase Studio by a non-technical founder using AI-assisted development.

---

## Stack

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│         React (Next.js) + Tailwind CSS           │
│         Hosted on Firebase Hosting               │
│         PWA — varoai.app                         │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│                  FIREBASE                        │
│  Auth (Google SSO)  │  Firestore  │  Storage     │
│  Cloud Messaging    │  Functions  │  Analytics   │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│               AI ENGINE                          │
│   Gemini 2.0 Flash — Google AI Studio API        │
│   Swap to Claude (Anthropic) at Month 3          │
└─────────────────────────────────────────────────┘
```

---

## Firestore Collections

### `users`
```
users/{userId}
  email: string
  displayName: string
  role: 'analyst' | 'engineer' | 'ciso'
  facilityType: 'energy' | 'manufacturing' | 'water' | 'oil_gas'
  mode: 'COPILOT' | 'AUTOPILOT'
  createdAt: timestamp
  lastActive: timestamp
```

### `incidents`
```
incidents/{incidentId}
  userId: string
  createdAt: timestamp
  mode: 'COPILOT' | 'AUTOPILOT'
  inputMethod: 'paste' | 'upload' | 'form' | 'api'
  rawAlert: string
  protocol: string
  status: 'open' | 'investigating' | 'contained' | 'closed'
  report: {
    incidentId: string
    alertSummary: string
    protocolContext: string
    attackScenario: string
    affectedAssets: string[]
    operationalImpact: string
    financialExposure: string
    severityScore: number
    severityLabel: string
    confidenceLevel: string
    confidenceReason: string
    responseSteps: string[]
    escalationRecommendation: string
    mitreId: string
    mitreTechnique: string
  }
  analystActions: {
    stepId: string
    action: 'approved' | 'modified' | 'skipped'
    timestamp: timestamp
    userId: string
    note: string
  }[]
```

### `conversations`
```
conversations/{conversationId}
  incidentId: string
  userId: string
  messages: {
    role: 'user' | 'assistant'
    content: string
    timestamp: timestamp
  }[]
  createdAt: timestamp
```

### `simulations`
```
simulations/{simId}
  userId: string
  createdAt: timestamp
  scenario: string
  facilityDescription: string
  assetInventory: object | null
  results: {
    simulationId: string
    cascadeFailure: { step: number, event: string, timeframe: string }[]
    recoveryTime: string
    financialImpact: string
    resilienceScore: number
    resilienceLabel: string
    topRisks: string[]
    topRecommendations: string[]
    executiveSummary: string
  }
```

### `auditLog`
```
auditLog/{logId}
  userId: string
  incidentId: string
  action: string
  mode: 'COPILOT' | 'AUTOPILOT'
  timestamp: timestamp
  outcome: string
  automated: boolean
```

---

## Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Incidents belong to the creating user
    match /incidents/{incidentId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }

    // Conversations belong to the creating user
    match /conversations/{conversationId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }

    // Simulations belong to the creating user
    match /simulations/{simId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }

    // Audit log — write only, no delete
    match /auditLog/{logId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
  }
}
```

---

## Environment Variables

```bash
# .env.local — never commit to Git
GEMINI_API_KEY=your_key_from_aistudio.google.com
NEXT_PUBLIC_FIREBASE_API_KEY=from_firebase_console
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=varoai-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=varoai-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=varoai-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## AI API Call Pattern

```javascript
// All AI calls follow this pattern
// Temperature settings: see ai_rules.md

const callVaroAnalyst = async (systemPrompt, userMessage, temperature = 0.2) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userMessage}` }]
        }],
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      })
    }
  );
  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
};
```

---

## Deployment

```bash
# One-time setup
npm install -g firebase-tools
firebase login
firebase init hosting  # public dir: out, SPA: yes

# Build and deploy
npm run build
firebase deploy --only hosting

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

---

*References: PRD.md, system_prompt.md, ai_rules.md*
