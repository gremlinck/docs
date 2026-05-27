import { MITRE_ICS_KNOWLEDGE } from './corpus/mitre-ics.js';
import { NERC_CIP_KNOWLEDGE } from './corpus/nerc-cip.js';
import { CIRCIA_KNOWLEDGE } from './corpus/circia.js';
import { PROTOCOLS_KNOWLEDGE } from './corpus/protocols.js';

// Inject grounding knowledge into system prompts.
// This is the core differentiator from generic ChatGPT — citation-rich, OT-specific context.
export function buildKnowledgeContext(options = {}) {
  const { includeCompliance = true } = options;

  const sections = [
    MITRE_ICS_KNOWLEDGE,
    PROTOCOLS_KNOWLEDGE,
    ...(includeCompliance ? [NERC_CIP_KNOWLEDGE, CIRCIA_KNOWLEDGE] : []),
  ];

  return `\n\nGROUNDING KNOWLEDGE — cite these sources in your response:\n${sections.join('\n\n')}`;
}
