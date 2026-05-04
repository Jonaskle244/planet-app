export interface PlanetData {
  kind: 'planet'
  id: string
  name: string
  radius: number
  distance: number
  speed: number
  color: string
  atmosphereColor: string
  atmosphereOpacity: number
  roughness: number
  metalness: number
  description: string
  facts: string[]
  tilt: number
  hasRings?: boolean
  moons: number
}

export interface StarData {
  kind: 'star'
  id: string
  name: string
  radius: number
  distance: number
  speed: number
  color: string
  atmosphereColor: string
  atmosphereOpacity: number
  roughness: number
  metalness: number
  description: string
  facts: string[]
  tilt: number
  moons: number
  modelStats: { label: string; value: string }[]
  profileStats: { label: string; value: number; color: string }[]
}

export interface MoonData {
  kind: 'moon'
  id: string
  parentId: string
  parentName: string
  name: string
  radius: number
  distance: number
  speed: number
  color: string
  atmosphereColor: string
  atmosphereOpacity: number
  roughness: number
  metalness: number
  description: string
  facts: string[]
  tilt: number
  moons: number
  renderStyle?: 'textured-sphere' | 'gltf-model'
  textureUrl?: string
  modelUrl?: string
}

export type CelestialBodyData = PlanetData | StarData | MoonData

export const sun: StarData = {
  kind: 'star',
  id: 'sun',
  name: 'Sonne',
  radius: 2.58,
  distance: 0,
  speed: 0,
  color: '#f7a521',
  atmosphereColor: '#ffd36b',
  atmosphereOpacity: 0.18,
  roughness: 1,
  metalness: 0,
  description:
    'Die Sonne ist ein G2V-Hauptreihenstern und das Massezentrum unseres Sonnensystems. Ihre sichtbare Oberfl\u00e4che ist eine brodelnde Photosph\u00e4re aus hei\u00dfem Plasma.',
  facts: [
    'Durchmesser: 1.392.700 km',
    'Oberfl\u00e4che: ca. 5.500 \u00b0C',
    'Kern: ca. 15 Mio. \u00b0C',
    'Anteil an Systemmasse: 99,86 %',
  ],
  tilt: 7.25,
  moons: 8,
  modelStats: [
    { label: 'Klasse', value: 'G2V' },
    { label: 'Alter', value: '4,6 Mrd.' },
    { label: 'Licht', value: '8m 20s' },
  ],
  profileStats: [
    { label: 'Aktivit\u00e4t', value: 92, color: '#f59e0b' },
    { label: 'Leuchtkraft', value: 100, color: '#facc15' },
  ],
}

