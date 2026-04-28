import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import SolarSystem from './SolarSystem'
import type { PlanetData } from '../data/planets'

interface SceneProps {
  onSelectPlanet: (planet: PlanetData) => void
  selectedPlanetId: string | null
}

export default function Scene({ onSelectPlanet, selectedPlanetId }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 28, 82], fov: 50, near: 0.1, far: 500 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.45
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.setClearColor(0x000000, 0)
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight color="#fffaf0" groundColor="#8aa0b8" intensity={1.25} />

      <pointLight position={[0, 0, 0]} intensity={8.5} distance={340} color="#fff0b8" />
      <directionalLight position={[-28, 34, 38]} intensity={1.1} color="#d9efff" />

      <Stars radius={280} depth={80} count={2200} factor={2.2} saturation={0.2} fade speed={0.12} />

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={8}
        maxDistance={165}
        maxPolarAngle={Math.PI * 0.72}
        target={[0, 0, 0]}
      />

      <SolarSystem onSelectPlanet={onSelectPlanet} selectedPlanetId={selectedPlanetId} />
    </Canvas>
  )
}
