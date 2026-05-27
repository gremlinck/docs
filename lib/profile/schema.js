// Plant profile schema — customer's declared facility context
// Stored client-side in localStorage for MVP; enriches all AI calls

export const DEFAULT_PROFILE = {
  facilityType: 'energy',
  sector: 'electric_utility',
  monitoringTool: 'none',
  plcTypes: '',
  regulations: ['NERC_CIP'],
  siteName: '',
  configured: false,
};

export const SECTOR_OPTIONS = [
  { value: 'electric_utility', label: 'Electric Utility' },
  { value: 'oil_gas', label: 'Oil & Gas' },
  { value: 'water_wastewater', label: 'Water / Wastewater' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'chemical', label: 'Chemical' },
  { value: 'pipeline', label: 'Pipeline / Midstream' },
];

export const MONITORING_TOOL_OPTIONS = [
  { value: 'none', label: 'None / Not yet deployed' },
  { value: 'dragos', label: 'Dragos Platform' },
  { value: 'claroty', label: 'Claroty' },
  { value: 'nozomi', label: 'Nozomi Networks' },
  { value: 'armis', label: 'Armis' },
  { value: 'forescout', label: 'Forescout' },
  { value: 'tenable_ot', label: 'Tenable OT Security' },
];

export const REGULATION_OPTIONS = [
  { value: 'NERC_CIP', label: 'NERC CIP (electric utilities)' },
  { value: 'TSA_PIPELINE', label: 'TSA SD Pipeline-2021-02F' },
  { value: 'CIRCIA', label: 'CIRCIA (general critical infrastructure)' },
  { value: 'EPA', label: 'EPA Cybersecurity (water)' },
  { value: 'IEC_62443', label: 'IEC 62443' },
];

export function buildProfileContext(profile) {
  if (!profile || !profile.configured) return '';
  return `
CUSTOMER FACILITY CONTEXT:
  Site: ${profile.siteName || 'Not specified'}
  Sector: ${profile.sector}
  Facility type: ${profile.facilityType}
  Primary monitoring tool: ${profile.monitoringTool}
  PLC/DCS types in use: ${profile.plcTypes || 'Not specified'}
  Applicable regulations: ${(profile.regulations || []).join(', ')}

Tailor all analysis and recommendations to this specific environment.
Reference applicable regulations in response steps where relevant.
`.trim();
}
