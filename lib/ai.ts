// AI engine layer — two modes:
//   1. AGENT_BACKEND_URL set → calls the Python A.G.E.N.T. Loop™ (Phase 2)
//   2. Fallback                → direct Gemini call (Phase 1)
//
// To swap Gemini → Claude at Month 3, change callVaroAnalystDirect() only.

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

// ── Phase 1: direct Gemini call — swap point for Claude migration ─────────────

export async function callVaroAnalyst(
  fullPrompt: string,
  temperature = 0.2
): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured')

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`AI analyst unavailable (${response.status}): ${err}`)
  }

  const data = await response.json()
  const rawText: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!rawText) throw new Error('AI analyst returned an empty response')

  try {
    return JSON.parse(rawText)
  } catch {
    const stripped = rawText.replace(/^```(?:json)?\n?|\n?```$/g, '').trim()
    return JSON.parse(stripped)
  }
}
