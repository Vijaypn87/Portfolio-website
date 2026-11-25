/**
 * A small badge in the style of Adobe's app icons: a rounded square with a bold two-letter label.
 * Used for the Adobe apps (Simple Icons has no Adobe logos). The thin pale edge keeps the dark
 * square visible on the dark theme's chips.
 */
export function AdobeBadge({
  letters,
  color,
  background,
  size = 14,
}: {
  letters: string
  color: string
  background: string
  size?: number
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 14" width={size} height={size}>
      <rect
        x="0.5"
        y="0.5"
        width="13"
        height="13"
        rx="2.5"
        fill={background}
        stroke="#fff"
        strokeOpacity="0.22"
      />
      <text
        x="7"
        y="7.6"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="7.5"
        fontWeight="800"
        fontFamily="Inter Variable, Inter, system-ui, sans-serif"
      >
        {letters}
      </text>
    </svg>
  )
}

type BadgeProps = { size?: number }

export const PhotoshopBadge = ({ size }: BadgeProps) => (
  <AdobeBadge letters="Ps" color="#31A8FF" background="#001E36" size={size} />
)
export const PremiereBadge = ({ size }: BadgeProps) => (
  <AdobeBadge letters="Pr" color="#9999FF" background="#00005B" size={size} />
)
export const AfterEffectsBadge = ({ size }: BadgeProps) => (
  <AdobeBadge letters="Ae" color="#9999FF" background="#00005B" size={size} />
)
