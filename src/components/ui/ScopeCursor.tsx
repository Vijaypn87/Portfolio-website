import { useEffect, useRef } from 'react'
import { useFinePointer } from '@/hooks/useFinePointer'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Resting size of the bracket box, the length of each bracket's legs, and the padding when framing. */
const BOX = 28
const LEG = 10
const PAD = 6
/** Elements bigger than this are not framed (a link around a whole block, say). */
const CONTROL_MAX = { width: 560, height: 160 }
const CONTROL =
  '[data-cursor="frame"], a[href], button, summary, label, [role="button"], .chip-hover'
const TEXT_FIELDS =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea, [contenteditable="true"]'

/** True when the element has text of its own (not just child elements), i.e. the pointer is over words. */
const hasOwnText = (el: Element) =>
  Array.from(el.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim().length > 0,
  )

/**
 * A scope-style cursor (desktop mouse only): four small green L-shaped brackets around the mouse,
 * following with easing, and a green dot exactly at the mouse. Over buttons, links, chips and tiles
 * the brackets snap to frame that element (following it as the page scrolls or resizes) and the dot
 * hides; over anything else, including project cards, the brackets stay small around the mouse. Over
 * text the brackets hide and the dot turns into a thin vertical text line. The system cursor is hidden only while this is
 * active (after the first mouse movement); touch devices and reduced motion keep the normal cursor.
 * One requestAnimationFrame loop moves everything with transforms and stops once settled.
 */
export function ScopeCursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const corners = useRef<Array<HTMLSpanElement | null>>([])
  const root = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rootEl = root.current
    const dotEl = dot.current
    const [tl, tr, bl, br] = corners.current
    if (!fine || reduced || !rootEl || !dotEl || !tl || !tr || !bl || !br) return

    const html = document.documentElement

    const mouse = { x: -200, y: -200 }
    const box = { cx: -200, cy: -200, w: BOX, h: BOX }
    let hovered: Element | null = null
    let seen = false
    let frame = 0
    let last = 0

    const aim = () => {
      if (hovered?.isConnected) {
        const rect = hovered.getBoundingClientRect()
        return {
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          w: rect.width + PAD * 2,
          h: rect.height + PAD * 2,
        }
      }
      return { cx: mouse.x, cy: mouse.y, w: BOX, h: BOX }
    }

    const place = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const loop = (time: number) => {
      const dt = Math.min((time - last) / 1000, 0.05)
      last = time
      const to = aim()
      const framing = hovered !== null
      // Quick but smooth (about 200ms) when snapping to an element, softer when just following.
      const move = 1 - Math.exp(-dt * (framing ? 15 : 13))
      const grow = 1 - Math.exp(-dt * 15)
      box.cx += (to.cx - box.cx) * move
      box.cy += (to.cy - box.cy) * move
      box.w += (to.w - box.w) * grow
      box.h += (to.h - box.h) * grow

      const left = box.cx - box.w / 2
      const top = box.cy - box.h / 2
      place(tl, left, top)
      place(tr, left + box.w - LEG, top)
      place(bl, left, top + box.h - LEG)
      place(br, left + box.w - LEG, top + box.h - LEG)
      // The dot is exactly at the mouse, with no easing.
      place(dotEl, mouse.x, mouse.y)

      const settled =
        Math.abs(to.cx - box.cx) +
          Math.abs(to.cy - box.cy) +
          Math.abs(to.w - box.w) +
          Math.abs(to.h - box.h) <
        0.2
      // While framing an element, keep going so the frame follows it if the page scrolls.
      frame = (settled && !framing) || document.hidden ? 0 : requestAnimationFrame(loop)
    }
    const wake = () => {
      if (frame) return
      last = performance.now()
      frame = requestAnimationFrame(loop)
    }

    /** What is under the pointer: a small control (framed, dot hidden), text (dot becomes a line) or neither. */
    const classify = (target: Element | null) => {
      const control = target?.closest(CONTROL) ?? null
      const rect = control?.getBoundingClientRect()
      hovered =
        control &&
        rect &&
        (control.matches('[data-cursor="frame"]') ||
          (rect.width <= CONTROL_MAX.width && rect.height <= CONTROL_MAX.height))
          ? control
          : null
      // Anything inside a link or button (even one too big to frame) is never treated as text.
      const text = !control && !!target && (!!target.closest(TEXT_FIELDS) || hasOwnText(target))
      rootEl.dataset.mode = hovered ? 'frame' : text ? 'text' : 'dot'
      wake()
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      mouse.x = event.clientX
      mouse.y = event.clientY
      if (!seen) {
        // First movement: appear right at the mouse (no swoop in from a corner).
        seen = true
        box.cx = mouse.x
        box.cy = mouse.y
        rootEl.dataset.visible = 'true'
        // Only now, with the cursor drawn, hide the system one.
        html.classList.add('scope-hide')
      }
      classify(event.target instanceof Element ? event.target : null)
    }
    // The page moving under a still mouse changes what is hovered, and a resize moves the element.
    const onLayout = () => {
      if (seen) classify(document.elementFromPoint(mouse.x, mouse.y))
    }
    const onLeave = (event: MouseEvent) => {
      if (event.relatedTarget === null) rootEl.dataset.visible = 'false'
    }
    const onEnter = () => {
      if (seen) rootEl.dataset.visible = 'true'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onLayout, { passive: true })
    window.addEventListener('resize', onLayout, { passive: true })
    document.addEventListener('mouseout', onLeave)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('visibilitychange', wake)
    return () => {
      cancelAnimationFrame(frame)
      html.classList.remove('scope-hide')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onLayout)
      window.removeEventListener('resize', onLayout)
      document.removeEventListener('mouseout', onLeave)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('visibilitychange', wake)
    }
  }, [fine, reduced])

  if (!fine || reduced) return null
  return (
    <div
      ref={root}
      aria-hidden="true"
      data-visible="false"
      data-mode="dot"
      className="scope-cursor"
    >
      {['tl', 'tr', 'bl', 'br'].map((name, index) => (
        <span
          key={name}
          ref={(el) => {
            corners.current[index] = el
          }}
          className={`scope-corner ${name}`}
        />
      ))}
      <div ref={dot} className="scope-dot-wrap">
        <div className="scope-dot" />
      </div>
    </div>
  )
}
