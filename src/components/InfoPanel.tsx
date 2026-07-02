import type { CelestialBodyData } from '../data/planets'
import BodyPreview from './BodyPreview'

interface InfoPanelProps {
  body: CelestialBodyData | null
  onClose: () => void
}

const EARTH_DIAMETER_KM = 12742

// Zieht den Durchmesser in km aus den Fakten ("Durchmesser: 12.742 km").
function parseDiameterKm(body: CelestialBodyData): number | null {
  const fact = body.facts.find((entry) => /durchmesser/i.test(entry))
  const match = fact?.match(/([\d.]+)\s*km/)
  if (!match) return null
  const value = Number(match[1].replace(/\./g, ''))
  return Number.isFinite(value) && value > 0 ? value : null
}

function getHeadlineStats(body: CelestialBodyData) {
  if (body.kind === 'star') {
    return [
      { label: 'Typ', value: 'G2V' },
      { label: 'Planeten', value: body.moons.toString() },
    ]
  }

  if (body.kind === 'moon') {
    return [
      { label: 'Typ', value: 'Mond' },
      { label: 'Planet', value: body.parentName },
    ]
  }

  return [
    { label: 'Monde', value: body.moons.toString() },
    { label: 'Neigung', value: `${body.tilt}°` },
  ]
}

function getModelStats(body: CelestialBodyData) {
  if (body.kind === 'star') return body.modelStats

  return [
    { label: 'Radius', value: body.radius.toFixed(2) },
    { label: 'Orbit', value: body.distance.toFixed(0) },
    { label: 'Tempo', value: body.speed.toFixed(2) },
  ]
}

function getProfileStats(body: CelestialBodyData) {
  if (body.kind === 'star') return body.profileStats

  return [
    { label: 'Oberfläche', value: Math.round(body.roughness * 100), color: body.color },
    {
      label: 'Atmosphäre',
      value: Math.round(Math.min(100, body.atmosphereOpacity * 180)),
      color: body.atmosphereColor,
    },
  ]
}

export default function InfoPanel({ body, onClose }: InfoPanelProps) {
  const headlineStats = body ? getHeadlineStats(body) : []
  const modelStats = body ? getModelStats(body) : []
  const profileStats = body ? getProfileStats(body) : []

  const diameterKm = body?.kind === 'planet' ? parseDiameterKm(body) : null
  const sizeRatio = diameterKm ? diameterKm / EARTH_DIAMETER_KM : null
  const earthCirclePx = 26
  const bodyCirclePx = sizeRatio ? Math.max(8, Math.min(72, earthCirclePx * sizeRatio)) : 0

  return (
    <div
      className={`absolute right-0 top-0 z-30 h-full w-full overflow-y-auto border-l border-white/70 bg-white/90 text-slate-950 shadow-2xl shadow-slate-950/20 backdrop-blur-2xl transition-transform duration-300 ease-in-out sm:w-96 ${
        body ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
      }`}
    >
      {body && (
        <div className="flex min-h-full flex-col gap-6 p-6 sm:p-7">
          <div
            className="h-1.5 rounded-full"
            style={{ background: `linear-gradient(90deg, ${body.color}, transparent)` }}
            aria-hidden="true"
          />

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
                {body.kind === 'star'
                  ? 'Stern'
                  : body.kind === 'moon'
                    ? 'Mond'
                    : 'Planet'}
              </p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                {body.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/85 text-xl leading-none text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
              aria-label="Schließen"
            >
              &times;
            </button>
          </div>

          <div className="flex items-center gap-4 border-y border-slate-200/80 py-5">
            <BodyPreview body={body} size={80} />
            <div className="grid flex-1 grid-cols-2 gap-3">
              {headlineStats.map((item) => (
                <div key={item.label}>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm leading-6 text-slate-700">{body.description}</p>

          {sizeRatio && (
            <div className="rounded-md border border-slate-200/80 bg-white/55 p-4">
              <div className="flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <span>Größe im Vergleich</span>
                <span className="text-slate-950">
                  {sizeRatio >= 10 ? sizeRatio.toFixed(0) : sizeRatio.toFixed(2)}× Erde
                </span>
              </div>
              <div className="mt-3 flex items-end gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className="rounded-full bg-sky-500/85 ring-1 ring-white"
                    style={{ width: earthCirclePx, height: earthCirclePx }}
                  />
                  <span className="text-[0.6rem] font-medium text-slate-500">Erde</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className="rounded-full ring-1 ring-white"
                    style={{ width: bodyCirclePx, height: bodyCirclePx, backgroundColor: body.color }}
                  />
                  <span className="text-[0.6rem] font-medium text-slate-500">{body.name}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {modelStats.map((item) => (
              <div key={item.label} className="rounded-md border border-slate-200/80 bg-slate-50/80 px-3 py-2.5">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 rounded-md border border-slate-200/80 bg-white/55 p-4">
            {profileStats.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Daten &amp; Fakten
            </h3>
            {body.facts.map((fact, i) => (
              <div
                key={i}
                className="rounded-md border border-slate-200/80 bg-slate-50/80 px-3.5 py-2.5 text-sm text-slate-700"
              >
                {fact}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
