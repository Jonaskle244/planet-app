import { planets } from '../data/planets'
import type { PlanetData } from '../data/planets'
import PlanetMesh from './PlanetMesh'
import SunMesh from './SunMesh'

interface SolarSystemProps {
  onSelectPlanet: (planet: PlanetData) => void
  selectedPlanetId: string | null
}

export default function SolarSystem({ onSelectPlanet, selectedPlanetId }: SolarSystemProps) {
  return (
    <group>
      <SunMesh />
      {planets.map((planet) => (
        <PlanetMesh
          key={planet.id}
          planet={planet}
          onSelect={onSelectPlanet}
          isSelected={planet.id === selectedPlanetId}
        />
      ))}
    </group>
  )
}
