import { useEffect, useRef } from 'react'
import { useFinePointer } from '@/hooks/useFinePointer'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { codeColumns } from './codeSnippets'

/** The spotlight's diameter, in CSS pixels. */
const SPOT = 400

/** One line of code. */
function Line({ text }: { text: string }) {
  return (
    <span className="block">
      {text}
      {'\u00a0'}
    </span>
  )
}

/** The columns of code. Drawn twice: faint, and again (brighter) where the mouse is. */
function CodeLayer({ className }: { className: string }) {
  return (
    <div className={`code-bg hidden sm:block ${className}`}>
      {codeColumns.map((lines, column) => (
        <div key={column} className={`code-col c${column}`}>
          {/* The lines twice over, so the loop (up by half) joins up without a jump. */}
          <div className="code-track">
            {[0, 1].map((copy) => (
              <div key={copy}>
                {[0, 1, 2].flatMap((rep) =>
                  lines.map((text, i) => <Line key={`${rep}-${i}`} text={text} />),
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * The page background, fixed behind everything: a few columns of faint code slowly scrolling
 * upward (hidden on phones), and on desktop a green spotlight that follows the mouse with
 * easing; the code lights up near the mouse. Decorative only. The code and spotlight move with
 * transforms; the spotlight loop stops itself once it has caught up. With reduced motion the
 * background is static: no drift and no spotlight.
 */
export function AmbientBackground() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const spot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rootEl = root.current
    const spotEl = spot.current
    if (!fine || reduced || !rootEl || !spotEl) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 3 }
    const pos = { ...target }
    let frame = 0
    let last = 0

    const loop = (time: number) => {
      const dt = Math.min((time - last) / 1000, 0.05)
      last = time
      const k = 1 - Math.exp(-dt * 5)
      pos.x += (target.x - pos.x) * k
      pos.y += (target.y - pos.y) * k
      spotEl.style.transform = `translate3d(${pos.x - SPOT / 2}px, ${pos.y - SPOT / 2}px, 0)`
      rootEl.style.setProperty('--mouse-x', `${pos.x}px`)
      rootEl.style.setProperty('--mouse-y', `${pos.y}px`)
      const settled = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) < 0.3
      frame = settled || document.hidden ? 0 : requestAnimationFrame(loop)
    }
    const wake = () => {
      if (frame) return
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      rootEl.dataset.active = 'true'
      target.x = event.clientX
      target.y = event.clientY
      wake()
    }
    const onLeave = (event: MouseEvent) => {
      if (event.relatedTarget === null) rootEl.dataset.active = 'false'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseout', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseout', onLeave)
      rootEl.dataset.active = 'false'
    }
  }, [fine, reduced])

  return (
    <div
      ref={root}
      aria-hidden="true"
      data-active="false"
      className="aurora pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <CodeLayer className="code-dim" />
      {fine && !reduced && (
        <>
          <CodeLayer className="code-lit" />
          <div ref={spot} className="aurora-spot" />
        </>
      )}
    </div>
  )
}
