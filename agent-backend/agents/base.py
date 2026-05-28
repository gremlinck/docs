"""Base agent class — ADK-compatible interface with A2A agent card."""
from __future__ import annotations

import json
import os
from abc import ABC, abstractmethod
from typing import Any

from google import genai
from google.genai import types


def _get_client() -> genai.Client:
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        raise RuntimeError('GEMINI_API_KEY is not set')
    return genai.Client(api_key=api_key)


class Agent(ABC):
    """A single step in the A.G.E.N.T. Loop™.

    Subclasses define:
      - name / description / step_label  (used in the A2A agent card)
      - temperature
      - build_prompt(context) → str
    """

    name: str
    description: str
    step_label: str          # e.g. "[A] Assess"
    temperature: float = 0.2

    @property
    def agent_card(self) -> dict:
        """A2A-compatible agent descriptor."""
        return {
            'name': self.name,
            'description': self.description,
            'step': self.step_label,
            'model': 'gemini-2.0-flash',
            'inputSchema': 'AgentContext',
            'outputSchema': self.output_schema,
        }

    @property
    def output_schema(self) -> str:
        return 'dict'

    @abstractmethod
    def build_prompt(self, context: dict) -> str: ...

    def run(self, context: dict) -> dict:
        client = _get_client()
        prompt = self.build_prompt(context)

        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type='application/json',
                temperature=self.temperature,
                max_output_tokens=1024,
            ),
        )

        raw = response.text or ''
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            # Strip markdown fences and retry
            stripped = raw.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
            return json.loads(stripped)
