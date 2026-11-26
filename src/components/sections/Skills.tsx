import type { ReactNode } from 'react'
import type { Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { skillColumns, skillGroups } from '@/data/skills'
import { Section } from '@/components/layout/Section'
import { Card } from '@/components/ui/Card'
import { SectionTag } from '@/components/ui/SectionTag'
import { SkillMark } from '@/components/ui/SkillMark'
import { useColumnCount } from '@/hooks/useColumnCount'
import { useReveal } from '@/hooks/useReveal'
import { useSkillIconSet } from '@/hooks/useSkillIcons'
import { INTRO_STAGGER } from '@/lib/intro'
import { ease, fadeUp } from '@/lib/motion'
import { LocationCard } from './LocationCard'

const chips: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
}

const chip: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease } },
}

/** One group's chips, popping in one by one once the group is in view (and the intro has closed). */
function ChipList({ children }: { children: ReactNode }) {
  const [ref, ready] = useReveal<HTMLUListElement>('-60px')
  return (
    <m.ul
      ref={ref}
      variants={chips}
      initial="hidden"
      animate={ready ? 'visible' : 'hidden'}
      className="mt-[8px] flex flex-wrap content-start items-start gap-[6px]"
    >
      {children}
    </m.ul>
  )
}

/**
 * 02 / skills: a bento row with the location card beside a card of skills grouped by category. The
 * categories sit in 3 columns on wide screens, 2 on tablets and 1 on phones: each column is its own
 * top-aligned stack of equal width (see skillColumns in data/skills.ts for who goes where). The chips
 * pop in one by one when their group scrolls into view, and their brand logos load in a separate chunk.
 */
export function Skills() {
  const [row, rowReady] = useReveal('-80px')
  const icons = useSkillIconSet()
  const count = useColumnCount()
  const columns = skillColumns[count].map((ids) =>
    ids
      .map((id) => skillGroups.find((group) => group.id === id))
      .filter((group) => group !== undefined),
  )

  return (
    <Section id="skills">
      <m.div
        ref={row}
        variants={fadeUp}
        custom={INTRO_STAGGER}
        initial="hidden"
        animate={rowReady ? 'visible' : 'hidden'}
        className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] wide:grid-cols-[minmax(0,1fr)_minmax(0,2.3fr)]"
      >
        <LocationCard />

        <Card>
          <div className="p-4 sm:p-6">
            <h2>
              <SectionTag text="02 / skills" />
            </h2>
            <div
              className="mt-5 grid items-start gap-x-6"
              style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
            >
              {columns.map((groups, column) => (
                <div key={column} className="flex min-w-0 flex-col gap-[16px]">
                  {groups.map((group) => (
                    <section key={group.id} aria-labelledby={`skills-${group.id}`}>
                      <h3
                        id={`skills-${group.id}`}
                        className="text-[13px] leading-[1.4] font-semibold text-fg"
                      >
                        {group.title}
                      </h3>
                      <ChipList>
                        {group.skills.map((skill) => (
                          <m.li
                            key={skill}
                            variants={chip}
                            className="chip-hover flex h-[27px] items-center gap-[6px] rounded-lg border border-line bg-bg/40 px-[10px] font-mono text-[12px] leading-none text-fg transition-colors duration-200 hover:border-accent/60 hover:text-accent"
                          >
                            <SkillMark name={skill} set={icons} />
                            {skill}
                          </m.li>
                        ))}
                      </ChipList>
                    </section>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </m.div>
    </Section>
  )
}
