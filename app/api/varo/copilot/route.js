import { NextResponse } from 'next/server';
import { callVaroAnalyst } from '@/lib/ai/index.js';
import { buildKnowledgeContext } from '@/lib/knowledge/index.js';
import { buildProfileContext } from '@/lib/profile/schema.js';

const buildSystemPrompt = (report, facilityProfile) => {
  const knowledgeContext = buildKnowledgeContext({ includeCompliance: false });
  const profileContext = facilityProfile ? buildProfileContext(facilityProfile) : '';

  return `You are the Varo AI Analyst in Copilot mode, supporting a control or SCADA engineer during an active OT security incident.

ACTIVE INCIDENT CONTEXT:
Incident ID: ${report.incidentId}
Summary: ${report.alertSummary}
Affected assets: ${(report.affectedAssets || []).join(', ')}
Severity: ${report.severityScore}/10 — ${report.severityLabel}
Protocol context: ${report.protocolContext}
Attack scenario: ${report.attackScenario}
Operational impact: ${report.operationalImpact}
MITRE technique: ${report.mitreId} — ${report.mitreTechnique}

Your role:
- Answer the engineer's questions about this incident in operational terms
- Speak about equipment, processes, valves, pumps, setpoints — not CVEs or IP addresses
- Give specific, actionable guidance appropriate for a control engineer
- Always connect cyber events to physical consequences
- Cite MITRE ATT&CK for ICS technique IDs and NERC CIP requirements where relevant
- If you need more context about the specific environment, ask one targeted question
- Never recommend actions that could cause physical harm or disrupt safety systems

Operating mode: COPILOT — all recommendations require engineer approval.
Keep responses under 150 words. Plain conversational text — no JSON, no markdown headers.${knowledgeContext}${profileContext ? `\n\n${profileContext}` : ''}`;
};

export async function POST(request) {
  try {
    const { message, report, facilityProfile } = await request.json();

    if (!message || typeof message !== 'string' || !report) {
      return NextResponse.json({ error: true, reply: 'Invalid request.' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: true, reply: 'API key not configured.' }, { status: 500 });
    }

    const sanitised = message.replace(/[<>]/g, '').slice(0, 500);
    const reply = await callVaroAnalyst(buildSystemPrompt(report, facilityProfile), sanitised, {
      temperature: 0.4,
      maxTokens: 512,
    });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[varo/copilot]', err);
    return NextResponse.json(
      { reply: 'The Varo AI Analyst is temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
