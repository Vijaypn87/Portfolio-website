import type { PointerEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * A rounded bento card with a hairline border. On hover a soft glow follows the pointer. The pointer position is written straight to CSS variables, so moving
 * the mouse never re-renders anything.
 */
export function Card({ className, children }: { className?: string; children: ReactNode }) {
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - box.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - box.top}px`)
  }

  return (
    <div
      onPointerMove={onPointerMove}
      className={cn(
        'hover-lift spotlight group/card relative overflow-hidden glass-box rounded-3xl border transition-colors duration-300 hover:border-accent/30',
        className,
      )}
    >
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  )
}