export const planets: PlanetData[] = [
  {
    kind: 'planet',
    id: 'mercury',
    name: 'Merkur',
    radius: 0.15,
    distance: 5,
    speed: 4.74,
    color: '#8f8b80',
    atmosphereColor: '#c8c4ba',
    atmosphereOpacity: 0,
    roughness: 0.96,
    metalness: 0,
    description:
      'Der kleinste Planet des Sonnensystems liegt der Sonne am nächsten. Seine kaum vorhandene Atmosphäre lässt die Oberfläche zwischen Tag und Nacht extrem auskühlen und aufheizen.',
    facts: [
      'Durchmesser: 4.879 km',
      'Umlaufzeit: 88 Tage',
      'Temperatur: -180 °C bis 430 °C',
      'Praktisch keine Atmosphäre',
    ],
    tilt: 0.034,
    moons: 0,
  },
  {
    kind: 'planet',
    id: 'venus',
    name: 'Venus',
    radius: 0.38,
    distance: 8,
    speed: 3.5,
    color: '#d9b06a',
    atmosphereColor: '#f4d78c',
    atmosphereOpacity: 0.32,
    roughness: 0.9,
    metalness: 0,
    description:
      'Venus ist von hellen Schwefelsäurewolken umhüllt. Darunter hält eine dichte CO2-Atmosphäre die Hitze stärker fest als auf jedem anderen Planeten.',
    facts: [
      'Durchmesser: 12.104 km',
      'Umlaufzeit: 225 Tage',
      'Temperatur: ca. 465 °C',
      'Sehr dichte CO2-Atmosphäre',
    ],
    tilt: 177.4,
    moons: 0,
  },
  {
    kind: 'planet',
    id: 'earth',
    name: 'Erde',
    radius: 0.4,
    distance: 12,
    speed: 2.97,
    color: '#2f7fbd',
    atmosphereColor: '#74b9ff',
    atmosphereOpacity: 0.24,
    roughness: 0.88,
    metalness: 0,
    description:
      'Unser Heimatplanet zeigt aus dem All Ozeane, Landmassen, Wolkenfelder und eine dünne blaue Atmosphärenschicht.',
    facts: [
      'Durchmesser: 12.742 km',
      'Umlaufzeit: 365,25 Tage',
      'Temperatur: -88 °C bis 58 °C',
      '71 % Wasseroberfläche',
    ],
    tilt: 23.5,
    moons: 1,
  },
  {
    kind: 'planet',
    id: 'mars',
    name: 'Mars',
    radius: 0.25,
    distance: 17,
    speed: 2.41,
    color: '#b85b32',
    atmosphereColor: '#df8a58',
    atmosphereOpacity: 0,
    roughness: 0.96,
    metalness: 0,
    description:
      'Der Rote Planet verdankt seine Farbe Eisenoxid im Staub. Helle Polkappen und dunkle Vulkanebenen prägen seine Oberfläche.',
    facts: [
      'Durchmesser: 6.779 km',
      'Umlaufzeit: 687 Tage',
      'Temperatur: -140 °C bis 20 °C',
      'Dünne CO2-Atmosphäre',
    ],
    tilt: 25.2,
    moons: 2,
  },
  {
    kind: 'planet',
    id: 'jupiter',
    name: 'Jupiter',
    radius: 1.1,
    distance: 26,
    speed: 1.31,
    color: '#d2a06b',
    atmosphereColor: '#f0c98e',
    atmosphereOpacity: 0.14,
    roughness: 0.84,
    metalness: 0,
    description:
      'Jupiter ist ein Gasriese mit hellen Wolkenbändern, turbulenten Sturmsystemen und dem Großen Roten Fleck.',
    facts: [
      'Durchmesser: 139.820 km',
      'Umlaufzeit: 11,86 Jahre',
      'Windgeschwindigkeit: bis 500 km/h',
      '95 bekannte Monde',
    ],
    tilt: 3.1,
    moons: 95,
  },
  {
    kind: 'planet',
    id: 'saturn',
    name: 'Saturn',
    radius: 0.9,
    distance: 35,
    speed: 0.97,
    color: '#ddc895',
    atmosphereColor: '#f3ddb2',
    atmosphereOpacity: 0.13,
    roughness: 0.86,
    metalness: 0,
    description:
      'Saturn wirkt weich und golden, ist aber vor allem für sein feines Ringsystem aus Eis- und Gesteinsbrocken bekannt.',
    facts: [
      'Durchmesser: 116.460 km',
      'Umlaufzeit: 29,46 Jahre',
      'Ringe bis ca. 282.000 km Durchmesser',
      '146 bekannte Monde',
    ],
    tilt: 26.7,
    hasRings: true,
    moons: 146,
  },
  {
    kind: 'planet',
    id: 'uranus',
    name: 'Uranus',
    radius: 0.65,
    distance: 44,
    speed: 0.68,
    color: '#7ccfd0',
    atmosphereColor: '#bceeee',
    atmosphereOpacity: 0.15,
    roughness: 0.84,
    metalness: 0,
    description:
      'Der Eisriese erscheint blass türkis, weil Methan in seiner Atmosphäre rotes Licht absorbiert. Seine Rotationsachse liegt fast seitlich.',
    facts: [
      'Durchmesser: 50.724 km',
      'Umlaufzeit: 84 Jahre',
      'Temperatur: ca. -224 °C',
      '27 bekannte Monde',
    ],
    tilt: 97.8,
    moons: 27,
  },
  {
    kind: 'planet',
    id: 'neptune',
    name: 'Neptun',
    radius: 0.6,
    distance: 53,
    speed: 0.54,
    color: '#3f67c8',
    atmosphereColor: '#88a7ff',
    atmosphereOpacity: 0.16,
    roughness: 0.84,
    metalness: 0,
    description:
      'Neptun ist ein tiefblauer Eisriese mit sehr schnellen Winden und wechselnden hellen Wolken- und Sturmsystemen.',
    facts: [
      'Durchmesser: 49.244 km',
      'Umlaufzeit: 164,8 Jahre',
      'Windgeschwindigkeit: bis 2.100 km/h',
      '16 bekannte Monde',
    ],
    tilt: 28.3,
    moons: 16,
  },
]

