import * as THREE from 'three'

function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const el = document.createElement('canvas')
  el.width = w
  el.height = h
  return [el, el.getContext('2d')!]
}

function finishTexture(
  canvas: HTMLCanvasElement,
  colorSpace: THREE.ColorSpace = THREE.SRGBColorSpace
): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = colorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

// --- Mercury: gray, cratered ---
function mercury(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256)
  const rng = makeRng(1)

  ctx.fillStyle = '#8a8a8a'
  ctx.fillRect(0, 0, 512, 256)

  for (let i = 0; i < 25; i++) {
    const x = rng() * 512, y = rng() * 256, r = 12 + rng() * 55
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    const v = Math.floor(120 + rng() * 50)
    g.addColorStop(0, `rgba(${v},${v},${v},0.3)`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  for (let i = 0; i < 14; i++) {
    const x = rng() * 512, y = rng() * 256, r = 4 + rng() * 18
    ctx.fillStyle = `rgba(55,55,55,${0.5 + rng() * 0.25})`
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * 0.85, rng() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = `rgba(185,185,185,0.45)`
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.ellipse(x, y, r + 2, (r + 2) * 0.85, 0, 0, Math.PI * 2)
    ctx.stroke()
  }

  return finishTexture(c)
}

// --- Venus: thick yellow-orange cloud swirls ---
function venus(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256)

  const base = ctx.createLinearGradient(0, 0, 0, 256)
  base.addColorStop(0, '#b89030')
  base.addColorStop(0.5, '#ddb840')
  base.addColorStop(1, '#b89030')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 256)

  for (let band = 0; band < 10; band++) {
    const yBase = (band / 10) * 256
    const light = band % 2 === 0
    ctx.fillStyle = light ? 'rgba(255,225,100,0.22)' : 'rgba(140,90,10,0.18)'
    ctx.beginPath()
    ctx.moveTo(0, yBase)
    for (let x = 0; x <= 512; x += 6) {
      const w = Math.sin(x * 0.018 + band * 1.1) * 9 + Math.sin(x * 0.045 + band * 2.3) * 4
      ctx.lineTo(x, yBase + w)
    }
    ctx.lineTo(512, yBase + 28)
    ctx.lineTo(0, yBase + 28)
    ctx.closePath()
    ctx.fill()
  }

  return finishTexture(c)
}

