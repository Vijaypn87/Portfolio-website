import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { buttonStyles, type ButtonVariant } from './buttonStyles'
import { Magnetic } from './Magnetic'

interface ButtonProps extends ComponentPropsWithoutRef<'a'> {
  variant?: ButtonVariant
  /** Lets the button pull a few pixels toward the mouse. */
  magnetic?: boolean
}

/** The inside of a button: just the label (kept as a component so the form button matches). */
export function ButtonFace({ children }: { variant?: ButtonVariant; children: ReactNode }) {
  return <span className="relative inline-flex items-center gap-2">{children}</span>
}

/** A link styled as a button. */
export function Button({
  variant = 'primary',
  magnetic = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const link = (
    <a className={buttonStyles(variant, className)} {...props}>
      <ButtonFace variant={variant}>{children}</ButtonFace>
    </a>
  )
  return magnetic ? <Magnetic>{link}</Magnetic> : link
}
