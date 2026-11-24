import { useState } from 'react'
import { ArrowUpRight, Maximize2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { GitHubIcon } from '@/components/ui/SocialIcons'
import { TiltCard } from '@/components/ui/TiltCard'
import type { Project } from '@/types'
import { ProjectArt } from './ProjectArt'

const pill =
  'inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-ink transition duration-200 hover:border-amber-400/60 hover:bg-white/5 active:scale-[0.97]'

export function InProgressBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ember-500/40 bg-ember-500/10 px-2.5 py-1 font-mono text-xs text-ember-400">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-ember-500" />
      In progress
    </span>
  )
}

interface ProjectCardProps {
  project: Project
  onOpen: (project: Project) => void
}

/** Summary card. Links appear only when a real URL exists; "Details" opens the full dialog. */
export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { title, description, tags, image, status, context, githubUrl, liveUrl, visual } = project
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <TiltCard className="h-full">
      <article className="relative flex h-full flex-col p-4 sm:p-5">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line">
          {image && !imageFailed ? (
            <img
              src={image}
              alt={`Screenshot of ${title}`}
              width={1280}
              height={800}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <ProjectArt visual={visual} title={title} />
          )}
          {status === 'in-progress' && (
            <div className="absolute top-3 right-3">
              <InProgressBadge />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col px-1 pt-6 pb-1 sm:px-2">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h3>
          {context && <p className="mt-1 font-mono text-xs text-amber-400">{context}</p>}
          <p className="mt-3 leading-relaxed text-ink-muted">{description}</p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${title} technologies`}>
            {tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`More details about ${title}`}
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-4 py-2 text-sm text-ink transition duration-200 hover:bg-amber-400/25 active:scale-[0.97]"
            >
              <Maximize2 aria-hidden="true" size={15} />
              Details
            </button>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title}: GitHub repository (opens in a new tab)`}
                className={pill}
              >
                <GitHubIcon />
                GitHub
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title}: live demo (opens in a new tab)`}
                className={pill}
              >
                <ArrowUpRight aria-hidden="true" size={16} />
                Live demo
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  )
}
