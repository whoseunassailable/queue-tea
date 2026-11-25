// Wall times and moments, on any zone's clock. The window and main both read
// a timed event's start and end with these, so they agree on what an event
// means. Intl knows every zone's rules, summer time included.
const MINUTE = 60_000
const DAY = 24 * 60 * MINUTE
// An IANA name, such as America/Chicago or UTC. Offsets like +05:30 aren't
// zones: they don't move with summer time.
const ZONE_NAME = /^[A-Za-z][A-Za-z0-9_+-]*(\/[A-Za-z0-9_+-]+)*$/

const formatters = new Map<string, Intl.DateTimeFormat>()
const formatterOf = (zone: string): Intl.DateTimeFormat => {
  const known = formatters.get(zone)
  if (known !== undefined) return known
  const made = new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  formatters.set(zone, made)

  return made
}

// The zone's own name for itself, so europe/lisbon is kept as Europe/Lisbon;
// null for a name Intl doesn't know.
export const zoneNameOf = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.length > 64 || !ZONE_NAME.test(value)) return null
  try {
    return formatterOf(value).resolvedOptions().timeZone
  } catch {
    return null
  }
}

// The Mac's own zone, as the window reads it.
export const hereZone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone

// Every zone this computer knows, for the event sheet's list.
export const knownZones = (): string[] => (typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : [])

const partsOf = (ms: number, zone: string): number[] => {
  const parts = Object.fromEntries(formatterOf(zone).formatToParts(new Date(ms)).map(part => [part.type, part.value]))

  return [Number(parts.year), Number(parts.month), Number(parts.day), Number(parts.hour) % 24, Number(parts.minute), Number(parts.second)]
}

const utcOfWall = (wall: string): number => Date.UTC(Number(wall.slice(0, 4)), Number(wall.slice(5, 7)) - 1, Number(wall.slice(8, 10)), Number(wall.slice(11, 13)), Number(wall.slice(14, 16)))
const pad = (n: number, width = 2) => String(n).padStart(width, '0')

// A moment as a wall time on the zone's clock, to the minute.
export const wallOf = (ms: number, zone: string): string => {
  const [year, month, day, hour, minute] = partsOf(ms, zone)

  return `${pad(year!, 4)}-${pad(month!)}-${pad(day!)}T${pad(hour!)}:${pad(minute!)}`
}

// How far the zone's clock is ahead of UTC at a moment, in minutes.
export const offsetAt = (ms: number, zone: string): number => {
  const whole = Math.floor(ms / 1000) * 1000
  const [year, month, day, hour, minute, second] = partsOf(whole, zone)

  return Math.round((Date.UTC(year!, month! - 1, day!, hour!, minute!, second!) - whole) / MINUTE)
}

// The moment a wall time names on the zone's clock. When the clocks go back
// it happens twice, and this is the first. When they go forward it never
// happens, and this is the moment as far past the jump: 2:30 on a night that
// skips from 2:00 to 3:00 is 3:30.
export const instantOf = (wall: string, zone: string): number => {
  const local = utcOfWall(wall)
  const before = offsetAt(local - DAY, zone)
  const after = offsetAt(local + DAY, zone)
  const fits = [...new Set([before, after])].map(offset => local - offset * MINUTE).filter(ms => wallOf(ms, zone) === wall)

  return fits.length > 0 ? Math.min(...fits) : local - before * MINUTE
}

// The same moment read on another clock: 09:00 in Lisbon is 03:00 in Chicago.
export const wallIn = (wall: string, from: string, to: string): string => wallOf(instantOf(wall, from), to)
