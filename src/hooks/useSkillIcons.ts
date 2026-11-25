import { useEffect, useState } from 'react'
import type { SkillIcon, SkillIconSet } from '@/data/skillIcons'

/**
 * The brand icons for the skill chips, or null until they have loaded. They live in their own
 * lazily loaded chunk, so the Simple Icons data never weighs on the first load.
 */
export function useSkillIconSet() {
  const [set, setSet] = useState<SkillIconSet | null>(null)

  useEffect(() => {
    let alive = true
    import('@/data/skillIcons').then((module) => {
      if (alive) setSet({ brands: module.skillIcons, lines: module.lineIcons })
    })
    return () => {
      alive = false
    }
  }, [])

  return set
}

/** Just the brand logos (for the inline logos in the hero bio). */
export function useSkillIcons(): Record<string, SkillIcon> | null {
  return useSkillIconSet()?.brands ?? null
}
