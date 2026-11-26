import { useId } from 'react'
import * as m from 'motion/react-m'
import { BENGALURU_POINT, INDIA_OUTLINE_PATH, INDIA_VIEWBOX, KARNATAKA_PATH } from '@/data/indiaMap'
import { profile } from '@/data/profile'
import { Card } from '@/components/ui/Card'
import { useClock } from '@/hooks/useClock'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useReveal } from '@/hooks/useReveal'
import { INTRO_STAGGER } from '@/lib/intro'

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
  const gradients = useId()
  const indiaFill = `${gradients}-india`
  const karnatakaFill = `${gradients}-karnataka`
  // The outline draws itself (and the fills fade in) once the map is in view and the intro has closed.
  const [mapRef, ready] = useReveal('-60px')

  return (
    <Card className="h-full">
      <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
        {/* The map fills the space above the clock: it scales to fit the card and is centred both
            ways. From lg up the card is as tall as the Skills card beside it; below that the map gets
            a fixed height. */}
        <div className="grid h-[19rem] flex-none place-items-center [container-type:size] sm:h-[22rem] lg:h-auto lg:min-h-0 lg:flex-1">
          <div
            ref={mapRef}
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
              <defs>
                {/* Soft saffron to near-white to green (India), and yellow to red (Karnataka). The
                    stop opacity comes from CSS, so dark mode uses the same colours, fainter. */}
                <linearGradient id={indiaFill} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFE8D1" className="map-stop-india" />
                  <stop offset="0.5" stopColor="#FFFDF9" className="map-stop-india" />
                  <stop offset="1" stopColor="#DFF3E3" className="map-stop-india" />
                </linearGradient>
                <linearGradient id={karnatakaFill} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFF4B8" className="map-stop-karnataka" />
                  <stop offset="1" stopColor="#FFD6D6" className="map-stop-karnataka" />
                </linearGradient>
              </defs>
              <m.path
                d={INDIA_OUTLINE_PATH}
                fill={`url(#${indiaFill})`}
                style={{ stroke: 'var(--map-stroke)' }}
                strokeWidth={2.2}
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0, fillOpacity: 0 }}
                animate={ready ? { pathLength: 1, fillOpacity: 1 } : undefined}
                transition={{
                  pathLength: { duration: 2, ease: 'easeInOut', delay: INTRO_STAGGER },
                  fillOpacity: { duration: 0.8, delay: 1.5 + INTRO_STAGGER },
                }}
              />
              <m.path
                d={KARNATAKA_PATH}
                fill={`url(#${karnatakaFill})`}
                style={{ stroke: 'var(--map-stroke-state)' }}
                strokeWidth={1.4}
                strokeLinejoin="round"
                initial={reduced ? false : { fillOpacity: 0 }}
                animate={ready ? { fillOpacity: 1 } : undefined}
                transition={{ fillOpacity: { duration: 0.8, delay: 1.7 + INTRO_STAGGER } }}
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
