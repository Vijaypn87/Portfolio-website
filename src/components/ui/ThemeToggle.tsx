import { Moon, Sun } from 'lucide-react'
import { setTheme, useTheme } from '@/lib/theme'

/**
 * A sun/moon button that switches between the light and dark themes (a smooth cross-fade) and
 * remembers the choice. Visitors start in light mode whatever their system setting. There are
 * two on the page (the hero's top bar and the dock); both always show the same icon.
 */
export function ThemeToggle() {
  const theme = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark', { save: true })}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="inline-flex size-[40px] shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:text-fg"
    >
      {theme === 'dark' ? (
        <Sun aria-hidden="true" size={17} />
      ) : (
        <Moon aria-hidden="true" size={17} />
      )}
    </button>
  )
}
