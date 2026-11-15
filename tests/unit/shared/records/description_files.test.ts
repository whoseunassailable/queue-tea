import { expect, test } from 'claude-code/testing'

import { descriptionFiles, notesFolderOf, withFilePaths } from '../../../../hooks/shared/records/domain/services/description_files'

const IMAGE = `attachments/${'a1'.repeat(32)}.png`
const PDF = `attachments/${'b2'.repeat(32)}.pdf`
const FOLDER = '/h/.queue-tea/notes/app-1a2b3c'

test('a description finds the images and PDFs Queue-tea saved, in order, with or without angle brackets', () => {
  const text = `See the mock:\n![mock.png](<${IMAGE}>)\nand the spec [spec.pdf](${PDF}), then ![again](${IMAGE})`

  expect(descriptionFiles(text)).toEqual([
    { name: 'mock.png', path: IMAGE, isImage: true },
    { name: 'spec.pdf', path: PDF, isImage: false },
    { name: 'again', path: IMAGE, isImage: true },
  ])
})

test('an escaped bracket or backslash in a file name reads as itself', () => {
  expect(descriptionFiles(`![Plan \\[v2\\] a\\\\b.png](<${IMAGE}>)`)).toEqual([{ name: 'Plan [v2] a\\b.png', path: IMAGE, isImage: true }])
})

test('web links, hand-typed paths, other folders and names that are not a hash are not files', () => {
  const hash = 'c3'.repeat(32)
  const text = [
    `[site](https://example.com/attachments/${hash}.png)`,
    `[up](../attachments/${hash}.png)`,
    `[abs](</Users/r/attachments/${hash}.png>)`,
    `[other](images/${hash}.png)`,
    `[nested](notes/attachments/${hash}.png)`,
    '[named](attachments/photo.png)',
    `[short](attachments/${hash.slice(1)}.png)`,
    `[upper](attachments/${hash.toUpperCase()}.png)`,
    `[bare](attachments/${hash})`,
    '[[a wiki link]]',
  ].join('\n')

  expect(descriptionFiles(text)).toEqual([])
})

test('a quest with no description, or an empty one, links no files', () => {
  expect(descriptionFiles(null)).toEqual([])
  expect(descriptionFiles('')).toEqual([])
})

test('withFilePaths points each saved file at the notes folder and leaves every other link as it was', () => {
  const text = `![mock](<${IMAGE}>) and [spec](${PDF})\n[site](https://example.com) [named](attachments/photo.png) [up](../attachments/${'c3'.repeat(32)}.png)`

  expect(withFilePaths(text, FOLDER)).toBe(
    `![mock](<${FOLDER}/${IMAGE}>) and [spec](<${FOLDER}/${PDF}>)\n[site](https://example.com) [named](attachments/photo.png) [up](../attachments/${'c3'.repeat(32)}.png)`,
  )
})

test('withFilePaths keeps an escaped name escaped, so the link still reads as one', () => {
  expect(withFilePaths(`![Plan \\[v2\\]](${IMAGE})`, FOLDER)).toBe(`![Plan \\[v2\\]](<${FOLDER}/${IMAGE}>)`)
})

test("the realm's notes folder is named by its record file", () => {
  expect(notesFolderOf({ home: '/h', file: '/h/.queue-tea/projects/app-1a2b3c.json' })).toBe('/h/.queue-tea/notes/app-1a2b3c')
})
