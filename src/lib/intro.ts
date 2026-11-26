import { useSyncExternalStore } from 'react'

/**
 * Where the page is in its entrance, shared between the intro loader and the hero.
 *  - pending: the loader is running; the page stays hidden.
 *  - reveal:  the loader is opening; the page blurs in.
 *  - landed:  the loader's "Vijay" has reached the hero (or there was no loader); the name reveals.
 */
export type IntroStage = 'pending' | 'reveal' | 'landed'

const SEEN_KEY = 'intro-seen'

function wantsIntro() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(SEEN_KEY) !== '1'
  } catch {
    return true
  }
}

/** Decided once, before the first render, so the page never flashes before the loader. */
export const introWillRun = wantsIntro()

let stage: IntroStage = introWillRun ? 'pending' : 'landed'
let flew = false
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Moves the entrance forward. `flew` records that the loader's word flew into the hero name. */
export function setIntroStage(next: IntroStage, options?: { flew?: boolean }) {
  stage = next
  if (options?.flew) flew = true
  listeners.forEach((listener) => listener())
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* it may simply run again on the next visit */
  }
}

export const useIntroStage = () =>
  useSyncExternalStore(
    subscribe,
    () => stage,
    () => 'landed' as IntroStage,
  )

/**
 * True once the intro loader has finished (immediately on visits without it). Entrance animations
 * wait for this, so they play as the loader closes rather than unseen behind it.
 */
export const useIntroDone = () => useIntroStage() === 'landed'

/** A short pause after the loader closes before the first entrance animations start, in seconds. */
export const INTRO_STAGGER = introWillRun ? 0.12 : 0

/** True when the loader's "Vijay" has flown into the hero, so that word needs no reveal of its own. */
export const useIntroFlew = () =>
  useSyncExternalStore(
    subscribe,
    () => flew,
    () => false,
  )
