import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Scene from './components/Scene'
import InfoPanel from './components/InfoPanel'
import BodySearch from './components/BodySearch'
import { focusBodies, focusBodyGroups, solarBodies, type CelestialBodyData } from './data/planets'
import { DEFAULT_SIMULATION_DAYS_PER_SECOND, REALTIME_DAYS_PER_SECOND } from './data/orbits'
import { formatUrlDate, readUrlState, writeUrlState, type ViewMode } from './utils/urlState'
import { releases } from './data/releaseNotes'

const timeSpeedOptions = [
  { label: 'Echtzeit', value: REALTIME_DAYS_PER_SECOND },
  { label: '0,25 Tage / Sek.', value: 0.25 },
  { label: '0,5 Tage / Sek.', value: 0.5 },
  { label: '1 Tag / Sek.', value: 1 },
  { label: '10 Tage / Sek.', value: 10 },
  { label: '30 Tage / Sek.', value: 30 },
]

// Verweildauer pro Stopp der automatischen Kamera-Tour.
const TOUR_STOP_MS = 6500

export default function App() {
  const initialUrlState = useMemo(() => readUrlState(), [])
  const [selected, setSelected] = useState<CelestialBodyData | null>(initialUrlState.body)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedFocus, setSelectedFocus] = useState(initialUrlState.focus)
  const [viewMode, setViewMode] = useState<ViewMode>(initialUrlState.view)
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false)
  const [releaseIndex, setReleaseIndex] = useState(0)
  const [simulationDate, setSimulationDate] = useState(initialUrlState.date)
  const simulationDateRef = useRef(simulationDate)
  const [timeSpeedDaysPerSecond, setTimeSpeedDaysPerSecond] = useState(DEFAULT_SIMULATION_DAYS_PER_SECOND)
  const [tourActive, setTourActive] = useState(false)
  const tourIndexRef = useRef(0)

  // Zustand teilbar machen: Körper, Fokus, Ansicht und Datum (Tages-Granularität)
  // ohne History-Spam in die URL spiegeln.
  const simulationDay = formatUrlDate(simulationDate)
  useEffect(() => {
    writeUrlState({
      bodyId: selected?.id ?? null,
      focus: selectedFocus,
      view: viewMode,
      dateString: simulationDay,
    })
  }, [selected, selectedFocus, viewMode, simulationDay])

  const isDarkMode = viewMode === 'dark'
  const panelClass = isDarkMode
    ? 'border-white/10 bg-slate-950/72 shadow-black/35 text-slate-50'
    : 'border-white/70 bg-white/80 shadow-slate-900/10 text-slate-950'
  const controlClass = isDarkMode
    ? 'border-slate-700 bg-slate-900/88 text-slate-100 focus:border-amber-300'
    : 'border-slate-200 bg-white/85 text-slate-900 focus:border-amber-300'
  const secondaryTextClass = isDarkMode ? 'text-slate-400' : 'text-slate-500'
  const releaseTextClass = isDarkMode ? 'text-slate-300' : 'text-slate-700'
  const releaseNotesPositionClass = releaseNotesOpen
    ? 'bottom-24 left-4 right-4 top-auto max-w-none sm:bottom-auto sm:left-6 sm:right-auto sm:top-28 sm:max-w-sm'
    : 'bottom-24 left-4 right-auto top-auto max-w-[12rem] sm:bottom-auto sm:left-6 sm:right-auto sm:top-28 sm:max-w-sm'
  const formattedSimulationDate = new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(simulationDate)

  const currentRelease = releases[releaseIndex]
  const formattedReleaseDate = new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${currentRelease.date}T12:00:00`))
  const pagerButtonClass = `flex h-6 w-6 items-center justify-center rounded-md border text-sm font-semibold leading-none transition disabled:cursor-not-allowed disabled:opacity-40 ${
    isDarkMode
      ? 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500'
      : 'border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300'
  }`

  const handleTodayClick = () => {
    const today = new Date()
    simulationDateRef.current = today
    setSimulationDate(today)
  }

  // Einen Reise-Stopp anfahren: Körper auswählen und in den Kamerafokus nehmen.
  const goToStop = useCallback((index: number) => {
    const body = solarBodies[index]
    tourIndexRef.current = index
    setSelected(body)
    setSelectedFocus(body.id)
  }, [])

  // Körper anspringen (Suchfeld): auswählen + fokussieren, beendet eine laufende Reise.
  const handleJumpTo = useCallback((body: CelestialBodyData) => {
    setTourActive(false)
    setSelected(body)
    setSelectedFocus(body.id)
  }, [])

  // Direkte Auswahl durch den Nutzer (3D-Klick, Planetenleiste): beendet die Reise.
  const handleUserSelect = useCallback((body: CelestialBodyData) => {
    setTourActive(false)
    setSelected(body)
  }, [])

  const startTour = useCallback(() => {
    setTourActive(true)
    goToStop(0)
  }, [goToStop])

  // Automatische Kamera-Tour: schaltet im festen Takt durch Sonne + Planeten.
  useEffect(() => {
    if (!tourActive) return
    const interval = window.setInterval(() => {
      goToStop((tourIndexRef.current + 1) % solarBodies.length)
    }, TOUR_STOP_MS)
    return () => window.clearInterval(interval)
  }, [tourActive, goToStop])

  return (
    <div
      className={`app-shell view-${viewMode} relative h-full w-full overflow-hidden transition-colors duration-500 ${
        isDarkMode ? 'text-slate-50' : 'text-slate-950'
      }`}
    >
      <Scene
        onSelectBody={handleUserSelect}
        selectedBodyId={selected?.id ?? null}
        isPaused={isPaused}
        selectedFocus={selectedFocus}
        viewMode={viewMode}
        simulationDateRef={simulationDateRef}
        timeSpeedDaysPerSecond={timeSpeedDaysPerSecond}
        onSimulationDateChange={setSimulationDate}
      />
      <InfoPanel body={selected} onClose={() => setSelected(null)} />

      <div className="pointer-events-none absolute left-1/2 top-4 z-30 hidden -translate-x-1/2 sm:top-6 lg:block">
        <BodySearch
          bodies={focusBodies}
          selectedId={selected?.id ?? null}
          onJump={handleJumpTo}
          isDarkMode={isDarkMode}
        />
      </div>

      <header className="pointer-events-none absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
        <div className={`pointer-events-auto rounded-lg border px-4 py-3 shadow-xl backdrop-blur-xl ${panelClass}`}>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-amber-700">
            Planetenmodell
          </p>
          <h1 className="mt-1 text-lg font-semibold leading-tight sm:text-xl">
            Sonnensystem
          </h1>
        </div>

        <div className="pointer-events-none flex max-w-[13rem] flex-col gap-2 sm:max-w-none sm:items-end">
          <button
            type="button"
            aria-pressed={isDarkMode}
            onClick={() => setViewMode((current) => (current === 'light' ? 'dark' : 'light'))}
            className={`pointer-events-auto rounded-lg border px-3 py-3 text-right shadow-xl backdrop-blur-xl transition sm:px-4 ${panelClass}`}
          >
            <span className={`block text-[0.64rem] font-semibold uppercase tracking-[0.18em] ${secondaryTextClass}`}>
              Ansicht
            </span>
            <span className="mt-2 flex items-center justify-end gap-2 text-xs font-semibold sm:gap-3 sm:text-sm">
              {isDarkMode ? 'Realistisch dunkel' : 'Realistisch hell'}
              <span
                className={`relative h-5 w-9 rounded-full border transition ${
                  isDarkMode ? 'border-slate-500 bg-slate-800' : 'border-amber-200 bg-amber-50'
                }`}
                aria-hidden="true"
              >
                <span
                  className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full transition ${
                    isDarkMode ? 'left-[1.15rem] bg-slate-100' : 'left-1 bg-amber-400'
                  }`}
                />
              </span>
            </span>
          </button>

          <div className={`pointer-events-auto flex w-full flex-col gap-2 rounded-lg border px-3 py-3 shadow-xl backdrop-blur-xl sm:w-auto sm:flex-row sm:items-end sm:px-4 ${panelClass}`}>
            <button
              type="button"
              onClick={() => setIsPaused((current) => !current)}
              className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900 shadow-sm transition hover:border-amber-300 hover:bg-white"
            >
              {isPaused ? 'Zeit starten' : 'Zeit pausieren'}
            </button>

            <button
              type="button"
              aria-pressed={tourActive}
              onClick={() => (tourActive ? setTourActive(false) : startTour())}
              className={`rounded-md border px-3 py-2 text-xs font-semibold shadow-sm transition ${
                tourActive
                  ? 'border-amber-400 bg-amber-400 text-amber-950 hover:bg-amber-300'
                  : isDarkMode
                    ? 'border-slate-700 bg-slate-900/85 text-slate-100 hover:border-slate-500'
                    : 'border-slate-200 bg-white/85 text-slate-700 hover:border-slate-300 hover:text-slate-950'
              }`}
            >
              {tourActive ? 'Reise beenden' : 'Reise starten'}
            </button>

            <div className="grid grid-cols-[1fr_auto] gap-2 sm:flex sm:items-end">
              <label className="flex min-w-0 flex-col gap-1 text-left">
                <span className={`text-[0.64rem] font-semibold uppercase tracking-[0.18em] ${secondaryTextClass}`}>
                  Speed
                </span>
                <select
                  value={timeSpeedDaysPerSecond}
                  onChange={(event) => setTimeSpeedDaysPerSecond(Number(event.target.value))}
                  className={`max-w-full rounded-md border px-2 py-2 text-xs font-semibold shadow-sm outline-none transition ${controlClass}`}
                >
                  {timeSpeedOptions.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={handleTodayClick}
                className={`rounded-md border px-3 py-2 text-xs font-semibold shadow-sm transition ${
                  isDarkMode
                    ? 'border-slate-700 bg-slate-900/85 text-slate-100 hover:border-slate-500'
                    : 'border-slate-200 bg-white/85 text-slate-700 hover:border-slate-300 hover:text-slate-950'
                }`}
              >
                Heute
              </button>
            </div>

            <label className="flex min-w-0 flex-col gap-1 text-left">
              <span className={`text-[0.64rem] font-semibold uppercase tracking-[0.18em] ${secondaryTextClass}`}>
                Fokus
              </span>
              <select
                value={selectedFocus}
                onChange={(event) => {
                  setTourActive(false)
                  setSelectedFocus(event.target.value)
                }}
                className={`max-w-full rounded-md border px-2 py-2 text-xs font-semibold shadow-sm outline-none transition ${controlClass}`}
              >
                {focusBodyGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.bodies.map((body) => (
                      <option key={body.id} value={body.id}>
                        {body.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <div className="flex min-w-[7.5rem] flex-col gap-1 text-left">
              <span className={`text-[0.64rem] font-semibold uppercase tracking-[0.18em] ${secondaryTextClass}`}>
                Datum
              </span>
              <span className={`rounded-md border px-2 py-2 text-xs font-semibold shadow-sm ${controlClass}`}>
                {formattedSimulationDate}
              </span>
            </div>
          </div>
        </div>
      </header>

      <aside
        className={`pointer-events-auto absolute z-20 rounded-lg border px-3 py-2 shadow-xl backdrop-blur-xl sm:px-4 sm:py-3 ${releaseNotesPositionClass} ${panelClass}`}
      >
        <button
          type="button"
          aria-expanded={releaseNotesOpen}
          onClick={() => setReleaseNotesOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <span>
            <span className={`block text-[0.64rem] font-semibold uppercase tracking-[0.18em] ${secondaryTextClass}`}>
              Release Notes
            </span>
            <span className={`${releaseNotesOpen ? 'block' : 'hidden'} mt-1 text-sm font-semibold sm:block`}>
              Versionsverlauf
            </span>
          </span>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-base font-semibold transition ${
              isDarkMode ? 'border-slate-700 bg-slate-900/80 text-slate-200' : 'border-slate-200 bg-white/80 text-slate-700'
            }`}
            aria-hidden="true"
          >
            {releaseNotesOpen ? '-' : '+'}
          </span>
        </button>

        {releaseNotesOpen && (
          <div className="mt-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Version {currentRelease.version} · {currentRelease.title}
                </p>
                <p className={`mt-0.5 text-[0.62rem] font-medium uppercase tracking-[0.16em] ${secondaryTextClass}`}>
                  {formattedReleaseDate} · {releaseIndex + 1} / {releases.length}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label="Ältere Version"
                  onClick={() => setReleaseIndex((current) => Math.min(current + 1, releases.length - 1))}
                  disabled={releaseIndex >= releases.length - 1}
                  className={pagerButtonClass}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Neuere Version"
                  onClick={() => setReleaseIndex((current) => Math.max(current - 1, 0))}
                  disabled={releaseIndex <= 0}
                  className={pagerButtonClass}
                >
                  ›
                </button>
              </div>
            </div>

            <ul className={`mt-3 space-y-2 text-xs leading-5 ${releaseTextClass}`}>
              {currentRelease.notes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <nav
        className={`pointer-events-auto absolute bottom-4 left-4 right-4 z-20 transition-[right] duration-300 sm:bottom-6 sm:left-6 ${
          selected ? 'sm:right-[25.5rem]' : 'sm:right-6'
        }`}
      >
        <div className={`flex gap-2 overflow-x-auto rounded-lg border p-2 shadow-2xl backdrop-blur-xl ${panelClass}`}>
          {solarBodies.map((body) => {
            const isActive = body.id === selected?.id

            return (
              <button
                key={body.id}
                type="button"
                onClick={() => handleUserSelect(body)}
                className={`flex min-w-24 items-center gap-2 rounded-md border px-3 py-2 text-left transition ${
                  isActive
                    ? 'border-amber-300 bg-amber-50 text-slate-950 shadow-sm'
                    : isDarkMode
                      ? 'border-transparent text-slate-300 hover:border-slate-600 hover:bg-slate-800/80 hover:text-white'
                      : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/75 hover:text-slate-950'
                }`}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: body.color }}
                  aria-hidden="true"
                />
                <span className="truncate text-xs font-semibold">{body.name}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
