<script setup lang="ts">
// Canvas starfield sized to its parent: seeded, one canvas, ~30fps cap, paused when off-screen,
// and still (no twinkle, drift, parallax or meteors) under prefers-reduced-motion.
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { generateStars, METEOR_GAPS, STARFIELD_DEFAULTS, type Star, type StarfieldOptions } from '../../utils/starfield'

const props = withDefaults(
  defineProps<{
    /** Same seed, same sky. Sites pass their hostname. */
    seed?: string
    options?: Partial<StarfieldOptions>
  }>(),
  { seed: 'vexoulz.net', options: () => ({}) },
)

const opts = computed<StarfieldOptions>(() => ({ ...STARFIELD_DEFAULTS, ...props.options }))
const canvas = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let host: HTMLElement | null = null
let stars: Star[] = []
let nebula: HTMLCanvasElement | null = null
let w = 0, h = 0, dpr = 1
let raf = 0, last = 0, visible = true
const t0 = performance.now()
const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
let meteors: { x: number; y: number; vx: number; vy: number; born: number }[] = []
let nextMeteor = 2
let ro: ResizeObserver | undefined
let io: IntersectionObserver | undefined
let reduced: MediaQueryList | undefined

function build() {
  const o = opts.value
  const g = generateStars(props.seed, w, h, o)
  stars = g.stars
  nebula = null
  if (!o.band) return
  const rnd = g.rnd
  nebula = document.createElement('canvas')
  nebula.width = w * dpr
  nebula.height = h * dpr
  const n = nebula.getContext('2d')
  if (!n) return
  n.scale(dpr, dpr)
  const vh = Math.min(h, 900)
  const tints = ['120,140,255', '190,120,255', '255,200,160', '140,200,255']
  for (let i = 0; i < 22; i++) {
    const f = rnd()
    const cx = f * w + (rnd() - 0.5) * 80
    const cy = vh * 0.85 - f * vh * 0.8 + (rnd() - 0.5) * g.bandW
    const r = 60 + rnd() * 180
    const grad = n.createRadialGradient(cx, cy, 0, cx, cy, r)
    grad.addColorStop(0, `rgba(${tints[i % tints.length]},${0.03 + rnd() * 0.04})`)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    n.fillStyle = grad
    n.fillRect(cx - r, cy - r, r * 2, r * 2)
  }
}

const motion = () => !reduced?.matches
const animated = () => {
  const o = opts.value
  return motion() && (o.twinkle || o.drift || o.pointer || o.meteors)
}

function draw(now: number) {
  if (!ctx) return
  const o = opts.value
  const t = (now - t0) / 1000
  const moving = motion()
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  if (nebula) ctx.drawImage(nebula, 0, 0, w, h)

  pointer.x += (pointer.tx - pointer.x) * 0.06
  pointer.y += (pointer.ty - pointer.y) * 0.06

  for (const s of stars) {
    let x = s.x, y = s.y
    if (moving && o.drift) x = (((x + t * 6 * s.depth) % w) + w) % w
    if (moving && o.pointer) {
      x += pointer.x * s.depth * o.parallax
      y += pointer.y * s.depth * o.parallax
    }
    const a = moving && o.twinkle ? 0.2 + 0.4 * (0.5 + 0.5 * Math.sin((t * Math.PI * 2) / s.period + s.phase)) : 0.5
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

  if (moving && o.meteors) {
    if (t > nextMeteor) {
      const vh = Math.min(h, 900)
      const side = Math.random() < 0.5 ? -1 : 1
      const ang = (0.25 + Math.random() * 0.3) * side
      meteors.push({ x: Math.random() * w, y: Math.random() * vh * 0.5, vx: Math.sin(ang) * 650, vy: Math.cos(ang) * 650 * 0.45, born: t })
      const [lo, hi] = METEOR_GAPS[o.meteorRate] ?? METEOR_GAPS.normal
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

function loop(now: number) {
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
  if (!host || !canvas.value) return
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

function onMove(e: PointerEvent) {
  if (!host) return
  const r = host.getBoundingClientRect()
  pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2
  pointer.ty = ((e.clientY - r.top) / Math.min(r.height, 900) - 0.5) * 2
}

onMounted(() => {
  if (!canvas.value) return
  host = canvas.value.parentElement
  ctx = canvas.value.getContext('2d')
  if (!host || !ctx) return
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.addEventListener('change', restart)
  ro = new ResizeObserver(resize)
  ro.observe(host)
  io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting))
  io.observe(host)
  host.addEventListener('pointermove', onMove)
  resize()
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  io?.disconnect()
  reduced?.removeEventListener('change', restart)
  host?.removeEventListener('pointermove', onMove)
})
watch(() => [props.seed, JSON.stringify(opts.value)], restart)
</script>

<template>
  <canvas ref="canvas" class="vx-starfield" aria-hidden="true"></canvas>
</template>
