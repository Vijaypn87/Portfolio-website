import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { navItems } from '@/data/navigation'
import { profile } from '@/data/profile'
import { useClock } from '@/hooks/useClock'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const ids = navItems.map((item) => item.id)
/** Scroll distance (px) that counts as a deliberate move, so small jitters change nothing. */
const THRESHOLD = 8

/**
 * A glassy pill dock fixed at the bottom centre: section links, a live clock, the theme toggle and
 * back-to-top. The content behind it is blurred. It slides away while scrolling down and returns on
 * scrolling up, near the top, or when keyboard focus lands inside it.
 */
export function Dock() {
  const active = useScrollSpy(ids)
  const time = useClock(profile.location.timeZone)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y < 120) {
        setHidden(false)
        last = y
        return
      }
      const delta = y - last
      if (Math.abs(delta) < THRESHOLD) return
      setHidden(delta > 0)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Primary"
      onFocusCapture={() => setHidden(false)}
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:bottom-6',
        hidden && 'translate-y-[calc(100%+2rem)]',
      )}
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-card p-1.5 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.6)]">
        <ul className="flex items-center">
          {navItems.map(({ id, label }) => {
            const isActive = active === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'label-mono flex min-h-[40px] items-center gap-1.5 rounded-full px-3 py-2.5 transition-colors duration-200 max-[379px]:px-[7px] max-[379px]:tracking-[0.05em] sm:px-4',
                    isActive ? 'bg-accent/15 text-accent' : 'text-muted hover:text-fg',
                  )}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-line max-[379px]:mx-0.5" />
        <ThemeToggle />
        <span className="label-mono hidden px-2 text-[0.65rem] whitespace-nowrap text-muted tabular-nums sm:block">
          {profile.location.abbr} {time}
        </span>
        <a
          href="#top"
          aria-label="Back to top"
          className="hidden size-[40px] items-center justify-center rounded-full text-muted transition-colors duration-200 hover:text-fg sm:inline-flex"
        >
          <ArrowUp aria-hidden="true" size={16} />
        </a>
      </div>
    </nav>
  )
}