export const earthMoon: MoonData = {
  kind: 'moon',
  id: 'moon',
  parentId: 'earth',
  parentName: 'Erde',
  name: 'Mond',
  radius: 0.11,
  distance: 1.55,
  speed: 13.18,
  color: '#b8b6ad',
  atmosphereColor: '#d6d3c8',
  atmosphereOpacity: 0,
  roughness: 0.98,
  metalness: 0,
  description:
    'Der Mond ist der einzige nat\u00fcrliche Satellit der Erde. Seine gebundene Rotation sorgt daf\u00fcr, dass uns fast immer dieselbe Seite zugewandt ist.',
  facts: [
    'Durchmesser: 3.474 km',
    'Mittlere Entfernung: 384.400 km',
    'Umlaufzeit: 27,32 Tage',
    'Gebundene Rotation',
  ],
  tilt: 6.68,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/earth/2k_moon.jpg',
}

export const deimos: MoonData = {
  kind: 'moon',
  id: 'deimos',
  parentId: 'mars',
  parentName: 'Mars',
  name: 'Deimos',
  radius: 0.062,
  distance: 0.92,
  speed: 285.15,
  color: '#746a60',
  atmosphereColor: '#8f8479',
  atmosphereOpacity: 0,
  roughness: 0.97,
  metalness: 0,
  description:
    'Deimos ist der kleinere und weiter entfernte Mond des Mars. In der Szene nutzt er das NASA-GLB-Modell und bewegt sich auf einer Mars-zentrierten, angenaeherten J2000-Umlaufbahn.',
  facts: [
    'Mittlerer Durchmesser: ca. 12,4 km',
    'Mittlere Entfernung: ca. 23.457 km',
    'Umlaufzeit: 1,26 Tage',
    'NASA-3D-Modell aus lokalem GLB-Asset',
  ],
  tilt: 0.9,
  moons: 0,
  renderStyle: 'gltf-model',
  modelUrl: '/planet/moons/mars/24879_Deimos_1_1000.glb',
}

export const phobos: MoonData = {
  kind: 'moon',
  id: 'phobos',
  parentId: 'mars',
  parentName: 'Mars',
  name: 'Phobos',
  radius: 0.075,
  distance: 0.48,
  speed: 1129.59,
  color: '#756a60',
  atmosphereColor: '#91867b',
  atmosphereOpacity: 0,
  roughness: 0.97,
  metalness: 0,
  description:
    'Phobos ist der innere und groessere Marsmond. In der Szene nutzt er das lokale NASA-GLB-Modell und eine Mars-zentrierte J2000-Umlaufbahn.',
  facts: [
    'Mittlerer Durchmesser: ca. 22,2 km',
    'Mittlere Entfernung: ca. 9.375 km',
    'Umlaufzeit: 0,32 Tage',
    'NASA-3D-Modell aus lokalem GLB-Asset',
  ],
  tilt: 0,
  moons: 0,
  renderStyle: 'gltf-model',
  modelUrl: '/planet/moons/mars/24878_Phobos_1_1000.glb',
}

