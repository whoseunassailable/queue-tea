import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

const APP = join(__dirname, '..')
const KEY = 'notes-abc123'
const TITLE = 'Maybe we should understand the missed steps'
const BODY = 'Find out why short walks lose steps.\n\n- [ ] Reproduce a missed step\n- [ ] Compare sensor recordings'
let home: string
let app: ElectronApplication
let page: Page
const errors: string[] = []
const recordPath = () => join(home, '.queue-tea/projects', `${KEY}.json`)
const vault = () => join(home, '.queue-tea/notes', KEY)
const record = async () => JSON.parse(await readFile(recordPath(), 'utf8')) as { tasks: { id: string; title: string; parentIds: string[]; priority: string; difficulty: { expected: string }; description: string }[] }

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-notes-performance-'))
  await mkdir(join(home, 'gait'))
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await mkdir(vault(), { recursive: true })
  await writeFile(recordPath(), JSON.stringify({ version: 2, project: { name: 'Gait-feedback', path: join(home, 'gait') }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))
  // Capture brings this vault to its existing limit of 5,000 notes. Include
  // bodies, tags, many folders and pins rather than just short empty titles.
  for (let start = 0; start < 4999; start += 100) {
    await Promise.all(Array.from({ length: Math.min(100, 4999 - start) }, (_, offset) => {
      const i = start + offset
      const n = String(i).padStart(5, '0')
      return writeFile(join(vault(), `Note ${n}.md`), `---\ntitle: Note ${n}\nfolder: Research ${i % 100}\ntags: ["research"]\npinned: ${i % 10 === 0}\nupdated: "2026-11-01T12:00:00Z"\n---\n${'Observation from a walk. '.repeat(100)} marker-${n}`)
    }))
  }
  app = await electron.launch({ args: [join(APP, 'out/main/main.js')], cwd: APP, env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' } })
  page = await app.firstWindow()
  page.on('pageerror', error => errors.push(String(error)))
  await page.route(/^https?:/, route => route.abort())
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: /^Gait-feedback/ }).click()
})

test.afterAll(async () => {
  await app?.close()
  if (home !== undefined) await rm(home, { recursive: true, force: true })
})

test('a vague captured idea becomes a reviewed saga, saved and reopened in a large vault', async () => {
  const started = Date.now()
  await page.keyboard.press('Meta+7')
  await expect(page.getByLabel('Title *')).toHaveValue(/^Note /)
  const opened = Date.now() - started
  process.stdout.write(`Open 4,999-note vault: ${opened} ms\n`)
  expect(opened).toBeLessThan(5000)
  const capture = page.getByLabel('Jot an idea')
  await capture.fill(TITLE)
  await capture.press('Meta+Enter')
  await expect(page.getByLabel('Title *')).toHaveValue(TITLE)
  await page.getByRole('combobox', { name: 'Note' }).fill(BODY)
  await page.getByRole('button', { name: 'Turn into quests…' }).click()
  const sheet = page.getByRole('dialog', { name: `Turn ${TITLE} into quests` })
  await expect(sheet.getByLabel('Parent quest *')).toHaveValue(TITLE)
  expect((await record()).tasks).toEqual([])
  await sheet.getByLabel('Parent quest *').fill('Understand missed steps')
  await sheet.getByLabel('Quest 1 title *').fill('Reproduce a missed step on a short walk')
  await sheet.getByLabel('Quest 1 priority').selectOption('high')
  await sheet.getByLabel('Quest 2 difficulty').selectOption('hard')
  await sheet.getByRole('button', { name: 'File 3 quests' }).click()
  await expect(sheet).toBeHidden({ timeout: 15_000 })
  const tasks = (await record()).tasks
  expect(tasks.map(task => task.title)).toEqual(['Understand missed steps', 'Reproduce a missed step on a short walk', 'Compare sensor recordings'])
  expect(tasks.slice(1).map(task => task.parentIds)).toEqual([[tasks[0]!.id], [tasks[0]!.id]])
  expect(tasks[1]!.priority).toBe('high')
  expect(tasks[2]!.difficulty.expected).toBe('hard')
  expect(tasks[1]!.description).toBe(`From the note "${TITLE}" in Notes.`)
  const names = (await readdir(vault())).filter(name => name.endsWith('.md'))
  expect(names).toHaveLength(5000)
  const text = await readFile(join(vault(), names.find(name => name.startsWith('n-'))!), 'utf8')
  expect(text).toContain(BODY)
  for (const task of tasks) expect(text).toContain(task.id)
  const about = page.getByRole('complementary', { name: 'About this note' })
  await about.getByRole('button', { name: 'Open Compare sensor recordings in Quests' }).click()
  await expect(page.getByRole('complementary', { name: 'Quest details' }).getByRole('heading', { name: 'Compare sensor recordings' })).toBeVisible()
  await page.reload()
  await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Notes', exact: true }).click()
  await page.getByLabel('Search notes').fill('Maybe missed')
  await page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: new RegExp(`^${TITLE}`) }).click()
  await expect(page.getByRole('combobox', { name: 'Note' })).toHaveValue(BODY)
  await expect(about.getByRole('button', { name: 'Open Compare sensor recordings in Quests' })).toBeVisible()
  await page.getByRole('button', { name: 'Turn into quests…' }).click()
  await expect(sheet.getByRole('button', { name: /^File / })).toBeHidden()
  await sheet.getByRole('button', { name: 'Close', exact: true }).click()
  expect((await record()).tasks).toHaveLength(3)
})

test('pages and searches all 5,000 notes within the browser budgets, including the narrow drawer', async () => {
  const search = page.getByLabel('Search notes')
  const list = page.getByRole('navigation', { name: 'Notes' })
  await search.fill('')
  await expect(list.locator('.nt-item')).toHaveCount(100)
  await expect(list.getByRole('button', { name: 'Next notes' })).toBeInViewport()
  const started = Date.now()
  await list.getByRole('button', { name: 'Next notes' }).click()
  await expect(list.getByText('Page 2 of 50')).toBeVisible()
  await expect(list.getByRole('button', { name: 'Previous notes' })).toBeInViewport()
  await expect(list.locator('.nt-item').first()).toBeFocused()
  const paged = Date.now() - started
  expect(paged).toBeLessThan(1000)
  const times: number[] = []
  for (const query of ['marker-04998', '#res marker-04997', 'NOTE 04996 observation']) {
    const at = Date.now()
    await search.fill(query)
    await expect(list.locator('.nt-item')).toHaveCount(1)
    await expect(list.locator('.nt-item')).toContainText(query.includes('04998') ? 'Note 04998' : query.includes('04997') ? 'Note 04997' : 'Note 04996')
    times.push(Date.now() - at)
  }
  expect(Math.max(...times)).toBeLessThan(1000)
  process.stdout.write(`5,000 notes: page ${paged} ms; searches ${times.join(', ')} ms\n`)
  await search.fill('')
  await expect(list.getByText('Page 1 of 50')).toBeVisible()
  await page.screenshot({ path: test.info().outputPath('notes-paging-wide.png') })
  await page.setViewportSize({ width: 760, height: 900 })
  await page.getByRole('button', { name: 'Notes', exact: true }).click()
  await list.getByRole('button', { name: 'Next notes' }).click()
  await expect(list.getByText('Page 2 of 50')).toBeVisible()
  await expect(list.getByRole('button', { name: 'Next notes' })).toBeInViewport()
  expect(await list.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
  await page.screenshot({ path: test.info().outputPath('notes-paging-narrow.png') })
  await list.locator('.nt-item').first().press('Enter')
  await expect(search).toBeHidden()
  expect(errors).toEqual([])
})
