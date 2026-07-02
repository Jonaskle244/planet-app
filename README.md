# Sonnensystem 3D

Ein interaktives 3D-Modell des Sonnensystems im Browser — die Sonne, alle acht Planeten und 18 ihrer wichtigsten Monde, frei erkundbar. Die Himmelskörper bewegen sich auf astronomisch plausiblen J2000-Bahnen; per Zeitsteuerung lässt sich die Simulation beschleunigen, pausieren oder auf ein beliebiges Datum setzen.

Gebaut mit React, TypeScript und Three.js (react-three-fiber).

## Features

- **Sonne, 8 Planeten und 18 Monde** — Textur-Kugeln und detaillierte NASA-GLB-Modelle
- **Echte Bahnmechanik** — Positionen aus J2000-Keplerelementen statt fiktiver Kreise
- **Zeitsteuerung** — Datum wählen, Echtzeit bis 30 Tage/Sekunde, Pause, „Heute"-Sprung
- **Fokus-Kamera** — folgt weich dem gewählten Himmelskörper
- **Erde im Detail** — Tag/Nacht-Grenze, Wolkenschicht, Atmosphäre
- **Heller & dunkler Modus** und Info-Panels zu jedem Körper

## Entwicklung

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Dev-Server (http://localhost:5173)
npm run build    # TypeScript-Check + Production-Build
npm run lint     # ESLint
npm run preview  # Production-Build lokal ansehen
```

## Stack

Vite · React 19 · TypeScript · Three.js · @react-three/fiber + drei + postprocessing · Tailwind CSS v4 · Deployment auf Vercel.

## Projektstruktur

Details zur Architektur stehen in [`CLAUDE.md`](./CLAUDE.md). Kurz:

- `src/data/planets.ts` — alle Himmelskörper-Daten (einzige Quelle der Wahrheit)
- `src/data/orbits.ts` — Keplerelemente und Bahn-Mathematik
- `src/components/` — die 3D-Szene (R3F) und das HTML-Info-Overlay
- `public/planet/` — Texturen und 3D-Modelle der Körper
