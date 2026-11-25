import { useState } from 'react'
import * as m from 'motion/react-m'
import { projects } from '@/data/projects'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { fadeUp } from '@/lib/motion'
import type { Project } from '@/types'
import { ProjectCard } from './projects/ProjectCard'
import { ProjectDialog } from './projects/ProjectDialog'

/** A card that fades up (blur to sharp) the first time it scrolls into view. */
function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <m.li
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="min-w-0"
    >
      {children}
    </m.li>
  )
}

/**
 * 03 / projects: every project as an equal compact card in an even grid
 * (3 columns on desktop, 2 on tablet, 1 on phones, 16px apart). Clicking a card opens its
 * details in a dialog.
 */
export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)
  return (
    <Section id="projects">
      <SectionHeading index="03" label="projects" className="mb-[16px] max-w-3xl" />

      <ul className="grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Reveal key={project.id}>
            <ProjectCard project={project} onOpen={setSelected} />
          </Reveal>
        ))}
      </ul>

      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}
