import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

/**
 * The blueprint frame for one section. Put it first inside a `relative` section: it fills the
 * section, sits behind the content, and draws itself in (lines scale up from nothing, then the
 * corner brackets fade in) once the section scrolls into view. The sections' frames
 * join up, so the vertical lines run the full height of the page. Reduced motion shows it at once.
 * The vertical lines and corner brackets sit exactly on the cards' left and right edges. Set
 * `--frame-top` (via className) to start the frame lower than the top of its section.
 */
export function GridFrame({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduced = useReducedMotion()

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-in={String(inView || reduced)}
      className={cn(
        'grid-frame pointer-events-none absolute inset-x-0 bottom-0 top-[var(--frame-top,0px)] -z-10',
        className,
      )}
    >
      <span className="gf-h top" />
      <span className="gf-v l" />
      <span className="gf-v r" />
      <span className="gf-corner tl" />
      <span className="gf-corner tr" />
      <span className="gf-corner bl" />
      <span className="gf-corner br" />
    </div>
  )
}
