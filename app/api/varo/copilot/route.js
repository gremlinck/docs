import { NextResponse } from 'next/server';

const buildSystemPrompt = (report) => `You are the Varo AI Analyst in Copilot mode, supporting a control or SCADA engineer during an active OT security incident.

ACTIVE INCIDENT CONTEXT:
Incident ID: ${report.incidentId}
Summary: ${report.alertSummary}
Affected assets: ${(report.affectedAssets || []).join(', ')}
Severity: ${report.severityScore}/10 — ${report.severityLabel}
Protocol context: ${report.protocolContext}
Attack scenario: ${report.attackScenario}
Operational impact: ${report.operationalImpact}

Your role:
- Answer the engineer's questions about this incident in operational terms
- Speak about equipment, processes, valves, pumps, setpoints — not CVEs
- Give specific, actionable guidance appropriate for a control engineer
- Always connect cyber events to physical consequences
- If you need more context about the specific environment, ask one targeted question
- Never recommend actions requiring IT security expertise to execute
- Never recommend anything that could cause physical harm or disrupt safety systems

Operating mode: COPILOT — all recommendations require engineer approval.
Keep responses under 150 words. Plain conversational text only — no JSON, no markdown headers.`;

async function callVaroAnalyst(systemPrompt, userMessage) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nEngineer: ${userMessage}` }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export async function POST(request) {
  try {
    const { message, report } = await request.json();

    if (!message || typeof message !== 'string' || !report) {
      return NextResponse.json({ error: true, reply: 'Invalid request.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: true, reply: 'API key not configured.' }, { status: 500 });
    }

    const sanitised = message.replace(/[<>]/g, '').slice(0, 500);
    const reply = await callVaroAnalyst(buildSystemPrompt(report), sanitised);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[varo/copilot]', err);
    return NextResponse.json(
      { reply: 'The Varo AI Analyst is temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
