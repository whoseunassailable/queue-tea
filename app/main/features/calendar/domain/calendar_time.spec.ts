import { describe, expect, it } from 'vitest'

import { isDay, isWallTime } from '../../../../shared/calendar'
import { instantOf, offsetAt, wallIn, wallOf, zoneNameOf } from '../../../../shared/calendar_time'

// Both sides read events with these, so they live in shared; the specs sit here.
describe('days and wall times', () => {
  it.each(['2026-12-01', '2028-02-29', '1999-12-31'])('takes the day %s', day => {
    expect(isDay(day)).toBe(true)
  })

  it.each(['2026-02-30', '2026-13-01', '2026-1-01', ' 2026-12-01', '2026-12-01T09:00', '', 20261201, null])('refuses %s as a day', value => {
    expect(isDay(value)).toBe(false)
  })

  it.each(['2026-12-01T00:00', '2026-12-01T23:59'])('takes the wall time %s', wall => {
    expect(isWallTime(wall)).toBe(true)
  })

  it.each(['2026-12-01T24:00', '2026-12-01T9:00', '2026-12-01 09:00', '2026-02-30T09:00', '2026-12-01T09:00:00', '2026-12-01T09:00Z'])('refuses %s as a wall time', wall => {
    expect(isWallTime(wall)).toBe(false)
  })
})

describe('zones', () => {
  it("keeps a zone by its own name, and refuses offsets and names Intl doesn't know", () => {
    expect(zoneNameOf('Europe/Lisbon')).toBe('Europe/Lisbon')
    expect(zoneNameOf('europe/lisbon')).toBe('Europe/Lisbon')
    expect(zoneNameOf('UTC')).toBe('UTC')
    for (const bad of ['+05:30', 'Mars/Olympus_Mons', '', '../etc', 'America/Chicago\n', 7, null]) expect(zoneNameOf(bad)).toBeNull()
  })

  it('reads a moment on any clock', () => {
    const noon = Date.parse('2026-07-01T12:00:00Z')

    expect(wallOf(noon, 'America/Chicago')).toBe('2026-07-01T07:00')
    expect(wallOf(noon, 'Asia/Kolkata')).toBe('2026-07-01T17:30')
    expect(offsetAt(noon, 'Asia/Kolkata')).toBe(330)
    expect(offsetAt(noon, 'America/Chicago')).toBe(-300)
    expect(offsetAt(Date.parse('2026-12-01T12:00:00Z'), 'America/Chicago')).toBe(-360)
  })

  it('finds the moment a wall time names, in summer and winter', () => {
    expect(new Date(instantOf('2026-07-01T09:00', 'Europe/Lisbon')).toISOString()).toBe('2026-07-01T08:00:00.000Z')
    expect(new Date(instantOf('2026-12-01T09:00', 'Europe/Lisbon')).toISOString()).toBe('2026-12-01T09:00:00.000Z')
  })

  it('moves a time the clocks skip past the jump, and takes the first of a time they repeat', () => {
    // Chicago skips 2:00 to 3:00 on 8 March and repeats 1:00 to 2:00 on 1 November.
    expect(wallOf(instantOf('2026-03-08T02:30', 'America/Chicago'), 'America/Chicago')).toBe('2026-03-08T03:30')
    expect(new Date(instantOf('2026-11-01T01:30', 'America/Chicago')).toISOString()).toBe('2026-11-01T06:30:00.000Z')
  })

  it('shows a 9:00 call in Lisbon at 3:00 in Chicago, and a late one in Tokyo on the day before in Los Angeles', () => {
    expect(wallIn('2026-11-25T09:00', 'Europe/Lisbon', 'America/Chicago')).toBe('2026-11-25T03:00')
    expect(wallIn('2026-11-26T08:30', 'Asia/Tokyo', 'America/Los_Angeles')).toBe('2026-11-25T15:30')
  })
})
