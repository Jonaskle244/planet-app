import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh } from 'three'
import { createSunTexture } from '../utils/textures'

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float rim = 1.0 - max(0.0, dot(vNormal, vViewDir));
    float glow = pow(rim, 1.7);
    gl_FragColor = vec4(uColor, glow * uAlpha);
  }
`

export default function SunMesh() {
  const meshRef = useRef<Mesh>(null)

  const texture = useMemo(() => createSunTexture(), [])

  const innerCorona = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color('#ffe3a6') },
          uAlpha: { value: 0.46 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  const outerCorona = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color('#f7b955') },
          uAlpha: { value: 0.22 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002
  })

  return (
    <group>
      {/* Sun core with procedural texture */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 48, 48]} />
        <meshStandardMaterial
          map={texture}
          color="#fff2b8"
          emissive="#ffbf3d"
          emissiveIntensity={2.15}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Inner corona */}
      <mesh material={innerCorona}>
        <sphereGeometry args={[2.9, 32, 32]} />
      </mesh>

      {/* Outer corona */}
      <mesh material={outerCorona}>
        <sphereGeometry args={[4.5, 32, 32]} />
      </mesh>
    </group>
  )
}
