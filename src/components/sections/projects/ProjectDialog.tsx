import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { Project } from '@/types'
import { ProjectMedia } from './ProjectMedia'
import { CategoryPill, ProjectLinks, StatusBadge, TechChips } from './ProjectParts'

interface ProjectDialogProps {
  project: Project | null
  onClose: () => void
}

const heading = 'mt-8 mb-3 font-mono text-sm text-accent'

/**
 * Project details in a native modal <dialog>: the browser traps focus inside it, closes it on
 * Escape, marks the page behind it inert, and returns focus to the "Details" button afterwards.
 * Clicking the backdrop also closes it. `data-lenis-prevent` keeps smooth scrolling from
 * hijacking the wheel while it is open. Projects with planned work (`comingNext`, and the skills it
 * would add) show those lists too.
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
      className="project-dialog m-auto max-h-[88vh] w-[min(44rem,calc(100%-2rem))] overflow-y-auto rounded-3xl border border-line bg-card p-0 text-fg shadow-[0_40px_120px_-30px_rgb(0_0_0/0.8)] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {project && (
        <div className="relative p-6 sm:p-9">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-accent/60 hover:text-fg"
          >
            <X aria-hidden="true" size={18} />
          </button>

          <div className="flex flex-wrap items-center gap-2 pr-12">
            <CategoryPill category={project.category} />
            <StatusBadge status={project.status} />
          </div>
          <h2
            id="project-dialog-title"
            className="mt-5 pr-10 font-display text-3xl font-semibold tracking-tight"
          >
            {project.name}
          </h2>
          <div className="mt-5">
            <ProjectMedia project={project} large />
          </div>
          <p className="mt-6 text-base leading-relaxed text-muted">{project.description}</p>

          {project.keyMetric && (
            <p className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 font-mono text-sm leading-relaxed font-medium text-accent">
              {project.keyMetric}
            </p>
          )}

          <h3 className={heading}>Highlights</h3>
          <ul className="space-y-3">
            {project.highlights.map((point) => (
              <li key={point} className="flex gap-3 leading-relaxed text-muted">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                />
                {point}
              </li>
            ))}
          </ul>

          <h3 className={heading}>Technologies</h3>
          <TechChips tech={project.tech} />

          {project.comingNext && project.comingNext.length > 0 && (
            <>
              <h3 className={heading}>Coming next</h3>
              <ul className="space-y-3">
                {project.comingNext.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-1.5 shrink-0 rounded-full border border-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          {project.upcomingSkills && project.upcomingSkills.length > 0 && (
            <>
              <h3 className={heading}>Upcoming skills</h3>
              <ul className="flex flex-wrap gap-[6px]">
                {project.upcomingSkills.map((skill) => (
                  <li
                    key={skill}
                    className="flex h-[27px] items-center rounded-lg border border-dashed border-accent/50 px-[10px] font-mono text-[12px] leading-none text-fg"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-9 flex flex-wrap gap-3">
            <ProjectLinks project={project} />
          </div>
        </div>
      )}
    </dialog>
  )
}