export const iapetus: MoonData = {
  kind: 'moon',
  id: 'iapetus',
  parentId: 'saturn',
  parentName: 'Saturn',
  name: 'Iapetus',
  radius: 0.11,
  distance: 4.35,
  speed: 4.54,
  color: '#8f8678',
  atmosphereColor: '#a89d8c',
  atmosphereOpacity: 0,
  roughness: 0.98,
  metalness: 0,
  description:
    'Iapetus ist ein weit aussen laufender Saturnmond mit stark kontrastreicher Oberflaeche. In der Szene wird er als lokales GLB-Modell auf einer Saturn-zentrierten J2000-Bahn gerendert.',
  facts: [
    'Mittlerer Durchmesser: ca. 1.469 km',
    'Mittlere Entfernung: ca. 3.561.700 km',
    'Umlaufzeit: 79,33 Tage',
    'NASA-3D-Modell aus lokalem GLB-Asset',
  ],
  tilt: 14.8,
  moons: 0,
  renderStyle: 'gltf-model',
  modelUrl: '/planet/moons/saturn/Iapetus_1_1471.glb',
}

export const miranda: MoonData = {
  kind: 'moon',
  id: 'miranda',
  parentId: 'uranus',
  parentName: 'Uranus',
  name: 'Miranda',
  radius: 0.075,
  distance: 1.65,
  speed: 254.69,
  color: '#908d84',
  atmosphereColor: '#aaa79d',
  atmosphereOpacity: 0,
  roughness: 0.98,
  metalness: 0,
  description:
    'Miranda ist einer der inneren Uranusmonde und zeigt eine auffaellig zerklueftete Oberflaeche. In der Szene nutzt er das lokale GLB-Modell und eine Uranus-zentrierte J2000-Umlaufbahn.',
  facts: [
    'Mittlerer Durchmesser: ca. 472 km',
    'Mittlere Entfernung: ca. 129.846 km',
    'Umlaufzeit: 1,41 Tage',
    'NASA-3D-Modell aus lokalem GLB-Asset',
  ],
  tilt: 0,
  moons: 0,
  renderStyle: 'gltf-model',
  modelUrl: '/planet/moons/uranus/Miranda_1_472.glb',
}

export const io: MoonData = {
  kind: 'moon',
  id: 'io',
  parentId: 'jupiter',
  parentName: 'Jupiter',
  name: 'Io',
  radius: 0.12,
  distance: 1.65,
  speed: 204.23,
  color: '#d9bd67',
  atmosphereColor: '#e6d58f',
  atmosphereOpacity: 0,
  roughness: 0.94,
  metalness: 0,
  description:
    'Io ist der innerste der vier grossen Jupitermonde und vulkanisch extrem aktiv. In der Szene wird er als Texturkugel auf einer Jupiter-zentrierten J2000-Bahn dargestellt.',
  facts: [
    'Durchmesser: ca. 3.643 km',
    'Mittlere Entfernung: ca. 421.800 km',
    'Umlaufzeit: 1,76 Tage',
    'Textur: io_global.jpg',
  ],
  tilt: 0,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/jupiter/io_global.jpg',
}

export const europa: MoonData = {
  kind: 'moon',
  id: 'europa',
  parentId: 'jupiter',
  parentName: 'Jupiter',
  name: 'Europa',
  radius: 0.105,
  distance: 2.05,
  speed: 102.11,
  color: '#cfc5ad',
  atmosphereColor: '#e5ded2',
  atmosphereOpacity: 0,
  roughness: 0.96,
  metalness: 0,
  description:
    'Europa ist ein heller Eismond Jupiters. Die Kugel nutzt die vorhandene globale Textur und folgt einer Jupiter-zentrierten J2000-Bahn.',
  facts: [
    'Durchmesser: ca. 3.122 km',
    'Mittlere Entfernung: ca. 671.100 km',
    'Umlaufzeit: 3,53 Tage',
    'Textur: europa_global.jpg',
  ],
  tilt: 0,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/jupiter/europa_global.jpg',
}

export const ganymede: MoonData = {
  kind: 'moon',
  id: 'ganymede',
  parentId: 'jupiter',
  parentName: 'Jupiter',
  name: 'Ganymed',
  radius: 0.16,
  distance: 2.7,
  speed: 50.31,
  color: '#8e8171',
  atmosphereColor: '#b5ab9c',
  atmosphereOpacity: 0,
  roughness: 0.97,
  metalness: 0,
  description:
    'Ganymed ist der groesste Mond des Sonnensystems. Er wird als Texturkugel mit realistisch phasierter Jupiter-Umlaufbahn gerendert.',
  facts: [
    'Durchmesser: ca. 5.262 km',
    'Mittlere Entfernung: ca. 1.070.400 km',
    'Umlaufzeit: 7,16 Tage',
    'Textur: ganymed_global.jpg',
  ],
  tilt: 0.1,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/jupiter/ganymed_global.jpg',
}

