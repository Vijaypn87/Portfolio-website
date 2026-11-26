import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { markIntroSeen, setIntroStage } from '@/lib/intro'
import '@/styles/boot-fonts.css'

const FONT = (name: string) => `'Noto Sans ${name} Variable'`

/** "Vijay" in ten scripts, ending on English. Each is timed to the counter. */
const WORDS = [
  { text: 'ವಿಜಯ್', font: FONT('Kannada') },
  { text: 'विजय', font: FONT('Devanagari') },
  { text: 'விஜய்', font: FONT('Tamil') },
  { text: 'విజయ్', font: FONT('Telugu') },
  { text: 'വിജയ്', font: FONT('Malayalam') },
  { text: 'বিজয়', font: FONT('Bengali') },
  { text: 'વિજય', font: FONT('Gujarati') },
  { text: 'ਵਿਜੇ', font: FONT('Gurmukhi') },
  { text: 'ビジェイ', font: FONT('JP') },
  { text: 'Vijay', font: "'Space Grotesk Variable'" },
]
const LAST = WORDS.length - 1

const COUNT_MS = 2500
const HOLD_MS = 450
const FLY_DELAY_MS = 150
const FLY_MS = 950
const GREEN = '#22c55e'

type Phase = 'fonts' | 'count' | 'hold' | 'exit' | 'done'

/** How far (in px) the element and its ancestors are currently translated down by transforms that will settle to none. */
function pendingLift(element: Element) {
  let lift = 0
  for (let node: Element | null = element; node; node = node.parentElement) {
    const transform = getComputedStyle(node).transform
    if (transform && transform !== 'none') lift += new DOMMatrix(transform).m42
  }
  return lift
}

/**
 * The cinematic intro. Fonts load first, then a counter runs 000% to 100% (fast start, slow finish)
 * while "Vijay" cycles through ten scripts. At 100% there is a light flash, the letterbox bars open,
 * the overlay splits, and the English "Vijay" flies into the hero name while the page blurs in.
 * Skippable with the button or Escape/Enter/Space. Lazy-loaded by App; it only mounts on a
 * session's first load and never for reduced motion (see lib/intro.ts).
 */
