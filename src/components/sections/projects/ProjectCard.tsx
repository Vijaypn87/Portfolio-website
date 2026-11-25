import { Maximize2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { Project } from '@/types'
import { ProjectMedia } from './ProjectMedia'
import { ProjectLinks, StatusBadge, TechChips } from './ProjectParts'

/** How many technology chips a card shows before collapsing the rest into "+N". */
const MAX_CHIPS = 5

/**
 * A compact project card: the picture (a screenshot, or a generated cover), then the name with a
 * tiny status badge, a one-line summary, up to five technology chips, and a row of small buttons. The
 * description, key metric, highlights and category live in the details dialog, which opens from the
 * "Details" button. The card itself is not a link: only its buttons do anything.
 */
export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: (project: Project) => void
}) {
  const { name, status, oneLiner, tech } = project

  return (
    <Card className="h-full">
      <article className="flex h-full flex-col p-4">
        <ProjectMedia project={project} />

        <div className="mt-3 flex items-center justify-between gap-2">
          <h3 className="min-w-0 truncate font-display text-[16px] leading-snug font-bold tracking-tight text-fg">
            {name}
          </h3>
          <StatusBadge status={status} small />
        </div>

        <p className="mt-1.5 line-clamp-2 min-h-[2.75em] text-[13px] leading-snug text-muted">
          {oneLiner}
        </p>

        <div className="mt-3">
          <TechChips tech={tech} max={MAX_CHIPS} compact />
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
          <ProjectLinks project={project} compact />
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`More details about ${name}`}
            onClick={() => onOpen(project)}
            className="inline-flex h-[28px] items-center gap-1.5 rounded-full px-[10px] text-[12px] font-medium text-muted transition-colors duration-200 hover:text-fg [@media(pointer:coarse)]:min-h-[40px]"
          >
            <Maximize2 aria-hidden="true" size={12} />
            Details
          </button>
        </div>
      </article>
    </Card>
  )
}
