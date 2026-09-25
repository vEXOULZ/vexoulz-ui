<script setup>
// Canvas take on stars_bg.js: same spectral classes and perlin clustering, but seeded, sized to its
// container, one canvas instead of hundreds of divs, and with optional band / drift / parallax / meteors.
import { onMounted, onUnmounted, ref, watch } from 'vue'
import noisejs from 'noisejs/index.js'

const props = defineProps({
  seed: { type: String, default: 'vexoulz' },
  opts: { type: Object, required: true },
})

// [cumulative probability, colour, size multiplier]; "classic" is the table from stars_bg.js
const SPECTRA = {
  classic: [[0.0000006, '#92b5ff', 6.6], [0.0024, '#a2c0ff', 1.8], [0.0122, '#d5e0ff', 1.4], [0.06, '#f9f5ff', 1.15], [0.152, '#ffede3', 0.96], [0.24, '#ffdab5', 0.7], [1, '#ffb56c', 0.5]],
  bright: [[0.01, '#92b5ff', 2.2], [0.06, '#a2c0ff', 1.8], [0.16, '#d5e0ff', 1.4], [0.36, '#f9f5ff', 1.15], [0.58, '#ffede3', 0.96], [0.78, '#ffdab5', 0.7], [1, '#ffb56c', 0.5]],
  mono: [[0.0024, '#e9edff', 1.8], [0.0122, '#e9edff', 1.4], [0.06, '#e9edff', 1.15], [0.24, '#e9edff', 0.9], [1, '#e9edff', 0.6]],
}

// seconds between meteors
const METEOR_GAPS = { rare: [12, 30], normal: [4, 13], frequent: [1.2, 4] }

const canvas = ref(null)
let ctx, host, stars = [], nebula = null, w = 0, h = 0, dpr = 1
let raf = 0, last = 0, visible = true, t0 = performance.now()
let pointer = { x: 0, y: 0, tx: 0, ty: 0 }
let meteors = [], nextMeteor = 2
let ro, io
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function hash(s) {
  let x = 2166136261
  for (const c of s) x = Math.imul(x ^ c.charCodeAt(0), 16777619)
  return x >>> 0
}

// Milky-way band: a diagonal line across the first screenful
function bandDist(x, y) {
  const vh = Math.min(h, 900)
  const x1 = 0, y1 = vh * 0.85, x2 = w, y2 = vh * 0.05
  const dx = x2 - x1, dy = y2 - y1
  return Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / Math.hypot(dx, dy)
}

