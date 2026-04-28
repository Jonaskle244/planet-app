import { useState } from 'react'
import Scene from './components/Scene'
import InfoPanel from './components/InfoPanel'
import type { PlanetData } from './data/planets'

export default function App() {
  const [selected, setSelected] = useState<PlanetData | null>(null)

  return (
    <div className="relative w-full h-full">
      <Scene onSelectPlanet={setSelected} selectedPlanetId={selected?.id ?? null} />
      <InfoPanel planet={selected} onClose={() => setSelected(null)} />

      {/* Title */}
      <div className="absolute top-6 left-6 pointer-events-none">
        <h1 className="text-white text-xl font-semibold tracking-widest uppercase opacity-80">
          Solar System
        </h1>
        <p className="text-gray-400 text-xs mt-1">Klicke auf einen Planeten</p>
      </div>
    </div>
  )
}
