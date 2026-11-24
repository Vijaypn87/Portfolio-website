import { useRef, type PointerEvent, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

/**
 * Lightweight card interaction with no dependencies: a soft amber spotlight that follows the
 * mouse, plus a very slight 3D tilt. Values go straight to CSS variables (no re-renders). Touch
 * and pen input are ignored, the tilt is skipped under reduced motion, and the spotlight also
 * shows on keyboard focus so the card feels the same for every kind of user.
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el || event.pointerType !== 'mouse') return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    if (!reducedMotion) {
      el.style.setProperty('--rx', `${(0.5 - y) * 5}deg`)
      el.style.setProperty('--ry', `${(x - 0.5) * 5}deg`)
    }
  }

  const onPointerLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }

  return (
    <div
      ref={ref}
      data-cursor="card"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        'group relative rounded-3xl border border-line bg-white/[0.03] transition-[transform,border-color,background-color] duration-200 ease-out [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] hover:border-amber-400/35 hover:bg-white/[0.05] focus-within:border-amber-400/35',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [background:radial-gradient(380px_circle_at_var(--mx,50%)_var(--my,50%),rgb(255_177_92/0.13),transparent_65%)] group-focus-within:opacity-100 group-hover:opacity-100"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-300 [background:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),rgb(255_140_60/0.8),transparent_70%)] [mask-composite:exclude] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] group-focus-within:opacity-100 group-hover:opacity-100"
      />
      {children}
    </div>
  )
}
