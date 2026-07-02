import { useEffect, useRef } from 'react'
import type { CelestialBodyData } from '../data/planets'
import { renderBodyPreview } from '../utils/bodyPreview'

interface BodyPreviewProps {
  body: CelestialBodyData
  size: number
}

export default function BodyPreview({ body, size }: BodyPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) renderBodyPreview(canvas, body, size)
  }, [body, size])

  return (
    <canvas
      ref={canvasRef}
      className="shrink-0 rounded-full shadow-lg shadow-slate-950/30 ring-1 ring-white/70"
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}
