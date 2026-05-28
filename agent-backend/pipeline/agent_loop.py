"""A.G.E.N.T. Loop™ — sequential multi-agent reasoning pipeline.

Each step produces typed output that is accumulated into context
and passed to the next agent. Steps:

  [A] Assess    — protocol identification + anomaly classification
  [G] Generate  — attack scenario + MITRE ATT&CK for ICS
  [E] Evaluate  — consequence modelling (operational + financial)
  [N] Navigate  — response steps + safety gate
  [T] Translate — final 12-field IncidentReport JSON

The pipeline is designed for full Google ADK orchestration (Phase 3).
In Phase 2, agents are called sequentially via this module.
The A2A protocol is exposed through the FastAPI endpoint layer.
"""
from __future__ import annotations

import logging
from typing import Any

from agents.assessor   import ProtocolAssessor
from agents.generator  import ScenarioGenerator
from agents.evaluator  import ConsequenceEvaluator
from agents.navigator  import ResponseNavigator
from agents.translator import LanguageTranslator
from security.sanitise import validate_report

log = logging.getLogger(__name__)

_STEPS = [
    ('assess_result',   ProtocolAssessor),
    ('generate_result', ScenarioGenerator),
    ('evaluate_result', ConsequenceEvaluator),
    ('navigate_result', ResponseNavigator),
    ('translate_result', LanguageTranslator),
]


def run_agent_loop(
    alert_text: str,
    facility_type: str = 'energy',
    mode: str = 'COPILOT',
) -> dict[str, Any]:
    """Execute the full A.G.E.N.T. Loop™ and return a validated IncidentReport."""

    context: dict[str, Any] = {
        'alert_text':    alert_text,
        'facility_type': facility_type,
        'mode':          mode,
    }

    for output_key, AgentClass in _STEPS:
        agent = AgentClass()
        log.info('Running %s', agent.step_label)
        try:
            result = agent.run(context)
        except Exception as exc:
            log.error('%s failed: %s', agent.step_label, exc)
            raise RuntimeError(f'{agent.step_label} agent failed: {exc}') from exc

        context[output_key] = result
        log.debug('%s output: %s', agent.step_label, result)

    raw_report = context.get('translate_result', {})
    report = validate_report(raw_report)

    # Propagate safety gate decision from [N] Navigate
    navigate = context.get('navigate_result', {})
    if navigate.get('safetyGateTriggered'):
        report['requiresSafetyCheck'] = True

    return report


def get_agent_cards() -> list[dict]:
    """A2A-compatible agent card registry for all loop steps."""
    return [AgentClass().agent_card for _, AgentClass in _STEPS]
