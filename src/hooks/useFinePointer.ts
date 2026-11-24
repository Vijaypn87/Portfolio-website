import { useSyncExternalStore } from 'react'

const query = '(hover: hover) and (pointer: fine)'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/** True when the primary input is a mouse-like pointer that can hover (not touch or pen-only). */
export function useFinePointer() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
