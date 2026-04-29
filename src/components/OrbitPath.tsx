import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { getOrbitPathPoints, type PlanetOrbitConfig } from '../data/orbits'

interface OrbitPathProps {
  orbitConfig: PlanetOrbitConfig
  isSelected: boolean
}

export default function OrbitPath({ orbitConfig, isSelected }: OrbitPathProps) {
  const geometry = useMemo(() => {
    const points = getOrbitPathPoints(orbitConfig).map((point) => new THREE.Vector3(...point))
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [orbitConfig])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial
        color={isSelected ? '#f7c86a' : '#c8d7e8'}
        transparent
        opacity={isSelected ? 0.42 : 0.16}
        depthWrite={false}
      />
    </lineLoop>
  )
}
