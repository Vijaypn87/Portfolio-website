import { useState } from 'react'
import { Eye, HeartPulse, Waves, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project, ProjectCoverIcon } from '@/types'

const icons: Record<ProjectCoverIcon, LucideIcon> = {
  eye: Eye,
  'heart-pulse': HeartPulse,
  waves: Waves,
}

/**
 * A generated cover for a project with no screenshot, in the same 16:10 frame: the blueprint grid, a simple line icon in a corner-bracketed frame, and the project's name and key
 * metric in small mono text. It is meant to look deliberate, not like a missing image.
 */
export function ProjectCover({ project, large = false }: { project: Project; large?: boolean }) {
  const Icon = icons[project.coverIcon ?? 'eye']
  const bracket = 'absolute size-2.5 border-accent'

  return (
    <div
      role="img"
      aria-label={`Cover for ${project.name}`}
      className={cn(
        'project-cover relative aspect-[16/10] overflow-hidden border border-line',
        large ? 'rounded-xl' : 'rounded-lg',
      )}
    >
      <div aria-hidden="true" className="project-cover-grid absolute inset-0" />

      <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
        <span
          className={cn(
            'relative grid place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent',
            large ? 'size-24' : 'size-14',
          )}
        >
          <Icon strokeWidth={1.4} className={large ? 'size-11' : 'size-7'} />
          <span className={cn(bracket, '-top-px -left-px border-t-2 border-l-2')} />
          <span className={cn(bracket, '-top-px -right-px border-t-2 border-r-2')} />
          <span className={cn(bracket, '-bottom-px -left-px border-b-2 border-l-2')} />
          <span className={cn(bracket, '-right-px -bottom-px border-r-2 border-b-2')} />
        </span>
      </div>

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 bg-linear-to-t from-card via-card/80 to-transparent',
          large ? 'p-4 pt-10' : 'p-2.5 pt-6',
        )}
      >
        <p
          className={cn(
            'font-mono tracking-[0.14em] text-fg uppercase',
            large ? 'text-xs' : 'text-[9px]',
          )}
        >
          {project.name}
        </p>
        {project.keyMetric && (
          <p
            className={cn(
              'mt-0.5 line-clamp-2 font-mono leading-snug text-muted',
              large ? 'text-xs' : 'text-[9px]',
            )}
          >
            {project.keyMetric}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * The project's picture. On a card it is a 16:10 frame (cropped from the top, with a slight zoom on
 * hover); with `large` it is the whole screenshot, for the details dialog. With no image, or if the
 * file fails to load, the generated cover is shown instead.
 */
export function ProjectMedia({ project, large = false }: { project: Project; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  const { image, name } = project

  if (!image || failed) return <ProjectCover project={project} large={large} />

  if (large) {
    return (
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={`Screenshot of ${name}`}
        decoding="async"
        onError={() => setFailed(true)}
        className="h-auto w-full rounded-xl border border-line"
      />
    )
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-card">
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={`Screenshot of ${name}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="project-cover-img size-full object-cover object-top"
      />
    </div>
  )
}
