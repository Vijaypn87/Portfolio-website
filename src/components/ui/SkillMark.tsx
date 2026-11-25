import type { CSSProperties } from 'react'
import type { SkillIconSet } from '@/data/skillIcons'
import { cn } from '@/lib/utils'

/**
 * The 14px mark before a chip's text: the skill's official brand logo (in its brand colour,
 * softened for the theme), or for concepts and brands with no official icon a simple line icon.
 * `alias` is another name to try for the logo. The box is always 14px, so chips line up and nothing
 * shifts when the icons finish loading.
 */
export function SkillMark({
  name,
  alias,
  set,
}: {
  name: string
  alias?: string
  set: SkillIconSet | null
}) {
  const brand = set?.brands[name] ?? (alias ? set?.brands[alias] : undefined)
  const Line = set?.lines[name]
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-[14px] shrink-0 place-items-center transition-opacity duration-300',
        set ? 'opacity-100' : 'opacity-0',
      )}
    >
      {brand ? (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          data-tone={brand.tone}
          className="skill-logo size-[14px]"
          style={{ '--brand': `#${brand.hex}` } as CSSProperties}
        >
          <path d={brand.path} />
        </svg>
      ) : Line ? (
        <Line size={14} strokeWidth={1.75} className="text-accent" />
      ) : null}
    </span>
  )
}
