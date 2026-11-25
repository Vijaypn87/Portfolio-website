import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SkillMark } from '@/components/ui/SkillMark'
import { GitHubIcon } from '@/components/ui/SocialIcons'
import { useSkillIconSet } from '@/hooks/useSkillIcons'
import { cn } from '@/lib/utils'
import type { Project, ProjectStatus } from '@/types'

/** Small pieces shared by the project cards and the details dialog. */

const statusLabel: Record<ProjectStatus, string> = {
  live: 'Live',
  completed: 'Completed',
  building: 'Building',
}

/**
 * The status pill, a soft tint with a dot of the same colour. Live is red (its dot gently pulses; it
 * is still under reduced motion), Completed is green and Building is yellow. The colours are in
 * index.css (.badge-*). `small` is for cards.
 */
export function StatusBadge({ status, small = false }: { status: ProjectStatus; small?: boolean }) {
  return (
    <span
      className={cn(
        'badge label-mono inline-flex shrink-0 items-center rounded-full border',
        `badge-${status}`,
        small ? 'gap-1 px-1.5 py-px text-[0.6rem]' : 'gap-1.5 px-2.5 py-1',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'badge-dot rounded-full',
          small ? 'size-1' : 'size-1.5',
          status === 'live' && 'status-dot',
        )}
      />
      {statusLabel[status]}
    </span>
  )
}

export function CategoryPill({ category }: { category: string }) {
  return (
    <span className="label-mono inline-block rounded-full border border-line px-2.5 py-1 text-muted">
      {category}
    </span>
  )
}

/** A few project technologies are the same brand as a skill with a slightly different name. */
const ICON_ALIAS: Record<string, string> = {
  'React 19': 'React',
  'HTML/CSS': 'HTML',
  'scikit-learn': 'Scikit-learn',
  pandas: 'Pandas',
  'Cloudflare Workers': 'Cloudflare',
  'GitHub Pages': 'GitHub',
  'GitHub Actions': 'GitHub',
}

interface TechChipsProps {
  tech: readonly string[]
  /** Show at most this many, then a "+N" chip. With `compact`, the chips are also smaller. */
  max?: number
  compact?: boolean
}

/** The technology chips, with the same logos as the skills chips (a line icon where there is no brand logo). */
export function TechChips({ tech, max, compact = false }: TechChipsProps) {
  const icons = useSkillIconSet()
  const shown = max === undefined ? tech : tech.slice(0, max)
  const hidden = max === undefined ? [] : tech.slice(max)
  const chip = cn(
    'flex items-center rounded-lg border border-line bg-bg/40 font-mono leading-none text-fg',
    compact
      ? 'h-[22px] gap-[5px] px-[8px] text-[11px]'
      : 'h-[27px] gap-[6px] px-[10px] text-[12px]',
  )

  return (
    <ul aria-label="Technologies" className="flex flex-wrap gap-[6px]">
      {shown.map((name) => (
        <li key={name} className={chip}>
          <SkillMark name={name} alias={ICON_ALIAS[name]} set={icons} />
          {name}
        </li>
      ))}
      {hidden.length > 0 && (
        <li
          className={cn(chip, 'text-muted')}
          title={hidden.join(', ')}
          aria-label={`and ${hidden.length} more: ${hidden.join(', ')}`}
        >
          +{hidden.length}
        </li>
      )}
    </ul>
  )
}

const small =
  'inline-flex h-[28px] items-center justify-center gap-1.5 rounded-full text-[12px] font-medium transition duration-200 active:scale-[0.97] [@media(pointer:coarse)]:min-h-[40px]'

/**
 * GitHub always; Visit only when the project has a live link. Both open in a new tab. `compact`
 * is for cards: a GitHub icon button and a small Live button (about 28px tall; 40px on touch screens).
 */
export function ProjectLinks({
  project,
  compact = false,
}: {
  project: Project
  compact?: boolean
}) {
  if (compact) {
    return (
      <>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} source code on GitHub`}
          className={cn(
            small,
            'border border-line bg-transparent px-[10px] text-fg hover:border-accent/60 hover:text-accent',
          )}
        >
          <GitHubIcon size={12} />
          Source
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name}: visit the live site (opens in a new tab)`}
            className={cn(small, 'bg-accent px-[10px] text-on-accent hover:brightness-110')}
          >
            Visit
            <ArrowUpRight aria-hidden="true" size={12} />
          </a>
        )}
      </>
    )
  }

  return (
    <>
      <Button
        href={project.github}
        variant="ghost"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.name} source code on GitHub`}
      >
        <GitHubIcon size={16} />
        Source
      </Button>
      {project.live && (
        <Button
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name}: visit the live site (opens in a new tab)`}
        >
          Visit
          <ArrowUpRight aria-hidden="true" size={15} />
        </Button>
      )}
    </>
  )
}
