import type { ReactNode } from 'react'
import * as m from 'motion/react-m'
import { fadeUp } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Start delay in seconds, to stagger siblings. */
  delay?: number
}

/** Fades children up once when scrolled into view. Reduced motion is handled by MotionConfig in App. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <m.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </m.div>
  )
}
