import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { TIFFLoader } from 'three/examples/jsm/loaders/TIFFLoader.js'
import type { Group, Mesh } from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { earthMoon, type CelestialBodyData, type PlanetData } from '../data/planets'
import { getPlanetPosition, getPlanetRotationAngle, getRotationAngleForPeriod, planetOrbitConfigs } from '../data/orbits'
import MoonMesh from './MoonMesh'
import OrbitPath from './OrbitPath'
import type { BodyPositionReporter } from '../types/scene'

interface EarthMeshProps {
  planet: PlanetData
  onSelect: (planet: CelestialBodyData) => void
  isSelected: boolean
  selectedBodyId: string | null
  sunPosition: THREE.Vector3Tuple
  onBodyPositionChange: BodyPositionReporter
  simulationDateRef: MutableRefObject<Date>
}

const EARTH_CLOUD_ROTATION_PERIOD_DAYS = 1.18
const EARTH_CLOUD_OPACITY = 0.45

type EarthDebugLayer = 'normal' | 'dayOnly' | 'nightOnly' | 'cloudOnly' | 'noClouds'

// Temporarily switch this to isolate texture/render issues without touching Pause/Focus.
const DEBUG_EARTH_LAYER: EarthDebugLayer = 'normal'

const EARTH_TEXTURE_URLS = {
  day: '/planet/earth/2k_earth_daymap.jpg',
  night: '/planet/earth/2k_earth_nightmap.jpg',
  // Verified on disk: the current asset is "clouds", not "cloude".
  clouds: '/planet/earth/2k_earth_clouds.jpg',
  normal: '/planet/earth/2k_earth_normal_map.tif',
  specular: '/planet/earth/2k_earth_specular_map.tif',
} as const

const EARTH_DEBUG_LAYER_VALUE: Record<EarthDebugLayer, number> = {
  normal: 0,
  dayOnly: 1,
  nightOnly: 2,
  cloudOnly: 3,
  noClouds: 4,
}

const earthSurfaceVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const earthSurfaceFragmentShader = `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform sampler2D uNormalMap;
  uniform sampler2D uSpecularMap;
  uniform vec3 uSunPosition;
  uniform float uSelected;
  uniform float uNormalStrength;
  uniform float uSpecularStrength;
  uniform float uDebugLayer;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  vec2 textureSafeUv(vec2 uv) {
    return clamp(uv, vec2(0.001), vec2(0.999));
  }

  vec3 perturbNormal(vec3 surfaceNormal, vec3 mapNormal) {
    vec3 q0 = dFdx(vWorldPosition);
    vec3 q1 = dFdy(vWorldPosition);
    vec2 st0 = dFdx(vUv);
    vec2 st1 = dFdy(vUv);
    vec3 q1Perp = cross(q1, surfaceNormal);
    vec3 q0Perp = cross(surfaceNormal, q0);
    vec3 tangent = q1Perp * st0.x + q0Perp * st1.x;
    vec3 bitangent = q1Perp * st0.y + q0Perp * st1.y;
    float det = max(max(dot(tangent, tangent), dot(bitangent, bitangent)), 0.00001);
    float scale = inversesqrt(det);
    mat3 tbn = mat3(tangent * scale, bitangent * scale, surfaceNormal);
    return normalize(tbn * mapNormal);
  }

  void main() {
    vec2 uv = vec2(fract(vUv.x), vUv.y);
    uv = clamp(uv, vec2(0.001), vec2(0.999));
    vec2 sampleUv = textureSafeUv(uv);
    vec3 geometricNormal = normalize(vWorldNormal);
    float poleFade = smoothstep(0.12, 0.24, uv.y) * (1.0 - smoothstep(0.76, 0.88, uv.y));
    vec3 mapNormal = texture2D(uNormalMap, sampleUv).xyz * 2.0 - 1.0;
    mapNormal.xy *= uNormalStrength;
    mapNormal = normalize(mapNormal);
    vec3 detailNormal = normalize(mix(geometricNormal, perturbNormal(geometricNormal, mapNormal), poleFade));
    vec3 sunDirection = normalize(uSunPosition - vWorldPosition);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float light = dot(geometricNormal, sunDirection);
    float dayAmount = smoothstep(-0.18, 0.24, light);
    float nightAmount = 1.0 - smoothstep(-0.32, 0.08, light);
    float sunlight = clamp(light, 0.0, 1.0);
    float detailSunlight = clamp(dot(detailNormal, sunDirection), 0.0, 1.0);
    float specularMask = clamp(texture2D(uSpecularMap, sampleUv).r, 0.0, 1.0);

    vec3 dayColor = texture2D(uDayMap, sampleUv).rgb;
    vec3 nightColor = texture2D(uNightMap, sampleUv).rgb;

    if (uDebugLayer > 0.5 && uDebugLayer < 1.5) {
      gl_FragColor = vec4(dayColor, 1.0);
      return;
    }
    if (uDebugLayer > 1.5 && uDebugLayer < 2.5) {
      gl_FragColor = vec4(nightColor * 1.6, 1.0);
      return;
    }
    if (uDebugLayer > 2.5 && uDebugLayer < 3.5) {
      gl_FragColor = vec4(0.015, 0.025, 0.04, 1.0);
      return;
    }

    vec3 litDayColor = dayColor * (0.36 + 0.82 * pow(sunlight, 0.52));
    vec3 cityLights = nightColor * (1.08 + nightAmount * 0.5);
    vec3 color = mix(cityLights, litDayColor, dayAmount);
    vec3 reflection = reflect(-sunDirection, detailNormal);
    float oceanGlint = pow(max(dot(reflection, viewDirection), 0.0), 36.0) * specularMask * dayAmount * detailSunlight;

    float terminator = 1.0 - smoothstep(0.02, 0.34, abs(light));
    color += vec3(0.08, 0.18, 0.32) * terminator * 0.2;
    color += nightColor * nightAmount * 0.18;
    color += vec3(0.55, 0.72, 0.88) * oceanGlint * uSpecularStrength;
    color += vec3(0.22, 0.44, 0.72) * uSelected * 0.08;

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
  }
`

const earthCloudVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const earthCloudFragmentShader = `
  uniform sampler2D uCloudMap;
  uniform vec3 uSunPosition;
  uniform float uCloudOpacity;
  uniform float uDebugLayer;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  vec2 textureSafeUv(vec2 uv) {
    return clamp(uv, vec2(0.001), vec2(0.999));
  }

  void main() {
    vec2 uv = vec2(fract(vUv.x), vUv.y);
    uv = textureSafeUv(uv);
    vec3 cloudSample = texture2D(uCloudMap, uv).rgb;
    float cloud = dot(cloudSample, vec3(0.3333));
    vec3 normal = normalize(vWorldNormal);
    vec3 sunDirection = normalize(uSunPosition - vWorldPosition);
    float light = dot(normal, sunDirection);
    float dayAmount = smoothstep(-0.18, 0.24, light);
    float cloudMask = smoothstep(0.018, 0.32, cloud);
    float debugBoost = uDebugLayer > 2.5 && uDebugLayer < 3.5 ? 1.35 : 1.0;
    float alpha = cloudMask * uCloudOpacity * mix(0.36, 1.0, dayAmount) * debugBoost;
    vec3 color = mix(vec3(0.58, 0.62, 0.66), vec3(1.0, 0.98, 0.9), dayAmount);

    gl_FragColor = vec4(color, alpha);
  }
`

const earthAtmosphereVertexShader = `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const earthAtmosphereFragmentShader = `
  uniform vec3 uSunPosition;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 sunDirection = normalize(uSunPosition - vWorldPosition);
    float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.7);
    float dayAmount = smoothstep(-0.22, 0.32, dot(normal, sunDirection));
    float alpha = rim * mix(0.028, 0.115, dayAmount);
    vec3 color = vec3(0.32, 0.58, 0.95);

    gl_FragColor = vec4(color, alpha);
  }
