"""Varo AI Agent Backend — FastAPI server exposing the A.G.E.N.T. Loop™.

A2A-compatible endpoints:
  GET  /.well-known/agent.json   — agent registry card
  POST /tasks/analyze            — run the full A.G.E.N.T. Loop™
  POST /tasks/copilot            — single-turn Engineer Copilot response

Run locally:
  uvicorn main:app --reload --port 8000
"""
from __future__ import annotations

import json
import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

from pipeline.agent_loop import run_agent_loop, get_agent_cards
from agents.base import _get_client, Agent
from security.sanitise import sanitise_alert

from google.genai import types as genai_types

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

app = FastAPI(
    title='Varo AI Agent Backend',
    description='A.G.E.N.T. Loop™ — OT/ICS cyber-physical consequence intelligence',
    version='0.2.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000', 'https://varoai.app'],
    allow_methods=['GET', 'POST'],
    allow_headers=['*'],
)


# ── A2A agent registry ──────────────────────────────────────────────────────

@app.get('/.well-known/agent.json')
def agent_registry() -> dict:
    """A2A agent card — describes all agents in the A.G.E.N.T. Loop™."""
    return {
        'name': 'varo-ai-analyst',
        'description': 'OT/ICS cyber-physical consequence intelligence — A.G.E.N.T. Loop™',
        'version': '0.2.0',
        'url': os.environ.get('AGENT_BACKEND_URL', 'http://localhost:8000'),
        'agents': get_agent_cards(),
        'capabilities': {
            'streaming': False,
            'pushNotifications': False,
        },
    }


# ── Analysis endpoint ────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    alertText: str
    facilityType: str = 'energy'
    mode: str = 'COPILOT'


@app.post('/tasks/analyze')
def analyze(req: AnalyzeRequest) -> dict:
    """Run the full A.G.E.N.T. Loop™ against an OT alert."""
    if not req.alertText.strip():
        raise HTTPException(status_code=400, detail='alertText is required')

    if not os.environ.get('GEMINI_API_KEY'):
        raise HTTPException(
            status_code=503,
            detail='GEMINI_API_KEY is not configured. Add it to agent-backend/.env',
        )

    try:
        report = run_agent_loop(
            alert_text=req.alertText,
            facility_type=req.facilityType,
            mode=req.mode,
        )
        return {'report': report, 'facilityType': req.facilityType, 'mode': req.mode}
    except RuntimeError as exc:
        log.error('Agent loop failed: %s', exc)
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        log.exception('Unexpected error in analyze')
        raise HTTPException(status_code=500, detail='Analysis failed — please try again') from exc


# ── Copilot endpoint ─────────────────────────────────────────────────────────

class CopilotRequest(BaseModel):
    message: str
    report: dict


@app.post('/tasks/copilot')
def copilot(req: CopilotRequest) -> dict:
    """Single-turn Engineer Copilot response, loaded with incident context."""
    if not req.message.strip():
        raise HTTPException(status_code=400, detail='message is required')

    r = req.report
    system_prompt = f"""You are the Varo AI Analyst in Copilot mode, supporting a control engineer
during an active OT security incident.

ACTIVE INCIDENT CONTEXT:
Incident ID: {r.get('incidentId')}
Summary: {r.get('alertSummary')}
Affected assets: {', '.join(r.get('affectedAssets', []))}
Severity: {r.get('severityScore')}/10 — {r.get('severityLabel')}
Operational Impact: {r.get('operationalImpact')}

Your role:
- Answer questions in operational terms — equipment, processes, setpoints
- Never use IT jargon without translating it to physical consequence
- Never recommend actions requiring IT security expertise to execute

Return a JSON object: {{"response": "your conversational response"}}"""

    safe_message = sanitise_alert(req.message)
    prompt = f"{system_prompt}\n\nEngineer question: {safe_message}"

    try:
        client = _get_client()
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=genai_types.GenerateContentConfig(
                response_mime_type='application/json',
                temperature=0.4,
                max_output_tokens=512,
            ),
        )
        raw = json.loads(response.text or '{}')
        return {'response': raw.get('response', 'I was unable to process that question. Please try again.')}
    except Exception as exc:
        log.error('Copilot error: %s', exc)
        raise HTTPException(status_code=500, detail='Copilot unavailable — please try again') from exc


# ── Health check ─────────────────────────────────────────────────────────────

@app.get('/health')
def health() -> dict:
    return {'status': 'ok', 'pipeline': 'A.G.E.N.T. Loop™', 'steps': 5}
