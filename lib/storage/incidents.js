// localStorage-based incident store for demo/MVP.
// Replace with Firestore in Phase 2.

const PREFIX = 'varoai_incident_';
const INDEX_KEY = 'varoai_incidents_index';

export function saveIncident(report, mode) {
  const id = report.incidentId;
  const entry = { id, report, mode, savedAt: new Date().toISOString() };

  localStorage.setItem(`${PREFIX}${id}`, JSON.stringify(entry));

  const index = getIndex();
  const existing = index.findIndex((i) => i.id === id);
  const summary = {
    id,
    savedAt: entry.savedAt,
    alertSummary: report.alertSummary,
    severityScore: report.severityScore,
    severityLabel: report.severityLabel,
    mitreId: report.mitreId,
    mode,
  };

  if (existing >= 0) {
    index[existing] = summary;
  } else {
    index.unshift(summary);
  }

  localStorage.setItem(INDEX_KEY, JSON.stringify(index.slice(0, 50)));
  return id;
}

export function getIndex() {
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getIncident(id) {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}${id}`) || 'null');
  } catch {
    return null;
  }
}

export function clearAll() {
  getIndex().forEach((i) => localStorage.removeItem(`${PREFIX}${i.id}`));
  localStorage.removeItem(INDEX_KEY);
}
