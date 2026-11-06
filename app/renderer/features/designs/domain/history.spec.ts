import { describe, expect, it } from 'vitest'

import type { Scene } from '../../../../shared/designs'
import { commit, historyOf, redo, undo } from './history'
import type { History } from './history'

const scene = (width: number): Scene => ({ format: 1, name: 'Welcome', width, height: 844, fill: '#F6F1E7', nodes: [] })
const widths = (h: History) => ({ past: h.past.map(s => s.width), present: h.present.width, future: h.future.map(s => s.width) })

describe('undo and redo', () => {
  it('starts with nothing to undo or redo', () => {
    expect(widths(historyOf(scene(1)))).toEqual({ past: [], present: 1, future: [] })
  })

  it('goes back a change and forward again', () => {
    const changed = commit(commit(historyOf(scene(1)), scene(2)), scene(3))

    expect(widths(undo(changed))).toEqual({ past: [1], present: 2, future: [3] })
    expect(widths(undo(undo(changed)))).toEqual({ past: [], present: 1, future: [2, 3] })
    expect(widths(redo(undo(undo(changed))))).toEqual({ past: [1], present: 2, future: [3] })
  })

  it('drops what could be redone once something new is changed', () => {
    const undone = undo(commit(commit(historyOf(scene(1)), scene(2)), scene(3)))

    expect(widths(commit(undone, scene(9)))).toEqual({ past: [1, 2], present: 9, future: [] })
  })

  it('leaves the history alone with nothing to undo or redo', () => {
    const start = historyOf(scene(1))

    expect(undo(start)).toBe(start)
    expect(redo(start)).toBe(start)
  })

  it('counts the same scene again as no change', () => {
    const start = historyOf(scene(1))

    expect(commit(start, start.present)).toBe(start)
  })

  it('keeps the last 200 steps, and forgets the oldest', () => {
    let h = historyOf(scene(0))
    for (let width = 1; width <= 250; width += 1) h = commit(h, scene(width))

    expect(h.past).toHaveLength(200)
    expect(h.past[0]!.width).toBe(50)
    for (let i = 0; i < 200; i += 1) h = undo(h)
    expect(h.present.width).toBe(50)
    expect(undo(h)).toBe(h)
  })
})
