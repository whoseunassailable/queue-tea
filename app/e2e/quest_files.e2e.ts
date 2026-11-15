import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import type { ProjectRecord, Task } from '../../types'

const APP = join(__dirname, '..')
const KEY = 'quest-files-abc123'
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64')
const SAVED = `attachments/${createHash('sha256').update(PNG).digest('hex')}.png`

let home: string
let file: string
let app: ElectronApplication
let page: Page
const errors: string[] = []

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
  project: { name: 'Quest files', path: '/p/quest-files' },
  docsLogPath: null,
  playNext: null,
  feature: null,
  tasks: [task({ id: 'one', title: 'Retry button', priority: 'high', description: 'Why it matters' })],
  unassignedMinutesByDay: {},
  requests: [],
}

const stored = async () => (JSON.parse(await readFile(file, 'utf8')) as ProjectRecord).tasks[0]!

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-quest-files-'))
  file = join(home, '.queue-tea/projects', `${KEY}.json`)
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await writeFile(file, JSON.stringify(SEED, null, 2))
  app = await electron.launch({ args: [join(APP, 'out/main/main.js')], cwd: APP, env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' } })
  page = await app.firstWindow()
  page.on('pageerror', error => errors.push(String(error)))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('link', { name: 'Quests', exact: true }).click()
  await expect(page.locator('.detail').getByRole('textbox', { name: 'Description' })).toHaveValue('Why it matters')
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test("an image picked for a quest's description is kept in the realm's notes folder, linked in the record, and previewed under the box until its link goes", async () => {
  const detail = page.locator('.detail')
  const box = detail.getByRole('textbox', { name: 'Description' })

  await detail.getByLabel('Attach file…', { exact: true }).setInputFiles({ name: 'mock.png', mimeType: 'image/png', buffer: PNG })

  // Main keeps a description trimmed, and the box shows what main kept.
  await expect(box).toHaveValue(`Why it matters\n![mock.png](<${SAVED}>)`)
  expect((await stored()).description).toBe(`Why it matters\n![mock.png](<${SAVED}>)`)
  const vault = join(home, '.queue-tea/notes', KEY)
  expect(await readdir(join(vault, 'attachments'))).toEqual([SAVED.split('/')[1]])
  expect(await readFile(join(vault, SAVED))).toEqual(PNG)
  const preview = detail.getByAltText('mock.png')
  await expect(preview).toBeVisible()
  // The image came through the notes protocol, not a broken link.
  await expect.poll(() => preview.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(1)

  await box.fill('Why it matters')
  await box.blur()

  await expect(preview).toHaveCount(0)
  await expect.poll(async () => (await stored()).description).toBe('Why it matters')
  expect(errors).toEqual([])
})
