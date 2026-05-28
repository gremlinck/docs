// Single AI call wrapper — to swap Gemini → Claude at Month 3, change only this function
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
    // Strip markdown code fences and retry — Gemini occasionally wraps output
    const stripped = rawText.replace(/^```(?:json)?\n?|\n?```$/g, '').trim()
    return JSON.parse(stripped)
  }
}
