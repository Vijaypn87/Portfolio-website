import { useRef, type PointerEvent, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** The furthest the child may pull toward the pointer, in pixels. */
const MAX_PULL = 8

const clamp = (value: number) => Math.min(Math.max(value, -MAX_PULL), MAX_PULL)

/**
 * Pulls its child a few pixels toward the mouse. The pointer is measured against the outer
 * wrapper, which never moves, so there is no feedback loop; only the inner element shifts.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (reduced || event.pointerType !== 'mouse' || !inner.current) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - (box.left + box.width / 2)
    const y = event.clientY - (box.top + box.height / 2)
    inner.current.style.translate = `${clamp(x * 0.25)}px ${clamp(y * 0.35)}px`
  }

  const onLeave = () => {
    if (inner.current) inner.current.style.translate = ''
  }

  return (
    <span className="-m-3 inline-flex p-3" onPointerMove={onMove} onPointerLeave={onLeave}>
      <span ref={inner} className="inline-flex transition-[translate] duration-200 ease-out">
        {children}
      </span>
    </span>
  )
}