export const callisto: MoonData = {
  kind: 'moon',
  id: 'callisto',
  parentId: 'jupiter',
  parentName: 'Jupiter',
  name: 'Callisto',
  radius: 0.15,
  distance: 3.55,
  speed: 21.57,
  color: '#6f665b',
  atmosphereColor: '#968c7e',
  atmosphereOpacity: 0,
  roughness: 0.98,
  metalness: 0,
  description:
    'Callisto ist der aeusserste der vier grossen Jupitermonde und zeigt eine stark verkraterte Oberflaeche.',
  facts: [
    'Durchmesser: ca. 4.821 km',
    'Mittlere Entfernung: ca. 1.882.700 km',
    'Umlaufzeit: 16,69 Tage',
    'Textur: callisto_global.jpg',
  ],
  tilt: 0.4,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/jupiter/callisto_global.jpg',
}

export const mimas: MoonData = {
  kind: 'moon',
  id: 'mimas',
  parentId: 'saturn',
  parentName: 'Saturn',
  name: 'Mimas',
  radius: 0.055,
  distance: 2.7,
  speed: 382.0,
  color: '#aaa79f',
  atmosphereColor: '#c4c0b7',
  atmosphereOpacity: 0,
  roughness: 0.98,
  metalness: 0,
  description:
    'Mimas ist ein kleiner innerer Saturnmond. Seine Texturkugel laeuft knapp ausserhalb des Ringsystems auf einer Saturn-zentrierten Bahn.',
  facts: [
    'Durchmesser: ca. 396 km',
    'Mittlere Entfernung: ca. 186.000 km',
    'Umlaufzeit: 0,94 Tage',
    'Textur: mimas_global.jpg',
  ],
  tilt: 0,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/saturn/mimas_global.jpg',
}

export const enceladus: MoonData = {
  kind: 'moon',
  id: 'enceladus',
  parentId: 'saturn',
  parentName: 'Saturn',
  name: 'Enceladus',
  radius: 0.06,
  distance: 2.95,
  speed: 262.73,
  color: '#d7d9d6',
  atmosphereColor: '#f0f2ef',
  atmosphereOpacity: 0,
  roughness: 0.97,
  metalness: 0,
  description:
    'Enceladus ist ein heller Eismond Saturns. Die Szene nutzt seine globale Textur und eine Saturn-zentrierte J2000-Bahn.',
  facts: [
    'Durchmesser: ca. 504 km',
    'Mittlere Entfernung: ca. 238.400 km',
    'Umlaufzeit: 1,37 Tage',
    'Textur: enceladus_global.jpg',
  ],
  tilt: 0,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/saturn/enceladus_global.jpg',
}

export const titan: MoonData = {
  kind: 'moon',
  id: 'titan',
  parentId: 'saturn',
  parentName: 'Saturn',
  name: 'Titan',
  radius: 0.16,
  distance: 3.55,
  speed: 22.58,
  color: '#c49353',
  atmosphereColor: '#d8ae68',
  atmosphereOpacity: 0,
  roughness: 0.92,
  metalness: 0,
  description:
    'Titan ist Saturns groesster Mond. Er wird hier als Texturkugel auf einer real phasierten Saturn-Umlaufbahn dargestellt.',
  facts: [
    'Durchmesser: ca. 5.150 km',
    'Mittlere Entfernung: ca. 1.221.900 km',
    'Umlaufzeit: 15,95 Tage',
    'Textur: titan_global.jpg',
  ],
  tilt: 0.6,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/saturn/titan_global.jpg',
}

