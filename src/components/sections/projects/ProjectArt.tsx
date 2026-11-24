import type { ReactNode } from 'react'
import type { ProjectVisual } from '@/types'

/**
 * Abstract illustrations of what each project does, shown until a real screenshot exists. They
 * contain no data, numbers or fake UI text beyond the generic stage names taken from the resume.
 * All are 320 x 200 (16:10) and use only the site palette.
 */

const L = '#ffb15c' // amber
const F = '#ffd29a' // light amber
const M = '#ff7a30' // orange (the highlighted step)

/** Retrieval pipeline: ingest, chunk, retrieve, generate, cite. */
function Rag() {
  const labels = ['ingest', 'chunk', 'retrieve', 'generate', 'cite']
  const xs = [16, 77, 138, 199, 260]
  return (
    <>
      <line
        x1={38}
        y1={92}
        x2={282}
        y2={92}
        stroke={L}
        strokeOpacity={0.35}
        strokeDasharray="3 4"
      />
      {xs.map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={70}
            width={44}
            height={44}
            rx={12}
            fill="#161312"
            stroke={i === 4 ? M : i % 2 ? F : L}
            strokeOpacity={i === 4 ? 0.9 : 0.55}
          />
          <text
            x={x + 22}
            y={134}
            textAnchor="middle"
            fontSize={8}
            fill="#b3a89b"
            fontFamily="monospace"
          >
            {labels[i]}
          </text>
        </g>
      ))}
      {/* ingest: a page */}
      <path d="M31 82h12l6 6v16H31z" fill="none" stroke={L} strokeOpacity={0.8} />
      {/* chunk: stacked bars */}
      <path d="M90 84h18M90 92h18M90 100h12" stroke={F} strokeOpacity={0.8} strokeLinecap="round" />
      {/* retrieve: scattered vectors, one matched */}
      {[
        [150, 82],
        [166, 90],
        [152, 102],
        [168, 104],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i === 1 ? 3.5 : 2.5}
          fill={i === 1 ? M : L}
          fillOpacity={i === 1 ? 1 : 0.6}
        />
      ))}
      {/* generate: sparkle */}
      <path d="M221 82v20M211 92h20" stroke={F} strokeOpacity={0.8} strokeLinecap="round" />
      <circle cx={221} cy={92} r={4} fill={F} fillOpacity={0.5} />
      {/* cite: check */}
      <path
        d="M273 92l6 6 10-12"
        fill="none"
        stroke={M}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  )
}

/** Scheme discovery: filter chips over a grid of cards, one matching card highlighted. */
function Schemes() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={24 + i * 62}
          y={26}
          width={54}
          height={16}
          rx={8}
          fill={i === 0 ? L : 'none'}
          fillOpacity={0.25}
          stroke={L}
          strokeOpacity={0.5}
        />
      ))}
      {[0, 1, 2].flatMap((col) =>
        [0, 1].map((row) => {
          const hit = col === 1 && row === 0
          return (
            <g key={`${col}-${row}`}>
              <rect
                x={24 + col * 98}
                y={60 + row * 62}
                width={88}
                height={52}
                rx={10}
                fill="#161312"
                stroke={hit ? M : F}
                strokeOpacity={hit ? 0.95 : 0.35}
              />
              <path
                d={`M${36 + col * 98} ${76 + row * 62}h36M${36 + col * 98} ${86 + row * 62}h56M${36 + col * 98} ${96 + row * 62}h24`}
                stroke={hit ? M : L}
                strokeOpacity={0.6}
                strokeLinecap="round"
              />
            </g>
          )
        }),
      )}
    </>
  )
}

/** Surveillance frame: tracked boxes with identity tags, a trail and one flagged box. */
function Vision() {
  return (
    <>
      <rect
        x={14}
        y={14}
        width={292}
        height={172}
        rx={12}
        fill="none"
        stroke={L}
        strokeOpacity={0.3}
      />
      <path d="M14 140h292" stroke={F} strokeOpacity={0.18} />
      <path
        d="M50 150 C90 140, 110 130, 150 128 S 200 124, 226 112"
        fill="none"
        stroke={F}
        strokeOpacity={0.45}
        strokeDasharray="3 4"
      />
      {[
        { x: 40, y: 70, w: 58, h: 84, c: F, t: 'ID 1' },
        { x: 138, y: 86, w: 50, h: 68, c: L, t: 'ID 2' },
      ].map(({ x, y, w, h, c, t }) => (
        <g key={t}>
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={6}
            fill={c}
            fillOpacity={0.07}
            stroke={c}
            strokeOpacity={0.85}
          />
          <rect x={x} y={y - 13} width={30} height={13} rx={4} fill={c} fillOpacity={0.9} />
          <text
            x={x + 15}
            y={y - 3.5}
            textAnchor="middle"
            fontSize={7.5}
            fill="#0e0c0b"
            fontFamily="monospace"
          >
            {t}
          </text>
        </g>
      ))}
      <rect
        x={220}
        y={62}
        width={64}
        height={94}
        rx={6}
        fill={M}
        fillOpacity={0.08}
        stroke={M}
        strokeDasharray="4 3"
      />
      <rect x={220} y={49} width={38} height={13} rx={4} fill={M} />
      <text
        x={239}
        y={58.5}
        textAnchor="middle"
        fontSize={7.5}
        fill="#0e0c0b"
        fontFamily="monospace"
      >
        alert
      </text>
    </>
  )
}

/** Satellite tiles with layered water contours and a detected region outlined in orange. */
function Flood() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={`v${i}`} d={`M${i * 40} 0v200`} stroke={L} strokeOpacity={0.1} />
      ))}
      {[1, 2, 3, 4].map((i) => (
        <path key={`h${i}`} d={`M0 ${i * 40}h320`} stroke={L} strokeOpacity={0.1} />
      ))}
      <path
        d="M0 150 C50 125, 90 165, 140 142 S 240 118, 320 146 V200 H0Z"
        fill={F}
        fillOpacity={0.12}
      />
      <path
        d="M0 168 C60 148, 110 182, 170 160 S 270 142, 320 164 V200 H0Z"
        fill={L}
        fillOpacity={0.14}
      />
      <path
        d="M0 150 C50 125, 90 165, 140 142 S 240 118, 320 146"
        fill="none"
        stroke={F}
        strokeOpacity={0.6}
      />
      <path
        d="M0 168 C60 148, 110 182, 170 160 S 270 142, 320 164"
        fill="none"
        stroke={L}
        strokeOpacity={0.6}
      />
      <path
        d="M92 118 L128 92 L176 104 L198 138 L158 156 L110 148Z"
        fill={M}
        fillOpacity={0.1}
        stroke={M}
        strokeWidth={1.5}
        strokeDasharray="5 3"
      />
    </>
  )
}

const art: Record<ProjectVisual, () => ReactNode> = {
  rag: Rag,
  schemes: Schemes,
  vision: Vision,
  flood: Flood,
}

export function ProjectArt({ visual, title }: { visual: ProjectVisual; title: string }) {
  const Art = art[visual]
  return (
    <div className="relative size-full bg-[radial-gradient(circle_at_20%_15%,rgb(255_177_92/0.16),transparent_55%),radial-gradient(circle_at_90%_95%,rgb(255_122_48/0.12),transparent_50%),linear-gradient(160deg,var(--color-night-700),var(--color-night-800))]">
      <svg
        role="img"
        aria-label={`Illustration for ${title}`}
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
        className="size-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      >
        <Art />
      </svg>
    </div>
  )
}
