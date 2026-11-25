import { useEffect, useRef, useState } from 'react'
import { profile } from '@/data/profile'
import { cn } from '@/lib/utils'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

/** Shown when no photo file can be found. Never a stock or generated portrait. */
function Placeholder() {
  return (
    <div
      role="img"
      aria-label={`${profile.name}: portrait placeholder`}
      className="flex size-full items-center justify-center"
    >
      <span className="font-display text-5xl font-bold tracking-tight text-fg">
        {initials(profile.name)}
      </span>
    </div>
  )
}

/** The ring's radius in the 400x400 viewBox, and its circumference (the length of the text path). */
const RING_RADIUS = 172
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS
const RING_FONT_SIZE = 13.5
/** How much faster the ring turns while the portrait is hovered. */
const RING_HOVER_SPEED = 2

// Each phrase appears once, and the text is stretched (by `textLength`) to fill the whole circle
// exactly. The final no-break space keeps the gap after the last · the same as every other gap,
// so the end meets the start with no overlap and no extra space.
const ringText =
  'AI / ML ENGINEER · RAG SYSTEMS · COMPUTER VISION · FULL STACK · AI RESEARCH · OPEN TO WORK ·\u00a0'

// The browser spaces the glyphs evenly so that the *last* glyph ends exactly at `textLength`, and the
// last glyph gets no spacing after it. To make every step (including the one back to the start) equal
// to circumference / glyph count, stop the text one spacing short of the full circle.
const GLYPH_ADVANCE = RING_FONT_SIZE * 0.6 // JetBrains Mono is 0.6em wide
const RING_STEP = CIRCUMFERENCE / ringText.length
const RING_LENGTH = ((ringText.length - 1) * RING_STEP + GLYPH_ADVANCE).toFixed(2)

/**
 * A round portrait inside a slowly rotating ring of text. The photo is tried at `photo.src`, then
 * `photo.fallbackSrc`, then an initials placeholder. `priority` loads it eagerly.
 */
export function Portrait({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  const [src, setSrc] = useState<string | null>(profile.photo.src)
  const ring = useRef<SVGSVGElement>(null)
  const speed = useRef(1)
  const frame = useRef(0)

  // Ease the ring's speed toward `target` without ever jumping its angle: changing the
  // animation's playback rate keeps its current position. Mouse and no-reduced-motion only.
  const setRingSpeed = (target: number) => {
    const allowed = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches
    const animation = ring.current?.getAnimations()[0]
    if (!allowed || !animation) return
    cancelAnimationFrame(frame.current)
    const step = () => {
      speed.current += (target - speed.current) * 0.1
      if (Math.abs(target - speed.current) < 0.01) speed.current = target
      animation.updatePlaybackRate(speed.current)
      if (speed.current !== target) frame.current = requestAnimationFrame(step)
    }
    step()
  }
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const onError = () => {
    const { fallbackSrc } = profile.photo
    setSrc((current) => (current !== fallbackSrc && fallbackSrc ? fallbackSrc : null))
  }

  return (
    <figure
      onPointerEnter={() => setRingSpeed(RING_HOVER_SPEED)}
      onPointerLeave={() => setRingSpeed(1)}
      className={cn('portrait relative mx-auto aspect-square w-full max-w-[20rem]', className)}
    >
      <svg
        ref={ring}
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="ring-spin absolute inset-0 size-full text-muted"
      >
        <defs>
          <path id="ring-path" d="M200,200 m-172,0 a172,172 0 1,1 344,0 a172,172 0 1,1 -344,0" />
        </defs>
        <circle cx="200" cy="200" r="148" fill="none" stroke="currentColor" opacity="0.18" />
        <text
          fill="currentColor"
          fontSize={RING_FONT_SIZE}
          fontFamily="var(--font-mono)"
          fontWeight="500"
        >
          <textPath href="#ring-path" textLength={RING_LENGTH} lengthAdjust="spacing">
            {ringText}
          </textPath>
        </text>
      </svg>

      <div className="portrait-photo absolute inset-[15%] overflow-hidden rounded-full border border-line bg-[radial-gradient(circle_at_50%_30%,rgb(var(--glow)/0.3),var(--card)_75%)] shadow-[0_0_60px_-10px_rgb(var(--glow)/0.45)]">
        {src ? (
          <img
            src={src}
            alt={profile.photo.alt}
            width={900}
            height={900}
            decoding="async"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            onError={onError}
            className="portrait-img size-full object-cover object-top"
          />
        ) : (
          <Placeholder />
        )}
      </div>
    </figure>
  )
}
