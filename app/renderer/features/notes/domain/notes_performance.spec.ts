import { expect, it } from 'vitest'

import { note } from '../../../test_support'
import { folderKeyOf, folderPageOf, foldersOf, matches } from './notes_view'

it('splits folders across bounded pages without losing notes or their full counts', () => {
  const notes = Array.from({ length: 235 }, (_, i) => note({ id: `n-${i}`, folder: i < 5 ? 'Inbox' : 'Research' }))
  const groups = foldersOf(notes, '', false)
  const pages = [0, 1, 2].map(page => folderPageOf(groups, new Set(), page))
  expect(pages.map(page => page.groups.flatMap(group => group.visible).length)).toEqual([100, 100, 35])
  expect(pages[1]!.groups[0]!.notes).toHaveLength(230)
  expect(pages.flatMap(page => page.groups.flatMap(group => group.visible.map(n => n.id)))).toEqual(notes.map(n => n.id))
  expect(folderPageOf(groups, new Set(), 99).page).toBe(2)
  expect(folderPageOf([], new Set(), 9)).toMatchObject({ groups: [], page: 0, pages: 1 })
})

it('bounds a realm with thousands of folded folders as well as thousands of notes', () => {
  const notes = Array.from({ length: 5000 }, (_, i) => note({ id: `n-${i}`, folder: `Folder ${i}` }))
  const groups = foldersOf(notes, '', false)
  const folded = new Set(groups.map(folderKeyOf))
  const first = folderPageOf(groups, folded, 0)
  expect(first.groups).toHaveLength(100)
  expect(first.groups.flatMap(group => group.visible)).toHaveLength(0)
  expect(first.pages).toBe(50)
  expect(folderPageOf(groups, folded, 49).groups).toHaveLength(100)
})

it('searches all words across title, body and tag prefixes and refreshes replaced notes', () => {
  const original = note({ title: 'Café plan', body: 'Try the NEEDLE experiment', tags: ['Deep-work'] })
  expect(matches(original, 'CAFÉ needle #deep')).toBe(true)
  expect(matches(original, '#needle')).toBe(false)
  expect(matches(original, 'needle missing')).toBe(false)
  const replaced = { ...original, title: 'Different', body: 'Revised', tags: ['Research'] }
  expect(matches(replaced, 'needle')).toBe(false)
  expect(matches(replaced, 'revised #res')).toBe(true)
})

it('groups and repeatedly searches 5,000 substantial notes within the warm search budget', () => {
  const notes = Array.from({ length: 5000 }, (_, i) => note({ id: `n-${i}`, title: `Idea ${i}`, folder: `Folder ${i % 100}`, isPinned: i % 2 === 0, tags: ['Research'], body: `${'Experiment observations. '.repeat(200)} marker-${i}` }))
  // Warm once, as the first typed search does. Every query still searches all
  // 5,000 bodies, including the final note, before the list selects a page.
  foldersOf(notes, 'experiment', false)
  const started = performance.now()
  for (let i = 0; i < 5; i += 1) {
    const groups = foldersOf(notes, `#res marker-${4995 + i}`, false)
    expect(groups.flatMap(group => group.notes).map(n => n.id)).toEqual([`n-${4995 + i}`])
  }
  const took = performance.now() - started
  process.stdout.write(`Five warm searches across 5,000 notes: ${Math.round(took)} ms\n`)
  expect(took).toBeLessThan(500)
})
