import type { Variants } from 'motion/react'

export const ease = [0.22, 1, 0.36, 1] as const

/** Blur fade-in: from blur(12px), transparent and 24px low, to sharp. `custom` is a start delay in seconds. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(12px)' },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease, delay },
    // Once settled, drop the filter entirely: even blur(0px) makes the wrapper a "backdrop root",
    // which stops the frosted-glass boxes inside it from blurring the page behind them.
    transitionEnd: { filter: 'none' },
  }),
}

/** Staggers children 80ms apart. */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
