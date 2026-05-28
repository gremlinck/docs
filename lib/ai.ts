// AI engine layer — two modes:
//   1. AGENT_BACKEND_URL set → calls the Python A.G.E.N.T. Loop™ (Phase 2)
//   2. Fallback                → direct Claude call (Phase 1)

import Anthropic from '@anthropic-ai/sdk'

const AGENT_BACKEND = process.env.AGENT_BACKEND_URL ?? ''

// ── Phase 2: agent backend ───────────────────────────────────────────────────

export async function callAgentLoop(
  alertText: string,
  facilityType: string,
  mode: string
): Promise<unknown> {
  const res = await fetch(`${AGENT_BACKEND}/tasks/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alertText, facilityType, mode }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Agent backend error' }))
    throw new Error((err as { detail?: string }).detail ?? `Agent backend returned ${res.status}`)
  }
  const data = await res.json()
  return data.report
}

export async function callAgentCopilot(
  message: string,
  report: unknown
): Promise<string> {
  const res = await fetch(`${AGENT_BACKEND}/tasks/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, report }),
  })
  if (!res.ok) throw new Error('Copilot agent unavailable')
  const data = await res.json()
  return (data as { response: string }).response
}

// ── Phase 1: direct Claude call ──────────────────────────────────────────────

export async function callVaroAnalyst(
  fullPrompt: string,
  temperature = 0.2
): Promise<unknown> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured')

  const client = new Anthropic({ apiKey })
  const msg = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 2048,
    temperature,
    messages: [{ role: 'user', content: fullPrompt }],
  })

  const rawText = msg.content[0].type === 'text' ? msg.content[0].text : ''
  if (!rawText) throw new Error('AI analyst returned an empty response')

  try {
    return JSON.parse(rawText)
  } catch {
    const stripped = rawText.replace(/^```(?:json)?\n?|\n?```$/g, '').trim()
    return JSON.parse(stripped)
  }
}
