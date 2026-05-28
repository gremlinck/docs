# Varo AI — Architecture
**Varo Mythos internal spec | v0.2 | May 2026**

Chain-aware reasoning pipeline for OT/ICS security, built on Google ADK + A2A and structured around the A.G.E.N.T. Loop™.

---

## Section 1 — Overview

Varo AI is a multi-agent reasoning system that processes OT security alerts through a five-step consequence-analysis chain. Unlike a single-prompt LLM call, the A.G.E.N.T. Loop™ decomposes analysis into discrete, auditable steps — each producing a typed output that feeds the next agent.

```
Raw OT Alert
     │
     ▼
[A] Assess        Protocol identification + anomaly classification
     │               → { protocol, anomalyType, protocolContext, confidence }
     ▼
[G] Generate      Attack scenario + MITRE ATT&CK for ICS
     │               → { attackScenario, mitreId, mitreTechnique, affectedAssets }
     ▼
[E] Evaluate      Consequence modelling (operational + financial)
     │               → { operationalImpact, financialExposure, severityScore }
     ▼
[N] Navigate      Response steps + hardcoded safety gate
     │               → { responseSteps[], escalationRecommendation, safetyGateTriggered }
     ▼
[T] Translate     Final 12-field plain-language IncidentReport
     │               → IncidentReport (validated JSON)
     ▼
Structured Incident Report — displayed in the Next.js UI
```

**Why a chain, not a single prompt?**
Each step is independently auditable, retryable, and safety-checkable. The [N] Navigate agent applies `forcesCopilot()` at the application layer — not in the prompt — so it cannot be overridden by prompt injection, user mode settings, or API flags.

---

## Section 2 — Stack

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│           Next.js 14 + React 18 + TypeScript             │
│           Tailwind CSS — Varo AI design system           │
│           Firebase Hosting — varoai.app                  │
└──────────────────────────┬──────────────────────────────┘
                           │  REST (JSON)
┌──────────────────────────▼──────────────────────────────┐
│               AGENT BACKEND (Python)                     │
│          FastAPI — /tasks/analyze, /tasks/copilot        │
│          Google Agent Development Kit (ADK)              │
│          A2A agent registry at /.well-known/agent.json   │
│          A.G.E.N.T. Loop™ — 5-step pipeline             │
└──────────────────────────┬──────────────────────────────┘
                           │  google-genai SDK
┌──────────────────────────▼──────────────────────────────┐
│                      AI ENGINE                           │
│    Gemini 2.0 Flash (Phase 1–2)                         │
│    Claude swap at Month 3 — change callVaroAnalyst() only│
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                      FIREBASE (Phase 2)                  │
│    Auth (Google SSO)  │  Firestore  │  Hosting           │
└─────────────────────────────────────────────────────────┘
```

**Phase routing in the Next.js API layer:**
```typescript
// app/api/varo/analyze/route.ts
if (process.env.AGENT_BACKEND_URL) {
  // Phase 2 — calls Python A.G.E.N.T. Loop™
  report = await callAgentLoop(alertText, facilityType, mode)
} else {
  // Phase 1 fallback — direct Gemini call
  report = await callVaroAnalyst(prompt, 0.2)
}
```

---

## Section 3 — Agent definitions

Each agent in `agent-backend/agents/` is a class with:
- `name`, `description`, `step_label` — used in the A2A agent card
- `temperature` — tuned per task type
- `build_prompt(context)` — constructs the prompt from accumulated state
- `run(context)` — calls Gemini, parses JSON, returns typed result

```python
# agent-backend/agents/base.py
class Agent(ABC):
    name: str
    description: str
    step_label: str
    temperature: float = 0.2

    @property
    def agent_card(self) -> dict:
        return {
            'name': self.name,
            'description': self.description,
            'step': self.step_label,
            'model': 'gemini-2.0-flash',
            'inputSchema': 'AgentContext',
            'outputSchema': self.output_schema,
        }

    def run(self, context: dict) -> dict:
        client = genai.Client(api_key=os.environ['GEMINI_API_KEY'])
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=self.build_prompt(context),
            config=GenerateContentConfig(
                response_mime_type='application/json',
                temperature=self.temperature,
            ),
        )
        return json.loads(response.text)
