import { BrainCircuit, FileSearch, FileText, Layers, ScanEye, type LucideIcon } from 'lucide-react'
import { profile } from '@/data/profile'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Portrait } from '@/components/ui/Portrait'
import { Reveal } from '@/components/ui/Reveal'
import type { InterestIcon } from '@/types'

const icons: Record<InterestIcon, LucideIcon> = {
  ai: BrainCircuit,
  rag: FileSearch,
  vision: ScanEye,
  fullstack: Layers,
}

/** Clearly marked, so an empty biography is never mistaken for finished copy. */
function BioPlaceholder() {
  return (
    <p className="rounded-2xl border border-dashed border-line p-5 text-ink-muted">
      [Your biography goes here. Add one to three short paragraphs to <code>bio</code> in{' '}
      <code>src/data/profile.ts</code>.]
    </p>
  )
}

/** Editorial layout: portrait on the left, then introduction, interests and resume. */
export function About() {
  const { bio, interests, technologies, resumeUrl } = profile
  const [lead, ...rest] = bio

  return (
    <Section id="about">
      <SectionHeading index="01" eyebrow="About" title="About me" />

      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-5">
          <Portrait className="max-w-xs lg:mx-0 lg:max-w-sm" />
        </Reveal>

        <div className="space-y-10 lg:col-span-7">
          <Reveal>
            {lead ? (
              <div className="space-y-5">
                <p className="text-xl leading-relaxed text-ink sm:text-2xl">{lead}</p>
                {rest.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-relaxed text-ink-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <BioPlaceholder />
            )}
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="mb-4 font-mono text-sm text-amber-400">Interests</h3>
            <ul className="flex flex-wrap gap-2">
              {interests.map(({ title, icon }) => {
                const Icon = icons[icon]
                return (
                  <li
                    key={title}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] py-2 pr-4 pl-3 text-sm text-ink transition duration-200 hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-white/[0.06]"
                  >
                    <Icon aria-hidden="true" size={16} className="text-amber-300" />
                    {title}
                  </li>
                )
              })}
            </ul>

            {technologies.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Core technologies">
                {technologies.map((technology) => (
                  <li key={technology}>
                    <Badge>{technology}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          {resumeUrl && (
            <Reveal delay={0.16}>
              <Button href={resumeUrl} download magnetic>
                <FileText aria-hidden="true" size={18} />
                Download r&eacute;sum&eacute;
              </Button>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  )
}
