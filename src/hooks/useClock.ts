import { useEffect, useMemo, useState } from 'react'

interface ClockOptions {
  /** Show seconds ("03:42:07 PM") instead of just hours and minutes ("3:42 PM"). */
  seconds?: boolean
  /** How often to refresh, in milliseconds. */
  intervalMs?: number
}

/** The current time in a time zone, in 12-hour form. Refreshes on an interval. */
export function useClock(
  timeZone: string,
  { seconds = false, intervalMs = 5000 }: ClockOptions = {},
) {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: seconds ? '2-digit' : 'numeric',
        minute: '2-digit',
        second: seconds ? '2-digit' : undefined,
        hour12: true,
      }),
    [timeZone, seconds],
  )
  const [time, setTime] = useState(() => formatter.format(new Date()))

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()))
    const id = window.setInterval(tick, intervalMs)
    return () => window.clearInterval(id)
  }, [formatter, intervalMs])

  return time
}
