import { useEffect, useRef } from 'react'
import { useFinePointer } from '@/hooks/useFinePointer'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cancel, wake, type Task } from '@/lib/ticker'
import { useQualityTier } from '@/three/useQualityTier'

/** Pointer influence reaches this far (px); beyond it a neuron does not react at all. */
const REACH = 210
/** How long the pointer may rest before activity fades back to baseline (ms). */
const IDLE_MS = 2200
const MAX_PULSES = 5

interface Neuron {
  x: number
  y: number
  r: number
  hub: boolean
  /** Activation from the pointer, 0..1, smoothed. */
  level: number
  /** A short-lived boost from an arriving signal pulse, 0..1. */
  kick: number
  edges: number[]
}

interface Synapse {
  a: number
  b: number
  /** Quadratic curve control point (equal to the midpoint for a straight synapse). */
  cx: number
  cy: number
  length: number
}

interface Pulse {
  edge: number
  /** The neuron this pulse is leaving. */
  from: number
  /** 0..1 along the synapse in the direction of travel. */
  t: number
  speed: number
  hops: number
}

/** Small deterministic random source, so the network is the same on every visit. */
function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * An organic network: neurons scattered with a minimum spacing (never a grid), each linked to its
 * nearest two or three neighbours by a synapse, most of them gently curved.
 */
function buildNetwork(width: number, height: number) {
  const random = seeded(11)
  const gap = Math.min(Math.max(Math.sqrt((width * height) / 62), 100), 150)
  const pad = 40

  const neurons: Neuron[] = []
  for (let i = 0; i < 6000 && neurons.length < 90; i++) {
    const x = -pad + random() * (width + pad * 2)
    const y = -pad + random() * (height + pad * 2)
    if (neurons.every((n) => Math.hypot(n.x - x, n.y - y) >= gap)) {
      neurons.push({ x, y, r: 1.5 + random() * 1.1, hub: false, level: 0, kick: 0, edges: [] })
    }
  }

  const synapses: Synapse[] = []
  const seen = new Set<string>()
  const range = gap * 2.1
  neurons.forEach((from, i) => {
    const near = neurons
      .map((to, j) => ({ j, d: Math.hypot(to.x - from.x, to.y - from.y) }))
      .filter(({ j, d }) => j !== i && d <= range)
      .sort((p, q) => p.d - q.d)
      .slice(0, random() < 0.4 ? 3 : 2)
    for (const { j, d } of near) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) continue
      seen.add(key)
      const to = neurons[j]
      // Most synapses bow sideways a little, like real axons; some stay straight.
      const bow = random() < 0.7 ? (random() - 0.5) * 0.35 * d : 0
      const nx = -(to.y - from.y) / d
      const ny = (to.x - from.x) / d
      synapses.push({
        a: i,
        b: j,
        cx: (from.x + to.x) / 2 + nx * bow,
        cy: (from.y + to.y) / 2 + ny * bow,
        length: d,
      })
      from.edges.push(synapses.length - 1)
      to.edges.push(synapses.length - 1)
    }
  })
  neurons.forEach((n) => (n.hub = n.edges.length >= 4))
  return { neurons, synapses }
}

/**
 * A quiet, scientific neural network behind the whole page: small neurons joined by fine
 * synapses, faint at rest. As the mouse moves, the neurons near it brighten and swell a little,
 * the synapses between them light up, and a few signal pulses travel along the connections,
 * lighting each neuron they reach. When the pointer stops, everything eases back to baseline.
 * Only neurons within reach respond, so the network never flashes or follows the cursor.
 *
 * One 2D canvas on the shared ticker: nothing runs while the page is still, and the loop pauses
 * with the tab. It sits behind the content, ignores clicks, and the animation is only enabled
 * for fine pointers, without reduced motion, on capable devices. Everywhere else the same faint
 * network is drawn once, as a static background.
 */
