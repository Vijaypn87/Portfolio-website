/**
 * Geometry of the hero's "neural sculpture": three flowing ribbons that twist around a shared axis,
 * unfurling from a narrow tail on the left to a broad sweep on the right. Pure maths with no
 * three.js import, so the static SVG fallback (in the main bundle) and the WebGL scene (in the
 * lazy chunk) draw exactly the same shape.
 */

export type Vec3 = [number, number, number]

export interface RibbonSample {
  /** 0 at the tail, 1 at the broad end. */
  t: number
  center: Vec3
  left: Vec3
  right: Vec3
}

export const RIBBON_COUNT = 3

const TAU = Math.PI * 2

const PARAMS = [
  { radius: 0.78, phase: 0, turns: 1.15, twist: 0.4 },
  { radius: 1.0, phase: TAU / 3, turns: 1.05, twist: 1.3 },
  { radius: 1.22, phase: (2 * TAU) / 3, turns: 1.0, twist: 2.2 },
] as const

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const normalize = (v: Vec3): Vec3 => {
  const length = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / length, v[1] / length, v[2] / length]
}

/** Centre line of ribbon `k` at `t`: a helix whose radius grows toward the broad end. */
export function ribbonCenter(k: number, t: number): Vec3 {
  const { radius, phase, turns } = PARAMS[k]
  const r = radius * 1.2 * (0.5 + 0.75 * t)
  const angle = TAU * turns * t + phase
  return [
    (t - 0.5) * 5,
    r * Math.sin(angle) + 0.35 * Math.sin(TAU * t * 0.9 + k),
    r * Math.cos(angle),
  ]
}

/** Samples a ribbon: its centre line plus the two edges of a strip that twists as it travels. */
export function buildRibbon(k: number, samples: number): RibbonSample[] {
  const { phase, turns, twist } = PARAMS[k]
  const out: RibbonSample[] = []
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1)
    const center = ribbonCenter(k, t)
    const ahead = ribbonCenter(k, Math.min(t + 0.002, 1))
    const behind = ribbonCenter(k, Math.max(t - 0.002, 0))
    const tangent = normalize(sub(ahead, behind))

    // The strip starts out facing away from the axis, then twists around its own direction.
    const angle = TAU * turns * t + phase
    const radial: Vec3 = [0, Math.sin(angle), Math.cos(angle)]
    const psi = 0.9 + twist * 0.7 * Math.sin(TAU * t) + 1.1 * t
    const c = Math.cos(psi)
    const s = Math.sin(psi)
    const tr = cross(tangent, radial)
    const td = dot(tangent, radial)
    const edge = normalize([
      radial[0] * c + tr[0] * s + tangent[0] * td * (1 - c),
      radial[1] * c + tr[1] * s + tangent[1] * td * (1 - c),
      radial[2] * c + tr[2] * s + tangent[2] * td * (1 - c),
    ])

    // Narrow at the tail, broad at the head, and tapered to a point at both ends.
    const width = (0.2 + 0.75 * t) * Math.pow(Math.sin(Math.PI * t), 0.55) * (0.85 + 0.1 * k)
    out.push({
      t,
      center,
      left: [
        center[0] + (edge[0] * width) / 2,
        center[1] + (edge[1] * width) / 2,
        center[2] + (edge[2] * width) / 2,
      ],
      right: [
        center[0] - (edge[0] * width) / 2,
        center[1] - (edge[1] * width) / 2,
        center[2] - (edge[2] * width) / 2,
      ],
    })
  }
  return out
}

/** Rotations used by both renderers (the ribbons turn slowly about the shared X axis). */
export const rotateX = ([x, y, z]: Vec3, a: number): Vec3 => [
  x,
  y * Math.cos(a) - z * Math.sin(a),
  y * Math.sin(a) + z * Math.cos(a),
]
export const rotateY = ([x, y, z]: Vec3, a: number): Vec3 => [
  x * Math.cos(a) + z * Math.sin(a),
  y,
  -x * Math.sin(a) + z * Math.cos(a),
]
export const rotateZ = ([x, y, z]: Vec3, a: number): Vec3 => [
  x * Math.cos(a) - y * Math.sin(a),
  x * Math.sin(a) + y * Math.cos(a),
  z,
]

/**
 * The fine "neural" connections: chords that join neighbouring ribbons, as pairs of
 * (ribbon, sample) endpoints. Evenly spaced and slightly diagonal, so they read as a web, not a grid.
 */
export interface LinkSpec {
  a: { ribbon: number; sample: number }
  b: { ribbon: number; sample: number }
}

export function buildLinks(samples: number, perPair = 10): LinkSpec[] {
  const links: LinkSpec[] = []
  const lo = Math.round(samples * 0.1)
  const hi = Math.round(samples * 0.92)
  const step = (hi - lo) / perPair
  const skew = Math.max(2, Math.round(samples * 0.04))
  for (let pair = 0; pair < RIBBON_COUNT; pair++) {
    const a = pair
    const b = (pair + 1) % RIBBON_COUNT
    for (let i = 0; i < perPair; i++) {
      const sample = Math.round(lo + (i + (pair % 2) * 0.5) * step)
      links.push({
        a: { ribbon: a, sample: Math.min(sample, samples - 1) },
        b: { ribbon: b, sample: Math.min(sample + skew, samples - 1) },
      })
    }
  }
  return links
}
