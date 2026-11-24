import { useRef, useState, type KeyboardEvent } from 'react'
import { BrainCircuit, Code, Monitor, Server, Wrench, type LucideIcon } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { skillGroups, skillsNote } from '@/data/skills'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/utils'
import type { SkillGroup, SkillIcon } from '@/types'

const icons: Record<SkillIcon, LucideIcon> = {
  code: Code,
  frontend: Monitor,
  backend: Server,
  ai: BrainCircuit,
  tools: Wrench,
}

const ALL = 'all'
const tabs = [
  { id: ALL, label: 'All' },
  ...skillGroups.map(({ id, title }) => ({ id, label: title })),
]

function SkillCard({ group, focused }: { group: SkillGroup; focused: boolean }) {
  const Icon = icons[group.icon]
  return (
    <section
      aria-labelledby={`skills-${group.id}`}
      className="group h-full rounded-3xl border border-line bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-amber-400/35 hover:bg-white/[0.05] sm:p-7"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 transition-colors duration-300 group-hover:bg-ember-500/10 group-hover:text-ember-400">
          <Icon aria-hidden="true" size={20} />
        </span>
        <h3 id={`skills-${group.id}`} className="font-display text-lg font-medium text-ink">
          {group.title}
        </h3>
      </div>
      <ul className="flex flex-wrap gap-2">
        {group.skills.map((skill, index) => (
          <m.li
            key={skill}
            initial={focused ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: focused ? index * 0.03 : 0 }}
          >
            <Badge>{skill}</Badge>
          </m.li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Skills grouped by category with filter tabs (WAI-ARIA tabs pattern: arrow keys, Home/End and a
 * roving tabindex). No levels, ratings or years: just the technologies themselves.
 */
export function Skills() {
  const [active, setActive] = useState(ALL)
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({})

  const visible = active === ALL ? skillGroups : skillGroups.filter(({ id }) => id === active)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex(({ id }) => id === active)
    const last = tabs.length - 1
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft'
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1
    if (next < 0) return
    event.preventDefault()
    setActive(tabs[next].id)
    buttons.current[tabs[next].id]?.focus()
  }

  return (
    <Section id="skills">
      <SectionHeading index="02" eyebrow="Skills" title="Skills" />
      <p className="-mt-6 mb-10 max-w-xl text-ink-muted">{skillsNote}</p>

      <div
        role="tablist"
        aria-label="Skill categories"
        onKeyDown={onKeyDown}
        className="mb-8 flex flex-wrap gap-2"
      >
        {tabs.map(({ id, label }) => {
          const selected = id === active
          return (
            <button
              key={id}
              ref={(el) => {
                buttons.current[id] = el
              }}
              type="button"
              role="tab"
              id={`skills-tab-${id}`}
              aria-selected={selected}
              aria-controls="skills-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(id)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm transition duration-200 active:scale-[0.97]',
                selected
                  ? 'border-amber-400/60 bg-amber-400/15 text-ink'
                  : 'border-line text-ink-muted hover:border-amber-400/30 hover:text-ink',
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <Reveal>
        <div id="skills-panel" role="tabpanel" aria-labelledby={`skills-tab-${active}`}>
          <AnimatePresence mode="wait" initial={false}>
            <m.ul
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className={cn(
                'grid gap-5',
                active === ALL ? 'sm:grid-cols-2 lg:grid-cols-3' : 'max-w-3xl',
              )}
            >
              {visible.map((group) => (
                <li
                  key={group.id}
                  className={cn(
                    active === ALL && group.icon === 'ai' && 'lg:col-span-2',
                    active === ALL && group.icon === 'tools' && 'sm:col-span-2 lg:col-span-1',
                  )}
                >
                  <SkillCard group={group} focused={active !== ALL} />
                </li>
              ))}
            </m.ul>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  )
}
