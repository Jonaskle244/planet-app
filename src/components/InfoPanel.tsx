import type { PlanetData } from '../data/planets'

interface InfoPanelProps {
  planet: PlanetData | null
  onClose: () => void
}

export default function InfoPanel({ planet, onClose }: InfoPanelProps) {
  return (
    <div
      className={`absolute top-0 right-0 h-full w-80 bg-gray-900/85 backdrop-blur-md border-l border-white/10 text-white transition-transform duration-300 ease-in-out overflow-y-auto ${
        planet ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {planet && (
        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-wide">{planet.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Schließen"
            >
              ✕
            </button>
          </div>

          <div
            className="w-20 h-20 rounded-full self-center shadow-lg"
            style={{
              backgroundColor: planet.color,
              boxShadow: `0 0 30px 6px ${planet.color}55`,
            }}
          />

          <p className="text-gray-300 text-sm leading-relaxed">{planet.description}</p>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Daten &amp; Fakten
            </h3>
            {planet.facts.map((fact, i) => (
              <div key={i} className="bg-white/5 rounded-lg px-4 py-2.5 text-sm text-gray-200">
                {fact}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Monde</p>
              <p className="text-white text-xl font-semibold">{planet.moons}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Achsenneigung</p>
              <p className="text-white text-xl font-semibold">{planet.tilt}°</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
