import {
  buildLinks,
  buildRibbon,
  RIBBON_COUNT,
  rotateX,
  rotateY,
  rotateZ,
  type Vec3,
} from '@/lib/sculpture'

/**
 * A pure SVG take on the neural sculpture: shown while the 3D scene loads and permanently when
 * WebGL is unavailable, the device is low-powered, or the user prefers reduced motion. It uses the
 * same curves as the WebGL version (via lib/sculpture) in a similar pose, and carries
 * `data-static-visual` so CSS fades it out once WebGL is running (see index.css).
 * No three.js here, so it costs almost nothing in the main bundle.
 */

const SAMPLES = 64
const VIEW = { width: 400, height: 320, scale: 58 }
/** The ribbons' resting angles: the same starting pose as the 3D scene at time zero. */
const ANGLES = [0, 0, 0]

const pose = (p: Vec3): Vec3 => rotateZ(rotateY(rotateX(p, 0.25), 0.2), -0.32)
const project = ([x, y, z]: Vec3) => ({
  x: VIEW.width / 2 + 0.15 * VIEW.scale + x * VIEW.scale,
  y: VIEW.height / 2 - y * VIEW.scale,
  depth: (z + 1.6) / 3.2,
})

const ribbons = Array.from({ length: RIBBON_COUNT }, (_, k) =>
  buildRibbon(k, SAMPLES).map((sample) => ({
    t: sample.t,
    center: project(pose(rotateX(sample.center, ANGLES[k]))),
    left: project(pose(rotateX(sample.left, ANGLES[k]))),
    right: project(pose(rotateX(sample.right, ANGLES[k]))),
  })),
)

const outline = (k: number) => {
  const r = ribbons[k]
  const forward = r.map((s) => `${s.left.x.toFixed(1)},${s.left.y.toFixed(1)}`)
  const back = [...r].reverse().map((s) => `${s.right.x.toFixed(1)},${s.right.y.toFixed(1)}`)
  return `M${[...forward, ...back].join('L')}Z`
}

const links = buildLinks(SAMPLES, 9).map((link) => ({
  a: ribbons[link.a.ribbon][link.a.sample].center,
  b: ribbons[link.b.ribbon][link.b.sample].center,
}))
const NODE_LINKS = links.filter((_, i) => i % 3 === 0)

export function StaticSculpture() {
  return (
    <div
      aria-hidden="true"
      data-static-visual
      className="absolute inset-0 text-fg transition-opacity duration-700"
    >
      <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} className="relative size-full" fill="none">
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={outline(k)}
            fill="currentColor"
            fillOpacity={0.05 + k * 0.015}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
        ))}

        {links.map(({ a, b }, i) => (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="currentColor"
            strokeOpacity={0.22}
            strokeWidth={0.7}
          />
        ))}

        {NODE_LINKS.map(({ a }, i) => (
          <circle
            key={i}
            cx={a.x}
            cy={a.y}
            r={3}
            fill="currentColor"
            fillOpacity={0.25 + a.depth * 0.4}
          />
        ))}
      </svg>
    </div>
  )
}
