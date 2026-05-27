import { NextResponse } from 'next/server';
import { callVaroAnalyst } from '@/lib/ai/index.js';
import { buildKnowledgeContext } from '@/lib/knowledge/index.js';

// In-memory queue for MVP — replace with Firestore/Redis in Phase 2
const alertQueue = [];
const processedAlerts = new Map();

// Normalise alert payloads from Dragos, Claroty, Nozomi, or generic JSON
function normaliseAlert(payload, source) {
  if (source === 'dragos') {
    return {
      alertText: `${payload.title || 'OT Alert'}: ${payload.description || ''}. Asset: ${payload.asset || 'Unknown'}. Severity: ${payload.severity || 'Unknown'}. Timestamp: ${payload.timestamp || new Date().toISOString()}.`,
      facilityType: payload.facilityType || 'energy',
      source: 'dragos',
      rawPayload: payload,
    };
  }
  if (source === 'claroty') {
    return {
      alertText: `${payload.alert_name || 'OT Alert'}: ${payload.description || ''}. Device: ${payload.device_name || 'Unknown'} (${payload.ip || 'IP unknown'}). Category: ${payload.category || 'Unknown'}.`,
      facilityType: payload.site_type || 'energy',
      source: 'claroty',
      rawPayload: payload,
    };
  }
  if (source === 'nozomi') {
    return {
      alertText: `${payload.name || 'OT Alert'}: ${payload.description || ''}. Protocol: ${payload.protocol || 'Unknown'}. Source: ${payload.src_ip || 'Unknown'} → ${payload.dst_ip || 'Unknown'}.`,
      facilityType: 'energy',
      source: 'nozomi',
      rawPayload: payload,
    };
  }
  // Generic / custom format
  return {
    alertText: payload.alertText || payload.description || payload.message || JSON.stringify(payload),
    facilityType: payload.facilityType || 'energy',
    source: source || 'generic',
    rawPayload: payload,
  };
}

async function analyseAlert(normalised) {
  const { buildKnowledgeContext: getKnowledge } = await import('@/lib/knowledge/index.js');
  const knowledge = getKnowledge({ includeCompliance: true });

  const systemPrompt = `You are the Varo AI Analyst. Analyse this OT security alert and return a structured JSON report.
Return exactly the same 12-field JSON schema as the standard incident analysis.
${knowledge}

RULES:
- Return valid JSON only. No markdown.
- Financial exposure always a range. MITRE IDs must be real ATT&CK for ICS IDs.
- Flag physical process risk steps with [SAFETY CHECK REQUIRED].`;

  const raw = await callVaroAnalyst(
    systemPrompt,
    `<alert_content>\n${normalised.alertText}\n</alert_content>\n\nSource: ${normalised.source}\nFacility type: ${normalised.facilityType}`,
    { temperature: 0.2, maxTokens: 2048 }
  );

  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

// POST /api/ingest/webhook — receive alerts from monitoring tools
export async function POST(request) {
  try {
    const body = await request.json();
    const source = request.headers.get('x-alert-source') || body.source || 'generic';
    const webhookSecret = request.headers.get('x-webhook-secret');

    // Validate webhook secret if configured
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: true, message: 'Unauthorised.' }, { status: 401 });
    }

    const normalised = normaliseAlert(body, source);
    const incidentId = `VAR-${Date.now()}`;

    // Queue the alert
    alertQueue.push({ id: incidentId, normalised, status: 'queued', receivedAt: new Date().toISOString() });

    // Process asynchronously (fire and forget for MVP)
    setImmediate(async () => {
      try {
        const report = await analyseAlert(normalised);
        processedAlerts.set(incidentId, {
          id: incidentId,
          report,
          source: normalised.source,
          processedAt: new Date().toISOString(),
          status: 'complete',
        });
      } catch (err) {
        console.error(`[ingest/webhook] Processing failed for ${incidentId}:`, err);
        processedAlerts.set(incidentId, { id: incidentId, status: 'error', error: err.message });
      }
    });

    return NextResponse.json({ received: true, incidentId, status: 'queued' });
  } catch (err) {
    console.error('[ingest/webhook]', err);
    return NextResponse.json({ error: true, message: 'Invalid alert payload.' }, { status: 400 });
  }
}

// GET /api/ingest/webhook?id=VAR-xxx — poll for processed result
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ queue: alertQueue.slice(-20), processed: [...processedAlerts.values()].slice(-20) });
  }

  const result = processedAlerts.get(id);
  if (!result) {
    const queued = alertQueue.find((a) => a.id === id);
    return NextResponse.json(queued || { error: true, message: 'Alert not found.' }, { status: queued ? 200 : 404 });
  }

  return NextResponse.json(result);
}
