import type { Difficulty, Priority } from '../types'
import type { Host } from './host'
import { formatMinutes } from './time'

export type DocsRow = {
  title: string
  priority: Priority
  expected: Difficulty
  actual: Difficulty
  minutes: number
  branch: string | null
}

const HEAD = [
  '# Task Log',
  '',
  'Every task finished in this project, newest first. Written by Queue-tea.',
  '',
]
const TABLE = ['| Task | Priority | Difficulty | Time | Branch |', '| --- | --- | --- | --- | --- |']
const DAY = /^## (\d{4}-\d{2}-\d{2})$/

const capital = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

// A cell that keeps the table whole, and an MDX build (Docusaurus) working.
export const escapeCell = (text: string): string =>
  text
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/</g, '&lt;')
    .replace(/[{}]/g, c => `\\${c}`)
    .replace(/\s*(\r\n|\r|\n)\s*/g, ' ')

const rowLine = (row: DocsRow): string => {
  const difficulty =
    row.expected === row.actual ? capital(row.actual) : `${capital(row.expected)} → ${capital(row.actual)}`
  const branch = row.branch === null ? '—' : `\`${row.branch}\``

  return `| ${escapeCell(row.title)} | ${capital(row.priority)} | ${difficulty} | ${formatMinutes(row.minutes)} | ${branch} |`
}

// Puts the row first under its date; a date not there yet gets its own
// section above every older date.
export const addRow = (existing: string | null, row: DocsRow, day: string): string => {
  const lines = existing === null ? [...HEAD] : existing.replace(/\n+$/, '').split('\n').concat('')
  const line = rowLine(row)

  const heading = lines.indexOf(`## ${day}`)
  if (heading >= 0) {
    const sep = lines.indexOf(TABLE[1]!, heading)
    lines.splice(sep + 1, 0, line)

    return lines.join('\n').replace(/\n*$/, '\n')
  }

  const older = lines.findIndex(l => (l.match(DAY)?.[1] ?? '9999') < day)
  const at = older >= 0 ? older : lines.length
  const section = [`## ${day}`, '', ...TABLE, line, '']
  lines.splice(at, 0, ...section)

  return lines.join('\n').replace(/\n*$/, '\n')
}

export const writeDocsLog = async (
  host: Host,
  projectPath: string,
  logPath: string,
  row: DocsRow,
  day: string,
): Promise<void> => {
  const file = logPath.startsWith('/') ? logPath : `${projectPath}/${logPath}`
  const existing = (await host.exists(file)) ? await host.read(file) : null
  await host.write(file, addRow(existing, row, day))
}
