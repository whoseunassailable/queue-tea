import { cp, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import type { Task } from '../../types'

const APP = join(__dirname, '..')
const KEY = 'demo-abc123'
// QUEUE_TEA_SHOTS names a folder for the four skies; QUEUE_TEA_REAL_COPY a
// folder of record copies to look at instead of the fixture.
const SHOTS = process.env.QUEUE_TEA_SHOTS
const REAL_COPY = process.env.QUEUE_TEA_REAL_COPY

let home: string
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
    ...over,
  }) as Task

const record = (tasks: Task[]) => ({
  version: 1,
  project: { name: 'Demo realm', path: '/p/demo' },
  docsLogPath: null,
  playNext: null,
  feature: null,
  tasks,
  unassignedMinutesByDay: {},
})

const FIRST = [
  task({ id: 'now', title: 'Finish the insole bridge', state: 'current', priority: 'urgent', branch: 'task/bridge', started: '2026-10-20T22:17:00+02:00', minutesByDay: { '2026-10-20': 43 }, difficulty: { expected: 'hard', actual: null } }),
  task({ id: 'docs', title: 'Fix the documentation', priority: 'urgent' }),
  task({ id: 'cut', title: 'Fix cut-off text in diagrams', priority: 'high' }),
  task({ id: 'stuck', title: 'Analyse new recordings', blockedReason: 'waiting for the clinic' }),
  task({ id: 'won', title: 'Correct the privacy claims', state: 'done', finished: '2026-10-20T11:00:00+02:00', difficulty: { expected: 'medium', actual: 'medium' } }),
]

const recordFile = () => join(home, '.queue-tea/projects', `${KEY}.json`)

// The way the engine writes: a temp file swapped over the record.
const replaceRecord = async (tasks: Task[]) => {
  await writeFile(`${recordFile()}.tmp`, JSON.stringify(record(tasks)))
  await rename(`${recordFile()}.tmp`, recordFile())
}

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-e2e-'))
  const projects = join(home, '.queue-tea/projects')
  await mkdir(projects, { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  if (REAL_COPY !== undefined) await cp(REAL_COPY, projects, { recursive: true })
  await writeFile(recordFile(), JSON.stringify(record(FIRST)))
  await writeFile(join(projects, `${KEY}.json.bak`), '{}')
  await writeFile(join(projects, '.brew-repro-tmp-2d9b32.json'), JSON.stringify(record([])))
  await writeFile(
    join(home, '.queue-tea/sessions/s-1.json'),
    JSON.stringify({ id: 's-1', projectPath: '/p/demo', recordFile: recordFile(), currentTaskId: 'now', isTurnRunning: true, cup: { mood: 'working', line: '' }, allowance: { percent: 62, resetsAt: null }, options: {}, heartbeat: Date.now(), startedAt: Date.now() }),
  )
  await writeFile(join(home, 'settings.json'), '{}')

  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  page.on('pageerror', err => {
    throw err
  })
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('the window opens at its size, on its own, with the engine out of reach', async () => {
  expect(await page.title()).toBe('Queue-tea')
  const size = await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]!.getSize())
  expect(size).toEqual([1280, 800])
  expect(await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]!.getMinimumSize())).toEqual([720, 560])
  expect(await page.evaluate(() => typeof (window as unknown as { require?: unknown }).require)).toBe('undefined')
  expect(await page.evaluate(() => typeof (window as unknown as { process?: unknown }).process)).toBe('undefined')
})

test('the sidebar lists the realm and hides the dot-file', async () => {
  await expect(page.locator('.realm').filter({ hasText: 'Demo realm' })).toBeVisible()
  await expect(page.locator('.realm').filter({ hasText: 'brew-repro' })).toHaveCount(0)
})

test('Home shows the record, the session and the game', async () => {
  await page.locator('.realm').filter({ hasText: 'Demo realm' }).click()
  await expect(page.getByRole('heading', { name: 'Finish the insole bridge' })).toBeVisible()
  await expect(page.locator('.rm')).toHaveClass(/m-working/)
  await expect(page.getByText('Claude Code is working on it')).toBeVisible()
  await expect(page.getByText('Fix the documentation')).toBeVisible()
  await expect(page.getByText('38% mana')).toBeVisible()
})

test('Quests shows the board, with the sealed quest apart', async () => {
  await page.getByRole('link', { name: 'Quests', exact: true }).click()
  await expect(page.locator('.board-list .qc-title').first()).toHaveText('Fix the documentation')
  await expect(page.locator('.fold .qrow.sealed')).toContainText('waiting for the clinic')
  await page.getByRole('link', { name: 'Home' }).click()
})

test('a change on disk reaches the window', async () => {
  await replaceRecord([...FIRST, task({ id: 'new', title: 'Filed from a session', priority: 'urgent', created: '2026-10-19T09:00:00+02:00' })])

  await expect(page.locator('.board').getByText('Filed from a session')).toBeVisible({ timeout: 8_000 })
})

test('the sky can be fixed, and the panels stay where they are', async () => {
  const panel = page.locator('.board')
  await page.getByRole('button', { name: 'Day sky' }).click()
  await expect(page.locator('.rm')).toHaveClass(/t-day/)
  const before = await panel.boundingBox()

  for (const sky of ['Morning', 'Evening', 'Night', 'Day']) {
    await page.getByRole('button', { name: `${sky} sky` }).click()
    await expect(page.locator('.rm')).toHaveClass(new RegExp(`t-${sky.toLowerCase()}`))
    expect(await panel.boundingBox()).toEqual(before)
  }
})

test('a sky choice is kept in the settings', async () => {
  await page.getByRole('button', { name: 'Night sky' }).click()
  await expect(async () => {
    expect(JSON.parse(await readFile(join(home, 'user-data/settings.json'), 'utf8')).sky).toBe('night')
  }).toPass()
})

test('the four skies, for looking at', async () => {
  test.skip(SHOTS === undefined, 'only when QUEUE_TEA_SHOTS names a folder')
  for (const sky of ['Morning', 'Day', 'Evening', 'Night']) {
    await page.getByRole('button', { name: `${sky} sky` }).click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: join(SHOTS!, `home-${sky.toLowerCase()}.png`) })
  }
  await page.getByRole('link', { name: 'Quests', exact: true }).click()
  await page.getByRole('button', { name: 'Day sky' }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: join(SHOTS!, 'quests-day.png') })
})
