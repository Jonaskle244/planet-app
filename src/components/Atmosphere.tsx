import { useMemo } from 'react'
import * as THREE from 'three'

interface AtmosphereProps {
  radius: number
  color: string
  opacity: number
}

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
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float rim = 1.0 - max(0.0, dot(vNormal, vViewDir));
    rim = smoothstep(0.22, 1.0, pow(rim, 2.1));
    gl_FragColor = vec4(uColor, rim * uOpacity);
  }
`

export default function Atmosphere({ radius, color, opacity }: AtmosphereProps) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: opacity },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.NormalBlending,
      }),
    [color, opacity]
  )

  return (
    <mesh material={material}>
      <sphereGeometry args={[radius * 1.08, 48, 48]} />
    </mesh>
  )
}
