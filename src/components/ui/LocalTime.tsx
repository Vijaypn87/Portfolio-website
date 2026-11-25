import { useClock } from '@/hooks/useClock'

/** A live clock for a given time zone, e.g. "3:42 pm · bengaluru". */
export function LocalTime({ timeZone, city }: { timeZone: string; city: string }) {
  const time = useClock(timeZone)
  return (
    <span className="tabular-nums">
      {time.toLowerCase()} · {city.toLowerCase()}
    </span>
  )
}
