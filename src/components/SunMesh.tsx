import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh } from 'three'

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
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float rim = 1.0 - max(0.0, dot(vNormal, vViewDir));
    float glow = pow(rim, 1.8) * 0.9;
    gl_FragColor = vec4(uColor, glow);
  }
`

export default function SunMesh() {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002
  })

  const innerCorona = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uColor: { value: new THREE.Color('#ffa030') } },
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
        uniforms: { uColor: { value: new THREE.Color('#ff5500') } },
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  return (
    <group>
      {/* Sun core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={2} roughness={1} metalness={0} />
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
