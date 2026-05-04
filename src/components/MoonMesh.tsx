import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useGLTF } from '@react-three/drei'
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

const MOON_TEXTURE_URL = '/planet/moons/earth/2k_moon.jpg'
const FULL_TURN = Math.PI * 2
const MAX_MOON_VISUAL_SPIN_RADIANS_PER_SECOND = Math.PI * 1.35

function shortestAngleDelta(from: number, to: number) {
  return THREE.MathUtils.euclideanModulo(to - from + Math.PI, FULL_TURN) - Math.PI
}

function prepareMoonTexture(rawTexture: THREE.Texture) {
  const map = rawTexture.clone()
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 8
  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.ClampToEdgeWrapping
  map.minFilter = THREE.LinearMipmapLinearFilter
  map.magFilter = THREE.LinearFilter
  map.needsUpdate = true
  return map
}

function TexturedMoonSurface({ moon }: { moon: MoonData }) {
  const rawTexture = useLoader(THREE.TextureLoader, moon.textureUrl ?? MOON_TEXTURE_URL)
  const texture = useMemo(() => prepareMoonTexture(rawTexture), [rawTexture])

  return (
    <mesh>
      <sphereGeometry args={[moon.radius, 48, 48]} />
      <meshStandardMaterial
        map={texture}
        color="#ffffff"
        roughness={moon.roughness}
        metalness={0}
        envMapIntensity={0}
      />
    </mesh>
  )
}

function GltfMoonSurface({ moon, modelUrl }: { moon: MoonData; modelUrl: string }) {
  const { scene } = useGLTF(modelUrl)

  const model = useMemo(() => {
    const clone = scene.clone(true)
    const bounds = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    bounds.getSize(size)
    bounds.getCenter(center)

    const maxDimension = Math.max(size.x, size.y, size.z) || 1
    const scale = (moon.radius * 2) / maxDimension
    const normalizedModel = new THREE.Group()
    clone.position.copy(center).multiplyScalar(-1)
    normalizedModel.scale.setScalar(scale)

    clone.traverse((object) => {
      const mesh = object as Mesh
      if (!mesh.isMesh) return

      const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const materials = sourceMaterials.map((material) => {
        if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
          const clonedMaterial = material.clone()
          clonedMaterial.roughness = Math.max(clonedMaterial.roughness, moon.roughness)
          clonedMaterial.metalness = 0
          clonedMaterial.envMapIntensity = 0
          return clonedMaterial
        }

        return new THREE.MeshStandardMaterial({
          color: moon.color,
          roughness: moon.roughness,
          metalness: 0,
          envMapIntensity: 0,
        })
      })

      mesh.material = Array.isArray(mesh.material) ? materials : materials[0]
    })

    normalizedModel.add(clone)

    return normalizedModel
  }, [moon.color, moon.radius, moon.roughness, scene])

  return <primitive object={model} />
}

export default function MoonMesh({
  moon,
  onSelect,
  isSelected,
  onBodyPositionChange,
  simulationDateRef,
}: MoonMeshProps) {
  const orbitConfig = satelliteOrbitConfigs[moon.id]
  const moonGroupRef = useRef<Group>(null)
  const bodyRef = useRef<Group>(null)
  const visualRotationRef = useRef(0)
  const worldPositionRef = useRef(new THREE.Vector3())
  const axialTilt = useMemo(() => THREE.MathUtils.degToRad(moon.tilt), [moon.tilt])

  const orbitGeometry = useMemo(() => {
    const points = getSatelliteOrbitPathPoints(orbitConfig).map((point) => new THREE.Vector3(...point))
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [orbitConfig])

  useEffect(() => () => orbitGeometry.dispose(), [orbitGeometry])

  useFrame((_, delta) => {
    if (moonGroupRef.current) {
      const [x, y, z] = getSatellitePosition(orbitConfig, simulationDateRef.current)
      moonGroupRef.current.position.set(x, y, z)
      moonGroupRef.current.getWorldPosition(worldPositionRef.current)
      onBodyPositionChange(moon.id, worldPositionRef.current)
    }

    if (bodyRef.current) {
      const targetRotation = getSatelliteRotationAngle(moon.id, simulationDateRef.current)
      const rotationStep = shortestAngleDelta(visualRotationRef.current, targetRotation)
      const maxRotationStep = MAX_MOON_VISUAL_SPIN_RADIANS_PER_SECOND * delta
      visualRotationRef.current += THREE.MathUtils.clamp(rotationStep, -maxRotationStep, maxRotationStep)
      bodyRef.current.rotation.y = visualRotationRef.current
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
          <group
            ref={bodyRef}
            onClick={handleSelect}
            onPointerOver={handlePointerOver}
            onPointerOut={() => {
              document.body.style.cursor = ''
            }}
          >
            {moon.renderStyle === 'gltf-model' && moon.modelUrl ? (
              <GltfMoonSurface moon={moon} modelUrl={moon.modelUrl} />
            ) : (
              <TexturedMoonSurface moon={moon} />
            )}
          </group>
        </group>
      </group>
    </>
  )
}
