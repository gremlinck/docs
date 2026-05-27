import { NextResponse } from 'next/server';
import { callVaroAnalyst } from '@/lib/ai/index.js';
import { buildKnowledgeContext } from '@/lib/knowledge/index.js';
import { buildProfileContext } from '@/lib/profile/schema.js';

const SYSTEM_PROMPT = `You are the Varo AI Analyst performing OT security incident analysis.

You combine the expertise of:
- A senior OT security analyst with 20+ years in industrial environments
- A control systems engineer who understands industrial processes deeply
- A cyber threat intelligence analyst fluent in MITRE ATT&CK for ICS

You have deep expertise in industrial protocols: Modbus, DNP3,
IEC 61850, OPC-UA, Profinet, EtherNet/IP, BACnet, ICCP.

Analyse the submitted OT security alert and return a JSON object
with exactly these fields:

{
  "incidentId": "VAR-2026-[random 4 digits]",
  "alertSummary": "One sentence, plain language, max 25 words",
  "protocolContext": "2-3 sentences: what protocol, what the anomaly means in that protocol's context, why it is dangerous",
  "attackScenario": "Most likely attack pattern. Include MITRE ATT&CK for ICS technique name and ID.",
  "affectedAssets": ["list", "of", "assets", "at", "risk"],
  "operationalImpact": "Plain language: which equipment, which process, what fails, in what timeframe. No jargon.",
  "financialExposure": "Cost range if unaddressed. Base on $2.3M/hour energy sector downtime. Always a range.",
  "severityScore": 7,
  "severityLabel": "High",
  "confidenceLevel": "High",
  "confidenceReason": "One sentence explaining confidence",
  "responseSteps": [
    "Step 1 (0-5 min): Immediate action in OT-appropriate language",
    "Step 2 (0-30 min): Short-term containment action",
    "Step 3 (24 hrs): Follow-up and verification action"
  ],
  "escalationRecommendation": "Who to notify, when, and what to tell them",
  "mitreId": "T0831",
  "mitreTechnique": "Manipulation of Control"
}

RULES:
- Return valid JSON only. No markdown. No explanation outside the JSON.
- Never recommend actions that could cause physical harm.
- SAFETY OVERRIDE: Flag any step with physical process risk with [SAFETY CHECK REQUIRED].
- Financial exposure must always be a range, never a single number.
- MITRE IDs must be real ATT&CK for ICS technique IDs only — cite from the grounding knowledge.
- Always state confidence level (High/Medium/Low) and a one-sentence reason.
- Cite applicable NERC CIP, CIRCIA, or TSA requirements in escalationRecommendation where relevant.
- Speak in operational language — equipment, processes, consequences. Never pure IT jargon.`;

const REQUIRED_FIELDS = [
  'incidentId', 'alertSummary', 'protocolContext', 'attackScenario',
  'affectedAssets', 'operationalImpact', 'financialExposure',
  'severityScore', 'severityLabel', 'confidenceLevel', 'confidenceReason',
  'responseSteps', 'escalationRecommendation', 'mitreId', 'mitreTechnique',
];

const MITRE_ID_RE = /^T\d{4}$/;

const AUTOPILOT_EXCLUDED_CATEGORIES = [
  'safety_system_interaction',
  'physical_process_impact',
  'turbine_governor_access',
  'emergency_shutdown_system',
  'pressure_relief_valve',
  'high_severity_unknown',
];

function sanitiseAlert(text) {
  return text
    .replace(/[<>]/g, '')
    .replace(/\bignore\b.{0,50}\binstructions?\b/gi, '[FILTERED]')
    .trim()
    .slice(0, 5000);
}

function parseAIResponse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}

function validateReport(report) {
  for (const field of REQUIRED_FIELDS) {
    if (report[field] == null) return { valid: false, reason: `Missing field: ${field}` };
  }
  const score = report.severityScore;
  if (typeof score !== 'number' || score < 1 || score > 10) {
    return { valid: false, reason: 'severityScore must be 1–10' };
  }
  if (!MITRE_ID_RE.test(report.mitreId) && report.mitreId !== 'T0000') {
    return { valid: false, reason: `Invalid MITRE ID: ${report.mitreId}` };
  }
  return { valid: true };
}

function isSafeForAutopilot(report) {
  const text = JSON.stringify(report).toLowerCase();
  return !AUTOPILOT_EXCLUDED_CATEGORIES.some((cat) => text.includes(cat.replace(/_/g, ' ')));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { alertText, mode = 'COPILOT', facilityType = 'energy', facilityProfile } = body;

    if (!alertText || typeof alertText !== 'string' || alertText.trim().length === 0) {
      return NextResponse.json({ error: true, message: 'Alert text is required.' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: true, message: 'API key not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const sanitised = sanitiseAlert(alertText);
    const knowledgeContext = buildKnowledgeContext({ includeCompliance: true });
    const profileContext = facilityProfile ? buildProfileContext(facilityProfile) : '';

    const systemPrompt = SYSTEM_PROMPT + knowledgeContext + (profileContext ? `\n\n${profileContext}` : '');
    const userMessage = `<alert_content>\n${sanitised}\n</alert_content>\n\nOperating mode: ${mode}\nFacility type: ${facilityType}`;

    const raw = await callVaroAnalyst(systemPrompt, userMessage, { temperature: 0.2, maxTokens: 2048 });
    const report = parseAIResponse(raw);

    if (!report) {
      return NextResponse.json(
        { error: true, message: 'Analysis could not be completed. Please resubmit the alert.' },
        { status: 500 }
      );
    }

    const validation = validateReport(report);
    if (!validation.valid) {
      console.error('[varo/analyze] Validation failed:', validation.reason);
      return NextResponse.json(
        { error: true, message: 'Analysis could not be completed. Please resubmit the alert.' },
        { status: 500 }
      );
    }

    const effectiveMode =
      report.severityScore >= 8 ||
      report.confidenceLevel === 'Low' ||
      !isSafeForAutopilot(report)
        ? 'COPILOT'
        : mode;

    return NextResponse.json({ report, mode: effectiveMode });
  } catch (err) {
    console.error('[varo/analyze]', err);
    return NextResponse.json(
      { error: true, message: 'The Varo AI Analyst is currently unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
