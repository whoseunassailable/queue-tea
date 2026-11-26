import { expect, test } from 'claude-code/testing'

import { ALIKE_AT, alikeOf, alikeTask, likeness } from '../../../../hooks/shared/backlog/domain/services/duplicates'
import { makeTask } from '../../../helpers'

test('the same work in other words is alike: case, punctuation, filler words and plurals are ignored', () => {
  expect(likeness('Add dark mode', 'Dark mode')).toBe(1)
  expect(likeness('Notes in the fourth place!', 'notes fourth place')).toBe(1)
  expect(likeness('Filter quests by priority', 'filter quest by priority')).toBe(1)
  expect(likeness('Move Notes to fourth on the toolbar', 'Notes fourth on the toolbar')).toBeGreaterThanOrEqual(ALIKE_AT)
})

test('different work is not alike, and a title of filler words alone matches nothing', () => {
  expect(likeness('Dark mode', 'Export CSV')).toBe(0)
  expect(likeness('Dark mode for the calendar', 'Calendar import and export with ICS')).toBeLessThan(ALIKE_AT)
  expect(likeness('add the', 'add the')).toBe(0)
  expect(likeness('', 'Dark mode')).toBe(0)
})

test('the most alike task wins; on a tie, one still open beats one done, and removed tasks never count', () => {
  const done = makeTask({ title: 'Dark mode', state: 'done', finished: '2026-11-02T10:00:00-06:00' })
  const queued = makeTask({ title: 'dark mode', state: 'queued' })
  const removed = makeTask({ title: 'Add dark mode', state: 'removed' })

  expect(alikeTask([done, queued, removed], 'Add dark mode')?.id).toBe(queued.id)
  expect(alikeTask([done, removed], 'Add dark mode')?.id).toBe(done.id)
  expect(alikeTask([removed], 'Add dark mode')).toBeNull()
  expect(alikeTask([makeTask({ title: 'Dark mode toggle in settings' }), queued], 'Dark mode')?.id).toBe(queued.id)
})

test("the band's field holds the alike task's id, or is left out", () => {
  const queued = makeTask({ title: 'Export CSV', state: 'queued' })

  expect(alikeOf([queued], 'export csv')).toEqual({ alike: queued.id })
  expect(alikeOf([queued], 'Dark mode')).toEqual({})
})
