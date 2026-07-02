# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # Install dependencies (node_modules is git-ignored)
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript check (tsc -b) + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Stack

- **Vite + React 19 + TypeScript**
- **@react-three/fiber** — React renderer for Three.js
- **@react-three/drei** — helpers (Stars, OrbitControls, useGLTF, useTexture, …)
- **@react-three/postprocessing** — post-processing effects
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.js`; config lives in `@theme` blocks in `index.css`)
- Deployed on **Vercel** (`vercel.json`, output dir `dist`)

## Architecture

This is an astronomically-plausible 3D model of the solar system: the Sun, all eight planets and 18 major moons, with real J2000 orbital mechanics, a time controller, a focus-follow camera, and HTML info overlays.

```
src/
  data/
    planets.ts       # Single source of truth for all bodies: PlanetData | StarData | MoonData.
                     #   Exports sun, planets[], individual moons, and grouping helpers
                     #   (moonsByParentId, focusBodyGroups, solarBodies, …)
    orbits.ts        # J2000 Keplerian elements + math. planetOrbitConfigs / satelliteOrbitConfigs,
                     #   time constants (REALTIME/DEFAULT days-per-second), position solvers.
  components/
    Scene.tsx        # R3F <Canvas>: camera, lights, Stars, fog, tone mapping.
                     #   FocusControls smoothly follows the selected body via bodyPositionsRef.
    SolarSystem.tsx  # Advances the simulation clock in useFrame (priority -3); composes
                     #   SunMesh + EarthMesh + one PlanetMesh per planet.
    SunMesh.tsx      # Sun with emissive shader + slow rotation.
    PlanetMesh.tsx   # Generic planet: orbit path, sphere, atmosphere, Saturn rings, child moons.
    EarthMesh.tsx    # Special-cased Earth: day/night terminator, clouds, atmosphere.
    MoonMesh.tsx     # Moon rendering: 'textured-sphere' or 'gltf-model' (NASA GLB assets).
    OrbitPath.tsx    # Flat ecliptic orbit ring.
    Atmosphere.tsx   # Reusable atmosphere shell.
    SaturnRings.tsx  # Saturn's ring system.
    InfoPanel.tsx    # Slide-in right panel (HTML overlay, not R3F).
  types/scene.ts     # BodyPositionMap / BodyPositionReporter — bodies report live positions up.
  utils/textures.ts  # Texture loading helpers.
  App.tsx            # UI shell: selection, focus, pause, view mode (light/dark),
                     #   simulation date + time-speed state, release notes.
public/
  planet/            # Planet & moon textures + NASA GLB moon models (~48 MB)
  textures/          # Shared textures
```

### Key patterns

- **Time simulation**: `SolarSystem` advances a shared `simulationDateRef` (a `Date`) each frame based on `timeSpeedDaysPerSecond`. Bodies read this ref to compute their position — they are driven by simulated time, not raw elapsed time.
- **Orbital positioning**: Positions come from J2000 Keplerian elements in `orbits.ts` (not fake circles). Planets orbit the Sun; moons orbit their parent on parent-centered orbits. `displaySemiMajorAxis` preserves scene scale while `semiMajorAxis` holds real AU/km.
- **Focus camera**: Each body reports its world position via `onBodyPositionChange` into `bodyPositionsRef`. `FocusControls` in `Scene.tsx` lerps the OrbitControls target toward the selected body and clamps min distance per body kind.
- **Body selection**: Click handlers call `e.stopPropagation()` and lift the selected `CelestialBodyData` to `App.tsx`, which drives the `InfoPanel`.
- **Overlay vs 3D**: All UI (header, controls, InfoPanel, release notes) is plain HTML positioned absolutely over the `<Canvas>` — never inside the R3F scene. Follow this pattern for new UI.
- **Adding/editing bodies**: Do it only in `src/data/planets.ts` (data) and, for orbits, `src/data/orbits.ts`. The data interfaces are the single source of truth for both 3D rendering and the info panel. Moons use `renderStyle: 'textured-sphere' | 'gltf-model'` with `textureUrl` / `modelUrl` into `public/`.

### Tailwind v4 notes

No `tailwind.config.ts` — configuration is done via CSS `@theme` blocks in `index.css`. Import is `@import "tailwindcss"` at the top of `index.css`.
