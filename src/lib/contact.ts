import { isSecureUrl, type ContactValues } from './validation'

/**
 * The public URL of a form-handling service (for example a Formspree form endpoint), supplied at
 * build time as VITE_CONTACT_ENDPOINT. It is a public address, not a secret, and no credentials
 * ever belong in this front-end code. When it is missing or not https, the form does not pretend
 * to send: it opens the visitor's email app instead (see `buildMailto`).
 */
const configured = import.meta.env.VITE_CONTACT_ENDPOINT?.trim()
// Production accepts https only. While developing, a local http://localhost mock is allowed too,
// so the form can be tested without a real service.
const isLocalDev = (value: string) =>
  import.meta.env.DEV && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(value)
export const contactEndpoint =
  configured && (isSecureUrl(configured) || isLocalDev(configured)) ? configured : undefined

/**
 * Sends the message to the configured service. Resolves only when the service answers with a
 * success status; otherwise it throws, so the UI can never report a message as sent when it wasn't.
 */
export async function sendContact(values: ContactValues, signal?: AbortSignal) {
  if (!contactEndpoint) throw new Error('No contact endpoint is configured.')
  const response = await fetch(contactEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      _subject: values.subject.trim(),
      message: values.message.trim(),
    }),
    signal,
  })
  if (!response.ok) throw new Error(`The service replied with status ${response.status}.`)
}

/** A prefilled `mailto:` link: the practical fallback when no service is configured. */
export function buildMailto(to: string, values: ContactValues) {
  const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`
  return `mailto:${to}?subject=${encodeURIComponent(values.subject.trim())}&body=${encodeURIComponent(body)}`
}
