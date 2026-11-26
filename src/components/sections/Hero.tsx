import { Fragment } from 'react'
import { Download } from 'lucide-react'
import type { Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { profile } from '@/data/profile'
import { Container } from '@/components/layout/Container'
import { GridFrame } from '@/components/layout/GridFrame'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Portrait } from '@/components/ui/Portrait'
import { RichBio } from '@/components/ui/RichBio'
import { RotatingRole } from '@/components/ui/RotatingRole'
import { SectionTag } from '@/components/ui/SectionTag'
import { GitHubIcon, LinkedInIcon, RedditIcon, XIcon } from '@/components/ui/SocialIcons'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useIntroFlew, useIntroStage } from '@/lib/intro'
import { ease, fadeUp, stagger } from '@/lib/motion'

interface LetterCustom {
  /** Position in the stagger, in letters. */
  order: number
  /** True for the word the intro loader already flew into place (the name): show it with no reveal. */
  instant: boolean
}

const letter: Variants = {
  hidden: { opacity: 0, y: '0.2em', filter: 'blur(12px)' },
  visible: ({ order, instant }: LetterCustom) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: instant ? { duration: 0 } : { duration: 0.7, ease, delay: order * 0.05 },
  }),
}

const socialIcons = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  X: XIcon,
  Reddit: RedditIcon,
} as const

/**
 * The greeting, "Hi, I’m Vijay", revealed letter by letter from blur to sharp. "Hi, I’m" is
 * off-white and the name is in the warm tone colour. The intro loader's "Vijay" flies onto the name.
 */
function HeroName({ revealed, nameFlew }: { revealed: boolean; nameFlew: boolean }) {
  const words = ['Hi,', 'I’m', profile.name.split(' ')[0]]
  const nameIndex = words.length - 1
  let count = 0

  return (
    <m.h1
      aria-label={words.join(' ')}
      initial="hidden"
      animate={revealed ? 'visible' : 'hidden'}
      className="text-display leading-[0.9] font-bold tracking-tighter"
    >
      {words.map((word, w) => {
        const isName = w === nameIndex
        // When the loader's "Vijay" flew in, that word needs no reveal and the others start at once.
        const instant = nameFlew && isName
        return (
          <Fragment key={w}>
            <span
              data-hero-word={isName ? 'name' : undefined}
              className={isName ? 'inline-block text-tone' : 'inline-block'}
            >
              {[...word].map((char, i) => {
                const order = instant ? 0 : count++
                return (
                  <m.span
                    key={i}
                    aria-hidden="true"
                    variants={letter}
                    custom={{ order, instant } satisfies LetterCustom}
                    className="inline-block"
                  >
                    {char}
                  </m.span>
                )
              })}
            </span>
            {w < words.length - 1 && ' '}
          </Fragment>
        )
      })}
    </m.h1>
  )
}

/**
 * 01 / about, as one large bento card: status pill, the name, role, a short bio and buttons on the
 * left; the portrait in a rotating text ring on the right.
 */
export function Hero() {
  const stage = useIntroStage()
  const flew = useIntroFlew()
  const waiting = stage === 'pending'
  const links = profile.socials.filter(({ href }) => href)

  return (
    <section
      id="top"
      className="relative pt-[32px] pb-[16px] sm:pt-[76px] sm:pb-[20px] lg:pb-[24px]"
    >
      {/* The frame's top line is 24px from the page top (60px from sm up); the card sits 8px (16px) below it. */}
      <GridFrame className="[--frame-top:24px] sm:[--frame-top:60px]" />
      <Container>
        <m.div variants={fadeUp} initial="hidden" animate={waiting ? 'hidden' : 'visible'}>
          <Card className="p-6 sm:p-10 lg:p-14">
            {/* Top row: the section label on the left; the status and theme toggle on the right. The
                name sits on its own line just below. */}
            <div className="flex items-center justify-between gap-3">
              <SectionTag text="01 / about" active={!waiting} />
              <div className="-mr-2 flex shrink-0 items-center gap-1">
                {profile.openToWork && (
                  <span className="label-mono inline-flex items-center gap-2 rounded-full border border-ok/40 bg-ok/10 px-3 py-1.5 text-ok">
                    <span aria-hidden="true" className="status-dot size-1.5 rounded-full bg-ok" />
                    Open to work
                  </span>
                )}
                <ThemeToggle />
              </div>
            </div>

            <div className="mt-5">
              <span className="block truncate font-display text-[15px] font-bold tracking-tight text-fg">
                {profile.name}
              </span>
            </div>

            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
              <m.div
                variants={stagger}
                initial="hidden"
                animate={waiting ? 'hidden' : 'visible'}
                className="order-last lg:order-first"
              >
                <HeroName revealed={stage === 'landed'} nameFlew={flew} />
                <m.p variants={fadeUp} className="mt-5 text-xl text-muted sm:text-2xl">
                  <RotatingRole roles={profile.roles} />
                </m.p>
                <m.p
                  variants={fadeUp}
                  className="mt-6 max-w-xl text-base leading-relaxed text-muted"
                >
                  <RichBio
                    text={profile.tagline}
                    techs={profile.taglineTech}
                    terms={profile.taglineTerms}
                    accent={profile.taglineAccent}
                  />
                </m.p>

                <m.ul variants={fadeUp} className="mt-9 flex flex-wrap gap-x-2 gap-y-4">
                  <li>
                    <Button
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      magnetic
                    >
                      <Download aria-hidden="true" size={16} />
                      Resume
                    </Button>
                  </li>
                  {links.map(({ label, href }) => {
                    const Icon = socialIcons[label as keyof typeof socialIcons]
                    return (
                      <li key={label}>
                        <Button
                          href={href}
                          variant="ghost"
                          magnetic
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="group size-[40px] px-0 py-0"
                        >
                          {Icon && <Icon size={18} />}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-full left-1/2 mb-[16px] -translate-x-1/2 rounded-md border border-line bg-card px-2 py-1 text-[12px] font-medium whitespace-nowrap text-fg opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                          >
                            {label}
                          </span>
                        </Button>
                      </li>
                    )
                  })}
                </m.ul>
              </m.div>

              <Portrait priority className="max-w-[14.5rem] lg:max-w-none" />
            </div>
          </Card>
        </m.div>
      </Container>
    </section>
  )
}
