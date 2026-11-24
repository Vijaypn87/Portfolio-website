import type { Variants } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

/** `custom` is an optional start delay in seconds, used to stagger items in a grid. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease, delay },
  }),
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
