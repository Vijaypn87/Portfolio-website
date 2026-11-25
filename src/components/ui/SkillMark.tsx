import type { CSSProperties } from 'react'
import type { SkillIcon } from '@/data/skillIcons'
import { cn } from '@/lib/utils'

/**
 * The 12px mark before a chip's text: the skill's brand logo (in its brand colour, softened for the
 * theme), or a tiny green dot for concepts and brands with no official icon. The box is always
 * 12px, so chips line up and nothing shifts when the icons finish loading.
 */
export function SkillMark({ icon, ready }: { icon?: SkillIcon; ready: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-[12px] shrink-0 place-items-center transition-opacity duration-300',
        ready ? 'opacity-100' : 'opacity-0',
      )}
    >
      {icon ? (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          data-tone={icon.tone}
          className="skill-logo size-[12px]"
          style={{ '--brand': `#${icon.hex}` } as CSSProperties}
        >
          <path d={icon.path} />
        </svg>
      ) : (
        <span className="size-[5px] rounded-full bg-accent/80" />
      )}
    </span>
  )
}