```

| Agent | Step | File | Temperature | Output fields |
|---|---|---|---|---|
| ProtocolAssessor | [A] | `assessor.py` | 0.1 | `protocol, anomalyType, protocolContext, confidence` |
| ScenarioGenerator | [G] | `generator.py` | 0.2 | `attackScenario, mitreId, mitreTechnique, affectedAssets` |
| ConsequenceEvaluator | [E] | `evaluator.py` | 0.2 | `operationalImpact, financialExposure, severityScore` |
| ResponseNavigator | [N] | `navigator.py` | 0.2 | `responseSteps[], escalationRecommendation, safetyGateTriggered` |
| LanguageTranslator | [T] | `translator.py` | 0.3 | Full 12-field `IncidentReport` |

---

## Section 4 — Firestore schema

See [`architecture.md §3`](../varoai_build_package_v2/varoai_docs/architecture.md) for the full Firestore collection schema (`users`, `incidents`, `conversations`, `simulations`, `auditLog`).

---

## Section 5 — Safety gate specification

The [N] ResponseNavigator applies `forcesCopilot()` before returning. This is enforced at the application layer, not in the prompt.

```python
# agent-backend/security/sanitise.py
def forces_copilot(report: dict) -> bool:
    return (
        report.get('severityScore', 0) >= 8
        or 'safety' in (report.get('mitreTechnique') or '').lower()
        or _detect_physical_impact(report)
    )

def _detect_physical_impact(report: dict) -> bool:
    impact = (report.get('operationalImpact') or '').lower()
    physical_keywords = [
        'physical', 'equipment damage', 'emergency shutdown',
        'personnel', 'safety system', 'explosion', 'fire',
    ]
    safety_assets = ['sis', 'esd', 'safety', 'turbine', 'governor']
    has_risky_asset = any(
        any(k in a.lower() for k in safety_assets)
        for a in (report.get('affectedAssets') or [])
    )
    return any(k in impact for k in physical_keywords) or has_risky_asset
```

When triggered: the frontend displays the safety override banner and all APPROVE / MODIFY / SKIP buttons remain active — AUTOPILOT execution is blocked.

---

## Section 6 — AI call pattern

All AI calls in the agent backend flow through `agent-backend/agents/base.py`.
All AI calls in the Next.js layer flow through `lib/ai.ts`.
These are the two swap points for the Gemini → Claude migration.

**Data flow for security review:**

```
1. User browser  →  Next.js /api/varo/analyze  (HTTPS — API key never in browser)
2. Next.js       →  Python /tasks/analyze       (internal network — AGENT_BACKEND_URL)
3. Python        →  sanitise_alert()            (prompt injection defence)
4. Python        →  Gemini API                  (GEMINI_API_KEY — server env only)
5. Python        →  validate_report()           (schema + MITRE ID check)
6. Python        →  Next.js                     (validated JSON)
7. Next.js       →  browser                     (rendered as incident report)
```

**What leaves the customer's network:**
- Alert text → sent to Gemini API (processed transiently, not stored by Google)

**What never leaves Varo AI infrastructure:**
- User credentials, Firebase tokens, asset inventory files

---

## Section 7 — Running locally

**Agent backend (Python):**
```bash
cd agent-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env     # add GEMINI_API_KEY
uvicorn main:app --reload --port 8000
```

**Next.js frontend:**
```bash
cp .env.local.example .env.local
# Set AGENT_BACKEND_URL=http://localhost:8000
# Set GEMINI_API_KEY (used as fallback if backend is down)
npm install
npm run dev
```

**Deploy (Firebase Hosting + Cloud Run):**
```bash
# Deploy agent backend to Cloud Run
gcloud run deploy varo-agent-backend \
  --source agent-backend/ \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY

# Deploy Next.js frontend
npm run build
firebase deploy --only hosting
```

---

*References: [`ai_rules.md`](../varoai_build_package_v2/varoai_docs/ai_rules.md) · [`SYSTEM_BEHAVIOR.md`](../varoai_build_package_v2/varoai_docs/SYSTEM_BEHAVIOR.md) · [`SECURITY_PRIVACY.md`](../varoai_build_package_v2/varoai_docs/SECURITY_PRIVACY.md)*
