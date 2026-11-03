import { expect, test } from 'claude-code/testing'

import { accrue, addMinutes, dayKey, formatMinutes, isoLocal, mergeMinutes, minutesOfStamps, parseOffset } from '../../../hooks/shared/time/domain/services/time'

const MIN = 60_000

test('a gap of 15 minutes counts, 15m01s does not', () => {
  expect(accrue(0, 15 * MIN, 15)).toBe(15)
  expect(accrue(0, 15 * MIN + 1000, 15)).toBe(0)
  expect(accrue(0, 90_000, 15)).toBe(1.5)
})

test('no earlier activity counts nothing', () => {
  expect(accrue(null, 5 * MIN, 15)).toBe(0)
})

test('a negative gap counts nothing', () => {
  expect(accrue(10 * MIN, 5 * MIN, 15)).toBe(0)
})

test('dayKey uses the local offset across midnight', () => {
  expect(dayKey(Date.parse('2026-10-21T23:50:00Z'), 120)).toBe('2026-10-22')
  expect(dayKey(Date.parse('2026-10-21T23:50:00Z'), 0)).toBe('2026-10-21')
  expect(dayKey(Date.parse('2026-10-22T03:00:00Z'), -330)).toBe('2026-10-21')
})

test('addMinutes adds to the day and rounds to two decimals', () => {
  expect(addMinutes({ '2026-10-21': 1.111 }, '2026-10-21', 2.222)).toEqual({ '2026-10-21': 3.33 })
  expect(addMinutes({}, '2026-10-22', 5)).toEqual({ '2026-10-22': 5 })
})

test('formatMinutes', () => {
  expect(formatMinutes(0.5)).toBe('0m')
  expect(formatMinutes(24)).toBe('24m')
  expect(formatMinutes(84)).toBe('1h 24m')
  expect(formatMinutes(400)).toBe('6h 40m')
  expect(formatMinutes(120)).toBe('2h 0m')
})

test('parseOffset', () => {
  expect(parseOffset('+0200\n')).toBe(120)
  expect(parseOffset('-0530')).toBe(-330)
  expect(parseOffset('garbage')).toBe(0)
})

test('isoLocal writes the local time with its offset', () => {
  expect(isoLocal(Date.parse('2026-10-21T07:12:00Z'), 120)).toBe('2026-10-21T09:12:00+02:00')
  expect(isoLocal(Date.parse('2026-10-21T07:12:00Z'), -330)).toBe('2026-10-21T01:42:00-05:30')
  expect(isoLocal(Date.parse('2026-10-21T07:12:00Z'), 0)).toBe('2026-10-21T07:12:00+00:00')
})

test('mergeMinutes adds each day of the second into the first', () => {
  expect(mergeMinutes({ '2026-10-21': 5 }, { '2026-10-21': 2.5, '2026-10-22': 3 })).toEqual({ '2026-10-21': 7.5, '2026-10-22': 3 })
  expect(mergeMinutes({ '2026-10-21': 5 }, {})).toEqual({ '2026-10-21': 5 })
  expect(mergeMinutes({}, { '2026-10-21': 1.111 })).toEqual({ '2026-10-21': 1.11 })
})

test('minutesOfStamps counts each gap up to the idle limit, whatever order the stamps come in', () => {
  const t0 = Date.parse('2026-10-21T08:00:00Z')
  // 10 and 5 minutes, a 16-minute gap that does not count, then 2.
  const stamps = [t0 + 15 * MIN, t0, t0 + 33 * MIN, t0 + 10 * MIN, t0 + 31 * MIN]

  expect(minutesOfStamps(stamps, 15, 120)).toEqual({ '2026-10-21': 17 })
})

test('minutesOfStamps puts each gap on the local day it ends on', () => {
  // 23:50, 23:55 and 00:05 at +02:00.
  const stamps = ['2026-10-21T21:50:00Z', '2026-10-21T21:55:00Z', '2026-10-21T22:05:00Z'].map(Date.parse)

  expect(minutesOfStamps(stamps, 15, 120)).toEqual({ '2026-10-21': 5, '2026-10-22': 10 })
  expect(minutesOfStamps(stamps, 15, 0)).toEqual({ '2026-10-21': 15 })
})

test('minutesOfStamps counts nothing for no stamps, one stamp, or the same moment twice', () => {
  const t0 = Date.parse('2026-10-21T08:00:00Z')

  expect(minutesOfStamps([], 15, 120)).toEqual({})
  expect(minutesOfStamps([t0], 15, 120)).toEqual({})
  expect(minutesOfStamps([t0, t0], 15, 120)).toEqual({})
})