// --- Earth: ocean + continents + polar caps ---
function earth(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256)
  const rng = makeRng(3)

  ctx.fillStyle = '#1a5c9a'
  ctx.fillRect(0, 0, 512, 256)

  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 256)
  oceanGrad.addColorStop(0, 'rgba(20,60,130,0.35)')
  oceanGrad.addColorStop(0.5, 'rgba(30,100,180,0.1)')
  oceanGrad.addColorStop(1, 'rgba(20,60,130,0.35)')
  ctx.fillStyle = oceanGrad
  ctx.fillRect(0, 0, 512, 256)

  const continents: { x: number; y: number; rx: number; ry: number; rgb: [number, number, number] }[] = [
    { x: 95, y: 80, rx: 55, ry: 45, rgb: [45, 122, 58] },     // N. America
    { x: 115, y: 178, rx: 28, ry: 50, rgb: [55, 130, 60] },   // S. America
    { x: 237, y: 65, rx: 22, ry: 20, rgb: [55, 120, 55] },    // Europe
    { x: 248, y: 158, rx: 28, ry: 55, rgb: [90, 120, 40] },   // Africa
    { x: 360, y: 72, rx: 100, ry: 52, rgb: [58, 118, 48] },   // Asia
    { x: 398, y: 184, rx: 34, ry: 26, rgb: [140, 110, 55] },  // Australia
  ]

  for (const cont of continents) {
    const [r, g, b] = cont.rgb
    const maxR = Math.max(cont.rx, cont.ry)
    const grad = ctx.createRadialGradient(cont.x, cont.y, 0, cont.x, cont.y, maxR)
    grad.addColorStop(0.3, `rgba(${r},${g},${b},0.95)`)
    grad.addColorStop(0.75, `rgba(${r},${g},${b},0.55)`)
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.ellipse(cont.x, cont.y, cont.rx, cont.ry, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Cloud wisps
  for (let i = 0; i < 12; i++) {
    const x = rng() * 512, y = rng() * 256, r = 25 + rng() * 45
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(255,255,255,0.14)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  // Polar caps
  const np = ctx.createLinearGradient(0, 0, 0, 38)
  np.addColorStop(0, 'rgba(220,235,255,0.95)')
  np.addColorStop(1, 'rgba(220,235,255,0)')
  ctx.fillStyle = np
  ctx.fillRect(0, 0, 512, 38)

  const sp = ctx.createLinearGradient(0, 222, 0, 256)
  sp.addColorStop(0, 'rgba(220,235,255,0)')
  sp.addColorStop(1, 'rgba(220,235,255,0.95)')
  ctx.fillStyle = sp
  ctx.fillRect(0, 222, 512, 34)

  return finishTexture(c)
}

// --- Mars: red, dark lowlands, polar caps ---
function mars(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256)
  const rng = makeRng(4)

  const base = ctx.createLinearGradient(0, 0, 512, 256)
  base.addColorStop(0, '#b83a0a')
  base.addColorStop(0.5, '#d85018')
  base.addColorStop(1, '#a03008')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 256)

  for (let i = 0; i < 8; i++) {
    const x = rng() * 512, y = 40 + rng() * 176
    const rx = 28 + rng() * 85, ry = 18 + rng() * 50
    ctx.fillStyle = `rgba(70,15,5,${0.18 + rng() * 0.2})`
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, rng() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let i = 0; i < 6; i++) {
    const x = rng() * 512, y = 40 + rng() * 176, r = 18 + rng() * 48
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(215,95,45,0.3)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  const np = ctx.createLinearGradient(0, 0, 0, 28)
  np.addColorStop(0, 'rgba(235,240,255,0.92)')
  np.addColorStop(1, 'rgba(235,240,255,0)')
  ctx.fillStyle = np
  ctx.fillRect(0, 0, 512, 28)

  const sp = ctx.createLinearGradient(0, 235, 0, 256)
  sp.addColorStop(0, 'rgba(235,240,255,0)')
  sp.addColorStop(1, 'rgba(235,240,255,0.85)')
  ctx.fillStyle = sp
  ctx.fillRect(0, 235, 512, 21)

  return finishTexture(c)
}

// --- Jupiter: colorful bands + Great Red Spot ---
function jupiter(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256)

  const bands = [
    '#e8c080', '#b87828', '#e0a050', '#7a4a10',
    '#d49030', '#c07030', '#e8c080', '#985820',
    '#d08828', '#7a4a10', '#e0a050', '#b87828',
    '#e8c080', '#a06020', '#d8a040', '#7a4a10',
    '#e8c080', '#b87828',
  ]

  const bandH = 256 / bands.length
  bands.forEach((color, i) => {
    const y = i * bandH
    ctx.fillStyle = color
    ctx.fillRect(0, y, 512, bandH + 1)

    ctx.fillStyle = i % 2 === 0 ? 'rgba(220,160,70,0.2)' : 'rgba(90,45,5,0.18)'
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= 512; x += 4) {
      ctx.lineTo(x, y + Math.sin(x * 0.028 + i * 1.4) * 4.5 + Math.sin(x * 0.065 + i * 0.9) * 2)
    }
    ctx.lineTo(512, y + 9)
    ctx.lineTo(0, y + 9)
    ctx.closePath()
    ctx.fill()
  })

  // Great Red Spot
  const gx = 345, gy = 145
  const grs = ctx.createRadialGradient(gx, gy, 0, gx, gy, 30)
  grs.addColorStop(0, '#c82010')
  grs.addColorStop(0.55, '#c83015')
  grs.addColorStop(1, 'rgba(170,50,15,0)')
  ctx.fillStyle = grs
  ctx.beginPath()
  ctx.ellipse(gx, gy, 34, 19, 0, 0, Math.PI * 2)
  ctx.fill()

  return finishTexture(c)
}

// --- Saturn: soft pale bands ---
function saturn(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256)

  const bands = [
    '#f0e8c0', '#d0b870', '#ecd8a8', '#c0a860',
    '#e8d498', '#c8b068', '#f0e8c0', '#c0a860',
    '#e8d498', '#c8b068', '#f0e8c0', '#d0b870',
    '#ecd8a8', '#c0a860', '#e8d498', '#c8b068',
  ]

  const bandH = 256 / bands.length
  bands.forEach((color, i) => {
    ctx.fillStyle = color
    ctx.fillRect(0, i * bandH, 512, bandH + 1)

    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,240,180,0.12)' : 'rgba(140,105,40,0.1)'
    ctx.beginPath()
    ctx.moveTo(0, i * bandH)
    for (let x = 0; x <= 512; x += 4) {
      ctx.lineTo(x, i * bandH + Math.sin(x * 0.02 + i * 1.2) * 3)
    }
    ctx.lineTo(512, i * bandH + 6)
    ctx.lineTo(0, i * bandH + 6)
    ctx.closePath()
    ctx.fill()
  })

  return finishTexture(c)
}

