import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import type { ProjectRecord, Task } from '../../types'

const APP = join(__dirname, '..')
const KEY = 'demo-abc123'
const SHOTS = process.env.QUEUE_TEA_SHOTS

let home: string
let file: string
let app: ElectronApplication
let page: Page

const task = (over: Partial<Task> & { id: string; title: string }): Task =>
  ({
    state: 'queued',
    priority: 'mid',
    difficulty: { expected: 'medium', actual: null },
    messages: [],
    handoff: null,
    branch: null,
    baseBranch: null,
    startCommit: null,
    blockedBy: [],
    blockedReason: null,
    checkpoint: null,
    created: '2026-10-20T09:00:00+02:00',
    started: null,
    finished: null,
    minutesByDay: {},
    effort: { understandingMessages: 0, improvingMessages: 0, filesRead: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, filesTouched: 0 },
    files: { read: [], changed: [] },
    parentId: null,
    description: null,
    criteria: [],
    review: null,
    ...over,
  }) as Task

const SEED: ProjectRecord = {
  version: 1,
  project: { name: 'Demo realm', path: '/p/demo' },
  docsLogPath: null,
  playNext: null,
  feature: null,
  tasks: [
    task({ id: 'one', title: 'First quest', priority: 'high' }),
    task({ id: 'two', title: 'Second quest', priority: 'low' }),
    task({ id: 'saga', title: 'The saga', priority: 'low', created: '2026-10-21T09:00:00+02:00' }),
    task({ id: 'chapter', title: 'A chapter', priority: 'low', parentId: 'saga', created: '2026-10-22T09:00:00+02:00' }),
  ],
  unassignedMinutesByDay: {},
  requests: [],
}

const onDisk = async (): Promise<ProjectRecord> => JSON.parse(await readFile(file, 'utf8'))
const stored = async (id: string) => (await onDisk()).tasks.find(t => t.id === id)!
const titled = async (title: string) => (await onDisk()).tasks.find(t => t.title === title)
// The exact title, and no wait after it: a key pressed straight away has to
// act on this row and not the one before it.
const pickRow = (title: string) => page.locator('.qrow-open').filter({ has: page.getByText(title, { exact: true }) }).click()
const dialog = () => page.getByRole('dialog')
const toast = (text: string | RegExp) => page.locator('.toast-item').filter({ hasText: text })

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-edits-'))
  file = join(home, '.queue-tea/projects', `${KEY}.json`)
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await writeFile(file, JSON.stringify(SEED, null, 2))
  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  await page.getByRole('link', { name: 'Quests', exact: true }).click()
  await expect(page.locator('.board-list .qc-title').first()).toHaveText('First quest')
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('a priority shows at once, and reaches the record within 300 ms', async () => {
  const row = page.locator('.qrow').filter({ hasText: 'Second quest' })
  await row.getByRole('button', { name: /Priority of Second quest/ }).click()
  const started = Date.now()
  await page.getByRole('menuitemradio', { name: /Urgent/ }).click()

  await expect(row.getByRole('button', { name: /Priority of Second quest/ })).toContainText('Urgent')
  await expect.poll(async () => (await stored('two')).priority, { intervals: [5], timeout: 2_000 }).toBe('urgent')
  expect(Date.now() - started).toBeLessThan(300)

  // Main's answer brings the board's real order.
  await expect(page.locator('.board-list .qc-title').first()).toHaveText('Second quest')
  await expect(toast('Priority: Low → Urgent')).toBeVisible()
})

test('⌘Z puts it back', async () => {
  await page.keyboard.press('Meta+z')

  await expect.poll(async () => (await stored('two')).priority).toBe('low')
  await expect(page.locator('.board-list .qc-title').first()).toHaveText('First quest')
})

test('the number keys set the priority of the quest in the detail pane', async () => {
  await pickRow('Second quest')
  await page.keyboard.press('2')

  await expect.poll(async () => (await stored('two')).priority).toBe('high')
})

test('New quest checks its fields, files the quest, and never starts it', async () => {
  await page.getByRole('button', { name: 'New quest', exact: true }).first().click()
  await expect(dialog()).toBeVisible()
  await dialog().getByRole('button', { name: 'Add to the board' }).click()
  await expect(dialog().getByText('Title is required.')).toBeVisible()
  expect(await titled('Filed from the app')).toBeUndefined()

  await dialog().getByLabel('Title *').fill('Filed from the app')
  await dialog().getByRole('radio', { name: 'Urgent' }).check()
  await dialog().getByRole('button', { name: 'Add to the board' }).click()
  await expect(dialog()).toBeHidden()

  await expect(page.locator('.qrow').filter({ hasText: 'Filed from the app' })).toBeVisible()
  expect(await titled('Filed from the app')).toMatchObject({ state: 'queued', priority: 'urgent', started: null, branch: null, parentId: null })
})

test('a chapter goes in under its saga, inline', async () => {
  await page.getByRole('button', { name: '+ Add a chapter' }).click()
  await page.getByLabel('Part of The saga').fill('Filed under the saga')
  await page.keyboard.press('Enter')

  await expect(page.locator('.qrow.child').filter({ hasText: 'Filed under the saga' })).toBeVisible()
  expect((await titled('Filed under the saga'))?.parentId).toBe('saga')
})

