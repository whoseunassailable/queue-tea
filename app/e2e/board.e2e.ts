import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import type { ProjectRecord, Task } from '../../types'

const APP = join(__dirname, '..')
const KEY = 'demo-abc123'
const SHOTS = process.env.QUEUE_TEA_SHOTS
const run = promisify(execFile)

let home: string
let repo: string
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

const git = async (...args: string[]) => (await run('git', args, { cwd: repo })).stdout.trim()
const onDisk = async (): Promise<ProjectRecord> => JSON.parse(await readFile(file, 'utf8'))
const stored = async (id: string) => (await onDisk()).tasks.find(t => t.id === id)!
const change = async (edit: (record: ProjectRecord) => ProjectRecord) => writeFile(file, JSON.stringify(edit(await onDisk()), null, 2))
const titles = () => page.locator('.board-list .qc-title')
const row = (title: string) => page.locator('.board-list .qrow').filter({ has: page.getByText(title, { exact: true }) })
const search = () => page.getByRole('searchbox', { name: 'Search quests' })
const shot = async (name: string) => {
  if (SHOTS !== undefined) await page.screenshot({ path: join(SHOTS, `${name}.png`) })
}

test.beforeAll(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-board-')))
  repo = join(home, 'demo')
  file = join(home, '.queue-tea/projects', `${KEY}.json`)
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await mkdir(repo)
  await git('init', '-b', 'main')
  await git('config', 'user.email', 'test@example.com')
  await git('config', 'user.name', 'Test')
  await writeFile(join(repo, 'a.txt'), 'a\n')
  await git('add', '.')
  await git('commit', '-m', 'first')
  await git('branch', 'task/mine')
  const seed: ProjectRecord = {
    version: 1,
    project: { name: 'Demo realm', path: repo },
    docsLogPath: null,
    playNext: null,
    feature: null,
    tasks: [
      task({ id: 'long', title: 'A long hard quest', priority: 'urgent', difficulty: { expected: 'hard', actual: null } }),
      task({ id: 'short', title: 'A short light quest', priority: 'low', difficulty: { expected: 'light', actual: null }, branch: 'task/needle' }),
      task({ id: 'saga', title: 'The saga', priority: 'low' }),
      task({ id: 'hay', title: 'Hay', priority: 'low', parentId: 'saga' }),
      task({ id: 'pin', title: 'Pin', priority: 'low', parentId: 'saga' }),
    ],
    unassignedMinutesByDay: {},
    requests: [],
  }
  await writeFile(file, JSON.stringify(seed, null, 2))
  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  await page.getByRole('link', { name: 'Quests' }).click()
  await expect(titles().first()).toHaveText('A long hard quest')
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('search narrows the board, marks the match and keeps a saga for its chapter', async () => {
  await page.keyboard.press('Meta+f')
  await expect(search()).toBeFocused()

  await page.keyboard.type('pin')

  await expect(titles()).toHaveText(['The saga', 'Pin'])
  await expect(page.locator('.board-list mark')).toHaveText('Pin')
  await shot('search')

  await page.keyboard.press('Escape')

  await expect(search()).toHaveValue('')
  await expect(titles().first()).toHaveText('A long hard quest')
})

test('a search with no match says so, and clears', async () => {
  await search().fill('zebra')

  await expect(page.getByText('No quests match "zebra".')).toBeVisible()
  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(titles().first()).toHaveText('A long hard quest')
})

test('filters combine, and clear', async () => {
  await page.getByRole('button', { name: 'Filters' }).click()
  await page.getByRole('checkbox', { name: 'Light' }).check()

  await expect(titles()).toHaveText(['A short light quest'])
  await page.getByRole('button', { name: 'Clear all' }).click()
  await page.getByRole('button', { name: 'Filters' }).click()
  await expect(titles().first()).toHaveText('A long hard quest')
})

test('Time I have changes the ★, keeps it through an edit, and writes nothing', async () => {
  const before = await readFile(file, 'utf8')
  ;(await page.evaluateHandle(() => document.activeElement as HTMLElement)).asElement()?.evaluate(el => (el as HTMLElement).blur())

  await page.keyboard.press('t')

  await expect(page.getByRole('button', { name: 'Time I have: 30m. Change it' })).toBeVisible()
  await expect(row('A short light quest').locator('.qr-mark')).toHaveText('★')
  expect(await readFile(file, 'utf8')).toBe(before)

  await row('A long hard quest').locator('.qrow-open').click()
  await page.keyboard.press('2')

  await expect.poll(async () => (await stored('long')).priority).toBe('high')
  await page.waitForTimeout(400)
  await expect(row('A short light quest').locator('.qr-mark')).toHaveText('★')

  for (let i = 0; i < 3; i += 1) await page.keyboard.press('t')
  await expect(page.getByRole('button', { name: 'Time I have: any. Change it' })).toBeVisible()
})

test('dragging a quest onto a saga asks first, then moves it', async () => {
  await row('A short light quest').dragTo(row('The saga'))

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('A short light quest moves to The saga.', { exact: false })).toBeVisible()
  expect((await stored('short')).parentId).toBeNull()
  await shot('drag-move')

  await dialog.getByRole('button', { name: 'Move' }).click()

  await expect(dialog).toBeHidden()
  await expect.poll(async () => (await stored('short')).parentId).toBe('saga')
})

