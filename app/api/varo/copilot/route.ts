import { NextRequest, NextResponse } from 'next/server'
import { callAgentCopilot, callVaroAnalyst } from '@/lib/ai'
import { buildCopilotPrompt } from '@/lib/security'
import type { IncidentReport } from '@/types/varo'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, report } = body as {
      message: string
      report: IncidentReport
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let responseText: string

    if (process.env.AGENT_BACKEND_URL) {
      // Phase 2 — Copilot agent via Python backend
      responseText = await callAgentCopilot(message, report)
    } else {
      // Phase 1 fallback — direct Gemini call
      const prompt = buildCopilotPrompt(message, {
        incidentId: report.incidentId,
        alertSummary: report.alertSummary,
        affectedAssets: report.affectedAssets,
        severityScore: report.severityScore,
        severityLabel: report.severityLabel,
        operationalImpact: report.operationalImpact,
      })
      const raw = (await callVaroAnalyst(prompt, 0.4)) as { response: string }
      responseText =
        typeof raw?.response === 'string'
          ? raw.response
          : 'I was unable to process that question. Please try again.'
    }

    return NextResponse.json({ response: responseText })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Copilot unavailable'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
