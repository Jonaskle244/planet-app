import { useState } from 'react'
import Scene from './components/Scene'
import InfoPanel from './components/InfoPanel'
import { planets, type PlanetData } from './data/planets'

export default function App() {
  const [selected, setSelected] = useState<PlanetData | null>(null)

  return (
    <div className="app-shell relative h-full w-full overflow-hidden text-slate-950">
      <Scene onSelectPlanet={setSelected} selectedPlanetId={selected?.id ?? null} />
      <InfoPanel planet={selected} onClose={() => setSelected(null)} />

      <header className="pointer-events-none absolute left-4 right-4 top-4 z-20 flex items-start justify-between gap-4 sm:left-6 sm:right-6 sm:top-6">
        <div className="pointer-events-auto rounded-lg border border-white/70 bg-white/80 px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-amber-700">
            Planetenmodell
          </p>
          <h1 className="mt-1 text-lg font-semibold leading-tight text-slate-950 sm:text-xl">
            Sonnensystem
          </h1>
        </div>

        <div className="pointer-events-auto hidden rounded-lg border border-white/65 bg-white/75 px-4 py-3 text-right shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:block">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Ansicht
          </p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            Realistisch hell
          </p>
        </div>
      </header>

      <nav
        className={`pointer-events-auto absolute bottom-4 left-4 right-4 z-20 transition-[right] duration-300 sm:bottom-6 sm:left-6 ${
          selected ? 'sm:right-[25.5rem]' : 'sm:right-6'
        }`}
      >
        <div className="flex gap-2 overflow-x-auto rounded-lg border border-white/70 bg-white/80 p-2 shadow-2xl shadow-slate-950/15 backdrop-blur-xl">
          {planets.map((planet) => {
            const isActive = planet.id === selected?.id

            return (
              <button
                key={planet.id}
                type="button"
                onClick={() => setSelected(planet)}
                className={`flex min-w-24 items-center gap-2 rounded-md border px-3 py-2 text-left transition ${
                  isActive
                    ? 'border-amber-300 bg-amber-50 text-slate-950 shadow-sm'
                    : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/75 hover:text-slate-950'
                }`}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: planet.color }}
                  aria-hidden="true"
                />
                <span className="truncate text-xs font-semibold">{planet.name}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
