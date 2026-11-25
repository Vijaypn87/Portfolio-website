import { useEffect, useState } from 'react'
import type { SkillIcon } from '@/data/skillIcons'

/**
 * The brand icons for the skill chips, or null until they have loaded. They live in their own
 * lazily loaded chunk, so the Simple Icons data never weighs on the first load.
 */
export function useSkillIcons() {
  const [icons, setIcons] = useState<Record<string, SkillIcon> | null>(null)

  useEffect(() => {
    let alive = true
    import('@/data/skillIcons').then((module) => {
      if (alive) setIcons(module.skillIcons)
    })
    return () => {
      alive = false
    }
  }, [])

  return icons
}
