import { useEffect, useRef } from 'react'
import { useFinePointer } from '@/hooks/useFinePointer'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cancel, wake, type Task } from '@/lib/ticker'

const INTERACTIVE = 'a[href], button, [role="tab"], summary, label, [data-cursor="link"]'

/** How quickly the ring catches up with the pointer (per second); frame-rate independent. */
const FOLLOW = 12

type CursorState = 'default' | 'link' | 'card'

/**
 * A tiny dot with a thin, softly lagging ring, for mouse users only. It is purely cosmetic: it is
 * never rendered on touch devices or under reduced motion, the native cursor is only hidden once
 * the mouse has actually moved, and focus rings and labels are untouched.
 *
 * Over an interactive element the ring grows only a little (about 1.2x, orange over links and
 * buttons, 1.15x and amber over cards). The size never depends on the hovered element, and the
 * cursor sits in its own fixed, click-through layer, so it cannot affect layout or click targets.
 * See index.css for the sizes and colours.
 *
 * Position uses the individual `translate` property, not `transform`: individual properties apply
 * before `transform`, so the hover `scale` can never multiply the position. The ring's motion runs
 * on the shared ticker and sleeps once it has caught up with the pointer.
 */
export function CustomCursor() {
  const reducedMotion = useReducedMotion()
  const enabled = useFinePointer() && !reducedMotion

  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    let targetX = 0
    let targetY = 0
    let ringX = 0
    let ringY = 0
    let seen = false

    const setState = (state: CursorState) => {
      if (ring.current) ring.current.dataset.state = state
      if (dot.current) dot.current.dataset.state = state
    }

    const follow: Task = (dt) => {
      const k = 1 - Math.exp(-dt * FOLLOW)
      ringX += (targetX - ringX) * k
      ringY += (targetY - ringY) * k
      if (ring.current) ring.current.style.translate = `${ringX}px ${ringY}px`
      return Math.abs(targetX - ringX) + Math.abs(targetY - ringY) > 0.1
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      targetX = event.clientX
      targetY = event.clientY
      if (dot.current) dot.current.style.translate = `${targetX}px ${targetY}px`

      if (!seen) {
        seen = true
        ringX = targetX
        ringY = targetY
        root.classList.add('custom-cursor')
      }
      root.dataset.cursorVisible = 'true'

      const target = event.target instanceof Element ? event.target : null
      setState(
        target?.closest(INTERACTIVE)
          ? 'link'
          : target?.closest('[data-cursor="card"]')
            ? 'card'
            : 'default',
      )
      wake(follow)
    }

    const onLeave = () => {
      root.dataset.cursorVisible = 'false'
    }
    const onDown = () => ring.current && (ring.current.dataset.pressed = 'true')
    const onUp = () => ring.current && delete ring.current.dataset.pressed

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancel(follow)
      root.classList.remove('custom-cursor')
      delete root.dataset.cursorVisible
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={ring} aria-hidden="true" className="cursor-ring" data-state="default" />
      <div ref={dot} aria-hidden="true" className="cursor-dot" data-state="default" />
    </>
  )
}
