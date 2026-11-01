import type { Color } from 'claude-code'

import type { Priority } from '../../../types'

export const PRIORITY_COLOR: Record<Priority, Color> = {
  urgent: 'error',
  high: 'warning',
  mid: 'suggestion',
  okay: 'success',
  low: 'inactive',
}

export const capital = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
export const total = (byDay: Record<string, number>) => Object.values(byDay).reduce((a, b) => a + b, 0)
export const sum = (minutes: number[]) => minutes.reduce((a, b) => a + b, 0)
export const grouped = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

// A handoff line's mark, from its section: a step still to do, one done, or
// a plain point.
export const markFor = (heading: string) =>
  /next|left|to do|todo|remaining/i.test(heading) ? '☐' : /changed|changes|done/i.test(heading) ? '✓' : '•'

// The menu the tea cup opens: the list, or one of its views. Every press
// goes to the same actions the panel used; opening, moving between views and
// closing write nothing to the record.
