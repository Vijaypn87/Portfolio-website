import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { useIntroDone } from '@/lib/intro'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const GLYPHS = '01/\\<>[]{}-_=+*#%&'
const DURATION_MS = 700

const scramble = (text: string, revealed: number) =>
  [...text]
    .map((char, i) =>
      char === ' ' || i < revealed ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    )
    .join('')

interface ScrambleTextProps {
  text: string
  className?: string
  /** Hold off until this is true (e.g. until the intro loader has gone). */
  active?: boolean
}

/** A label that decodes from random glyphs into its text when it scrolls into view. */
export function ScrambleText({ text, className, active = true }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = useReducedMotion()
  const done = useIntroDone()
  const [shown, setShown] = useState(() => text.replace(/[^ ]/g, '·'))

  useEffect(() => {
    if (!inView || !active || !done || reduced) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION_MS, 1)
      setShown(t < 1 ? scramble(text, Math.floor(t * text.length)) : text)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, active, done, reduced, text])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{reduced ? text : shown}</span>
    </span>
  )
}
