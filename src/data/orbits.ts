import type { Vector3Tuple } from 'three'

export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000
export const REALTIME_DAYS_PER_SECOND = 1 / (24 * 60 * 60)
export const DEFAULT_SIMULATION_DAYS_PER_SECOND = 10

const J2000_EPOCH_MS = Date.parse('2000-01-01T12:00:00Z')
const FULL_TURN = Math.PI * 2
const ECLIPTIC_INCLINATION_VISUAL_SCALE = 0.35
const MAX_DISPLAY_INCLINATION_DEGREES = 7

export const SIMULATION_DAYS_PER_SECOND = DEFAULT_SIMULATION_DAYS_PER_SECOND

export interface PlanetOrbitConfig {
  // JPL/NASA J2000 Keplerian elements. semiMajorAxis is stored in AU;
  // displaySemiMajorAxis preserves the existing scene scale.
  semiMajorAxis: number
  displaySemiMajorAxis: number
  eccentricity: number
  inclination: number
  longitudeOfAscendingNode: number
  longitudeOfPerihelion: number
  meanLongitudeAtEpoch: number
  orbitalPeriod: number
}

export interface SatelliteOrbitConfig {
  semiMajorAxisKm: number
  displaySemiMajorAxis: number
  eccentricity: number
  inclination: number
  longitudeOfAscendingNode: number
  argumentOfPeriapsis: number
  meanAnomalyAtEpoch: number
  orbitalPeriod: number
}

export const planetOrbitConfigs: Record<string, PlanetOrbitConfig> = {
  mercury: {
    semiMajorAxis: 0.38709927,
    displaySemiMajorAxis: 5,
    eccentricity: 0.20563593,
    inclination: 7.00497902,
    longitudeOfAscendingNode: 48.33076593,
    longitudeOfPerihelion: 77.45779628,
    meanLongitudeAtEpoch: 252.2503235,
    orbitalPeriod: 87.9691,
  },
  venus: {
    semiMajorAxis: 0.72333566,
    displaySemiMajorAxis: 8,
    eccentricity: 0.00677672,
    inclination: 3.39467605,
    longitudeOfAscendingNode: 76.67984255,
    longitudeOfPerihelion: 131.60246718,
    meanLongitudeAtEpoch: 181.9790995,
    orbitalPeriod: 224.701,
  },
  earth: {
    semiMajorAxis: 1.00000261,
    displaySemiMajorAxis: 12,
    eccentricity: 0.01671123,
    inclination: -0.00001531,
    longitudeOfAscendingNode: 0,
    longitudeOfPerihelion: 102.93768193,
    meanLongitudeAtEpoch: 100.46457166,
    orbitalPeriod: 365.2564,
  },
  mars: {
    semiMajorAxis: 1.52371034,
    displaySemiMajorAxis: 17,
    eccentricity: 0.0933941,
    inclination: 1.84969142,
    longitudeOfAscendingNode: 49.55953891,
    longitudeOfPerihelion: -23.94362959,
    meanLongitudeAtEpoch: -4.55343205,
    orbitalPeriod: 686.98,
  },
  jupiter: {
    semiMajorAxis: 5.202887,
    displaySemiMajorAxis: 26,
    eccentricity: 0.04838624,
    inclination: 1.30439695,
    longitudeOfAscendingNode: 100.47390909,
    longitudeOfPerihelion: 14.72847983,
    meanLongitudeAtEpoch: 34.39644051,
    orbitalPeriod: 4332.589,
  },
  saturn: {
    semiMajorAxis: 9.53667594,
    displaySemiMajorAxis: 35,
    eccentricity: 0.05386179,
    inclination: 2.48599187,
    longitudeOfAscendingNode: 113.66242448,
    longitudeOfPerihelion: 92.59887831,
    meanLongitudeAtEpoch: 49.95424423,
    orbitalPeriod: 10759.22,
  },
  uranus: {
    semiMajorAxis: 19.18916464,
    displaySemiMajorAxis: 44,
    eccentricity: 0.04725744,
    inclination: 0.77263783,
    longitudeOfAscendingNode: 74.01692503,
    longitudeOfPerihelion: 170.9542763,
    meanLongitudeAtEpoch: 313.23810451,
    orbitalPeriod: 30685.4,
  },
  neptune: {
    semiMajorAxis: 30.06992276,
    displaySemiMajorAxis: 53,
    eccentricity: 0.00859048,
    inclination: 1.77004347,
    longitudeOfAscendingNode: 131.78422574,
    longitudeOfPerihelion: 44.96476227,
    meanLongitudeAtEpoch: -55.12002969,
    orbitalPeriod: 60189,
  },
}