export const titania: MoonData = {
  kind: 'moon',
  id: 'titania',
  parentId: 'uranus',
  parentName: 'Uranus',
  name: 'Titania',
  radius: 0.105,
  distance: 2.55,
  speed: 41.35,
  color: '#918d85',
  atmosphereColor: '#aaa69d',
  atmosphereOpacity: 0,
  roughness: 0.98,
  metalness: 0,
  description:
    'Titania ist der groesste Uranusmond und wird als Texturkugel auf einer Uranus-zentrierten J2000-Bahn dargestellt.',
  facts: [
    'Durchmesser: ca. 1.578 km',
    'Mittlere Entfernung: ca. 436.298 km',
    'Umlaufzeit: 8,71 Tage',
    'Textur: titania_global.jpg',
  ],
  tilt: 0,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/uranus/titania_global.jpg',
}

export const oberon: MoonData = {
  kind: 'moon',
  id: 'oberon',
  parentId: 'uranus',
  parentName: 'Uranus',
  name: 'Oberon',
  radius: 0.1,
  distance: 3.15,
  speed: 26.74,
  color: '#77746d',
  atmosphereColor: '#9b978e',
  atmosphereOpacity: 0,
  roughness: 0.98,
  metalness: 0,
  description:
    'Oberon ist ein aeusserer grosser Uranusmond. Seine vorhandene globale Textur wird auf eine Kugel gelegt.',
  facts: [
    'Durchmesser: ca. 1.523 km',
    'Mittlere Entfernung: ca. 583.511 km',
    'Umlaufzeit: 13,46 Tage',
    'Textur: oberon_global.png',
  ],
  tilt: 0,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/uranus/oberon_global.png',
}

export const triton: MoonData = {
  kind: 'moon',
  id: 'triton',
  parentId: 'neptune',
  parentName: 'Neptun',
  name: 'Triton',
  radius: 0.115,
  distance: 1.65,
  speed: 61.26,
  color: '#c7b4a7',
  atmosphereColor: '#ded0c5',
  atmosphereOpacity: 0,
  roughness: 0.96,
  metalness: 0,
  description:
    'Triton ist der groesste Mond Neptuns und laeuft retrograd. In der Szene wird er als Texturkugel mit Neptun-zentrierter J2000-Bahn gezeigt.',
  facts: [
    'Durchmesser: ca. 2.705 km',
    'Mittlere Entfernung: ca. 354.800 km',
    'Umlaufzeit: 5,88 Tage',
    'Textur: triton_global.jpg',
  ],
  tilt: 0.4,
  moons: 0,
  renderStyle: 'textured-sphere',
  textureUrl: '/planet/moons/neptun/triton_global.jpg',
}

export const earthMoons: MoonData[] = [earthMoon]
export const marsMoons: MoonData[] = [phobos, deimos]
export const jupiterMoons: MoonData[] = [io, europa, ganymede, callisto]
export const saturnMoons: MoonData[] = [mimas, enceladus, titan, iapetus]
export const uranusMoons: MoonData[] = [miranda, titania, oberon]
export const neptuneMoons: MoonData[] = [triton]
export const moonBodies: MoonData[] = [
  ...earthMoons,
  ...marsMoons,
  ...jupiterMoons,
  ...saturnMoons,
  ...uranusMoons,
  ...neptuneMoons,
]
export const solarBodies: CelestialBodyData[] = [sun, ...planets]
export const moonsByParentId: Record<string, MoonData[]> = {
  earth: earthMoons,
  mars: marsMoons,
  jupiter: jupiterMoons,
  saturn: saturnMoons,
  uranus: uranusMoons,
  neptune: neptuneMoons,
}
export const focusBodyGroups: { label: string; bodies: CelestialBodyData[] }[] = [
  { label: 'Sonne & Planeten', bodies: solarBodies },
  { label: 'Erde - Monde', bodies: earthMoons },
  { label: 'Mars - Monde', bodies: marsMoons },
  { label: 'Jupiter - Monde', bodies: jupiterMoons },
  { label: 'Saturn - Monde', bodies: saturnMoons },
  { label: 'Uranus - Monde', bodies: uranusMoons },
  { label: 'Neptun - Monde', bodies: neptuneMoons },
]
export const focusBodies: CelestialBodyData[] = focusBodyGroups.flatMap((group) => group.bodies)
