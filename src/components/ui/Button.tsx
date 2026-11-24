import {
  useRef,
  type ComponentPropsWithoutRef,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import { buttonStyles, buttonVariants, type ButtonVariant } from './buttonStyles'

interface ButtonProps extends ComponentPropsWithoutRef<'a'> {
  variant?: ButtonVariant
  /** Lets the label drift a few pixels toward the mouse. The button itself never moves. */
  magnetic?: boolean
}

/** The furthest the label may drift from rest, in pixels. */
const MAX_SHIFT = 3

const clamp = (value: number) => Math.min(Math.max(value, -1), 1)

/** The inside of a button: a soft light sweep on hover, and the label. */
export function ButtonFace({
  variant = 'primary',
  labelRef,
  children,
}: {
  variant?: ButtonVariant
  labelRef?: Ref<HTMLSpanElement>
  children: ReactNode
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent to-transparent transition-transform duration-700 ease-out group-hover/button:translate-x-full motion-reduce:hidden',
          buttonVariants[variant].sheen,
        )}
      />
      <span
        ref={labelRef}
        className="relative inline-flex items-center gap-2 transition-[translate] duration-200 ease-out"
      >
        {children}
      </span>
    </>
  )
}

/**
 * A link styled as a button.
 *
 * Hover feedback is a soft light sweep plus a stronger glow. With `magnetic`, the *label* (not the
 * button) drifts up to `MAX_SHIFT` px toward the pointer. The button's box, hit area and keyboard
 * focus ring stay exactly where they are, so the pointer offset is always measured against a
 * stationary rectangle: there is no feedback loop, and no transform on the box to fight with CSS
 * (`active:scale`), Motion (section reveals) or the custom cursor.
 */
export function Button({
  variant = 'primary',
  magnetic = false,
  className,
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}: ButtonProps) {
  const anchor = useRef<HTMLAnchorElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  const handleMove = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerMove?.(event)
    const box = anchor.current?.getBoundingClientRect()
    if (!magnetic || reducedMotion || event.pointerType !== 'mouse' || !box || !label.current)
      return
    const x = clamp(((event.clientX - box.left) / box.width) * 2 - 1)
    const y = clamp(((event.clientY - box.top) / box.height) * 2 - 1)
    label.current.style.translate = `${x * MAX_SHIFT}px ${y * MAX_SHIFT * 0.7}px`
  }

  const handleLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerLeave?.(event)
    if (label.current) label.current.style.translate = ''
  }

  return (
    <a
      ref={anchor}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={buttonStyles(variant, className)}
      {...props}
    >
      <ButtonFace variant={variant} labelRef={label}>
        {children}
      </ButtonFace>
    </a>
  )
}
