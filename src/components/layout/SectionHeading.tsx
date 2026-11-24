interface SectionHeadingProps {
  index: string
  eyebrow: string
  title: string
}

export function SectionHeading({ index, eyebrow, title }: SectionHeadingProps) {
  return (
    <header className="mb-12 max-w-2xl">
      <p className="mb-3 font-mono text-sm text-amber-400">
        {index} / {eyebrow}
      </p>
      <h2 className="text-title leading-[1.12] font-semibold text-ink">{title}</h2>
    </header>
  )
}
