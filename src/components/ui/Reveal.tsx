import type { ReactNode } from 'react'
import * as m from 'motion/react-m'
import { useReveal } from '@/hooks/useReveal'
import { fadeUp } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Start delay in seconds, to stagger siblings. */
  delay?: number
}

/**
 * Fades children up once when scrolled into view (and not before the intro loader has closed).
 * Reduced motion is handled by MotionConfig in App.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const [ref, ready] = useReveal('-80px')
  return (
    <m.div
      ref={ref}
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={ready ? 'visible' : 'hidden'}
    >
      {children}
    </m.div>
  )
}
