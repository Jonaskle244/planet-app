import type { PlanetData } from '../data/planets'

interface InfoPanelProps {
  planet: PlanetData | null
  onClose: () => void
}

export default function InfoPanel({ planet, onClose }: InfoPanelProps) {
  return (
    <div
      className={`absolute right-0 top-0 z-30 h-full w-full overflow-y-auto border-l border-white/70 bg-white/90 text-slate-950 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl transition-transform duration-300 ease-in-out sm:w-96 ${
        planet ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
      }`}
    >
      {planet && (
        <div className="flex min-h-full flex-col gap-6 p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Planet
              </p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                {planet.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-xl leading-none text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
              aria-label="Schließen"
            >
              ×
            </button>
          </div>

          <div className="flex items-center gap-4 border-y border-slate-200/80 py-5">
            <div
              className="h-20 w-20 shrink-0 rounded-full shadow-lg ring-1 ring-white"
              style={{
                background: `radial-gradient(circle at 32% 30%, #ffffffcc 0, ${planet.color} 28%, #172033 115%)`,
                boxShadow: `0 18px 48px -22px ${planet.color}`,
              }}
            />
            <div className="grid flex-1 grid-cols-2 gap-3">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Monde
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{planet.moons}</p>
              </div>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Neigung
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{planet.tilt}°</p>
              </div>
            </div>
          </div>

          <p className="text-sm leading-6 text-slate-700">{planet.description}</p>

          <div className="flex flex-col gap-2.5">
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Daten &amp; Fakten
            </h3>
            {planet.facts.map((fact, i) => (
              <div
                key={i}
                className="rounded-md border border-slate-200/80 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-700"
              >
                {fact}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
