import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navItems } from '@/data/navigation'
import { profile } from '@/data/profile'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'
import { Container } from './Container'
import { ScrollProgress } from './ScrollProgress'

const ids = navItems.map((item) => item.id)

export function Navbar() {
  const active = useScrollSpy(ids)
  const [open, setOpen] = useState(false)
  const list = useRef<HTMLUListElement>(null)
  const indicator = useRef<HTMLSpanElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  // Slide the indicator under the active link. Written straight to the element (no state), and
  // re-measured on resize since link widths change with the viewport.
  useEffect(() => {
    const place = () => {
      const bar = indicator.current
      const current = list.current?.querySelector<HTMLElement>('a[aria-current="true"]')
      if (!bar) return
      if (!current) {
        bar.style.opacity = '0'
        return
      }
      bar.style.opacity = '1'
      bar.style.width = `${current.offsetWidth}px`
      bar.style.transform = `translateX(${current.offsetLeft}px)`
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active])

  // Escape closes the mobile menu and returns focus to its toggle, as users expect.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-night-900/70 backdrop-blur-lg">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight">
          {profile.name}
          <span className="text-ember-500">.</span>
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul ref={list} className="relative flex items-center gap-8 text-sm">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'true' : undefined}
                  className={cn(
                    "relative block py-2 transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ink-muted/60 after:transition-transform after:duration-300 after:content-[''] hover:text-ink hover:after:scale-x-100 focus-visible:text-ink focus-visible:after:scale-x-100",
                    active === id ? 'text-amber-300' : 'text-ink-muted',
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
            <span
              ref={indicator}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-linear-to-r from-amber-400 via-amber-400 to-ember-500 opacity-0 transition-[transform,width,opacity] duration-300 ease-out"
            />
          </ul>
        </nav>

        <button
          ref={toggle}
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Primary mobile" className="border-t border-line md:hidden">
          <ul className="flex flex-col px-5 py-3">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block py-3 text-base transition-colors hover:text-ink',
                    active === id ? 'text-amber-300' : 'text-ink-muted',
                  )}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ScrollProgress />
    </header>
  )
}