// --- Uranus: cyan gradient ---
function uranus(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256)

  const base = ctx.createLinearGradient(0, 0, 0, 256)
  base.addColorStop(0, '#3ac8c8')
  base.addColorStop(0.5, '#70e4e4')
  base.addColorStop(1, '#3ac8c8')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 256)

  for (let i = 0; i < 7; i++) {
    const y = (i / 7) * 256
    ctx.fillStyle = 'rgba(30,150,150,0.1)'
    ctx.fillRect(0, y, 512, 14)
  }

  const eq = ctx.createLinearGradient(0, 85, 0, 171)
  eq.addColorStop(0, 'rgba(150,240,240,0)')
  eq.addColorStop(0.5, 'rgba(150,240,240,0.14)')
  eq.addColorStop(1, 'rgba(150,240,240,0)')
  ctx.fillStyle = eq
  ctx.fillRect(0, 85, 512, 86)

  const pole = ctx.createLinearGradient(0, 0, 0, 40)
  pole.addColorStop(0, 'rgba(20,170,190,0.45)')
  pole.addColorStop(1, 'rgba(20,170,190,0)')
  ctx.fillStyle = pole
  ctx.fillRect(0, 0, 512, 40)

  return finishTexture(c)
}

// --- Neptune: deep blue with storm patches ---
function neptune(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256)
  const rng = makeRng(8)

  const base = ctx.createLinearGradient(0, 0, 0, 256)
  base.addColorStop(0, '#142890')
  base.addColorStop(0.5, '#2248c0')
  base.addColorStop(1, '#142890')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 256)

  for (let i = 0; i < 9; i++) {
    const y = (i / 9) * 256
    ctx.fillStyle = 'rgba(50,70,200,0.14)'
    ctx.fillRect(0, y, 512, 18)
  }

  for (let i = 0; i < 3; i++) {
    const x = 50 + rng() * 400, y = 60 + rng() * 136, r = 12 + rng() * 24
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(190,215,255,0.65)')
    g.addColorStop(1, 'rgba(100,145,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  ctx.fillStyle = 'rgba(8,18,75,0.55)'
  ctx.beginPath()
  ctx.ellipse(160, 130, 22, 13, 0.3, 0, Math.PI * 2)
  ctx.fill()

  return finishTexture(c)
}

// --- Sun: granulation + sunspots ---
export function createSunTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(1024, 512)
  const rng = makeRng(0)

  const base = ctx.createRadialGradient(512, 256, 0, 512, 256, 540)
  base.addColorStop(0, '#fff6a8')
  base.addColorStop(0.42, '#ffd45a')
  base.addColorStop(0.72, '#f28a18')
  base.addColorStop(1, '#b94800')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 1024, 512)

  for (let y = 0; y < 512; y += 7) {
    for (let x = 0; x < 1024; x += 7) {
      const heat = 190 + Math.floor(rng() * 66)
      const alpha = 0.08 + rng() * 0.12
      ctx.fillStyle = `rgba(255,${heat},${Math.floor(18 + rng() * 58)},${alpha})`
      ctx.beginPath()
      ctx.ellipse(x + rng() * 8, y + rng() * 8, 3 + rng() * 5, 2 + rng() * 4, rng() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  for (let i = 0; i < 58; i++) {
    const x = rng() * 1024, y = rng() * 512, rx = 28 + rng() * 105, ry = 5 + rng() * 16
    ctx.strokeStyle = `rgba(255,225,95,${0.08 + rng() * 0.16})`
    ctx.lineWidth = 2 + rng() * 5
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, rng() * Math.PI, 0, Math.PI * 2)
    ctx.stroke()
  }

  for (let i = 0; i < 10; i++) {
    const x = 120 + rng() * 784, y = 70 + rng() * 372, r = 8 + rng() * 22
    ctx.fillStyle = `rgba(90,36,0,${0.26 + rng() * 0.22})`
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * 0.8, rng() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2)
    g.addColorStop(0, 'rgba(70,26,0,0.16)')
    g.addColorStop(0.42, 'rgba(210,88,0,0.1)')
    g.addColorStop(1, 'rgba(200,100,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r * 2, y - r * 2, r * 4, r * 4)
  }

  return finishTexture(c)
}

export function createEarthCloudTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(1024, 512)
  const rng = makeRng(31)

  ctx.clearRect(0, 0, 1024, 512)

  for (let band = 0; band < 12; band++) {
    const yBase = 38 + band * 38 + rng() * 18
    ctx.strokeStyle = `rgba(255,255,255,${0.1 + rng() * 0.12})`
    ctx.lineWidth = 7 + rng() * 14
    ctx.beginPath()
    for (let x = -20; x <= 1044; x += 12) {
      const y =
        yBase +
        Math.sin(x * 0.012 + band * 1.4) * (8 + rng() * 6) +
        Math.sin(x * 0.032 + band) * 5
      if (x === -20) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  for (let i = 0; i < 42; i++) {
    const x = rng() * 1024, y = 24 + rng() * 464, r = 18 + rng() * 70
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(255,255,255,${0.14 + rng() * 0.16})`)
    g.addColorStop(0.58, `rgba(255,255,255,${0.06 + rng() * 0.08})`)
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }

  return finishTexture(c)
}

export function createPlanetReliefTexture(id: string): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 256)
  const seedMap: Record<string, number> = {
    mercury: 41,
    venus: 42,
    earth: 43,
    mars: 44,
    jupiter: 45,
    saturn: 46,
    uranus: 47,
    neptune: 48,
  }
  const rng = makeRng(seedMap[id] ?? 41)

  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 512, 256)

  if (id === 'jupiter' || id === 'saturn' || id === 'uranus' || id === 'neptune' || id === 'venus') {
    for (let y = 0; y < 256; y += 5) {
      const value = 120 + Math.sin(y * 0.08) * 18 + rng() * 22
      ctx.fillStyle = `rgb(${value},${value},${value})`
      ctx.fillRect(0, y, 512, 5)
    }
    return finishTexture(c, THREE.NoColorSpace)
  }

  for (let i = 0; i < 1600; i++) {
    const v = 95 + rng() * 72
    ctx.fillStyle = `rgba(${v},${v},${v},${0.11 + rng() * 0.13})`
    ctx.fillRect(rng() * 512, rng() * 256, 1 + rng() * 3, 1 + rng() * 3)
  }

  const craterCount = id === 'earth' ? 18 : id === 'mars' ? 44 : 64
  for (let i = 0; i < craterCount; i++) {
    const x = rng() * 512, y = rng() * 256, r = 3 + rng() * (id === 'mercury' ? 19 : 12)
    ctx.strokeStyle = `rgba(190,190,190,${0.22 + rng() * 0.22})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * (0.65 + rng() * 0.35), rng() * Math.PI, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = `rgba(54,54,54,${0.08 + rng() * 0.12})`
    ctx.beginPath()
    ctx.ellipse(x + r * 0.2, y + r * 0.12, r * 0.72, r * 0.56, rng() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }

  return finishTexture(c, THREE.NoColorSpace)
}

export function createSaturnRingTexture(): THREE.CanvasTexture {
  const [c, ctx] = makeCanvas(512, 64)
  const rng = makeRng(12)

  const base = ctx.createLinearGradient(0, 0, 512, 0)
  base.addColorStop(0, 'rgba(170,150,115,0.08)')
  base.addColorStop(0.18, 'rgba(224,207,166,0.62)')
  base.addColorStop(0.32, 'rgba(150,132,102,0.2)')
  base.addColorStop(0.46, 'rgba(238,222,184,0.78)')
  base.addColorStop(0.58, 'rgba(196,174,132,0.36)')
  base.addColorStop(0.72, 'rgba(246,231,198,0.68)')
  base.addColorStop(0.88, 'rgba(180,156,112,0.24)')
  base.addColorStop(1, 'rgba(120,104,82,0.04)')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 64)

  for (let i = 0; i < 34; i++) {
    const x = rng() * 512
    const w = 1 + rng() * 8
    ctx.fillStyle = rng() > 0.58 ? 'rgba(255,245,220,0.18)' : 'rgba(85,72,56,0.16)'
    ctx.fillRect(x, 0, w, 64)
  }

  const texture = finishTexture(c)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

export function createPlanetTexture(id: string): THREE.CanvasTexture {
  switch (id) {
    case 'mercury': return mercury()
    case 'venus':   return venus()
    case 'earth':   return earth()
    case 'mars':    return mars()
    case 'jupiter': return jupiter()
    case 'saturn':  return saturn()
    case 'uranus':  return uranus()
    case 'neptune': return neptune()
    default:        return mercury()
  }
}