test('sagas fold, and the fold stays', async () => {
  await page.getByRole('button', { name: 'Fold The saga' }).click()
  await expect(page.locator('.qrow').filter({ hasText: 'A chapter' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Unfold The saga' }).click()
  await expect(page.locator('.qrow').filter({ hasText: 'A chapter' })).toBeVisible()
})

test('seal with a reason, then unseal', async () => {
  await pickRow('First quest')
  await page.keyboard.press('k')
  await dialog().getByLabel('Or a reason').fill('waiting for the clinic')
  await dialog().getByRole('button', { name: 'Seal', exact: true }).click()
  await expect(dialog()).toBeHidden()

  await expect(page.locator('.fold .qrow.sealed')).toContainText('waiting for the clinic')
  expect((await stored('one')).blockedReason).toBe('waiting for the clinic')

  await page.locator('.fold .qrow.sealed .qrow-open').click()
  await page.getByRole('button', { name: 'Unseal' }).click()
  await expect.poll(async () => (await stored('one')).blockedReason).toBe(null)
})

test('Part of asks first, then moves the quest', async () => {
  await pickRow('Second quest')
  await page.keyboard.press('p')
  await dialog().getByRole('radio', { name: /The saga/ }).check()
  await expect(dialog().getByText('Its priority, branch and time stay as they are.')).toBeVisible()
  await dialog().getByRole('button', { name: 'Move' }).click()
  await expect(dialog()).toBeHidden()

  await expect.poll(async () => (await stored('two')).parentId).toBe('saga')
  await expect(page.locator('.qrow.child').filter({ hasText: 'Second quest' })).toBeVisible()
})

test('a plain quest is removed at once, and Undo brings it back', async () => {
  await pickRow('Filed under the saga')
  await page.keyboard.press('x')
  await expect(page.locator('.qrow').filter({ hasText: 'Filed under the saga' })).toHaveCount(0)
  expect((await titled('Filed under the saga'))?.state).toBe('removed')

  await toast(/Removed/).getByRole('button', { name: 'Undo' }).click()

  await expect(page.locator('.qrow').filter({ hasText: 'Filed under the saga' })).toBeVisible()
  expect((await titled('Filed under the saga'))?.state).toBe('queued')
})

test('a saga asks before it goes', async () => {
  await pickRow('The saga')
  await page.keyboard.press('x')
  await expect(dialog().getByText(/stay on the board/)).toBeVisible()
  expect((await stored('saga')).state).toBe('queued')

  await page.keyboard.press('Escape')
  await expect(dialog()).toBeHidden()
})

test('letters type into the title and do nothing else', async () => {
  await pickRow('First quest')
  await page.locator('.detail .title-btn').click()
  const box = page.locator('.detail').getByLabel('Title *')
  await box.fill('')
  await box.pressSequentially('kfux12')
  await box.press('Enter')

  await expect.poll(async () => (await stored('one')).title).toBe('kfux12')
  expect(await stored('one')).toMatchObject({ priority: 'high', blockedReason: null })
  await expect(dialog()).toHaveCount(0)
})

test('the detail pane keeps a description and criteria', async () => {
  await page.getByRole('textbox', { name: 'Description' }).fill('Why it matters')
  await page.getByRole('textbox', { name: 'Add a criterion' }).fill('It passes')
  await page.keyboard.press('Enter')

  await expect.poll(async () => (await stored('one')).criteria).toEqual(['It passes'])
  expect((await stored('one')).description).toBe('Why it matters')
})

test('every edit left a record the mod can read, with a good copy beside it', async () => {
  const record = await onDisk()

  expect(record.version).toBe(2)
  expect(Array.isArray(record.requests)).toBe(true)
  expect(JSON.parse(await readFile(`${file}.bak`, 'utf8')).version).toBe(2)
})

test('the sheet, for looking at', async () => {
  test.skip(SHOTS === undefined, 'only when QUEUE_TEA_SHOTS names a folder')
  await page.getByRole('button', { name: 'Day sky' }).click()
  await page.getByRole('button', { name: 'New quest', exact: true }).first().click()
  await dialog().getByRole('button', { name: 'Add to the board' }).click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: join(SHOTS!, 'new-quest.png') })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  await page.screenshot({ path: join(SHOTS!, 'board-edits.png') })
})

test('a record that breaks mid-session reverts the chip, says why, and stays as it is', async () => {
  const good = await readFile(file, 'utf8')
  await pickRow('The saga')
  const before = await page.locator('.detail').getByRole('button', { name: /Priority of The saga/ }).textContent()
  await writeFile(file, '{half a record')

  await page.keyboard.press('1')

  await expect(toast("This realm's record can't be read, so nothing was changed.")).toBeVisible()
  expect(await readFile(file, 'utf8')).toBe('{half a record')
  await expect(page.getByText("This realm's record can't be read").first()).toBeVisible()
  expect(before).toContain('Low')

  await writeFile(file, good)
  await expect(page.locator('.board-list')).toBeVisible({ timeout: 10_000 })
})
