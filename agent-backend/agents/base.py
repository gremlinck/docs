"""Base agent class — ADK-compatible interface with A2A agent card."""
from __future__ import annotations

import json
import os
from abc import ABC, abstractmethod

import anthropic


def _get_client() -> anthropic.Anthropic:
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        raise RuntimeError('ANTHROPIC_API_KEY is not set')
    return anthropic.Anthropic(api_key=api_key)


class Agent(ABC):
    """A single step in the A.G.E.N.T. Loop™.

    Subclasses define:
      - name / description / step_label  (used in the A2A agent card)
      - temperature
      - build_prompt(context) → str
    """

    name: str
    description: str
    step_label: str
    temperature: float = 0.2

    @property
    def agent_card(self) -> dict:
        """A2A-compatible agent descriptor."""
        return {
            'name': self.name,
            'description': self.description,
            'step': self.step_label,
            'model': 'claude-opus-4-7',
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

        msg = client.messages.create(
            model='claude-opus-4-7',
            max_tokens=1024,
            temperature=self.temperature,
            messages=[{'role': 'user', 'content': prompt}],
        )

        raw = msg.content[0].text if msg.content else ''
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            stripped = raw.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
            return json.loads(stripped)
