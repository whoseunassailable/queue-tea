const MINUTE = 60_000

// The local day of a moment, as `YYYY-MM-DD`, for the offset `date +%z` gave.
export const dayKey = (ms: number, offsetMinutes: number): string =>
  new Date(ms + offsetMinutes * MINUTE).toISOString().slice(0, 10)

// The minutes between two moments of activity, or 0 when there was no earlier
// one, the clock went back, or the gap was longer than the idle limit.
export const accrue = (prevMs: number | null, nowMs: number, gapMinutes: number): number => {
  if (prevMs === null) return 0
  const minutes = (nowMs - prevMs) / MINUTE

  return minutes < 0 || minutes > gapMinutes ? 0 : minutes
}

const round2 = (n: number) => Math.round(n * 100) / 100

export const addMinutes = (
  byDay: Record<string, number>,
  day: string,
  minutes: number,
): Record<string, number> => ({ ...byDay, [day]: round2((byDay[day] ?? 0) + minutes) })

export const formatMinutes = (m: number): string => {
  const whole = Math.floor(m)
  const hours = Math.floor(whole / 60)

  return hours === 0 ? `${whole}m` : `${hours}h ${whole % 60}m`
}

// `+0200` → 120, `-0530` → -330; anything else → 0.
export const parseOffset = (dateZ: string): number => {
  const match = dateZ.trim().match(/^([+-])(\d{2})(\d{2})$/)
  if (match === null) return 0
  const minutes = Number(match[2]) * 60 + Number(match[3])

  return match[1] === '-' ? -minutes : minutes
}

const pad = (n: number) => String(n).padStart(2, '0')

// ISO 8601 in local time with its offset: `2026-10-21T09:12:00+02:00`.
export const isoLocal = (ms: number, offsetMinutes: number): string => {
  const local = new Date(ms + offsetMinutes * MINUTE).toISOString().slice(0, 19)
  const sign = offsetMinutes < 0 ? '-' : '+'
  const abs = Math.abs(offsetMinutes)

  return `${local}${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
}
