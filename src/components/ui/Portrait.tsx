import { useState } from 'react'
import { profile } from '@/data/profile'
import { cn } from '@/lib/utils'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

/** Shown when the photo file is missing. Never a stock or generated portrait. */
function Placeholder() {
  return (
    <div
      role="img"
      aria-label={`${profile.name}: portrait placeholder`}
      className="flex size-full flex-col items-center justify-center gap-3"
    >
      <span className="text-gradient font-display text-6xl font-semibold tracking-tight">
        {initials(profile.name)}
      </span>
      {import.meta.env.DEV && (
        <span className="px-4 text-center font-mono text-[0.65rem] leading-relaxed text-ink-muted">
          Photo not found at
          <br />
          {profile.photo.src}
        </span>
      )}
    </div>
  )
}

/**
 * The portrait is a cut-out (transparent background), so it sits on a glass panel with a soft
 * warm amber glow behind the head, a hairline amber-to-orange border and a restrained shadow.
 * `priority` loads it eagerly; by default it is lazy. It is only used in the About section.
 */
export function Portrait({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  const [failed, setFailed] = useState(false)

  return (
    <figure className={cn('mx-auto w-full', className)}>
      <div className="rounded-[1.75rem] bg-linear-to-br from-amber-400/50 via-line to-amber-400/40 p-px shadow-[0_30px_80px_-35px_rgb(255_122_48/0.32)]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[calc(1.75rem-1px)] bg-[radial-gradient(ellipse_at_50%_28%,rgb(255_140_60/0.26),transparent_62%),linear-gradient(170deg,var(--color-night-700),var(--color-night-800))]">
          {failed ? (
            <Placeholder />
          ) : (
            <img
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={1086}
              height={1448}
              decoding="async"
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              onError={() => setFailed(true)}
              className="absolute inset-0 size-full object-cover object-bottom"
            />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/10 ring-inset"
          />
        </div>
      </div>
    </figure>
  )
}