function build() {
  const o = props.opts
  const rnd = mulberry32(hash(props.seed))
  const noise = new noisejs.Noise(rnd())
  const spectrum = SPECTRA[o.spectrum] || SPECTRA.classic
  const bandW = Math.min(w, 900) * 0.16
  const target = Math.round((o.density * w * h) / 10000)
  stars = []
  for (let tries = 0; stars.length < target && tries < target * 25; tries++) {
    const x = rnd() * w, y = rnd() * h
    let chance = 1 - o.cluster + o.cluster * ((noise.perlin2(x / 140, y / 140) + 0.5) / 1.5)
    if (o.band) chance *= 0.3 + 1.4 * Math.exp(-((bandDist(x, y) / bandW) ** 2))
    if (rnd() > chance) continue
    const roll = rnd()
    const [, color, mult] = spectrum.find(([p]) => roll < p)
    const size = Math.floor(2 * mult * rnd()) + 1
    stars.push({ x, y, size, color, depth: 0.2 + rnd() * 0.8, period: rnd() * 5 + 1, phase: rnd() * Math.PI * 2 })
  }

  nebula = null
  if (o.band) {
    nebula = document.createElement('canvas')
    nebula.width = w * dpr
    nebula.height = h * dpr
    const n = nebula.getContext('2d')
    n.scale(dpr, dpr)
    const vh = Math.min(h, 900)
    const tints = ['120,140,255', '190,120,255', '255,200,160', '140,200,255']
    for (let i = 0; i < 22; i++) {
      const f = rnd()
      const cx = f * w + (rnd() - 0.5) * 80
      const cy = vh * 0.85 - f * vh * 0.8 + (rnd() - 0.5) * bandW
      const r = 60 + rnd() * 180
      const g = n.createRadialGradient(cx, cy, 0, cx, cy, r)
      g.addColorStop(0, `rgba(${tints[i % tints.length]},${0.03 + rnd() * 0.04})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      n.fillStyle = g
      n.fillRect(cx - r, cy - r, r * 2, r * 2)
    }
  }
}

function animated() {
  const o = props.opts
  return !reduced.matches && (o.twinkle || o.drift || o.pointer || o.meteors)
}

function draw(now) {
  const o = props.opts
  const t = (now - t0) / 1000
  const motion = !reduced.matches
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  if (nebula) ctx.drawImage(nebula, 0, 0, w, h)

  pointer.x += (pointer.tx - pointer.x) * 0.06
  pointer.y += (pointer.ty - pointer.y) * 0.06

  for (const s of stars) {
    let x = s.x, y = s.y
    if (motion && o.drift) x = (((x + t * 6 * s.depth) % w) + w) % w
    if (motion && o.pointer) {
      const k = o.parallax ?? 14
      x += pointer.x * s.depth * k
      y += pointer.y * s.depth * k
    }
    const a = motion && o.twinkle ? 0.2 + 0.4 * (0.5 + 0.5 * Math.sin((t * Math.PI * 2) / s.period + s.phase)) : 0.5
    ctx.fillStyle = s.color
    if (o.glow && s.size >= 2) {
      ctx.globalAlpha = a * 0.22
      ctx.beginPath()
      ctx.arc(x, y, s.size * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = a
    if (s.size <= 1) ctx.fillRect(x, y, 1, 1)
    else {
      ctx.beginPath()
      ctx.arc(x, y, s.size / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  if (motion && o.meteors) {
    if (t > nextMeteor) {
      const vh = Math.min(h, 900)
      const dir = Math.random() < 0.5 ? -1 : 1
      const ang = (0.25 + Math.random() * 0.3) * dir
      meteors.push({ x: Math.random() * w, y: Math.random() * vh * 0.5, vx: Math.sin(ang) * 650, vy: Math.cos(ang) * 650 * 0.45, born: t })
      const [lo, hi] = METEOR_GAPS[o.meteorRate] || METEOR_GAPS.normal
      nextMeteor = t + lo + Math.random() * (hi - lo)
    }
    meteors = meteors.filter((m) => t - m.born < 0.8)
    for (const m of meteors) {
      const age = t - m.born
      const hx = m.x + m.vx * age, hy = m.y + m.vy * age
      const tx = hx - m.vx * 0.18, ty = hy - m.vy * 0.18
      const g = ctx.createLinearGradient(hx, hy, tx, ty)
      const fade = 1 - age / 0.8
      g.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.globalAlpha = 1
      ctx.strokeStyle = g
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(hx, hy)
      ctx.lineTo(tx, ty)
      ctx.stroke()
    }
  }
  ctx.globalAlpha = 1
}

function loop(now) {
  raf = requestAnimationFrame(loop)
  if (!visible || now - last < 33) return
  last = now
  draw(now)
}

function restart() {
  cancelAnimationFrame(raf)
  if (!w || !h) return
  build()
  if (animated()) raf = requestAnimationFrame(loop)
  else draw(performance.now())
}

function resize() {
  const r = host.getBoundingClientRect()
  const nw = Math.round(r.width), nh = Math.round(r.height)
  if (nw === w && nh === h) return
  w = nw
  h = nh
  dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.value.width = w * dpr
  canvas.value.height = h * dpr
  restart()
}

function onMove(e) {
  const r = host.getBoundingClientRect()
  pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2
  pointer.ty = ((e.clientY - r.top) / Math.min(r.height, 900) - 0.5) * 2
}

onMounted(() => {
  host = canvas.value.parentElement
  ctx = canvas.value.getContext('2d')
  ro = new ResizeObserver(resize)
  ro.observe(host)
  io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(host)
  host.addEventListener('pointermove', onMove)
  resize()
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  io?.disconnect()
  host?.removeEventListener('pointermove', onMove)
})
watch(() => [props.seed, JSON.stringify(props.opts)], restart)
</script>

<template>
  <canvas ref="canvas" class="starfield" aria-hidden="true"></canvas>
</template>

<style scoped>
.starfield {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
