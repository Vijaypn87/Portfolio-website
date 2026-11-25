import * as m from 'motion/react-m'
import { BENGALURU_POINT, INDIA_OUTLINE_PATH, INDIA_VIEWBOX } from '@/data/indiaMap'
import { profile } from '@/data/profile'
import { Card } from '@/components/ui/Card'
import { useClock } from '@/hooks/useClock'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const { x, y } = BENGALURU_POINT

/**
 * An outline map of India (inline SVG, no tiles or API) with a green pulsing pin on Bengaluru, and
 * a footer with the live local time. The outline draws itself when the card scrolls into view;
 * hovering or focusing the pin shows a small tooltip.
 */
export function LocationCard() {
  const { city, timeZone } = profile.location
  const time = useClock(timeZone, { seconds: true, intervalMs: 1000 })
  const reduced = useReducedMotion()

  return (
    <Card className="h-full">
      <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
        {/* The map fills the space above the clock: it scales to fit the card and is centred both
            ways. From lg up the card is as tall as the Skills card beside it; below that the map gets
            a fixed height. */}
        <div className="grid h-[19rem] flex-none place-items-center [container-type:size] sm:h-[22rem] lg:h-auto lg:min-h-0 lg:flex-1">
          <div
            className="relative"
            style={{
              width: `min(100cqw, calc(100cqh * ${INDIA_VIEWBOX.width / INDIA_VIEWBOX.height}))`,
              aspectRatio: `${INDIA_VIEWBOX.width} / ${INDIA_VIEWBOX.height}`,
            }}
          >
            <svg
              viewBox={`0 0 ${INDIA_VIEWBOX.width} ${INDIA_VIEWBOX.height}`}
              role="img"
              aria-label={`Outline map of India with a pin on ${city}`}
              className="absolute inset-0 size-full overflow-visible"
            >
              <m.path
                d={INDIA_OUTLINE_PATH}
                style={{ fill: 'var(--map-fill)', stroke: 'var(--map-stroke)' }}
                strokeWidth={2.2}
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0, fillOpacity: 0 }}
                whileInView={{ pathLength: 1, fillOpacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  pathLength: { duration: 2, ease: 'easeInOut' },
                  fillOpacity: { duration: 0.8, delay: 1.5 },
                }}
              />
              <g transform={`translate(${x} ${y})`}>
                <circle r="6" className="pin-ring" />
                <circle r="6" className="pin-ring" style={{ animationDelay: '1.3s' }} />
                <circle r="7" fill="var(--pin)" />
                <circle r="2.6" fill="var(--bg)" opacity="0.85" />
                <text
                  x="14"
                  y="7"
                  fill="var(--muted)"
                  fontSize="22"
                  fontFamily="var(--font-mono)"
                  fontWeight="500"
                  letterSpacing="2"
                >
                  BLR
                </text>
              </g>
            </svg>

            <button
              type="button"
              aria-label={`${city}, India`}
              className="group/pin absolute size-[40px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${(x / INDIA_VIEWBOX.width) * 100}%`,
                top: `${(y / INDIA_VIEWBOX.height) * 100}%`,
              }}
            >
              <span
                aria-hidden="true"
                className="label-mono pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-md border border-line bg-bg px-2.5 py-1.5 text-[0.65rem] whitespace-nowrap text-fg opacity-0 shadow-lg transition-opacity duration-200 group-hover/pin:opacity-100 group-focus-visible/pin:opacity-100"
              >
                {city}, India
              </span>
            </button>
          </div>
        </div>

        <p className="flex items-baseline justify-between gap-3 font-mono text-xs text-muted">
          <span>local time · {city}</span>
          <span className="text-sm font-medium text-fg tabular-nums">{time}</span>
        </p>
      </div>
    </Card>
  )
}
