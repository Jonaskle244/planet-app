import type { CelestialBodyData } from '../data/planets'
import { createPlanetTexture, createSunTexture } from './textures'

// Liest die equirektanguläre Quelltextur eines Körpers als ImageData aus.
function sourceImageData(body: CelestialBodyData): ImageData {
  const texture = body.kind === 'star' ? createSunTexture() : createPlanetTexture(body.id)
  const canvas = texture.image as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
  texture.dispose()
  return data
}

/**
 * Rendert eine 2D-Frontansicht des Körpers als beleuchtete Kugelscheibe:
 * orthografische Projektion der equirektangulären Textur auf die vordere
 * Halbkugel, mit Lambert-Beleuchtung (Tag/Nacht-Terminator) und – bei
 * Planeten mit Atmosphäre – einem weichen Atmosphärenrand.
 */
export function renderBodyPreview(target: HTMLCanvasElement, body: CelestialBodyData, size: number): void {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const px = Math.max(1, Math.round(size * dpr))
  target.width = px
  target.height = px
  target.style.width = `${size}px`
  target.style.height = `${size}px`

  const ctx = target.getContext('2d')
  if (!ctx) return

  const src = sourceImageData(body)
  const out = ctx.createImageData(px, px)
  const radius = px / 2
  const cx = radius
  const cy = radius

  // Lichtrichtung: von vorne, leicht oben-links (wie ein von der Sonne beleuchteter Körper).
  const lx = -0.42
  const ly = 0.5
  const lz = 0.76
  const lightLength = Math.hypot(lx, ly, lz)
  const isStar = body.kind === 'star'
  const ambient = isStar ? 1 : 0.26

  for (let y = 0; y < px; y++) {
    for (let x = 0; x < px; x++) {
      const nx = (x - cx) / radius
      const ny = (y - cy) / radius
      const d2 = nx * nx + ny * ny
      const idx = (y * px + x) * 4

      if (d2 > 1) {
        out.data[idx + 3] = 0
        continue
      }

      const nz = Math.sqrt(1 - d2)
      const worldY = -ny // Bildschirm-Y zeigt nach unten → invertieren, damit oben = Nordpol.

      const lat = Math.asin(Math.max(-1, Math.min(1, worldY)))
      const lon = Math.atan2(nx, nz)
      let u = lon / (2 * Math.PI) + 0.5
      u -= Math.floor(u)
      const v = Math.max(0, Math.min(0.9999, 0.5 - lat / Math.PI))

      const sx = Math.min(src.width - 1, (u * src.width) | 0)
      const sy = Math.min(src.height - 1, (v * src.height) | 0)
      const si = (sy * src.width + sx) * 4

      let light = ambient
      if (!isStar) {
        const dot = (nx * lx + worldY * ly + nz * lz) / lightLength
        light = Math.min(1, Math.max(ambient, dot))
      }

      out.data[idx] = src.data[si] * light
      out.data[idx + 1] = src.data[si + 1] * light
      out.data[idx + 2] = src.data[si + 2] * light
      out.data[idx + 3] = 255
    }
  }

  ctx.putImageData(out, 0, 0)

  // Weicher Atmosphärenrand für Planeten mit spürbarer Atmosphäre.
  if (body.kind === 'planet' && body.atmosphereOpacity > 0) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = Math.min(0.5, body.atmosphereOpacity * 1.7)
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius)
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(0.86, 'rgba(0,0,0,0)')
    grad.addColorStop(1, body.atmosphereColor)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}
