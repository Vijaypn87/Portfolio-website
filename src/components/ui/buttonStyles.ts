import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'ghost'

export const buttonVariants = {
  primary: {
    box: 'bg-ember-500 text-night-950 shadow-[0_8px_30px_-10px] shadow-ember-500/50 hover:bg-ember-400 hover:shadow-[0_14px_40px_-10px] hover:shadow-ember-500/70',
    sheen: 'via-white/30',
  },
  ghost: {
    box: 'border border-line text-ink hover:border-amber-400/60 hover:bg-amber-400/10 hover:shadow-[0_10px_30px_-14px] hover:shadow-ember-500/50',
    sheen: 'via-amber-400/20',
  },
}

/** Classes for anything that should look like a button (a link, or a real `<button>`). */
export function buttonStyles(variant: ButtonVariant = 'primary', className?: string) {
  return cn(
    'group/button relative inline-flex items-center overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition duration-200 active:scale-[0.97]',
    buttonVariants[variant].box,
    className,
  )
}
