import { SectionTag } from '@/components/ui/SectionTag'

interface SectionHeadingProps {
  /** Section number, e.g. "02". */
  index: string
  /** Short label, shown as the tag "02 / skills". */
  label: string
  /** The first part of the heading, in off-white. */
  title?: string
  /** The rest of the heading, in muted warm pink. */
  accent?: string
  /** Overrides the default spacing and width of the header. */
  className?: string
}

export function SectionHeading({ index, label, title, accent, className }: SectionHeadingProps) {
  return (
    <header className={className ?? 'mb-10 max-w-3xl'}>
      <SectionTag text={`${index} / ${label}`} />
      {(title || accent) && (
        <h2 className="mt-6 text-title leading-[1.05] font-bold text-balance text-fg">
          {title}
          {title && accent && ' '}
          {accent && <span className="text-tone">{accent}</span>}
        </h2>
      )}
    </header>
  )
}
