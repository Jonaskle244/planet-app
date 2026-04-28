export interface PlanetData {
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

export const planets: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Merkur',
    radius: 0.15,
    distance: 5,
    speed: 4.74,
    color: '#8f8b80',
    atmosphereColor: '#c8c4ba',
    atmosphereOpacity: 0,
    roughness: 0.96,
    metalness: 0.04,
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
    id: 'venus',
    name: 'Venus',
    radius: 0.38,
    distance: 8,
    speed: 3.5,
    color: '#d9b06a',
    atmosphereColor: '#f4d78c',
    atmosphereOpacity: 0.46,
    roughness: 0.78,
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
    id: 'earth',
    name: 'Erde',
    radius: 0.4,
    distance: 12,
    speed: 2.97,
    color: '#2f7fbd',
    atmosphereColor: '#74b9ff',
    atmosphereOpacity: 0.34,
    roughness: 0.68,
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
    id: 'mars',
    name: 'Mars',
    radius: 0.25,
    distance: 17,
    speed: 2.41,
    color: '#b85b32',
    atmosphereColor: '#df8a58',
    atmosphereOpacity: 0.18,
    roughness: 0.98,
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
    id: 'jupiter',
    name: 'Jupiter',
    radius: 1.1,
    distance: 26,
    speed: 1.31,
    color: '#d2a06b',
    atmosphereColor: '#f0c98e',
    atmosphereOpacity: 0.22,
    roughness: 0.48,
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
    id: 'saturn',
    name: 'Saturn',
    radius: 0.9,
    distance: 35,
    speed: 0.97,
    color: '#ddc895',
    atmosphereColor: '#f3ddb2',
    atmosphereOpacity: 0.2,
    roughness: 0.5,
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
    id: 'uranus',
    name: 'Uranus',
    radius: 0.65,
    distance: 44,
    speed: 0.68,
    color: '#7ccfd0',
    atmosphereColor: '#bceeee',
    atmosphereOpacity: 0.22,
    roughness: 0.42,
    metalness: 0.02,
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
    id: 'neptune',
    name: 'Neptun',
    radius: 0.6,
    distance: 53,
    speed: 0.54,
    color: '#3f67c8',
    atmosphereColor: '#88a7ff',
    atmosphereOpacity: 0.24,
    roughness: 0.42,
    metalness: 0.02,
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
