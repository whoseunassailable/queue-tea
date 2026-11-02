import { describe, expect, it } from 'vitest'

import { skyAt, skyOf } from './sky_time'

describe('the sky', () => {
  it.each([
    [4, 'night'],
    [5, 'morning'],
    [9, 'morning'],
    [10, 'day'],
    [16, 'day'],
    [17, 'evening'],
    [19, 'evening'],
    [20, 'night'],
    [0, 'night'],
  ])('at %i is %s', (hour, sky) => {
    expect(skyAt(hour)).toBe(sky)
  })

  it('follows the clock on auto and keeps a fixed choice otherwise', () => {
    expect(skyOf('auto', 12)).toBe('day')
    expect(skyOf('night', 12)).toBe('night')
  })
})
