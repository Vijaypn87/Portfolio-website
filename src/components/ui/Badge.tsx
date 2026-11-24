import type { ReactNode } from 'react'

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-xs text-ink-muted transition duration-200 hover:-translate-y-px hover:border-amber-400/50 hover:bg-amber-400/[0.06] hover:text-ink">
      {children}
    </span>
  )
}
