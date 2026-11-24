import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { GitHubIcon } from '@/components/ui/SocialIcons'
import type { Project } from '@/types'
import { InProgressBadge } from './ProjectCard'

interface ProjectDialogProps {
  project: Project | null
  onClose: () => void
}

/**
 * Project details in a native modal <dialog>: the browser traps focus inside it, closes it on
 * Escape, marks the page behind it inert, and returns focus to the "Details" button afterwards.
 * Clicking the backdrop also closes it. `data-lenis-prevent` keeps smooth scrolling from
 * hijacking the wheel while it is open.
 */
export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (project && !el.open) el.showModal()
    if (!project && el.open) el.close()
  }, [project])

  // Lock page scroll behind the dialog.
  useEffect(() => {
    if (!project) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [project])

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      aria-labelledby="project-dialog-title"
      data-lenis-prevent
      className="project-dialog m-auto max-h-[88vh] w-[min(42rem,calc(100%-2rem))] overflow-y-auto rounded-3xl border border-line bg-night-800 p-0 text-ink shadow-[0_40px_120px_-30px_rgb(0_0_0/0.8)] backdrop:bg-night-950/75 backdrop:backdrop-blur-sm"
    >
      {project && (
        <div className="p-6 sm:p-9">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full border border-line text-ink-muted transition hover:border-amber-400/60 hover:text-ink"
          >
            <X aria-hidden="true" size={18} />
          </button>

          {project.status === 'in-progress' && (
            <div className="mb-4">
              <InProgressBadge />
            </div>
          )}
          <h2
            id="project-dialog-title"
            className="pr-10 font-display text-3xl font-semibold tracking-tight"
          >
            {project.title}
          </h2>
          {project.context && (
            <p className="mt-1 font-mono text-xs text-amber-400">{project.context}</p>
          )}
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{project.description}</p>

          <h3 className="mt-8 mb-3 font-mono text-sm text-amber-400">What it does</h3>
          <ul className="space-y-3">
            {project.highlights.map((point) => (
              <li key={point} className="flex gap-3 leading-relaxed text-ink-muted">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ember-500"
                />
                {point}
              </li>
            ))}
          </ul>

          <h3 className="mt-8 mb-3 font-mono text-sm text-amber-400">Technologies</h3>
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>

          {(project.liveUrl || project.githubUrl) && (
            <div className="mt-9 flex flex-wrap gap-3">
              {project.liveUrl && (
                <Button
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title}: live demo (opens in a new tab)`}
                >
                  Live demo
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  aria-label={`${project.title}: GitHub repository (opens in a new tab)`}
                >
                  <GitHubIcon />
                  GitHub
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}
