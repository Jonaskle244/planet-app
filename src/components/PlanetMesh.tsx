import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import type { PlanetData } from '../data/planets'
import Atmosphere from './Atmosphere'
import { createPlanetTexture, createSaturnRingTexture } from '../utils/textures'

interface PlanetMeshProps {
  planet: PlanetData
  onSelect: (planet: PlanetData) => void
  isSelected: boolean
}

const SPEED_FACTOR = 0.08

function initialAngleFor(id: string) {
  let hash = 0
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360
  }
  return THREE.MathUtils.degToRad(hash)
}

export default function PlanetMesh({ planet, onSelect, isSelected }: PlanetMeshProps) {
  const orbitGroupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const angleRef = useRef(initialAngleFor(planet.id))

  const texture = useMemo(() => createPlanetTexture(planet.id), [planet.id])
  const ringTexture = useMemo(() => (planet.hasRings ? createSaturnRingTexture() : null), [planet.hasRings])
  const axialTilt = useMemo(() => THREE.MathUtils.degToRad(planet.tilt), [planet.tilt])

  useFrame((_, delta) => {
    angleRef.current += delta * planet.speed * SPEED_FACTOR
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.x = Math.cos(angleRef.current) * planet.distance
      orbitGroupRef.current.position.z = Math.sin(angleRef.current) * planet.distance
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <>
      {/* Orbit path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.distance - 0.035, planet.distance + 0.035, 192]} />
        <meshBasicMaterial
          color={isSelected ? '#f7c86a' : '#c8d7e8'}
          transparent
          opacity={isSelected ? 0.34 : 0.13}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

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
            <meshStandardMaterial
              map={texture}
              color="#ffffff"
              roughness={planet.roughness}
              metalness={planet.metalness}
              emissive={planet.color}
              emissiveIntensity={isSelected ? 0.09 : 0.015}
              envMapIntensity={0.8}
            />
          </mesh>

          {/* Saturn rings */}
          {planet.hasRings && ringTexture && (
            <mesh rotation={[Math.PI / 2.65, 0, 0]}>
              <ringGeometry args={[planet.radius * 1.45, planet.radius * 2.55, 192, 10]} />
              <meshStandardMaterial
                map={ringTexture}
                color="#fff2cf"
                transparent
                opacity={0.88}
                roughness={0.82}
                metalness={0}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>

        {/* Atmosphere rim */}
        {planet.atmosphereOpacity > 0 && (
          <Atmosphere
            radius={planet.radius}
            color={planet.atmosphereColor}
            opacity={planet.atmosphereOpacity}
          />
        )}
      </group>
    </>
  )
}
