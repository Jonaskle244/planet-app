import { focusBodies, type CelestialBodyData } from '../data/planets'

// Alle anspringbaren Körper (Sonne, Planeten, Monde) für die Rückauflösung aus der URL.
const bodyById = new Map<string, CelestialBodyData>(focusBodies.map((body) => [body.id, body]))

export type ViewMode = 'light' | 'dark'

const DEFAULT_FOCUS = 'sun'
const DEFAULT_VIEW: ViewMode = 'dark'

export interface InitialUrlState {
  body: CelestialBodyData | null
  focus: string
  view: ViewMode
  date: Date
}

export interface UrlStateSnapshot {
  bodyId: string | null
  focus: string
  view: ViewMode
  dateString: string
}

/** Simulationsdatum als YYYY-MM-DD in lokaler Zeit (Tages-Granularität reicht zum Teilen). */
export function formatUrlDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseUrlDate(value: string | null): Date {
  if (value) {
    const parsed = new Date(`${value}T12:00:00`)
    if (!Number.isNaN(parsed.getTime())) return parsed
  }
  return new Date()
}

/** Liest den geteilten Zustand aus der aktuellen URL (einmal beim Start). */
export function readUrlState(): InitialUrlState {
  const params = new URLSearchParams(window.location.search)
  const bodyId = params.get('body')
  const focusId = params.get('focus')

  return {
    body: (bodyId && bodyById.get(bodyId)) || null,
    focus: focusId && bodyById.has(focusId) ? focusId : DEFAULT_FOCUS,
    view: params.get('view') === 'light' ? 'light' : DEFAULT_VIEW,
    date: parseUrlDate(params.get('date')),
  }
}

/** Schreibt den aktuellen Zustand ohne History-Eintrag zurück in die URL. */
export function writeUrlState({ bodyId, focus, view, dateString }: UrlStateSnapshot): void {
  const params = new URLSearchParams()
  if (bodyId) params.set('body', bodyId)
  if (focus && focus !== DEFAULT_FOCUS) params.set('focus', focus)
  if (view !== DEFAULT_VIEW) params.set('view', view)
  params.set('date', dateString)

  const query = params.toString()
  window.history.replaceState(null, '', query ? `${window.location.pathname}?${query}` : window.location.pathname)
}
