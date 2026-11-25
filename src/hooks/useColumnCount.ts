import { useSyncExternalStore } from 'react'

/** Same widths as the `sm` (640px) and `wide` (1344px) breakpoints in index.css. */
const QUERIES = ['(min-width: 640px)', '(min-width: 1344px)'] as const

function subscribe(onChange: () => void) {
  const lists = QUERIES.map((query) => window.matchMedia(query))
  lists.forEach((list) => list.addEventListener('change', onChange))
  return () => lists.forEach((list) => list.removeEventListener('change', onChange))
}

/** How many columns the skills card shows: 3 on wide screens, 2 on tablets, 1 on phones. */
export function useColumnCount(): 1 | 2 | 3 {
  return useSyncExternalStore(
    subscribe,
    () =>
      window.matchMedia(QUERIES[1]).matches ? 3 : window.matchMedia(QUERIES[0]).matches ? 2 : 1,
    () => 1,
  )
}
