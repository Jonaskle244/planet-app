import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import type { PlanetData } from '../data/planets'
import Atmosphere from './Atmosphere'

interface PlanetMeshProps {
  planet: PlanetData
  onSelect: (planet: PlanetData) => void
  isSelected: boolean
}

const SPEED_FACTOR = 0.08

export default function PlanetMesh({ planet, onSelect, isSelected }: PlanetMeshProps) {
  const orbitGroupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)

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
        <ringGeometry args={[planet.distance - 0.04, planet.distance + 0.04, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.07} side={THREE.DoubleSide} />
      </mesh>

      {/* Planet at orbit position */}
      <group ref={orbitGroupRef}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(planet)
          }}
        >
          <sphereGeometry args={[planet.radius, 48, 48]} />
          <meshStandardMaterial
            color={planet.color}
            roughness={planet.roughness}
            metalness={planet.metalness}
            emissive={planet.color}
            emissiveIntensity={isSelected ? 0.3 : 0.05}
          />
        </mesh>

        {/* Atmosphere rim */}
        {planet.atmosphereOpacity > 0 && (
          <Atmosphere
            radius={planet.radius}
            color={planet.atmosphereColor}
            opacity={planet.atmosphereOpacity}
          />
        )}

        {/* Saturn rings */}
        {planet.hasRings && (
          <mesh rotation={[Math.PI / 5, 0, 0]}>
            <ringGeometry args={[planet.radius * 1.4, planet.radius * 2.4, 128]} />
            <meshBasicMaterial color="#c9b89a" transparent opacity={0.75} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </>
  )
}
