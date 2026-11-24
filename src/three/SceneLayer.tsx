import { lazy, Suspense, useEffect, useState } from 'react'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useQualityTier } from './useQualityTier'

// The whole WebGL stack (three, R3F, drei) lives in this lazy chunk, outside the initial bundle.
const Experience = lazy(() => import('./Experience'))

/** Runs `callback` when the browser is idle (Safari lacks requestIdleCallback). Returns a cancel. */
function whenIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 1500 })
    return () => window.cancelIdleCallback(id)
  }
  const id = window.setTimeout(callback, 400)
  return () => window.clearTimeout(id)
}

/**
 * Fixed, decorative layer behind the page that hosts the 3D sculpture. The hero always contains a
 * static sculpture first; this layer loads WebGL once the browser is idle, only if the device is
 * capable, and flags `data-webgl="ready"` on <html> so CSS can hand over from the static version.
 */
export function SceneLayer() {
  const { tier, downgrade } = useQualityTier()
  const [idle, setIdle] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)

  useEffect(() => whenIdle(() => setIdle(true)), [])

  // Stop rendering entirely when the hero is off-screen or the tab is hidden.
  useEffect(() => {
    const hero = document.getElementById('top')
    const observer = hero
      ? new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting))
      : null
    if (hero) observer?.observe(hero)
    const onVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const useWebGL = tier !== 'static' && !failed

  // Hand over from the static sculpture only while WebGL is actually running.
  useEffect(() => {
    if (!useWebGL || !ready) return
    document.documentElement.dataset.webgl = 'ready'
    return () => {
      delete document.documentElement.dataset.webgl
    }
  }, [useWebGL, ready])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {useWebGL && idle && (
        <ErrorBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <Experience
              tier={tier}
              active={heroVisible && tabVisible}
              onReady={() => setReady(true)}
              onFail={() => setFailed(true)}
              onDecline={downgrade}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  )
}
