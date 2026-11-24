import { useEffect } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Optional Lenis smooth scrolling. It is an enhancement only: it never runs for reduced-motion
 * users, touch devices or small screens, so those keep fully native scrolling. Lenis is imported
 * dynamically so it stays out of the initial bundle, and any failure leaves native scroll intact.
 */
export function useSmoothScroll() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const desktop = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
    if (!desktop.matches) return

    let cancelled = false
    let destroy: (() => void) | undefined

    import('lenis')
      .then(({ default: Lenis }) => {
        if (cancelled) return
        const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -80 } })
        destroy = () => lenis.destroy()
      })
      .catch(() => {
        /* native scrolling remains */
      })

    return () => {
      cancelled = true
      destroy?.()
    }
  }, [reducedMotion])
}
