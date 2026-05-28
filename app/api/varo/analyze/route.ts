import { NextRequest, NextResponse } from 'next/server'
import { callVaroAnalyst } from '@/lib/ai'
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

    const prompt = buildAnalystPrompt(alertText, mode ?? 'COPILOT')
    const raw = await callVaroAnalyst(prompt, 0.2)
    const report = validateReport(raw)

    return NextResponse.json({ report, facilityType, mode })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Analysis failed'

    if (message.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        {
          error:
            'The AI analyst is not configured. Add GEMINI_API_KEY to your .env.local file and restart the server.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
