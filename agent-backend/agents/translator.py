"""[T] Translate — Assembles the final 12-field IncidentReport JSON."""
from __future__ import annotations

from .base import Agent


class LanguageTranslator(Agent):
    name = 'language_translator'
    description = 'Assembles and plain-language-translates all prior step outputs into the final 12-field incident report.'
    step_label = '[T] Translate'
    temperature = 0.3   # slightly higher — this is a language/narrative task

    @property
    def output_schema(self) -> str:
        return 'IncidentReport (12 fields)'

    def build_prompt(self, context: dict) -> str:
        assess   = context.get('assess_result', {})
        generate = context.get('generate_result', {})
        evaluate = context.get('evaluate_result', {})
        navigate = context.get('navigate_result', {})
        mode     = context.get('mode', 'COPILOT')
        facility = context.get('facility_type', 'energy')

        return f"""You are the Varo AI Analyst. Assemble a final incident report from the structured
analysis produced by the five A.G.E.N.T. Loop™ steps below. Write in clear, operational language
for an OT security analyst. No jargon. Physical consequence first.

STEP OUTPUTS:
[A] Protocol: {assess.get('protocol')} | Anomaly: {assess.get('anomalyType')}
    Context: {assess.get('protocolContext')}

[G] Attack scenario: {generate.get('attackScenario')}
    MITRE: {generate.get('mitreId')} — {generate.get('mitreTechnique')}
    Assets: {', '.join(generate.get('affectedAssets', []))}
    Objective: {generate.get('attackerObjective')}

[E] Impact: {evaluate.get('operationalImpact')}
    Exposure: {evaluate.get('financialExposure')}
    Severity: {evaluate.get('severityScore')}/10 — {evaluate.get('severityLabel')}
    Confidence: {evaluate.get('confidenceLevel')} — {evaluate.get('confidenceReason')}

[N] Response steps: {navigate.get('responseSteps')}
    Escalation: {navigate.get('escalationRecommendation')}

Facility type: {facility} | Mode: {mode}

Return a JSON object with EXACTLY these fields:
{{
  "incidentId": "VAR-2026-[random 4 digits]",
  "alertSummary": "One sentence, plain language, max 25 words",
  "protocolContext": "2-3 sentences from the [A] Assess output — refined for clarity",
  "attackScenario": "From [G] Generate — refined to be maximally clear to a control engineer",
  "affectedAssets": ["from", "[G]", "Generate"],
  "operationalImpact": "From [E] Evaluate — this is the most important field. Plain language only.",
  "financialExposure": "From [E] Evaluate — always a range",
  "severityScore": 0,
  "severityLabel": "Critical | High | Medium | Low",
  "confidenceLevel": "High | Medium | Low",
  "confidenceReason": "One sentence",
  "responseSteps": ["from", "[N]", "Navigate"],
  "escalationRecommendation": "From [N] Navigate",
  "mitreId": "From [G] Generate",
  "mitreTechnique": "From [G] Generate"
}}

Return valid JSON only. No markdown."""
