import { useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import type { StarData } from '../data/planets'
import type { BodyPositionReporter } from '../types/scene'

const SUN_TEXTURE_URL = '/planet/sun/2k_sun.jpg'

const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const sunFragmentShader = `
  uniform sampler2D uMap;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec3 base = texture2D(uMap, vUv).rgb;

    float cells = noise(vUv * vec2(76.0, 42.0) + uTime * 0.12);
    float smallCells = noise(vUv * vec2(160.0, 96.0) - uTime * 0.09);
    float filaments =
      sin((vUv.x + uTime * 0.006) * 38.0 + sin(vUv.y * 17.0) * 2.2) *
      sin(vUv.y * 28.0 + uTime * 0.16);

    float limb = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
    float limbDarkening = mix(0.58, 1.12, pow(limb, 0.42));
    vec3 heat = vec3(1.0, 0.44, 0.06) * (cells - 0.5) * 0.12;
    vec3 fine = vec3(1.0, 0.78, 0.22) * (smallCells - 0.5) * 0.08;
    vec3 filamentColor = vec3(1.0, 0.32, 0.02) * filaments * 0.035;

    vec3 color = (base + heat + fine + filamentColor) * limbDarkening;
    color = color * 1.18 + vec3(0.09, 0.04, 0.01);
    color += vec3(1.0, 0.72, 0.28) * pow(1.0 - limb, 2.2) * 0.12;
    gl_FragColor = vec4(color, 1.0);
  }
`

const coronaVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const coronaFragmentShader = `
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float rim = 1.0 - max(0.0, dot(normalize(vNormal), normalize(vViewDir)));
    float edge = smoothstep(0.58, 1.0, rim);
    float waves = sin(vNormal.y * 28.0 + uTime * 0.65) * 0.06 +
      sin(vNormal.x * 19.0 - uTime * 0.45) * 0.04;
    float glow = pow(edge, 3.2) * uAlpha * (1.0 + waves);
    gl_FragColor = vec4(uColor, max(glow, 0.0));
  }
`

interface SunMeshProps {
  sun: StarData
  onSelect: (sun: StarData) => void
  isSelected: boolean
  isPaused: boolean
  onBodyPositionChange: BodyPositionReporter
}

export default function SunMesh({ sun, onSelect, isSelected, isPaused, onBodyPositionChange }: SunMeshProps) {
  const groupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const coronaRef = useRef<Group>(null)
  const innerCoronaRef = useRef<Mesh>(null)
  const outerCoronaRef = useRef<Mesh>(null)
  const animationTimeRef = useRef(0)
  const worldPositionRef = useRef(new THREE.Vector3())

  const rawTexture = useLoader(THREE.TextureLoader, SUN_TEXTURE_URL)
  const texture = useMemo(() => {
    const map = rawTexture.clone()
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    map.needsUpdate = true
    return map
  }, [rawTexture])

  const surfaceMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: sunVertexShader,
        fragmentShader: sunFragmentShader,
        uniforms: {
          uMap: { value: texture },
          uTime: { value: 0 },
        },
      }),
    [texture]
  )

  const innerCorona = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: coronaVertexShader,
        fragmentShader: coronaFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color('#ffe4a3') },
          uAlpha: { value: 0.045 },
          uTime: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  const outerCorona = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: coronaVertexShader,
        fragmentShader: coronaFragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color('#f4a841') },
          uAlpha: { value: 0.018 },
          uTime: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  useFrame((_, delta) => {
    if (!isPaused) {
      animationTimeRef.current += delta
    }

    for (const mesh of [meshRef.current, innerCoronaRef.current, outerCoronaRef.current]) {
      const material = mesh?.material
      if (material instanceof THREE.ShaderMaterial) {
        material.uniforms.uTime.value = animationTimeRef.current
      }
    }

    if (!isPaused && meshRef.current) meshRef.current.rotation.y += 0.0015
    if (!isPaused && coronaRef.current) coronaRef.current.rotation.z += 0.00045

    if (groupRef.current) {
      groupRef.current.getWorldPosition(worldPositionRef.current)
      onBodyPositionChange(sun.id, worldPositionRef.current)
    }
  }, -2)

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} material={surfaceMaterial}>
        <sphereGeometry args={[sun.radius, 96, 96]} />
      </mesh>

      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onSelect(sun)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      >
        <sphereGeometry args={[isSelected ? sun.radius * 1.08 : sun.radius * 1.05, 64, 64]} />
        <meshBasicMaterial color="#ffe08a" transparent opacity={isSelected ? 0.12 : 0} depthWrite={false} />
      </mesh>

      <group ref={coronaRef}>
        <mesh ref={innerCoronaRef} material={innerCorona}>
          <sphereGeometry args={[sun.radius * 1.05, 64, 64]} />
        </mesh>
        <mesh ref={outerCoronaRef} material={outerCorona}>
          <sphereGeometry args={[sun.radius * 1.4, 64, 64]} />
        </mesh>
      </group>
    </group>
  )
}