test('a drop the engine refuses shows its sentence, and moves nothing', async () => {
  await row('A long hard quest').dragTo(row('Hay'))

  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Move' }).click()

  await expect(dialog.locator('.field-error')).toBeVisible()
  expect((await stored('long')).parentId).toBeNull()
  await page.keyboard.press('Escape')
})

test('Home says when the quest\'s branch isn\'t checked out, and Switch fixes it', async () => {
  await change(r => ({ ...r, tasks: r.tasks.map(t => (t.id === 'long' ? { ...t, state: 'current', branch: 'task/mine', baseBranch: 'main' } : t)) }))
  await page.getByRole('link', { name: 'Home', exact: true }).click()

  await expect(page.getByText("You're on main, not task/mine")).toBeVisible()
  await page.waitForTimeout(100)
  await shot('branch-mismatch')

  await page.keyboard.press('w')

  await expect(page.getByText('Switched to task/mine')).toBeVisible()
  await expect(page.getByText("You're on main, not task/mine")).toBeHidden()
  expect(await git('branch', '--show-current')).toBe('task/mine')
})

test('the quest in hand opens in full, with what git says', async () => {
  await writeFile(join(repo, 'a.txt'), 'changed\n')
  await page.getByRole('link', { name: 'Quests' }).click()

  await page.getByRole('button', { name: 'Show the details of A long hard quest' }).click()

  const pane = page.getByRole('complementary', { name: 'Quest details' })
  await expect(pane.getByRole('heading', { name: 'A long hard quest' })).toBeVisible()
  await expect(pane).toContainText('first')
  await expect(pane.getByText('1 file not committed')).toBeVisible()
  await page.waitForTimeout(100)
  await shot('active-detail')

  await git('checkout', '--', 'a.txt')
  await page.getByRole('link', { name: 'Home', exact: true }).click()
})

test('the commit warning from a session shows, and OK puts it away', async () => {
  await writeFile(join(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: repo, recordFile: file, currentTaskId: 'long', isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: Date.now(), startedAt: Date.now(), warning: 'During the last turn a commit appeared: 1a2b3c4 tweak.' }))

  await expect(page.getByText('During the last turn a commit appeared: 1a2b3c4 tweak.')).toBeVisible()
  await page.getByRole('button', { name: 'OK' }).click()

  await expect(page.getByText('During the last turn a commit appeared: 1a2b3c4 tweak.')).toBeHidden()
})
