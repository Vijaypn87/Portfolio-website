import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useIntroDone } from '@/lib/intro'

type Margin = NonNullable<Parameters<typeof useInView>[1]>['margin']

/**
 * For entrance animations: a ref to attach, and `ready`, which turns true (once) when the element
 * has scrolled into view AND the intro loader has finished. Elements already on screen behind the
 * loader therefore wait and animate as it closes, instead of animating unseen underneath it. On
 * visits without the loader the intro counts as finished from the start.
 */
export function useReveal<T extends Element = HTMLDivElement>(margin: Margin = '-80px') {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: true, margin })
  const done = useIntroDone()
  return [ref, inView && done] as const
}
