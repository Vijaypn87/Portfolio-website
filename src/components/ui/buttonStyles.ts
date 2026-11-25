import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'ghost'

export const buttonVariants = {
  primary: {
    box: 'bg-accent text-on-accent shadow-[0_8px_30px_-10px_rgb(var(--glow)/0.7)] hover:brightness-110',
  },
  ghost: { box: 'border border-line text-fg hover:border-accent/60 hover:text-accent' },
}

/** Classes for anything that should look like a button (a link, or a real `<button>`). */
export function buttonStyles(variant: ButtonVariant = 'primary', className?: string) {
  return cn(
    'relative inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98]',
    buttonVariants[variant].box,
    className,
  )
}
