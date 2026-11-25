import { describe, expect, it } from 'vitest'

import { addDays, addMonths, daysFrom, monthWeeksOf, rangeOf, stepOf, todayIn, weekOf, weekStartOf } from './calendar_days'

describe('days', () => {
  it('counts across months, years and summer time without drifting', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-08', 1)).toBe('2026-03-09')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(daysFrom('2026-11-25', '2026-12-03')).toBe(8)
    expect(daysFrom('2026-12-03', '2026-11-25')).toBe(-8)
  })

  it('starts each week on Monday', () => {
    expect(weekStartOf('2026-11-25')).toBe('2026-11-23')
    expect(weekStartOf('2026-11-29')).toBe('2026-11-23')
    expect(weekStartOf('2026-11-30')).toBe('2026-11-30')
    expect(weekOf('2026-11-25')).toEqual(['2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28', '2026-11-29'])
  })

  it('moves a month on, keeping to the last day of a shorter one', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28')
    expect(addMonths('2028-01-31', 1)).toBe('2028-02-29')
    expect(addMonths('2026-12-15', 1)).toBe('2027-01-15')
    expect(addMonths('2026-01-15', -1)).toBe('2025-12-15')
  })

  it("lays a month out in whole weeks, from the Monday before the 1st to the Sunday after the last", () => {
    const november = monthWeeksOf('2026-11-25')

    expect(november).toHaveLength(6)
    expect(november[0]![0]).toBe('2026-10-26')
    expect(november[5]![6]).toBe('2026-12-06')
    // February 2027 starts on a Monday and ends on a Sunday: four rows.
    expect(monthWeeksOf('2027-02-10')).toHaveLength(4)
  })

  it('pages a month, a week or four weeks at a time', () => {
    expect(stepOf('month', '2026-11-25', 1)).toBe('2026-12-01')
    expect(stepOf('month', '2026-11-25', -1)).toBe('2026-10-01')
    expect(stepOf('week', '2026-11-25', 1)).toBe('2026-12-02')
    expect(stepOf('agenda', '2026-11-25', 1)).toBe('2026-12-23')
    expect(rangeOf('week', '2026-11-25')).toEqual({ first: '2026-11-23', last: '2026-11-29' })
    expect(rangeOf('agenda', '2026-11-25')).toEqual({ first: '2026-11-25', last: '2026-12-22' })
    expect(rangeOf('month', '2026-11-25')).toEqual({ first: '2026-10-26', last: '2026-12-06' })
  })

  it("takes today from the Mac's clock, not UTC's", () => {
    const lateEvening = Date.parse('2026-11-26T03:30:00Z')

    expect(todayIn('America/Chicago', lateEvening)).toBe('2026-11-25')
    expect(todayIn('Asia/Tokyo', lateEvening)).toBe('2026-11-26')
  })
})
