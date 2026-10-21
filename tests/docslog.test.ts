import { expect, test } from 'claude-code/testing'

import { addRow, escapeCell, writeDocsLog } from '../hooks/docslog'
import type { DocsRow } from '../hooks/docslog'
import { memoryHost } from './helpers'

const ROW: DocsRow = {
  title: 'Retry button on the scan page',
  priority: 'high',
  expected: 'light',
  actual: 'medium',
  minutes: 84,
  branch: 'task/retry-button-scan-page',
}

const HEAD = [
  '# Task Log',
  '',
  'Every task finished in this project, newest first. Written by Queue-tea.',
  '',
].join('\n')
const TABLE = ['| Task | Priority | Difficulty | Time | Branch |', '| --- | --- | --- | --- | --- |']

test('a new log gets the heading, intro, date and row', () => {
  expect(addRow(null, ROW, '2026-10-21')).toBe(
    [
      HEAD,
      '## 2026-10-21',
      '',
      ...TABLE,
      '| Retry button on the scan page | High | Light → Medium | 1h 24m | `task/retry-button-scan-page` |',
      '',
    ].join('\n'),
  )
})

test('a second task the same day goes first under that date', () => {
  const once = addRow(null, ROW, '2026-10-21')
  const twice = addRow(once, { ...ROW, title: 'Second', minutes: 10 }, '2026-10-21')
  const lines = twice.split('\n')
  const sep = lines.indexOf(TABLE[1]!)

  expect(lines[sep + 1]).toContain('| Second |')
  expect(lines[sep + 2]).toContain('| Retry button on the scan page |')
  expect(lines.filter(l => l === '## 2026-10-21')).toHaveLength(1)
})

test('a new day goes above the older day', () => {
  const older = addRow(null, ROW, '2026-10-21')
  const newer = addRow(older, { ...ROW, title: 'Next day' }, '2026-10-22')

  expect(newer.indexOf('## 2026-10-22') < newer.indexOf('## 2026-10-21')).toBe(true)
  expect(newer.startsWith(HEAD)).toBe(true)
})

test('pipes and newlines in a title do not break the table', () => {
  expect(escapeCell('a | b\nc')).toBe('a \\| b c')
  const text = addRow(null, { ...ROW, title: 'a | b\nc' }, '2026-10-21')
  const row = text.split('\n').find(l => l.startsWith('| a'))!

  expect(row.split(/(?<!\\)\|/).length).toBe(7)
})

test('same expected and actual difficulty shows once, no branch shows a dash', () => {
  const text = addRow(null, { ...ROW, actual: 'light', branch: null }, '2026-10-21')

  expect(text).toContain('| High | Light | 1h 24m | — |')
})

test('writeDocsLog writes the log under the project', async () => {
  const mem = memoryHost()

  await writeDocsLog(mem.host, '/p', 'docs/task_log.md', ROW, '2026-10-21')
  await writeDocsLog(mem.host, '/p', 'docs/task_log.md', { ...ROW, title: 'Two' }, '2026-10-21')

  expect(mem.files.get('/p/docs/task_log.md')).toContain('| Two |')
  expect(mem.files.get('/p/docs/task_log.md')).toContain('| Retry button on the scan page |')
})
