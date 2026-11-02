import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import type { ProjectRecord, Task } from '../../types'

const APP = join(__dirname, '..')
const SHOTS = process.env.QUEUE_TEA_SHOTS
const DAY_MS = 86_400_000

let home: string
let app: ElectronApplication
let page: Page

const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10)
const TODAY = iso(Date.now() - new Date().getTimezoneOffset() * 60_000)

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

const record = (name: string, tasks: Task[], unassigned: Record<string, number> = {}): ProjectRecord => ({
  version: 1,
  project: { name, path: `/p/${name}` },
  docsLogPath: null,
  playNext: null,
  feature: null,
  tasks,
  unassignedMinutesByDay: unassigned,
  requests: [],
})

const won = (id: string, title: string, day: string, over: Partial<Task> = {}): Task =>
  task({ id, title, state: 'done', finished: `${day}T12:00:00+01:00`, difficulty: { expected: 'medium', actual: 'hard' }, minutesByDay: { [day]: 45 }, ...over })

const shot = async (name: string) => {
  if (SHOTS !== undefined) await page.screenshot({ path: join(SHOTS, `${name}.png`) })
}

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-pages-'))
  const folder = join(home, '.queue-tea/projects')
  await mkdir(folder, { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await writeFile(
    join(folder, 'alpha-abc123.json'),
    JSON.stringify(
      record(
        'alpha',
        [
          won('a1', 'Won this week', TODAY),
          won('a2', 'Won last week', iso(Date.parse(TODAY) - 7 * DAY_MS), { priority: 'urgent', difficulty: { expected: 'hard', actual: 'hard' } }),
          task({ id: 'a3', title: 'The boss', state: 'current', priority: 'urgent', minutesByDay: { [TODAY]: 20 } }),
        ],
        { [TODAY]: 30 },
      ),
    ),
  )
  await writeFile(join(folder, 'beta-def456.json'), JSON.stringify(record('beta', [task({ id: 'b1', title: 'Nothing won here' })])))
  await writeFile(join(folder, 'broken-fed321.json'), '{ not json')
  await writeFile(join(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: '/p/alpha', recordFile: 'x', currentTaskId: 'a3', isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: { percent: 62, resetsAt: null }, options: { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 }, heartbeat: Date.now(), startedAt: Date.now() }))

  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  await page.getByRole('button', { name: /^alpha/ }).click()
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('Chronicle shows the week, and goes back to the last', async () => {
  await page.keyboard.press('Meta+3')

  await expect(page.getByRole('heading', { name: 'Chronicle' })).toBeVisible()
  await expect(page.locator('.summary')).toContainText('1 victory')
  await expect(page.locator('.summary')).toContainText('+50 XP')
  await expect(page.locator('.tbl')).toContainText('Won this week')
  await expect(page.locator('.tbl')).not.toContainText('Won last week')
  await page.waitForTimeout(200)
  await shot('chronicle')

  await page.getByRole('button', { name: 'Earlier week' }).click()

  await expect(page.locator('.tbl')).toContainText('Won last week')
  await expect(page.locator('.tbl')).not.toContainText('Won this week')
})

test('All realms is remembered, and says what it left out', async () => {
  await page.getByRole('button', { name: 'All realms' }).click()

  await expect(page.getByText("1 realm can't be read, so it's left out.")).toBeVisible()
  await expect.poll(async () => JSON.parse(await readFile(join(home, 'user-data/settings.json'), 'utf8')).chronicleScope).toBe('all')
})

test('a row opens with what it took', async () => {
  await page.getByRole('button', { name: 'Open Won last week' }).click()

  await expect(page.getByRole('region', { name: 'Won last week' }).getByRole('button', { name: 'File a follow-up…' })).toBeVisible()
})

test('Mana & time shows the orb, the week and the boss', async () => {
  await page.keyboard.press('Meta+4')

  await expect(page.getByRole('img', { name: '38% of the 5-hour allowance left' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'The boss quest so far' })).toBeVisible()
  await expect(page.getByText('Elsewhere, not on a quest')).toBeVisible()
  await page.waitForTimeout(200)
  await shot('mana')
})

test('the Hoard counts every realm that reads', async () => {
  await page.getByRole('link', { name: 'Hoard' }).click()

  await expect(page.getByText('alpha · 2 victories')).toBeVisible()
  await expect(page.getByText('beta · 0 victories')).toBeVisible()
  await expect(page.getByText('0 gold', { exact: true })).toBeVisible()
  await expect(page.getByText("1 realm can't be read, so it's left out.")).toBeVisible()
  await page.waitForTimeout(200)
  await shot('hoard')
})

test('the Guild Hall shows the four helpers with their logos', async () => {
  await page.getByRole('link', { name: 'Guild Hall' }).click()

  await expect(page.locator('.member')).toHaveCount(4)
  for (const img of await page.locator('.portrait img').all()) {
    expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
  }
  expect(await page.locator('.guild-h img').evaluate((el: HTMLImageElement) => el.naturalWidth > 0)).toBe(true)
  await shot('guild')

  await page.getByRole('button', { name: 'Copy the @-mention for Tea-DD' }).click()

  await expect.poll(() => app.evaluate(({ clipboard }) => clipboard.readText())).toBe('@queue-tea:tea-dd')
})
