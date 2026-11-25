import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** A smooth ease-in-out. */
const EASE_IN_OUT = [0.45, 0, 0.55, 1] as const

/** Each role is held for about 3.5s, then crossfades over TRANSITION_S, so a change lands every 4.4s. */
const HOLD_MS = 3500
const TRANSITION_S = 0.9
const INTERVAL_MS = HOLD_MS + TRANSITION_S * 1000

const roll = {
  // The next role fades in from blur(8px) while settling up into place; the current one fades out
  // while blurring to 8px and drifting up slightly. No rolling: the two simply cross over.
  initial: { y: '0.3em', opacity: 0, filter: 'blur(8px)' },
  animate: { y: '0em', opacity: 1, filter: 'blur(0px)' },
  exit: { y: '-0.3em', opacity: 0, filter: 'blur(8px)' },
}

/**
 * A line of text that rotates through `roles`: each is held for ~3.5s, then a slow ~900ms blur
 * crossfade swaps it for the next. It takes up exactly one line, and is as wide as the longest role,
 * so the layout never jumps. It
 * takes its font, size and colour from the element around it. Hovering it pauses the rotation.
 * With reduced motion only the first role is shown, statically. Screen readers get the full list
 * once, instead of hearing every change.
 */
export function RotatingRole({ roles }: { roles: readonly string[] }) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const paused = useRef(false)

  useEffect(() => {
    if (reduced || roles.length < 2) return
    const id = window.setInterval(() => {
      if (!paused.current) setIndex((current) => (current + 1) % roles.length)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reduced, roles.length])

  if (reduced) return <>{roles[0]}</>

  return (
    <span
      className="relative block w-fit"
      onPointerEnter={() => {
        paused.current = true
      }}
      onPointerLeave={() => {
        paused.current = false
      }}
    >
      <span className="sr-only">{roles.join(', ')}</span>
      {/* Invisible copies of every role, stacked: they size the mask to the longest one. */}
      <span aria-hidden="true" className="invisible grid">
        {roles.map((role) => (
          <span key={role} className="col-start-1 row-start-1 whitespace-nowrap">
            {role}
          </span>
        ))}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <m.span
          key={index}
          aria-hidden="true"
          className="absolute inset-0 whitespace-nowrap"
          initial={roll.initial}
          animate={roll.animate}
          exit={roll.exit}
          transition={{ duration: TRANSITION_S, ease: EASE_IN_OUT }}
        >
          {roles[index]}
          <span className="role-caret" />
        </m.span>
      </AnimatePresence>
    </span>
  )
}
