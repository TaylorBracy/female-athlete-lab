const KEY = 'felab:ankle-insight-read'

/** In-memory fallback when sessionStorage is unavailable (e.g. strict private mode). */
let memoryAuthorized = false

export function authorizeAnkleInsightRead() {
  try {
    sessionStorage.setItem(KEY, '1')
    memoryAuthorized = false
    return true
  } catch {
    memoryAuthorized = true
    return true
  }
}

export function clearAnkleInsightRead() {
  memoryAuthorized = false
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

export function isAnkleInsightReadAuthorized(): boolean {
  if (memoryAuthorized) return true
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}
