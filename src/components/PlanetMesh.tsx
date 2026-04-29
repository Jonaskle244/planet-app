import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import type { CelestialBodyData, PlanetData } from '../data/planets'
import { getPlanetPosition, getPlanetRotationAngle, getRotationAngleForPeriod, planetOrbitConfigs } from '../data/orbits'
import OrbitPath from './OrbitPath'
import SaturnRings from './SaturnRings'
import { createPlanetTexture } from '../utils/textures'
import type { BodyPositionReporter } from '../types/scene'

interface PlanetMeshProps {
  planet: PlanetData
  onSelect: (planet: CelestialBodyData) => void
  isSelected: boolean
  onBodyPositionChange: BodyPositionReporter
  simulationDateRef: MutableRefObject<Date>
}

const VENUS_ATMOSPHERE_TEXTURE_URL = '/planet/venus/2k_venus_atmosphere.jpg'
const VENUS_ATMOSPHERE_OPACITY = 0.24
const VENUS_ATMOSPHERE_ROTATION_PERIOD_DAYS = -4
const DEBUG_VENUS_ATMOSPHERE = false
const PLANET_ROUGHNESS_FLOOR = 0.9

const PLANET_TEXTURE_URLS: Partial<Record<string, string>> = {
  mercury: '/planet/mercury/2k_mercury.jpg',
  venus: '/planet/venus/2k_venus_surface.jpg',
  mars: '/planet/mars/2k_mars.jpg',
  jupiter: '/planet/jupiter/2k_jupiter.jpg',
  saturn: '/planet/saturn/2k_saturn.jpg',
  uranus: '/planet/uranus/2k_uranus.jpg',
  neptune: '/planet/neptun/2k_neptune.jpg',
}

function textureUrlFor(id: string) {
  return PLANET_TEXTURE_URLS[id]
}

function roughnessFor(planet: PlanetData) {
  return Math.max(planet.roughness, PLANET_ROUGHNESS_FLOOR)
}

function PublicTextureMaterial({ planet }: { planet: PlanetData }) {
  const rawTexture = useLoader(THREE.TextureLoader, textureUrlFor(planet.id)!)
  const texture = useMemo(() => {
    const map = rawTexture.clone()
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    map.wrapS = THREE.RepeatWrapping
    map.wrapT = THREE.ClampToEdgeWrapping
    map.minFilter = THREE.LinearMipmapLinearFilter
    map.magFilter = THREE.LinearFilter
    map.needsUpdate = true
    return map
  }, [rawTexture])

  return (
    <meshStandardMaterial
      map={texture}
      color="#ffffff"
      roughness={roughnessFor(planet)}
      metalness={0}
      envMapIntensity={0}
      transparent={false}
      opacity={1}
    />
  )
}

function ProceduralTextureMaterial({ planet }: { planet: PlanetData }) {
  const texture = useMemo(() => createPlanetTexture(planet.id), [planet.id])

  return (
    <meshStandardMaterial
      map={texture}
      color="#ffffff"
      roughness={roughnessFor(planet)}
      metalness={0}
      envMapIntensity={0}
      transparent={false}
      opacity={1}
    />
  )
}

function VenusAtmosphereMaterial() {
  const rawTexture = useLoader(THREE.TextureLoader, VENUS_ATMOSPHERE_TEXTURE_URL)
  const texture = useMemo(() => {
    const map = rawTexture.clone()
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    map.wrapS = THREE.RepeatWrapping
    map.wrapT = THREE.ClampToEdgeWrapping
    map.minFilter = THREE.LinearMipmapLinearFilter
    map.magFilter = THREE.LinearFilter
    map.needsUpdate = true
    return map
  }, [rawTexture])

  useEffect(() => {
    console.log(
      '[Venus] atmosphere texture path',
      JSON.stringify({
        atmosphere: VENUS_ATMOSPHERE_TEXTURE_URL,
        surface: PLANET_TEXTURE_URLS.venus,
        debugAtmosphere: DEBUG_VENUS_ATMOSPHERE,
      })
    )
  }, [])

  return (
    <meshStandardMaterial
      map={texture}
      color="#fff0c8"
      roughness={1}
      metalness={0}
      envMapIntensity={0}
      transparent
      opacity={DEBUG_VENUS_ATMOSPHERE ? 0.28 : VENUS_ATMOSPHERE_OPACITY}
      depthWrite={false}
      side={THREE.DoubleSide}
      blending={THREE.NormalBlending}
    />
  )
}

export default function PlanetMesh({
  planet,
  onSelect,
  isSelected,
  onBodyPositionChange,
  simulationDateRef,
}: PlanetMeshProps) {
  const orbitGroupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const venusAtmosphereRef = useRef<Mesh>(null)
  const worldPositionRef = useRef(new THREE.Vector3())

  const axialTilt = useMemo(() => THREE.MathUtils.degToRad(planet.tilt), [planet.tilt])
  const hasPublicTexture = Boolean(textureUrlFor(planet.id))
  const isVenus = planet.id === 'venus'
  const orbitConfig = planetOrbitConfigs[planet.id]

  useFrame(() => {
    if (orbitGroupRef.current) {
      const [x, y, z] = getPlanetPosition(orbitConfig, simulationDateRef.current)
      orbitGroupRef.current.position.set(x, y, z)
      orbitGroupRef.current.getWorldPosition(worldPositionRef.current)
      onBodyPositionChange(planet.id, worldPositionRef.current)
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = getPlanetRotationAngle(planet.id, simulationDateRef.current)
    }
    if (venusAtmosphereRef.current) {
      venusAtmosphereRef.current.rotation.y = getRotationAngleForPeriod(
        simulationDateRef.current,
        VENUS_ATMOSPHERE_ROTATION_PERIOD_DAYS
      )
    }
  }, -2)

  return (
    <>
      <OrbitPath orbitConfig={orbitConfig} isSelected={isSelected} />

      {/* Planet at orbit position */}
      <group ref={orbitGroupRef}>
        <group rotation={[0, 0, axialTilt]}>
          <mesh
            ref={meshRef}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(planet)
            }}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = ''
            }}
          >
            <sphereGeometry args={[planet.radius, 72, 72]} />
            {hasPublicTexture ? (
              <PublicTextureMaterial planet={planet} />
            ) : (
              <ProceduralTextureMaterial planet={planet} />
            )}
          </mesh>

          {isVenus && (
            <mesh
              ref={venusAtmosphereRef}
              renderOrder={2}
              scale={1.022}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(planet)
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                document.body.style.cursor = ''
              }}
            >
              <sphereGeometry args={[planet.radius, 72, 72]} />
              <VenusAtmosphereMaterial />
            </mesh>
          )}

          {/* Saturn rings */}
          {planet.hasRings && <SaturnRings radius={planet.radius} isSelected={isSelected} />}
        </group>
      </group>
    </>
  )
}
