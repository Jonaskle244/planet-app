import { useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { planets, sun } from '../data/planets'
import type { CelestialBodyData } from '../data/planets'
import type { Vector3Tuple } from 'three'
import { MILLISECONDS_PER_DAY } from '../data/orbits'
import EarthMesh from './EarthMesh'
import PlanetMesh from './PlanetMesh'
import SunMesh from './SunMesh'
import type { BodyPositionReporter } from '../types/scene'

const MAX_SIMULATION_FRAME_DELTA = 1 / 30
const DATE_DISPLAY_UPDATE_INTERVAL = 0.45

interface SolarSystemProps {
  onSelectBody: (body: CelestialBodyData) => void
  selectedBodyId: string | null
  sunPosition: Vector3Tuple
  isPaused: boolean
  onBodyPositionChange: BodyPositionReporter
  simulationDateRef: MutableRefObject<Date>
  timeSpeedDaysPerSecond: number
  onSimulationDateChange: (simulationDate: Date) => void
}

export default function SolarSystem({
  onSelectBody,
  selectedBodyId,
  sunPosition,
  isPaused,
  onBodyPositionChange,
  simulationDateRef,
  timeSpeedDaysPerSecond,
  onSimulationDateChange,
}: SolarSystemProps) {
  const dateDisplayUpdateRef = useRef(0)

  useFrame((_, delta) => {
    if (isPaused) return

    const smoothDelta = Math.min(delta, MAX_SIMULATION_FRAME_DELTA)
    const nextSimulationDate = new Date(
      simulationDateRef.current.getTime() + smoothDelta * timeSpeedDaysPerSecond * MILLISECONDS_PER_DAY
    )
    simulationDateRef.current = nextSimulationDate
    dateDisplayUpdateRef.current += delta

    if (dateDisplayUpdateRef.current >= DATE_DISPLAY_UPDATE_INTERVAL) {
      dateDisplayUpdateRef.current = 0
      onSimulationDateChange(nextSimulationDate)
    }
  }, -3)

  return (
    <group>
      <group position={sunPosition}>
        <SunMesh
          sun={sun}
          onSelect={onSelectBody}
          isSelected={selectedBodyId === sun.id}
          isPaused={isPaused}
          onBodyPositionChange={onBodyPositionChange}
        />
      </group>
      {planets.map((planet) =>
        planet.id === 'earth' ? (
          <EarthMesh
            key={planet.id}
            planet={planet}
            onSelect={onSelectBody}
            isSelected={planet.id === selectedBodyId}
            selectedBodyId={selectedBodyId}
            sunPosition={sunPosition}
            onBodyPositionChange={onBodyPositionChange}
            simulationDateRef={simulationDateRef}
          />
        ) : (
          <PlanetMesh
            key={planet.id}
            planet={planet}
            onSelect={onSelectBody}
            isSelected={planet.id === selectedBodyId}
            selectedBodyId={selectedBodyId}
            onBodyPositionChange={onBodyPositionChange}
            simulationDateRef={simulationDateRef}
          />
        )
      )}
    </group>
  )
}
