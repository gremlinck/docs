import { NextRequest, NextResponse } from 'next/server';
import { consequenceAnalysisFlow } from '@/genkit/consequence-analysis';
import { AnalysisInputSchema } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AnalysisInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }
    const result = await consequenceAnalysisFlow(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/analyze]', err);
    return NextResponse.json({ error: 'Analysis failed. Check that GEMINI_API_KEY is set and try again.' }, { status: 500 });
  }
}

// Gemini 2.5 Pro can take up to 90 seconds on complex scenarios
export const maxDuration = 90;
