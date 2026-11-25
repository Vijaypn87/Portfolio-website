import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/** Browser-chrome colour (the mobile address bar) for each theme. */
const chromeColor: Record<Theme, string> = { light: '#f8f4f0', dark: '#0a0706' }

export const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

/**
 * Switches the theme. With `save`, the choice is remembered in localStorage and used on later visits
 * (see the inline script in index.html). The system light/dark setting is never consulted. Where the
 * browser supports view transitions the whole page cross-fades smoothly; otherwise, and for reduced
 * motion, it switches at once.
 */
export function setTheme(next: Theme, { save }: { save: boolean }) {
  const apply = () => {
    document.documentElement.dataset.theme = next
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta) meta.content = chromeColor[next]
    const scheme = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
    if (scheme) scheme.content = next
  }
  if (save) {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* the choice just lasts for this visit */
    }
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if ('startViewTransition' in document && !reduced) document.startViewTransition(apply)
  else apply()
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

/** The current theme. Every toggle on the page stays in step, because they all read it from <html>. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, currentTheme, () => 'light' as Theme)
}