export function NeuralField() {
  const reducedMotion = useReducedMotion()
  const { tier } = useQualityTier()
  const animated = useFinePointer() && !reducedMotion && tier === 'high'
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvas.current
    const ctx = el?.getContext('2d')
    if (!el || !ctx) return

    let neurons: Neuron[] = []
    let synapses: Synapse[] = []
    const pulses: Pulse[] = []
    const pointer = { x: 0, y: 0, smoothX: 0, smoothY: 0, presence: 0, lastMove: 0, inside: false }
    let spawnIn = 0
    const random = seeded(23)
    /** The canvas's own CSS size. Everything is sized from this, never from window.innerWidth, which includes the scrollbar. */
    const size = { width: 0, height: 0 }

    const trace = (s: Synapse) => {
      const a = neurons[s.a]
      const b = neurons[s.b]
      ctx.moveTo(a.x, a.y)
      ctx.quadraticCurveTo(s.cx, s.cy, b.x, b.y)
    }

    /** Point at `u` (0 at neuron a, 1 at neuron b) along a synapse. */
    const pointOn = (s: Synapse, u: number): [number, number] => {
      const a = neurons[s.a]
      const b = neurons[s.b]
      const k = 1 - u
      return [
        k * k * a.x + 2 * k * u * s.cx + u * u * b.x,
        k * k * a.y + 2 * k * u * s.cy + u * u * b.y,
      ]
    }

    const draw = () => {
      ctx.clearRect(0, 0, size.width, size.height)
      // Always within 0..1, so no value can ever produce an out-of-range colour or a huge radius.
      const lit = (n: Neuron) => Math.min(1, Math.max(0, n.level, n.kick))

      // Resting synapses, in one batched stroke.
      ctx.lineWidth = 0.8
      ctx.strokeStyle = 'rgba(255,177,92,0.07)'
      ctx.beginPath()
      synapses.forEach(trace)
      ctx.stroke()

      // Active synapses: brighter toward whichever end is more active.
      for (const s of synapses) {
        const la = lit(neurons[s.a])
        const lb = lit(neurons[s.b])
        if (Math.max(la, lb) < 0.03) continue
        const a = neurons[s.a]
        const b = neurons[s.b]
        const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        gradient.addColorStop(0, `rgba(255,150,60,${0.68 * la})`)
        gradient.addColorStop(1, `rgba(255,150,60,${0.68 * lb})`)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 0.8 + 0.7 * Math.max(la, lb)
        ctx.beginPath()
        trace(s)
        ctx.stroke()
      }

      for (const n of neurons) {
        const level = lit(n)
        if (level > 0.12) {
          const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 9 + level * 11)
          halo.addColorStop(0, `rgba(255,122,48,${0.42 * level})`)
          halo.addColorStop(1, 'rgba(255,122,48,0)')
          ctx.fillStyle = halo
          ctx.fillRect(n.x - 20, n.y - 20, 40, 40)
        }
        if (n.hub) {
          ctx.strokeStyle = `rgba(255,177,92,${0.1 + level * 0.4})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r * (2.6 + level * 0.8), 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.fillStyle =
          level > 0.08
            ? `rgba(255,${Math.round(177 - level * 40)},${Math.round(92 - level * 40)},${0.18 + level * 0.72})`
            : 'rgba(246,239,230,0.16)'
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * (1 + level * 0.45), 0, Math.PI * 2)
        ctx.fill()
      }

      // Signal pulses: a bright head with a short fading tail, riding the curve.
      for (const p of pulses) {
        const s = synapses[p.edge]
        const forward = p.from === s.a
        for (let k = 0; k < 5; k++) {
          const t = Math.max(0, p.t - k * 0.035)
          const [x, y] = pointOn(s, forward ? t : 1 - t)
          const fade = 1 - k / 5
          if (k === 0) {
            const glow = ctx.createRadialGradient(x, y, 0, x, y, 9)
            glow.addColorStop(0, 'rgba(255,177,92,0.5)')
            glow.addColorStop(1, 'rgba(255,177,92,0)')
            ctx.fillStyle = glow
            ctx.fillRect(x - 9, y - 9, 18, 18)
          }
          ctx.fillStyle = `rgba(255,226,189,${0.85 * fade})`
          ctx.beginPath()
          ctx.arc(x, y, 1.9 - k * 0.22, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const step: Task = (rawDt) => {
      const dt = Number.isFinite(rawDt) ? Math.max(rawDt, 0) : 0
      const now = performance.now()
      const active = pointer.inside && now - pointer.lastMove < IDLE_MS
      pointer.presence +=
        ((active ? 1 : 0) - pointer.presence) * (1 - Math.exp(-dt * (active ? 4 : 1.6)))

      // Everything is smoothed, so a fast mouse can never cause a jump.
      const follow = 1 - Math.exp(-dt * 7)
      pointer.smoothX += (pointer.x - pointer.smoothX) * follow
      pointer.smoothY += (pointer.y - pointer.smoothY) * follow

      let energy = 0
      for (const n of neurons) {
        const distance = Math.hypot(n.x - pointer.smoothX, n.y - pointer.smoothY)
        const target = Math.max(0, 1 - distance / REACH) ** 2 * pointer.presence
        // Quick to light, slow to fade: it reads as organic, never as a flash.
        const rate = target > n.level ? 6 : 2.2
        n.level += (target - n.level) * (1 - Math.exp(-dt * rate))
        n.kick *= Math.exp(-dt * 2.4)
        energy += n.level + n.kick
      }

      // A few pulses leave the neurons that are lit up near the pointer.
      spawnIn -= dt
      if (pointer.presence > 0.3 && spawnIn <= 0 && pulses.length < MAX_PULSES) {
        spawnIn = 0.25 + random() * 0.3
        const sources = neurons.filter((n) => n.level > 0.3 && n.edges.length > 0)
        if (sources.length > 0) {
          const from = sources[Math.floor(random() * sources.length)]
          const edge = from.edges[Math.floor(random() * from.edges.length)]
          pulses.push({
            edge,
            from: neurons.indexOf(from),
            t: 0,
            speed: 230 + random() * 90,
            hops: 0,
          })
        }
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        const s = synapses[p.edge]
        p.t += (p.speed * dt) / s.length
        if (p.t < 1) continue

        // Arrived: light the neuron, then often carry on along another synapse.
        const arrivedAt = p.from === s.a ? s.b : s.a
        const neuron = neurons[arrivedAt]
        neuron.kick = Math.min(1, neuron.kick + 0.6)
        const onward = neuron.edges.filter((e) => e !== p.edge)
        if (p.hops < 3 && onward.length > 0 && random() < 0.7) {
          p.from = arrivedAt
          p.edge = onward[Math.floor(random() * onward.length)]
          p.t = 0
          p.hops += 1
        } else {
          pulses.splice(i, 1)
        }
      }

      draw()
      return pointer.presence > 0.01 || energy > 0.004 || pulses.length > 0
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      size.width = el.clientWidth
      size.height = el.clientHeight
      el.width = Math.round(size.width * dpr)
      el.height = Math.round(size.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ;({ neurons, synapses } = buildNetwork(size.width, size.height))
      pulses.length = 0
      draw()
    }

    resize()
    window.addEventListener('resize', resize)
    if (!animated) return () => window.removeEventListener('resize', resize)

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      if (!pointer.inside) {
        pointer.smoothX = event.clientX
        pointer.smoothY = event.clientY
      }
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.inside = true
      pointer.lastMove = performance.now()
      wake(step)
    }
    const onLeave = () => {
      pointer.inside = false
      wake(step)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    document.addEventListener('visibilitychange', onLeave)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      document.removeEventListener('visibilitychange', onLeave)
      cancel(step)
    }
  }, [animated])

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}
