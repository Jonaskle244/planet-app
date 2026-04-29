import type { Vector3 } from 'three'

export type BodyPositionMap = Record<string, Vector3>
export type BodyPositionReporter = (id: string, position: Vector3) => void
