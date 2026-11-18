import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

// The Notes graph end to end, on a realm of 5,000 notes that link to each other.

const APP = join(__dirname, '..')
const KEY = 'gait-abc123'
const COUNT = 5000

let home: string
let app: ElectronApplication
let page: Page
const errors: string[] = []

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-graph-'))
  await mkdir(join(home, 'gait'))
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify({ version: 2, project: { name: 'Gait-feedback', path: join(home, 'gait') }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))
  const dir = join(home, '.queue-tea/notes', KEY)
  await mkdir(dir, { recursive: true })
  await Promise.all(
    Array.from({ length: COUNT }, (_, i) => writeFile(join(dir, `Note ${i}.md`), `---\ntitle: Note ${i}\n---\n[[Note ${(i + 1) % COUNT}]]\n[[Note ${(i * 7) % COUNT}]]`)),
  )

  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  page.on('pageerror', err => errors.push(String(err)))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: /^Gait-feedback/ }).click()
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('Graph shows the notes around the open note', async () => {
  await page.keyboard.press('Meta+7')
  await expect(page.getByLabel('Title *')).toHaveValue(/^Note \d+$/, { timeout: 30_000 })
  await page.keyboard.press('Meta+g')

  await expect(page.getByRole('group', { name: /^Graph around / })).toBeVisible()
})

test('the whole realm of 5,000 notes settles within 3 seconds', async () => {
  const started = Date.now()
  await page.getByRole('button', { name: 'Whole realm' }).click()
  const map = page.getByRole('group', { name: 'Graph of the whole realm: 5,000 notes and 0 quests' })
  await expect(map).toHaveAttribute('aria-busy', 'false', { timeout: 30_000 })
  const took = Date.now() - started
  test.info().annotations.push({ type: 'settled', description: `${took} ms` })

  expect(took).toBeLessThan(3000)
})

test('a node opened from the keyboard opens its note', async () => {
  const before = await page.getByLabel('Title *').inputValue()
  const map = page.getByRole('group', { name: /^Graph of the whole realm/ })
  await expect(map).toHaveAttribute('aria-busy', 'false')
  await map.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')

  await expect(page.getByLabel('Title *')).toHaveValue(/^Note \d+$/)
  await expect(page.getByLabel('Title *')).not.toHaveValue(before)
})

test('the page logged no errors', () => {
  expect(errors).toEqual([])
})
