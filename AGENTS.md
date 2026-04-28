# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Stack

- **Vite + React + TypeScript**
- **@react-three/fiber** — React renderer for Three.js
- **@react-three/drei** — helpers (Stars, Sphere, OrbitControls, etc.)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)

## Architecture

```
src/
  data/planets.ts          # All planet data (PlanetData interface + planets array)
  components/
    Scene.tsx              # R3F <Canvas> — camera, lights, Stars, OrbitControls
    SolarSystem.tsx        # Composes SunMesh + all PlanetMesh instances
    SunMesh.tsx            # Sun sphere with emissive material + slow rotation
    PlanetMesh.tsx         # Orbit path ring + planet sphere + Saturn rings; useFrame drives orbital animation
    InfoPanel.tsx          # Slide-in right panel (HTML overlay, not R3F)
  App.tsx                  # selectedPlanet state; wires Scene ↔ InfoPanel
```

### Key patterns

- **Orbital animation**: Each `PlanetMesh` stores its current angle in a `useRef` and updates it in `useFrame` based on `planet.speed * SPEED_FACTOR`. Planet position is computed as `(cos(angle) * distance, 0, sin(angle) * distance)` on the orbit group.
- **Planet selection**: Click events on `<Sphere>` call `e.stopPropagation()` then lift state to `App.tsx` via `onSelect`. Selected planet gets a subtle `emissiveIntensity` glow.
- **Overlay vs 3D**: The `InfoPanel` is a plain HTML div overlaid with `position: absolute` — not part of the R3F scene. Use this pattern for all UI panels.
- **Planet data**: Add/edit planets only in `src/data/planets.ts`. The `PlanetData` interface is the single source of truth for both 3D rendering and the info panel.

### Tailwind v4 notes

No `tailwind.config.ts` — configuration is done via CSS `@theme` blocks in `index.css`. Import is `@import "tailwindcss"` at the top of `index.css`.
