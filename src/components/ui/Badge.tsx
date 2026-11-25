import type { ReactNode } from 'react'

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors duration-200 hover:border-fg/40 hover:text-fg">
      {children}
    </span>
  )
}
