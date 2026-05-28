import type { StoredIncident } from '@/types/varo'

const PREFIX = 'varo-incident-'

export function saveIncident(incident: StoredIncident): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PREFIX + incident.id, JSON.stringify(incident))
}

export function loadIncident(id: string): StoredIncident | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(PREFIX + id)
  return raw ? (JSON.parse(raw) as StoredIncident) : null
}

export function listIncidents(): StoredIncident[] {
  if (typeof window === 'undefined') return []
  const results: StoredIncident[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(PREFIX)) {
      const raw = localStorage.getItem(key)
      if (raw) results.push(JSON.parse(raw) as StoredIncident)
    }
  }
  return results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}