`

function useEarthTexture(url: string) {
  const rawTexture = useLoader(THREE.TextureLoader, url)

  return useMemo(() => {
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
}

function useEarthDataTexture(url: string) {
  const rawTexture = useLoader(TIFFLoader, url)

  return useMemo(() => {
    const map = rawTexture.clone()
    map.colorSpace = THREE.NoColorSpace
    map.anisotropy = 8
    map.wrapS = THREE.RepeatWrapping
    map.wrapT = THREE.ClampToEdgeWrapping
    map.minFilter = THREE.LinearMipmapLinearFilter
    map.magFilter = THREE.LinearFilter
    map.needsUpdate = true
    return map
  }, [rawTexture])
}

function useEarthMaterials(isSelected: boolean, sunPosition: THREE.Vector3Tuple) {
  const dayMap = useEarthTexture(EARTH_TEXTURE_URLS.day)
  const nightMap = useEarthTexture(EARTH_TEXTURE_URLS.night)
  const cloudMap = useEarthTexture(EARTH_TEXTURE_URLS.clouds)
  const normalMap = useEarthDataTexture(EARTH_TEXTURE_URLS.normal)
  const specularMap = useEarthDataTexture(EARTH_TEXTURE_URLS.specular)
  const sunPositionVector = useMemo(() => new THREE.Vector3(...sunPosition), [sunPosition])
  const debugLayerValue = EARTH_DEBUG_LAYER_VALUE[DEBUG_EARTH_LAYER]

  useEffect(() => {
    console.log(
      '[EarthMesh] texture paths',
      JSON.stringify({
        ...EARTH_TEXTURE_URLS,
        debugLayer: DEBUG_EARTH_LAYER,
        resolvedCloudAsset: 'public/planet/earth/2k_earth_clouds.jpg',
      })
    )
  }, [])

  const surfaceMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: earthSurfaceVertexShader,
        fragmentShader: earthSurfaceFragmentShader,
        uniforms: {
          uDayMap: { value: dayMap },
          uNightMap: { value: nightMap },
          uNormalMap: { value: normalMap },
          uSpecularMap: { value: specularMap },
          uSunPosition: { value: sunPositionVector.clone() },
          uSelected: { value: isSelected ? 1 : 0 },
          uNormalStrength: { value: 0.12 },
          uSpecularStrength: { value: 0.18 },
          uDebugLayer: { value: debugLayerValue },
        },
      }),
    [dayMap, debugLayerValue, isSelected, nightMap, normalMap, specularMap, sunPositionVector]
  )

  const cloudMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: earthCloudVertexShader,
        fragmentShader: earthCloudFragmentShader,
        uniforms: {
          uCloudMap: { value: cloudMap },
          uSunPosition: { value: sunPositionVector.clone() },
          uCloudOpacity: { value: DEBUG_EARTH_LAYER === 'cloudOnly' ? 0.65 : EARTH_CLOUD_OPACITY },
          uDebugLayer: { value: debugLayerValue },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
      }),
    [cloudMap, debugLayerValue, sunPositionVector]
  )

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: earthAtmosphereVertexShader,
        fragmentShader: earthAtmosphereFragmentShader,
        uniforms: {
          uSunPosition: { value: sunPositionVector.clone() },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    [sunPositionVector]
  )

  return { surfaceMaterial, cloudMaterial, atmosphereMaterial }
}

export default function EarthMesh({
  planet,
  onSelect,
  isSelected,
  selectedBodyId,
  sunPosition,
  onBodyPositionChange,
  simulationDateRef,
}: EarthMeshProps) {
  const orbitGroupRef = useRef<Group>(null)
  const surfaceRef = useRef<Mesh>(null)
  const cloudsRef = useRef<Mesh>(null)
  const atmosphereRef = useRef<Mesh>(null)
  const worldPositionRef = useRef(new THREE.Vector3())

  const axialTilt = useMemo(() => THREE.MathUtils.degToRad(planet.tilt), [planet.tilt])
  const { surfaceMaterial, cloudMaterial, atmosphereMaterial } = useEarthMaterials(isSelected, sunPosition)
  const orbitConfig = planetOrbitConfigs[planet.id]

  useFrame(() => {
    if (orbitGroupRef.current) {
      const [x, y, z] = getPlanetPosition(orbitConfig, simulationDateRef.current)
      orbitGroupRef.current.position.set(x, y, z)
      orbitGroupRef.current.getWorldPosition(worldPositionRef.current)
      onBodyPositionChange(planet.id, worldPositionRef.current)
    }

    if (surfaceRef.current) {
      surfaceRef.current.rotation.y = getPlanetRotationAngle(planet.id, simulationDateRef.current)
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = getRotationAngleForPeriod(
        simulationDateRef.current,
        EARTH_CLOUD_ROTATION_PERIOD_DAYS
      )
    }

    const currentSurfaceMaterial = surfaceRef.current?.material
    if (currentSurfaceMaterial instanceof THREE.ShaderMaterial) {
      currentSurfaceMaterial.uniforms.uSunPosition.value.set(...sunPosition)
      currentSurfaceMaterial.uniforms.uSelected.value = isSelected ? 1 : 0
      currentSurfaceMaterial.uniforms.uDebugLayer.value = EARTH_DEBUG_LAYER_VALUE[DEBUG_EARTH_LAYER]
    }

    const currentCloudMaterial = cloudsRef.current?.material
    if (currentCloudMaterial instanceof THREE.ShaderMaterial) {
      currentCloudMaterial.uniforms.uSunPosition.value.set(...sunPosition)
      currentCloudMaterial.uniforms.uDebugLayer.value = EARTH_DEBUG_LAYER_VALUE[DEBUG_EARTH_LAYER]
      currentCloudMaterial.uniforms.uCloudOpacity.value = DEBUG_EARTH_LAYER === 'cloudOnly' ? 0.65 : EARTH_CLOUD_OPACITY
    }

    const currentAtmosphereMaterial = atmosphereRef.current?.material
    if (currentAtmosphereMaterial instanceof THREE.ShaderMaterial) {
      currentAtmosphereMaterial.uniforms.uSunPosition.value.set(...sunPosition)
    }
  }, -2)

  const handleSelect = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect(planet)
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }

  return (
    <>
      <OrbitPath orbitConfig={orbitConfig} isSelected={isSelected} />

      <group ref={orbitGroupRef}>
        <group rotation={[0, 0, axialTilt]}>
          <mesh
            ref={surfaceRef}
            material={surfaceMaterial}
            onClick={handleSelect}
            onPointerOver={handlePointerOver}
            onPointerOut={() => {
              document.body.style.cursor = ''
            }}
          >
            <sphereGeometry args={[planet.radius, 72, 72]} />
          </mesh>

          {DEBUG_EARTH_LAYER !== 'noClouds' && (
            <mesh
              ref={cloudsRef}
              material={cloudMaterial}
              renderOrder={2}
              scale={1.05}
              onClick={handleSelect}
              onPointerOver={handlePointerOver}
              onPointerOut={() => {
                document.body.style.cursor = ''
              }}
            >
              <sphereGeometry args={[planet.radius, 72, 72]} />
            </mesh>
          )}

          <mesh ref={atmosphereRef} material={atmosphereMaterial} renderOrder={3} scale={1.052}>
            <sphereGeometry args={[planet.radius, 72, 72]} />
          </mesh>
        </group>

        <MoonMesh
          moon={earthMoon}
          onSelect={onSelect}
          isSelected={selectedBodyId === earthMoon.id}
          onBodyPositionChange={onBodyPositionChange}
          simulationDateRef={simulationDateRef}
        />
      </group>
    </>
  )
}
