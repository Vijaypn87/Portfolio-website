import { ScrambleText } from './ScrambleText'

/** A small outlined label such as "02 / skills". It decodes into place when it scrolls into view. */
export function SectionTag({ text, active = true }: { text: string; active?: boolean }) {
  return (
    <span className="tag">
      <ScrambleText text={text} active={active} />
    </span>
  )
}