export default function BootIntro() {
  const [phase, setPhase] = useState<Phase>('fonts')
  const [t, setT] = useState(0) // linear progress through the count, 0..1
  const [flying, setFlying] = useState(true)
  const word = useRef<HTMLSpanElement>(null)
  const skipButton = useRef<HTMLButtonElement>(null)

  // Start at the top with scrolling locked: the hero must sit where the word will fly to. The lock
  // is released as soon as the loader is finished (this component stays mounted, rendering nothing,
  // so it must not wait for unmount), and on unmount.
  const finished = phase === 'done'
  useEffect(() => {
    if (finished) return
    window.scrollTo(0, 0)
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    skipButton.current?.focus()
    return () => {
      root.style.overflow = previous
    }
  }, [finished])

  // Make sure every script's font is loaded before anything shows, so nothing flickers.
  useEffect(() => {
    let alive = true
    const loads = WORDS.map(({ font, text }) =>
      document.fonts.load(`700 64px ${font}`, text).catch(() => []),
    )
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 2000))
    Promise.race([Promise.all(loads), timeout]).then(() => {
      if (alive) setPhase((current) => (current === 'fonts' ? 'count' : current))
    })
    return () => {
      alive = false
    }
  }, [])

  // The counter.
  useEffect(() => {
    if (phase !== 'count') return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      // The frame's timestamp can be a hair earlier than `start`, so never let progress go below 0
      // (a negative value would pick a word that does not exist).
      const progress = Math.min(Math.max((now - start) / COUNT_MS, 0), 1)
      setT(progress)
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setPhase('hold')
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [phase])

  useEffect(() => {
    if (phase !== 'hold') return
    const id = window.setTimeout(() => setPhase('exit'), HOLD_MS)
    return () => window.clearTimeout(id)
  }, [phase])

  // Skip: jump to 100% (and the English word) and go straight to the exit.
  useEffect(() => {
    const skip = () => {
      setT(1)
      setPhase((current) => (current === 'exit' || current === 'done' ? current : 'exit'))
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        skip()
      }
    }
    const button = skipButton.current
    button?.addEventListener('click', skip)
    document.addEventListener('keydown', onKey)
    return () => {
      button?.removeEventListener('click', skip)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  // The exit: the word flies to the hero name, the page blurs in, then everything is removed.
  useEffect(() => {
    if (phase !== 'exit') return
    markIntroSeen()

    const el = word.current
    const target = document.querySelector<HTMLElement>('[data-hero-word="name"]')
    let flight: Animation | undefined
    if (el && target) {
      const from = el.getBoundingClientRect()
      const to = target.getBoundingClientRect()
      // The hero is still in its hidden pose (it sits a little lower and rises as it blurs in), so aim
      // for where the word will settle, not where it is now.
      const settleY = to.top - pendingLift(target)
      flight = el.animate(
        [
          { transform: 'translate(0px, 0px) scale(1)', color: '#ffffff' },
          {
            transform: `translate(${to.left - from.left}px, ${settleY - from.top}px) scale(${
              to.width / from.width
            })`,
            color: getComputedStyle(target).color,
          },
        ],
        {
          duration: FLY_MS,
          delay: FLY_DELAY_MS,
          easing: 'cubic-bezier(0.77, 0, 0.18, 1)',
          fill: 'forwards',
        },
      )
    }

    const timers = [
      window.setTimeout(() => setIntroStage('reveal'), 350),
      window.setTimeout(() => {
        setIntroStage('landed', { flew: Boolean(flight) })
        setFlying(false)
      }, FLY_DELAY_MS + FLY_MS),
      window.setTimeout(() => setPhase('done'), FLY_DELAY_MS + FLY_MS + 300),
    ]
    return () => {
      timers.forEach((id) => window.clearTimeout(id))
      flight?.cancel()
    }
  }, [phase])

  if (phase === 'done') return null

  const leaving = phase === 'exit'
  const index = Math.min(LAST, Math.floor(t * WORDS.length))
  const percent = Math.round((1 - Math.pow(1 - t, 2.6)) * 100)
  const current = WORDS[index]
  const slide = 'transition-transform duration-[900ms] ease-[cubic-bezier(0.77,0,0.18,1)]'

  return (
    <>
      <div role="status" aria-label="Loading" className="boot fixed inset-0 z-[100]">
        {/* The two halves the overlay splits into. */}
        <div
          style={{ transitionDelay: `${FLY_DELAY_MS}ms` }}
          className={`absolute inset-x-0 top-0 h-1/2 bg-[#050403] ${slide} ${leaving ? '-translate-y-full' : ''}`}
        />
        <div
          style={{ transitionDelay: `${FLY_DELAY_MS}ms` }}
          className={`absolute inset-x-0 bottom-0 h-1/2 bg-[#050403] ${slide} ${leaving ? 'translate-y-full' : ''}`}
        />

        {/* Grain, vignette, counter, progress line, skip: all fade as the exit begins. */}
        <div
          className={`absolute inset-0 overflow-hidden transition-opacity duration-300 ${leaving ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="grain" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(0_0_0/0.85)_100%)]" />

          <button
            ref={skipButton}
            type="button"
            className="label-mono absolute top-[calc(6vh+1rem)] right-5 rounded-full border border-white/20 px-4 py-2 text-white/80 transition-colors duration-200 hover:border-[#22c55e] hover:text-[#22c55e] sm:right-10"
          >
            skip
          </button>

          <p
            aria-hidden="true"
            className="absolute bottom-[calc(6vh+1.25rem)] left-5 font-mono text-[clamp(2.5rem,8vw,6rem)] leading-none font-medium text-white tabular-nums sm:left-10"
          >
            {String(percent).padStart(3, '0')}
            <span style={{ color: GREEN }}>%</span>
          </p>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-[6vh] h-px bg-white/10">
            <div className="h-full" style={{ width: `${percent}%`, background: GREEN }} />
          </div>
        </div>

        {/* Letterbox bars: they open outward at the exit. */}
        <div
          className={`absolute inset-x-0 top-0 h-[6vh] bg-black transition-transform duration-[650ms] ease-[cubic-bezier(0.77,0,0.18,1)] ${leaving ? '-translate-y-full' : ''}`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-[6vh] bg-black transition-transform duration-[650ms] ease-[cubic-bezier(0.77,0,0.18,1)] ${leaving ? 'translate-y-full' : ''}`}
        />

        {/* The light flash. */}
        {leaving && (
          <div
            className="absolute inset-0 animate-[flash_0.8s_ease-out_forwards] bg-[radial-gradient(circle_at_center,rgb(74_222_128/0.95),rgb(34_197_94/0.4)_45%,transparent_72%)]"
            style={{ opacity: 0 }}
          />
        )}
      </div>

      {/* The word. It sits above the overlay so it can fly over the opening halves. Every version
          is stacked in the same full-screen layer and centred on its own (never in a shared box
          whose width changes with the words in it), with one font size and one fixed line height,
          so no version shifts or jumps, including the final English "Vijay". */}
      {flying && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[101]">
          <AnimatePresence initial={false}>
            <m.div
              key={index}
              initial={{ opacity: 0, filter: 'blur(12px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(12px)' }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center justify-center text-center"
            >
              <span
                ref={index === LAST ? word : undefined}
                style={{
                  fontFamily: current.font,
                  letterSpacing: index === LAST ? '-0.05em' : undefined,
                  // Tight tracking leaves the last letter hanging 0.05em past the box; nudge it back so
                  // the English word is optically centred like the others.
                  left: index === LAST ? '-0.025em' : undefined,
                  transformOrigin: '0 0',
                }}
                className="relative inline-block text-[clamp(3.25rem,14vw,9rem)] leading-[1.15] font-bold whitespace-nowrap text-white"
              >
                {current.text}
              </span>
            </m.div>
          </AnimatePresence>
        </div>
      )}
    </>
  )
}
