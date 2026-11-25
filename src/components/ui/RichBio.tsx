import type { CSSProperties } from 'react'
import { useSkillIcons } from '@/hooks/useSkillIcons'
import { cn } from '@/lib/utils'

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

interface RichBioProps {
  text: string
  /** Names to set in the main text colour with their brand logo before them. */
  techs: readonly string[]
  /** Names to set in the main text colour with no logo (concepts such as RAG). */
  terms: readonly string[]
  /** A phrase in the text to set in the accent colour. */
  accent: string
}

/**
 * A sentence with small brand logos inline before the technology names (the same icons as the skill
 * chips, loaded lazily) and one phrase in the accent colour. A name with no official logo (RAG) is
 * just emphasised. The space for a logo is reserved from the start, so nothing shifts as they load.
 */
export function RichBio({ text, techs, terms, accent }: RichBioProps) {
  const icons = useSkillIcons()
  const parts = text.split(new RegExp(`(${[accent, ...techs, ...terms].map(escape).join('|')})`))

  return (
    <>
      {parts.map((part, i) => {
        if (part === accent) {
          return (
            <span key={i} className="text-accent">
              {part}
            </span>
          )
        }
        if (terms.includes(part)) {
          return (
            <span key={i} className="font-medium whitespace-nowrap text-fg">
              {part}
            </span>
          )
        }
        if (!techs.includes(part)) return part

        const icon = icons?.[part]
        return (
          <span key={i} className="font-medium whitespace-nowrap text-fg">
            <span
              aria-hidden="true"
              className={cn(
                'mr-[5px] inline-block size-[14px] align-[-2px] transition-opacity duration-300',
                icon ? 'opacity-100' : 'opacity-0',
              )}
            >
              {icon && (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  data-tone={icon.tone}
                  className="skill-logo size-[14px]"
                  style={{ '--brand': `#${icon.hex}` } as CSSProperties}
                >
                  <path d={icon.path} />
                </svg>
              )}
            </span>
            {part}
          </span>
        )
      })}
    </>
  )
}
