import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

interface SaturnRingsProps {
  radius: number
  isSelected: boolean
}

const RING_TEXTURE_URL = '/planet/saturn/2k_saturn_ring_alpha.png'
const ANGULAR_SEGMENTS = 384
const RADIAL_SEGMENTS = 96

function createTexturedRingGeometry(innerRadius: number, outerRadius: number) {
  const geometry = new THREE.BufferGeometry()
  const vertices: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (let radialIndex = 0; radialIndex <= RADIAL_SEGMENTS; radialIndex += 1) {
    const radialProgress = radialIndex / RADIAL_SEGMENTS
    const ringRadius = THREE.MathUtils.lerp(innerRadius, outerRadius, radialProgress)

    for (let segmentIndex = 0; segmentIndex <= ANGULAR_SEGMENTS; segmentIndex += 1) {
      const angle = (segmentIndex / ANGULAR_SEGMENTS) * Math.PI * 2
      vertices.push(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0)
      uvs.push(radialProgress, 0.5)
    }
  }

  const stride = ANGULAR_SEGMENTS + 1
  for (let radialIndex = 0; radialIndex < RADIAL_SEGMENTS; radialIndex += 1) {
    for (let segmentIndex = 0; segmentIndex < ANGULAR_SEGMENTS; segmentIndex += 1) {
      const current = radialIndex * stride + segmentIndex
      const next = current + stride

      indices.push(current, next, current + 1)
      indices.push(next, next + 1, current + 1)
    }
  }

  geometry.setIndex(indices)
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.computeVertexNormals()

  return geometry
}

export default function SaturnRings({ radius, isSelected }: SaturnRingsProps) {
  const innerRadius = radius * 1.42
  const outerRadius = radius * 2.72
  const rawTexture = useLoader(THREE.TextureLoader, RING_TEXTURE_URL)

  const ringTexture = useMemo(() => {
    const texture = rawTexture.clone()
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
    return texture
  }, [rawTexture])

  const geometry = useMemo(() => createTexturedRingGeometry(innerRadius, outerRadius), [innerRadius, outerRadius])

  return (
    <group rotation={[Math.PI / 2.72, 0, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={ringTexture}
          color="#fff7e8"
          transparent
          opacity={isSelected ? 0.98 : 0.92}
          alphaTest={0.015}
          roughness={0.95}
          metalness={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          envMapIntensity={0}
        />
      </mesh>
    </group>
  )
}
