import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import type { CelestialBodyData, MoonData } from '../data/planets'
import {
  getSatelliteOrbitPathPoints,
  getSatellitePosition,
  getSatelliteRotationAngle,
  satelliteOrbitConfigs,
} from '../data/orbits'
import type { BodyPositionReporter } from '../types/scene'

interface MoonMeshProps {
  moon: MoonData
  onSelect: (body: CelestialBodyData) => void
  isSelected: boolean
  onBodyPositionChange: BodyPositionReporter
  simulationDateRef: MutableRefObject<Date>
}

const MOON_TEXTURE_URL = '/planet/moon/2k_moon.jpg'

export default function MoonMesh({
  moon,
  onSelect,
  isSelected,
  onBodyPositionChange,
  simulationDateRef,
}: MoonMeshProps) {
  const orbitConfig = satelliteOrbitConfigs[moon.id]
  const moonGroupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const worldPositionRef = useRef(new THREE.Vector3())
  const axialTilt = useMemo(() => THREE.MathUtils.degToRad(moon.tilt), [moon.tilt])
  const rawTexture = useLoader(THREE.TextureLoader, MOON_TEXTURE_URL)

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

  const orbitGeometry = useMemo(() => {
    const points = getSatelliteOrbitPathPoints(orbitConfig).map((point) => new THREE.Vector3(...point))
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [orbitConfig])

  useEffect(() => () => orbitGeometry.dispose(), [orbitGeometry])

  useFrame(() => {
    if (moonGroupRef.current) {
      const [x, y, z] = getSatellitePosition(orbitConfig, simulationDateRef.current)
      moonGroupRef.current.position.set(x, y, z)
      moonGroupRef.current.getWorldPosition(worldPositionRef.current)
      onBodyPositionChange(moon.id, worldPositionRef.current)
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = getSatelliteRotationAngle(moon.id, simulationDateRef.current)
    }
  }, -2)

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect(moon)
  }

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    document.body.style.cursor = 'pointer'
  }

  return (
    <>
      <lineLoop geometry={orbitGeometry}>
        <lineBasicMaterial
          color={isSelected ? '#f7c86a' : '#d8e0ec'}
          transparent
          opacity={isSelected ? 0.52 : 0.22}
          depthWrite={false}
        />
      </lineLoop>

      <group ref={moonGroupRef}>
        <group rotation={[0, 0, axialTilt]}>
          <mesh
            ref={meshRef}
            onClick={handleSelect}
            onPointerOver={handlePointerOver}
            onPointerOut={() => {
              document.body.style.cursor = ''
            }}
          >
            <sphereGeometry args={[moon.radius, 48, 48]} />
            <meshStandardMaterial
              map={texture}
              color="#ffffff"
              roughness={moon.roughness}
              metalness={0}
              envMapIntensity={0}
            />
          </mesh>
        </group>
      </group>
    </>
  )
}
