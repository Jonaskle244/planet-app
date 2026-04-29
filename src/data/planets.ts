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
}

export const earthMoons: MoonData[] = [earthMoon]
export const moonBodies: MoonData[] = [...earthMoons]
export const solarBodies: CelestialBodyData[] = [sun, ...planets]
export const focusBodyGroups: { label: string; bodies: CelestialBodyData[] }[] = [
  { label: 'Sonne & Planeten', bodies: solarBodies },
  { label: 'Erde - Monde', bodies: earthMoons },
]
export const focusBodies: CelestialBodyData[] = focusBodyGroups.flatMap((group) => group.bodies)