export const satelliteOrbitConfigs: Record<string, SatelliteOrbitConfig> = {
  moon: {
    semiMajorAxisKm: 384400,
    displaySemiMajorAxis: 1.55,
    eccentricity: 0.0554,
    inclination: 5.16,
    longitudeOfAscendingNode: 125.08,
    argumentOfPeriapsis: 318.15,
    meanAnomalyAtEpoch: 135.27,
    orbitalPeriod: 27.322,
  },
}

export const planetRotationPeriodsInDays: Record<string, number> = {
  mercury: 58.646,
  venus: -243.025,
  earth: 0.99726968,
  mars: 1.02595675,
  jupiter: 0.41354,
  saturn: 0.44401,
  uranus: -0.71833,
  neptune: 0.67125,
}

export const satelliteRotationPeriodsInDays: Record<string, number> = {
  moon: 27.322,
}

function normalizeRadians(angle: number) {
  return ((angle % FULL_TURN) + FULL_TURN) % FULL_TURN
}

function solveEccentricAnomaly(meanAnomaly: number, eccentricity: number) {
  let eccentricAnomaly = meanAnomaly

  for (let i = 0; i < 5; i += 1) {
    eccentricAnomaly -=
      (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
      (1 - eccentricity * Math.cos(eccentricAnomaly))
  }

  return eccentricAnomaly
}

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

function displayInclinationRadians(inclination: number) {
  const sign = Math.sign(inclination) || 1
  const clampedInclination = Math.min(Math.abs(inclination), MAX_DISPLAY_INCLINATION_DEGREES)
  return degreesToRadians(clampedInclination * sign * ECLIPTIC_INCLINATION_VISUAL_SCALE)
}

function getOrbitPositionAtAnomaly(config: PlanetOrbitConfig, eccentricAnomaly: number): Vector3Tuple {
  const semiMinorAxis = config.semiMajorAxis * Math.sqrt(1 - config.eccentricity * config.eccentricity)
  const orbitalX = config.semiMajorAxis * (Math.cos(eccentricAnomaly) - config.eccentricity)
  const orbitalZ = semiMinorAxis * Math.sin(eccentricAnomaly)
  const inclination = displayInclinationRadians(config.inclination)
  const longitudeOfAscendingNode = degreesToRadians(config.longitudeOfAscendingNode)
  const argumentOfPerihelion = degreesToRadians(config.longitudeOfPerihelion - config.longitudeOfAscendingNode)
  const cosArgumentOfPerihelion = Math.cos(argumentOfPerihelion)
  const sinArgumentOfPerihelion = Math.sin(argumentOfPerihelion)
  const cosAscendingNode = Math.cos(longitudeOfAscendingNode)
  const sinAscendingNode = Math.sin(longitudeOfAscendingNode)
  const cosInclination = Math.cos(inclination)
  const sinInclination = Math.sin(inclination)
  const sceneScale = config.displaySemiMajorAxis / config.semiMajorAxis

  const eclipticX =
    (cosArgumentOfPerihelion * cosAscendingNode -
      sinArgumentOfPerihelion * sinAscendingNode * cosInclination) *
      orbitalX +
    (-sinArgumentOfPerihelion * cosAscendingNode -
      cosArgumentOfPerihelion * sinAscendingNode * cosInclination) *
      orbitalZ
  const eclipticY =
    (cosArgumentOfPerihelion * sinAscendingNode +
      sinArgumentOfPerihelion * cosAscendingNode * cosInclination) *
      orbitalX +
    (-sinArgumentOfPerihelion * sinAscendingNode +
      cosArgumentOfPerihelion * cosAscendingNode * cosInclination) *
      orbitalZ
  const eclipticZ =
    sinArgumentOfPerihelion * sinInclination * orbitalX +
    cosArgumentOfPerihelion * sinInclination * orbitalZ

  return [eclipticX * sceneScale, eclipticZ * sceneScale, eclipticY * sceneScale]
}

function getSatelliteOrbitPositionAtAnomaly(config: SatelliteOrbitConfig, eccentricAnomaly: number): Vector3Tuple {
  const semiMinorAxisKm = config.semiMajorAxisKm * Math.sqrt(1 - config.eccentricity * config.eccentricity)
  const orbitalX = config.semiMajorAxisKm * (Math.cos(eccentricAnomaly) - config.eccentricity)
  const orbitalZ = semiMinorAxisKm * Math.sin(eccentricAnomaly)
  const inclination = degreesToRadians(config.inclination)
  const longitudeOfAscendingNode = degreesToRadians(config.longitudeOfAscendingNode)
  const argumentOfPeriapsis = degreesToRadians(config.argumentOfPeriapsis)
  const cosArgumentOfPeriapsis = Math.cos(argumentOfPeriapsis)
  const sinArgumentOfPeriapsis = Math.sin(argumentOfPeriapsis)
  const cosAscendingNode = Math.cos(longitudeOfAscendingNode)
  const sinAscendingNode = Math.sin(longitudeOfAscendingNode)
  const cosInclination = Math.cos(inclination)
  const sinInclination = Math.sin(inclination)
  const sceneScale = config.displaySemiMajorAxis / config.semiMajorAxisKm

  const eclipticX =
    (cosArgumentOfPeriapsis * cosAscendingNode -
      sinArgumentOfPeriapsis * sinAscendingNode * cosInclination) *
      orbitalX +
    (-sinArgumentOfPeriapsis * cosAscendingNode -
      cosArgumentOfPeriapsis * sinAscendingNode * cosInclination) *
      orbitalZ
  const eclipticY =
    (cosArgumentOfPeriapsis * sinAscendingNode +
      sinArgumentOfPeriapsis * cosAscendingNode * cosInclination) *
      orbitalX +
    (-sinArgumentOfPeriapsis * sinAscendingNode +
      cosArgumentOfPeriapsis * cosAscendingNode * cosInclination) *
      orbitalZ
  const eclipticZ =
    sinArgumentOfPeriapsis * sinInclination * orbitalX +
    cosArgumentOfPeriapsis * sinInclination * orbitalZ

  return [eclipticX * sceneScale, eclipticZ * sceneScale, eclipticY * sceneScale]
}

export function getPlanetPosition(config: PlanetOrbitConfig, simulationDate: Date): Vector3Tuple {
  const elapsedDays = getSimulationElapsedDays(simulationDate)
  const meanMotion = FULL_TURN / config.orbitalPeriod
  const meanLongitude = degreesToRadians(config.meanLongitudeAtEpoch) + elapsedDays * meanMotion
  const meanAnomaly = normalizeRadians(meanLongitude - degreesToRadians(config.longitudeOfPerihelion))
  const eccentricAnomaly = solveEccentricAnomaly(meanAnomaly, config.eccentricity)

  return getOrbitPositionAtAnomaly(config, eccentricAnomaly)
}

export function getSatellitePosition(config: SatelliteOrbitConfig, simulationDate: Date): Vector3Tuple {
  const elapsedDays = getSimulationElapsedDays(simulationDate)
  const meanMotion = FULL_TURN / config.orbitalPeriod
  const meanAnomaly = normalizeRadians(degreesToRadians(config.meanAnomalyAtEpoch) + elapsedDays * meanMotion)
  const eccentricAnomaly = solveEccentricAnomaly(meanAnomaly, config.eccentricity)

  return getSatelliteOrbitPositionAtAnomaly(config, eccentricAnomaly)
}

export function getSimulationElapsedDays(simulationDate: Date) {
  return (simulationDate.getTime() - J2000_EPOCH_MS) / MILLISECONDS_PER_DAY
}

export function getRotationAngleForPeriod(simulationDate: Date, rotationPeriodDays: number) {
  return normalizeRadians((getSimulationElapsedDays(simulationDate) / rotationPeriodDays) * FULL_TURN)
}

export function getPlanetRotationAngle(planetId: string, simulationDate: Date) {
  return getRotationAngleForPeriod(simulationDate, planetRotationPeriodsInDays[planetId] ?? 1)
}

export function getSatelliteRotationAngle(satelliteId: string, simulationDate: Date) {
  return getRotationAngleForPeriod(simulationDate, satelliteRotationPeriodsInDays[satelliteId] ?? 1)
}

export function getOrbitPathPoints(config: PlanetOrbitConfig, segments = 384): Vector3Tuple[] {
  return Array.from({ length: segments }, (_, index) => {
    const eccentricAnomaly = (index / segments) * FULL_TURN
    return getOrbitPositionAtAnomaly(config, eccentricAnomaly)
  })
}

export function getSatelliteOrbitPathPoints(config: SatelliteOrbitConfig, segments = 192): Vector3Tuple[] {
  return Array.from({ length: segments }, (_, index) => {
    const eccentricAnomaly = (index / segments) * FULL_TURN
    return getSatelliteOrbitPositionAtAnomaly(config, eccentricAnomaly)
  })
}
