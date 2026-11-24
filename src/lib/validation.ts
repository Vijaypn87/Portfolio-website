export interface ContactValues {
  name: string
  email: string
  subject: string
  message: string
}

export type ContactField = keyof ContactValues
export type ContactErrors = Partial<Record<ContactField, string>>

export const LIMITS = { name: 80, email: 120, subject: 120, message: 2000 } as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const isValidEmail = (value: string) => EMAIL_PATTERN.test(value.trim())

/** Only https links are ever rendered as external links. */
export function isSecureUrl(value: string) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

/** Returns a short, plain-language message, or `undefined` when the value is fine. */
export function validateField(field: ContactField, raw: string): string | undefined {
  const value = raw.trim()
  switch (field) {
    case 'name':
      if (!value) return 'Please enter your name.'
      if (value.length < 2) return 'Your name should be at least 2 characters.'
      if (value.length > LIMITS.name)
        return `Please keep your name under ${LIMITS.name} characters.`
      return
    case 'email':
      if (!value) return 'Please enter your email address.'
      if (!isValidEmail(value)) return 'That email address doesn’t look right.'
      if (value.length > LIMITS.email) return 'That email address is too long.'
      return
    case 'subject':
      if (!value) return 'Please add a subject.'
      if (value.length < 3) return 'The subject should be at least 3 characters.'
      if (value.length > LIMITS.subject)
        return `Please keep the subject under ${LIMITS.subject} characters.`
      return
    case 'message':
      if (!value) return 'Please write a message.'
      if (value.length < 10) return 'Your message should be at least 10 characters.'
      if (value.length > LIMITS.message)
        return `Please keep the message under ${LIMITS.message} characters.`
      return
  }
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {}
  for (const field of Object.keys(values) as ContactField[]) {
    const message = validateField(field, values[field])
    if (message) errors[field] = message
  }
  return errors
}
