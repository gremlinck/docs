import { NextRequest, NextResponse } from 'next/server'
import { callAgentLoop, callVaroAnalyst } from '@/lib/ai'
import { validateReport, buildAnalystPrompt } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertText, facilityType, mode } = body as {
      alertText: string
      facilityType: string
      mode: string
    }

    if (!alertText?.trim()) {
      return NextResponse.json({ error: 'Alert text is required' }, { status: 400 })
    }

    let report: ReturnType<typeof validateReport>

    if (process.env.AGENT_BACKEND_URL) {
      // Phase 2 — A.G.E.N.T. Loop™ via Python backend
      const raw = await callAgentLoop(alertText, facilityType ?? 'energy', mode ?? 'COPILOT')
      report = validateReport(raw)
    } else {
      // Phase 1 fallback — direct Claude call
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
          {
            error:
              'The AI analyst is not configured. Add ANTHROPIC_API_KEY to .env.local or set AGENT_BACKEND_URL to point to the agent backend.',
          },
          { status: 503 }
        )
      }
      const prompt = buildAnalystPrompt(alertText, mode ?? 'COPILOT')
      const raw = await callVaroAnalyst(prompt, 0.2)
      report = validateReport(raw)
    }

    return NextResponse.json({ report, facilityType, mode })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
