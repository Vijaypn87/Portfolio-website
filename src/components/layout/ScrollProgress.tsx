import { useEffect, useRef } from 'react'

/**
 * A hairline reading-progress bar along the bottom edge of the header. It is purely a visual aid
 * (hidden from assistive tech) and updates the element directly, so scrolling never re-renders.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
      if (bar.current) bar.current.style.scale = `${progress} 1`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5">
      <div
        ref={bar}
        className="h-full origin-left bg-linear-to-r from-amber-400 via-amber-400 to-ember-500"
        style={{ scale: '0 1' }}
      />
    </div>
  )
}
