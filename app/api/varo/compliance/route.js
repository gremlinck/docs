import { NextResponse } from 'next/server';
import { callVaroAnalyst } from '@/lib/ai/index.js';
import { NERC_CIP_KNOWLEDGE } from '@/lib/knowledge/corpus/nerc-cip.js';
import { CIRCIA_KNOWLEDGE } from '@/lib/knowledge/corpus/circia.js';

const TEMPLATES = {
  CIRCIA: {
    name: 'CIRCIA 72-Hour Incident Report',
    authority: 'CISA',
    deadline: '72 hours from discovery',
    schema: `{
  "reportType": "CIRCIA_72HR",
  "reportingDeadline": "72 hours from incident discovery",
  "reportingAuthority": "CISA — report.cisa.gov",
  "incidentId": "from source report",
  "discoveryDateTime": "date/time analyst became aware",
  "criticalInfrastructureSector": "sector name",
  "entityDescription": "brief description of the reporting entity",
  "attackType": "type of cyber incident",
  "attackVector": "how attacker gained access",
  "affectedSystems": ["list of affected systems"],
  "dataCompromised": "description or 'No data compromised'",
  "operationalImpact": "impact on operations",
  "safetyImpact": "impact on safety systems or 'None identified'",
  "responseActionsTaken": ["actions taken so far"],
  "assistanceRequired": "type of federal assistance needed or 'None at this time'",
  "iocsSummary": "known indicators of compromise or 'Under investigation'",
  "draftNarrative": "Full 3-4 paragraph narrative suitable for submission to CISA. Plain language. No jargon."
}`,
  },
  NERC_CIP: {
    name: 'NERC CIP-008-6 Incident Response Report',
    authority: 'E-ISAC and CISA',
    deadline: '1 hour from determination as Reportable Cyber Security Incident',
    schema: `{
  "reportType": "NERC_CIP_008_6",
  "reportingDeadline": "1 hour from determination as Reportable incident",
  "reportingAuthority": "E-ISAC and CISA",
  "incidentId": "from source report",
  "cipStandardsTriggered": ["CIP-008-6", "list other applicable standards"],
  "besSystemsAffected": "High/Medium/Low impact BES Cyber Systems affected",
  "incidentDescription": "plain language description",
  "attackVector": "how the incident occurred",
  "affectedAssets": ["list of affected BES Cyber System assets"],
  "discoveryMethod": "how the incident was detected",
  "containmentActions": ["actions taken to contain"],
  "evidencePreserved": "description of evidence preservation actions per CIP-008-6 R5",
  "notificationLog": [{"recipient": "E-ISAC/CISA", "method": "phone/portal", "timestamp": ""}],
  "lessonLearned": "preliminary lesson learned for incident response plan update",
  "draftNarrative": "Full incident narrative suitable for E-ISAC submission. Reference applicable CIP requirements."
}`,
  },
  TSA_PIPELINE: {
    name: 'TSA SD Pipeline-2021-02F Cybersecurity Incident Report',
    authority: 'TSA',
    deadline: '24 hours from discovery',
    schema: `{
  "reportType": "TSA_SD_PIPELINE",
  "reportingDeadline": "24 hours from discovery",
  "reportingAuthority": "TSA Cybersecurity Division",
  "incidentId": "from source report",
  "operatorName": "pipeline operator name",
  "facilityDescription": "affected facility or pipeline segment",
  "incidentDateTime": "date/time of incident",
  "incidentDescription": "plain language description",
  "criticalFacilitiesAffected": "yes/no — which critical facilities",
  "operationalImpact": "impact on pipeline operations",
  "safetySystemsAffected": "yes/no — which safety systems",
  "containmentStatus": "contained/ongoing/unknown",
  "responseActions": ["actions taken"],
  "federalAgenciesNotified": ["list agencies notified"],
  "draftNarrative": "Full narrative for TSA submission. Reference TSA SD Pipeline-2021-02F requirements."
}`,
  },
};

const buildCompliancePrompt = (template) => `You are the Varo AI Analyst generating a compliance incident report draft.

Your output will be used as a first draft for regulatory submission. It must be:
- Accurate and based strictly on the incident data provided
- Formatted exactly as the JSON schema specifies
- Written in plain language suitable for regulators
- Complete — do not leave fields empty; use "Under investigation" or "Not applicable" where appropriate

TEMPLATE: ${template.name}
REPORTING AUTHORITY: ${template.authority}
DEADLINE: ${template.deadline}

REQUIRED OUTPUT SCHEMA:
${template.schema}

REGULATORY REFERENCE:
${template.name.includes('CIRCIA') ? CIRCIA_KNOWLEDGE : NERC_CIP_KNOWLEDGE}

Return valid JSON only matching the schema above. No markdown. No explanation outside the JSON.`;

export async function POST(request) {
  try {
    const { incidentReport, regulation = 'CIRCIA', facilityProfile } = await request.json();

    if (!incidentReport || !regulation) {
      return NextResponse.json({ error: true, message: 'incidentReport and regulation are required.' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY && !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: true, message: 'API key not configured.' }, { status: 500 });
    }

    const template = TEMPLATES[regulation];
    if (!template) {
      return NextResponse.json({ error: true, message: `Unknown regulation: ${regulation}` }, { status: 400 });
    }

    const facilityContext = facilityProfile
      ? `\nFACILITY: ${facilityProfile.siteName || 'Not specified'} — ${facilityProfile.sector} — Regulations: ${(facilityProfile.regulations || []).join(', ')}`
      : '';

    const userMessage = `Generate a ${template.name} draft based on this incident:\n\n${JSON.stringify(incidentReport, null, 2)}${facilityContext}`;

    const raw = await callVaroAnalyst(buildCompliancePrompt(template), userMessage, {
      temperature: 0.2,
      maxTokens: 3000,
    });

    let complianceReport;
    try {
      complianceReport = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        complianceReport = JSON.parse(cleaned);
      } catch {
        return NextResponse.json(
          { error: true, message: 'Compliance report could not be generated. Please try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      complianceReport,
      templateName: template.name,
      reportingAuthority: template.authority,
      deadline: template.deadline,
    });
  } catch (err) {
    console.error('[varo/compliance]', err);
    return NextResponse.json(
      { error: true, message: 'The compliance module is temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
