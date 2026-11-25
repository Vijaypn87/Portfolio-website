import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { CircleAlert, CircleCheck, LoaderCircle, Mail, Send } from 'lucide-react'
import { ButtonFace } from '@/components/ui/Button'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { buildMailto, contactEndpoint, sendContact } from '@/lib/contact'
import { cn } from '@/lib/utils'
import {
  LIMITS,
  validateContact,
  validateField,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '@/lib/validation'

type Status = 'idle' | 'invalid' | 'sending' | 'success' | 'error' | 'mailto'

const EMPTY: ContactValues = { name: '', email: '', subject: '', message: '' }
const ORDER: ContactField[] = ['name', 'email', 'subject', 'message']

const control =
  'w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-base text-ink transition-colors duration-200 placeholder:text-ink-muted/60 hover:border-accent/40 focus:border-accent/70 focus:bg-white/[0.05] focus-visible:outline-offset-2'

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-danger">
          <CircleAlert aria-hidden="true" size={15} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * The contact form. A message is only ever reported as sent when the configured form service
 * answers with success. With no service configured it opens the visitor's email app instead,
 * and says so plainly: nothing is "sent" until they press Send in their own mail client.
 */
export function ContactForm({ email }: { email?: string }) {
  const [values, setValues] = useState<ContactValues>(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const honeypot = useRef<HTMLInputElement>(null)

  const sending = status === 'sending'
  const hasErrors = Object.values(errors).some(Boolean)

  const update =
    (field: ContactField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [field]: value }))
      if (touched[field])
        setErrors((current) => ({ ...current, [field]: validateField(field, value) }))
      // Editing after a result starts a fresh attempt.
      setStatus((current) =>
        current === 'success' || current === 'error' || current === 'mailto' ? 'idle' : current,
      )
    }

  const blur = (field: ContactField) => () => {
    setTouched((current) => ({ ...current, [field]: true }))
    setErrors((current) => ({ ...current, [field]: validateField(field, values[field]) }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return

    const found = validateContact(values)
    setErrors(found)
    setTouched({ name: true, email: true, subject: true, message: true })
    const firstInvalid = ORDER.find((field) => found[field])
    if (firstInvalid) {
      setStatus('invalid')
      const control = event.currentTarget.elements.namedItem(firstInvalid)
      if (control instanceof HTMLElement) control.focus()
      return
    }

    // Bots fill the hidden field; real visitors never see it. Quietly do nothing.
    if (honeypot.current?.value) return

    if (!contactEndpoint) {
      if (!email) return
      window.location.href = buildMailto(email, values)
      setStatus('mailto')
      return
    }

    setStatus('sending')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15000)
    try {
      await sendContact(values, controller.signal)
      setValues(EMPTY)
      setErrors({})
      setTouched({})
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      window.clearTimeout(timeout)
    }
  }

  const props = (field: ContactField, id: string) => ({
    id,
    name: field,
    value: values[field],
    onChange: update(field),
    onBlur: blur(field),
    required: true,
    maxLength: LIMITS[field],
    'aria-invalid': errors[field] ? (true as const) : undefined,
    'aria-describedby': errors[field] ? `${id}-error` : undefined,
    className: cn(control, errors[field] ? 'border-danger/70' : 'border-line'),
  })

  const messageProps = props('message', 'contact-message')

  return (
    <form onSubmit={submit} noValidate aria-describedby="contact-status" className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="contact-name" label="Name" error={errors.name}>
          <input
            type="text"
            autoComplete="name"
            placeholder="Your name"
            {...props('name', 'contact-name')}
          />
        </Field>
        <Field id="contact-email" label="Email" error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            {...props('email', 'contact-email')}
          />
        </Field>
      </div>

      <Field id="contact-subject" label="Subject" error={errors.subject}>
        <input
          type="text"
          placeholder="What is this about?"
          {...props('subject', 'contact-subject')}
        />
      </Field>

      <Field id="contact-message" label="Message" error={errors.message}>
        <textarea
          rows={6}
          placeholder="Tell me a little about your project or role…"
          {...messageProps}
          className={cn(messageProps.className, 'resize-y')}
        />
        <p className="mt-2 text-right font-mono text-xs text-ink-muted" aria-hidden="true">
          {values.message.length} / {LIMITS.message}
        </p>
      </Field>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          className={buttonStyles(
            'primary',
            'disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
          )}
        >
          <ButtonFace variant="primary">
            {sending ? (
              <>
                <LoaderCircle aria-hidden="true" size={17} className="animate-spin" />
                Sending…
              </>
            ) : contactEndpoint ? (
              <>
                <Send aria-hidden="true" size={17} />
                Send message
              </>
            ) : (
              <>
                <Mail aria-hidden="true" size={17} />
                Open in email app
              </>
            )}
          </ButtonFace>
        </button>

        {!contactEndpoint && (
          <p className="max-w-xs text-sm text-ink-muted">
            This opens your email app with the message ready to send.
          </p>
        )}
      </div>

      <div id="contact-status" role="status" aria-live="polite" className="min-h-6 text-sm">
        {status === 'invalid' && hasErrors && (
          <p className="flex items-center gap-2 text-danger">
            <CircleAlert aria-hidden="true" size={16} className="shrink-0" />
            Please check the highlighted fields.
          </p>
        )}
        {status === 'success' && (
          <p className="flex items-center gap-2 text-accent">
            <CircleCheck aria-hidden="true" size={16} className="shrink-0" />
            Thank you! Your message was sent.
          </p>
        )}
        {status === 'error' && (
          <p className="flex items-start gap-2 text-danger">
            <CircleAlert aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
            <span>
              Sorry, that didn&rsquo;t go through, and your message hasn&rsquo;t been sent. Please
              try again
              {email && (
                <>
                  {' '}
                  or email me directly at{' '}
                  <a href={`mailto:${email}`} className="underline underline-offset-2">
                    {email}
                  </a>
                </>
              )}
              .
            </span>
          </p>
        )}
        {status === 'mailto' && (
          <p className="flex items-start gap-2 text-accent">
            <Mail aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
            <span>
              Your email app should open with your message ready. It hasn&rsquo;t been sent yet:
              press Send there. If nothing opened, email me at{' '}
              <a href={`mailto:${email}`} className="underline underline-offset-2">
                {email}
              </a>
              .
            </span>
          </p>
        )}
      </div>
    </form>
  )
}
