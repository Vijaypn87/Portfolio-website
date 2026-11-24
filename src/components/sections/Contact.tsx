import type { ReactNode } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'
import { profile } from '@/data/profile'
import { Section } from '@/components/layout/Section'
import { SectionHeading } from '@/components/layout/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { contactEndpoint } from '@/lib/contact'
import { isSecureUrl, isValidEmail } from '@/lib/validation'
import { ContactForm } from './contact/ContactForm'

interface ContactLink {
  label: string
  href: string
  text: string
  icon: ReactNode
  external: boolean
}

const socialIcons: Record<string, ReactNode> = {
  GitHub: <GitHubIcon size={20} />,
  LinkedIn: <LinkedInIcon size={20} />,
}

/** "https://www.github.com/name/" becomes "github.com/name". */
function shortUrl(href: string) {
  const url = new URL(href)
  return `${url.host.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`
}

/**
 * Contact details come only from the profile data, and only appear when they are valid: an email
 * must look like one and social links must be https. The form works with or without a form
 * service; see lib/contact.ts for how it decides what to do.
 */
export function Contact() {
  const email = isValidEmail(profile.email) ? profile.email.trim() : undefined

  const links: ContactLink[] = [
    ...(email
      ? [
          {
            label: 'Email',
            href: `mailto:${email}`,
            text: email,
            icon: <Mail aria-hidden="true" size={20} />,
            external: false,
          },
        ]
      : []),
    ...profile.socials
      .filter(({ href }) => isSecureUrl(href))
      .map(({ label, href }) => ({
        label,
        href,
        text: shortUrl(href),
        icon: socialIcons[label] ?? <ArrowUpRight aria-hidden="true" size={20} />,
        external: true,
      })),
  ]

  // With no service and no email there is nowhere for a message to go, so no form is shown.
  const canSend = Boolean(contactEndpoint || email)

  return (
    <Section id="contact">
      <SectionHeading index="04" eyebrow="Contact" title={'Let’s build something meaningful.'} />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="max-w-md text-lg leading-relaxed text-ink-muted">
            Whether it&rsquo;s a role, a project or a question about my work, I&rsquo;d love to hear
            from you. Send a message here, or reach me directly.
          </p>

          {links.length > 0 && (
            <ul className="mt-8 space-y-3" aria-label="Ways to reach me">
              {links.map(({ label, href, text, icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={
                      external ? `${label}: ${text} (opens in a new tab)` : `${label}: ${text}`
                    }
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-white/[0.03] p-4 transition duration-300 hover:border-amber-400/40 hover:bg-white/[0.06]"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 transition-colors duration-300 group-hover:bg-ember-500/15 group-hover:text-ember-400">
                      {icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-xs text-amber-400">{label}</span>
                      <span className="block truncate text-ink">{text}</span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={18}
                      className="shrink-0 text-ink-muted transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember-400"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          <div className="rounded-3xl border border-line bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
            {canSend ? (
              <ContactForm email={email} />
            ) : (
              <p className="text-ink-muted">
                The contact form isn&rsquo;t available right now. Please use one of the links.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
