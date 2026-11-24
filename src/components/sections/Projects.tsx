import { useState } from 'react'
import { projects } from '@/data/projects'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import type { Project } from '@/types'
import { ProjectCard } from './projects/ProjectCard'
import { ProjectDialog } from './projects/ProjectDialog'

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <Section id="projects">
      <SectionHeading index="03" eyebrow="Projects" title="Selected projects" />

      <ul className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {projects.map((project, index) => (
          <li key={project.id}>
            <Reveal delay={(index % 2) * 0.1} className="h-full">
              <ProjectCard project={project} onOpen={setSelected} />
            </Reveal>
          </li>
        ))}
      </ul>

      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </Section>
  )
}
