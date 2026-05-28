export interface IncidentReport {
  incidentId: string
  alertSummary: string
  protocolContext: string
  attackScenario: string
  affectedAssets: string[]
  operationalImpact: string
  financialExposure: string
  severityScore: number
  severityLabel: string
  confidenceLevel: 'High' | 'Medium' | 'Low'
  confidenceReason: string
  responseSteps: string[]
  escalationRecommendation: string
  mitreId: string
  mitreTechnique: string
  mitreNote?: string
  requiresSafetyCheck?: boolean
}

export type FacilityType = 'energy' | 'manufacturing' | 'water' | 'oil_gas'
export type OperatingMode = 'COPILOT' | 'AUTOPILOT'

export interface StoredIncident {
  id: string
  report: IncidentReport
  facilityType: FacilityType
  mode: OperatingMode
  rawAlert: string
  createdAt: string
}

export type StepStatus = 'pending' | 'approved' | 'modified' | 'skipped'
