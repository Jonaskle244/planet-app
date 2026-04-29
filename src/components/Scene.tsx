import { useCallback, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import type { MutableRefObject, RefObject } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import SolarSystem from './SolarSystem'
import { focusBodies, type CelestialBodyData } from '../data/planets'
import type { BodyPositionMap, BodyPositionReporter } from '../types/scene'

const SUN_POSITION: [number, number, number] = [0, 0, 0]
const MAX_CONTROL_DISTANCE = 165
const MIN_PLANET_DISTANCE_FACTOR = 2.65
const MIN_PLANET_DISTANCE_FLOOR = 0.9
const MIN_SUN_DISTANCE_FACTOR = 3.35
const MIN_SUN_DISTANCE_FLOOR = 8
const FOCUS_RADIUS_BY_ID = Object.fromEntries(focusBodies.map((body) => [body.id, body.radius]))

interface SceneProps {
  onSelectBody: (body: CelestialBodyData) => void
  selectedBodyId: string | null
  isPaused: boolean
  selectedFocus: string
  viewMode: 'light' | 'dark'
  simulationDateRef: MutableRefObject<Date>
  timeSpeedDaysPerSecond: number
  onSimulationDateChange: (simulationDate: Date) => void
}

interface FocusControlsProps {
  bodyPositionsRef: RefObject<BodyPositionMap>
  selectedFocus: string
  defaultTarget: THREE.Vector3Tuple
}

function minDistanceForFocus(selectedFocus: string) {
  const radius = FOCUS_RADIUS_BY_ID[selectedFocus] ?? FOCUS_RADIUS_BY_ID.sun

  if (selectedFocus === 'sun') {
    return Math.max(radius * MIN_SUN_DISTANCE_FACTOR, MIN_SUN_DISTANCE_FLOOR)
  }

  return Math.max(radius * MIN_PLANET_DISTANCE_FACTOR, MIN_PLANET_DISTANCE_FLOOR)
}

function FocusControls({ bodyPositionsRef, selectedFocus, defaultTarget }: FocusControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const fallbackTarget = useMemo(() => new THREE.Vector3(...defaultTarget), [defaultTarget])
  const desiredTarget = useMemo(() => new THREE.Vector3(), [])
  const previousTarget = useMemo(() => new THREE.Vector3(), [])
  const targetDelta = useMemo(() => new THREE.Vector3(), [])
  const cameraDirection = useMemo(() => new THREE.Vector3(), [])
  const clampedCameraPosition = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    const trackedTarget = bodyPositionsRef.current[selectedFocus] ?? fallbackTarget
    desiredTarget.copy(trackedTarget)
    previousTarget.copy(controls.target)

    const smoothing = 1 - Math.exp(-delta * 5.2)
    controls.target.lerp(desiredTarget, smoothing)
    targetDelta.subVectors(controls.target, previousTarget)
    camera.position.add(targetDelta)
    controls.minDistance = minDistanceForFocus(selectedFocus)
    controls.maxDistance = MAX_CONTROL_DISTANCE

    const cameraDistance = camera.position.distanceTo(controls.target)
    if (cameraDistance < controls.minDistance) {
      cameraDirection.subVectors(camera.position, controls.target)
      if (cameraDirection.lengthSq() < 0.0001) {
        cameraDirection.set(0, 0, 1)
      } else {
        cameraDirection.normalize()
      }

      clampedCameraPosition.copy(controls.target).addScaledVector(cameraDirection, controls.minDistance)
      camera.position.lerp(clampedCameraPosition, smoothing)
    }

    controls.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={minDistanceForFocus(selectedFocus)}
      maxDistance={MAX_CONTROL_DISTANCE}
      maxPolarAngle={Math.PI * 0.72}
      target={defaultTarget}
    />
  )
}

export default function Scene({
  onSelectBody,
  selectedBodyId,
  isPaused,
  selectedFocus,
  viewMode,
  simulationDateRef,
  timeSpeedDaysPerSecond,
  onSimulationDateChange,
}: SceneProps) {
  const bodyPositionsRef = useRef<BodyPositionMap>({})
  const isDarkMode = viewMode === 'dark'
  const handleBodyPositionChange = useCallback<BodyPositionReporter>((id, position) => {
    const existingPosition = bodyPositionsRef.current[id]
    if (existingPosition) {
      existingPosition.copy(position)
      return
    }

    bodyPositionsRef.current[id] = position.clone()
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 28, 82], fov: 50, near: 0.1, far: 500 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.34
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.setClearColor(0x000000, 0)
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <fog attach="fog" args={[isDarkMode ? '#040816' : '#d7e4ef', isDarkMode ? 96 : 74, isDarkMode ? 242 : 178]} />

      <ambientLight intensity={0.018} />
      <hemisphereLight color="#fffaf0" groundColor="#8aa0b8" intensity={0.055} />

      <pointLight position={SUN_POSITION} intensity={58} distance={420} decay={1.08} color="#fff0b8" />
      <directionalLight position={[-28, 34, 38]} intensity={0.025} color="#d9efff" />

      <Stars
        radius={280}
        depth={80}
        count={isDarkMode ? 2600 : 900}
        factor={isDarkMode ? 2.05 : 1.15}
        saturation={isDarkMode ? 0.06 : 0.18}
        fade
        speed={isPaused ? 0 : 0.08}
      />

      <FocusControls
        bodyPositionsRef={bodyPositionsRef}
        selectedFocus={selectedFocus}
        defaultTarget={SUN_POSITION}
      />

      <SolarSystem
        onSelectBody={onSelectBody}
        selectedBodyId={selectedBodyId}
        sunPosition={SUN_POSITION}
        isPaused={isPaused}
        onBodyPositionChange={handleBodyPositionChange}
        simulationDateRef={simulationDateRef}
        timeSpeedDaysPerSecond={timeSpeedDaysPerSecond}
        onSimulationDateChange={onSimulationDateChange}
      />
    </Canvas>
  )
}
