import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import SolarSystem from './SolarSystem'
import type { PlanetData } from '../data/planets'

interface SceneProps {
  onSelectPlanet: (planet: PlanetData) => void
  selectedPlanetId: string | null
}

export default function Scene({ onSelectPlanet, selectedPlanetId }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 35, 90], fov: 55 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Low ambient so the shadow side stays nearly black */}
      <ambientLight intensity={0.05} />

      {/* Sun as the only directional light source */}
      <pointLight position={[0, 0, 0]} intensity={6} distance={300} color="#fff5d0" />

      <Stars radius={300} depth={60} count={7000} factor={4} saturation={0} fade speed={0.5} />

      <OrbitControls enableDamping dampingFactor={0.06} minDistance={5} maxDistance={220} />

      <SolarSystem onSelectPlanet={onSelectPlanet} selectedPlanetId={selectedPlanetId} />

      <EffectComposer>
        <Bloom intensity={1.0} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
      </EffectComposer>
    </Canvas>
  )
}
