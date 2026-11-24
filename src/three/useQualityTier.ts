import { useCallback, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** `static` means: no WebGL at all, show the CSS fallback. */
export type QualityTier = 'high' | 'medium' | 'low' | 'static'

type NavigatorHints = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** Local, network-free capability check. Runtime frame-rate drops are handled by `downgrade`. */
function detectTier(): QualityTier {
  const nav = navigator as NavigatorHints
  if (!hasWebGL()) return 'static'
  if (nav.connection?.saveData) return 'static'
  if ((nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2) return 'static'

  const touchOrSmall =
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(max-width: 767px)').matches
  if (touchOrSmall || (nav.deviceMemory ?? 8) <= 4) return 'medium'
  return 'high'
}

/**
 * Picks how much the 3D scene may render. Reduced motion always yields `static`.
 * `downgrade` steps high → medium → low (1× resolution) → static as the frame rate keeps dropping.
 */
export function useQualityTier() {
  const reducedMotion = useReducedMotion()
  const [detected, setDetected] = useState<QualityTier>(detectTier)

  const downgrade = useCallback(
    () =>
      setDetected((tier) => (tier === 'high' ? 'medium' : tier === 'medium' ? 'low' : 'static')),
    [],
  )

  return { tier: reducedMotion ? ('static' as const) : detected, downgrade }
}
