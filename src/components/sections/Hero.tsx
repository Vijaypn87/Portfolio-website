import type { ReactElement } from 'react'
import { Mail } from 'lucide-react'
import * as m from 'motion/react-m'
import { profile } from '@/data/profile'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { GlowBackground } from '@/components/ui/GlowBackground'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { StaticSculpture } from '@/components/ui/StaticSculpture'
import { fadeUp, stagger } from '@/lib/motion'
import { HERO_3D_ANCHOR_ID } from '@/three/anchor'

const socialIcons: Record<string, ReactElement> = {
  GitHub: <GitHubIcon size={18} />,
  LinkedIn: <LinkedInIcon size={18} />,
}

const iconLink =
  'inline-flex size-10 items-center justify-center rounded-full border border-line text-ink-muted transition duration-200 hover:-translate-y-0.5 hover:border-amber-400/60 hover:text-ink'

/**
 * Two columns from `lg` up: text on the left, the 3D neural sculpture on the right. On smaller
 * screens they stack, text first. All content is real HTML; the sculpture is a decorative layer
 * that follows the `#hero-3d` cell, and a static SVG version fills that cell until (or unless)
 * WebGL runs.
 */
export function Hero() {
  const email = profile.email

  return (
    <section
      id="top"
      className="relative pt-28 pb-16 lg:flex lg:min-h-svh lg:items-center lg:py-0 lg:pt-16"
    >
      <GlowBackground />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
          <m.div className="max-w-xl" variants={stagger} initial="hidden" animate="visible">
            <m.p variants={fadeUp} className="mb-5 font-mono text-sm text-amber-400">
              {profile.role}
            </m.p>
            <m.h1
              variants={fadeUp}
              className="text-display leading-[1.02] font-semibold text-balance"
            >
              Hi, I&rsquo;m <span className="text-gradient">{profile.name}</span>.
            </m.h1>
            {profile.tagline && (
              <m.p
                variants={fadeUp}
                className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted"
              >
                {profile.tagline}
              </m.p>
            )}
            <m.div variants={fadeUp} className="mt-9 flex flex-wrap gap-4">
              <Button href="#projects" magnetic>
                View projects
              </Button>
              <Button href="#contact" variant="ghost" magnetic>
                Get in touch
              </Button>
            </m.div>

            <m.ul variants={fadeUp} aria-label="Social links" className="mt-8 flex gap-2">
              {profile.socials
                .filter(({ href }) => href)
                .map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (opens in a new tab)`}
                      className={iconLink}
                    >
                      {socialIcons[label]}
                    </a>
                  </li>
                ))}
              {email && (
                <li>
                  <a href={`mailto:${email}`} aria-label={`Email ${email}`} className={iconLink}>
                    <Mail aria-hidden="true" size={18} />
                  </a>
                </li>
              )}
            </m.ul>
          </m.div>

          <div
            id={HERO_3D_ANCHOR_ID}
            className="relative mx-auto aspect-[5/4] w-full max-w-xl lg:max-w-none"
          >
            <StaticSculpture />
          </div>
        </div>
      </Container>
    </section>
  )
}
