import { mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import { emptyRecord, projectKey } from '../../hooks/shared/records/data/datasources/record_source'

const APP = join(__dirname, '..')
const SHOTS = process.env.QUEUE_TEA_SHOTS

let home: string
let folder: string
let realm: string
let file: string
let app: ElectronApplication
let page: Page

const shot = async (name: string) => {
  if (SHOTS !== undefined) await page.screenshot({ path: join(SHOTS, `${name}.png`) })
}
const toast = (text: string | RegExp) => page.locator('.toast-item').filter({ hasText: text })
const saved = async () => JSON.parse(await readFile(join(home, 'user-data/settings.json'), 'utf8'))

test.beforeAll(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-settings-')))
  folder = join(home, '.queue-tea/projects')
  realm = join(home, 'my realm')
  file = join(folder, `${projectKey(realm)}.json`)
  await mkdir(folder, { recursive: true })
  await mkdir(realm)
  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('with no realms it welcomes you', async () => {
  await expect(page.getByRole('heading', { name: 'Welcome to Queue-tea' })).toBeVisible()
  await expect(page.getByText('No realms yet')).toBeVisible()
  await shot('first-run')
})

test('Open folder asks first, then adds the realm and writes nothing in the folder', async () => {
  // The dialog is the operating system's, so only it stands in for itself.
  await app.evaluate(({ dialog }, path) => {
    dialog.showOpenDialog = (async () => ({ canceled: false, filePaths: [path] })) as typeof dialog.showOpenDialog
  }, realm)

  await page.getByRole('button', { name: 'Open folder…' }).click()

  const asked = page.getByRole('dialog')
  await expect(asked.getByText("my realm isn't in Queue-tea yet.")).toBeVisible()
  await expect(asked.getByText('Not a git repository, so no branches are made')).toBeVisible()
  expect(await readdir(folder)).toEqual([])

  await asked.getByRole('button', { name: 'Add realm' }).click()

  await expect(asked).toBeHidden()
  await expect(page.getByRole('button', { name: /^my realm/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'No active quest' })).toBeVisible()
  expect(JSON.parse(await readFile(file, 'utf8')).project).toEqual({ name: 'my realm', path: realm })
  expect(await readdir(realm)).toEqual([])
})

test('Open folder on a realm it knows goes there, and adds nothing', async () => {
  const before = await readdir(folder)

  await page.keyboard.press('Meta+o')

  await expect(page.getByRole('dialog')).toBeHidden()
  expect(await readdir(folder)).toEqual(before)
})

test('Settings shows at once and is remembered', async () => {
  await page.keyboard.press('Meta+,')
  await expect(page.getByRole('heading', { name: 'Sky and motion' })).toBeVisible()

  await page.getByRole('switch', { name: 'Calm mode' }).click()

  await expect(page.locator('[data-testid="root"]')).toHaveClass(/calm/)
  await expect.poll(async () => (await saved()).isCalm).toBe(true)

  await page.getByRole('button', { name: 'iTerm2' }).click()
  await expect.poll(async () => (await saved()).terminal).toBe('iterm')
  await page.waitForTimeout(100)
  await shot('settings')
})

test('the task log path is checked, then saved', async () => {
  await page.getByRole('button', { name: 'Set now… my realm' }).click()
  const dialog = page.getByRole('dialog')
  const field = dialog.getByLabel('Task log path *')
  await expect(field).toHaveValue('docs/task_log.md')

  await field.fill('docs/')
  await field.blur()
  await expect(dialog.getByText('Enter a file path, such as docs/task_log.md.')).toBeVisible()
  await dialog.getByRole('button', { name: 'Save' }).click()
  expect(JSON.parse(await readFile(file, 'utf8')).docsLogPath).toBeNull()

  await field.fill('notes/log.md')
  await dialog.getByRole('button', { name: 'Save' }).click()

  await expect(dialog).toBeHidden()
  await expect(page.getByText('notes/log.md')).toBeVisible()
  expect(JSON.parse(await readFile(file, 'utf8')).docsLogPath).toBe('notes/log.md')
})

test('switched off, the single-letter keys do nothing', async () => {
  await page.getByRole('switch', { name: 'Single-key shortcuts in lists' }).click()
  await expect.poll(async () => (await saved()).letterKeys).toBe(false)
  await writeFile(file, JSON.stringify({ ...JSON.parse(await readFile(file, 'utf8')), tasks: [] }, null, 2))

  await page.getByRole('link', { name: 'Quests' }).click()
  await page.keyboard.press('Meta+n')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')

  await page.getByRole('link', { name: 'Settings' }).click()
  await page.getByRole('switch', { name: 'Single-key shortcuts in lists' }).click()
  await expect.poll(async () => (await saved()).letterKeys).toBe(true)
})

test('a broken record says why, and the last good copy puts it right', async () => {
  const good = await readFile(file, 'utf8')
  await writeFile(`${file}.bak`, good)
  await writeFile(file, '{ not json')

  await page.getByRole('link', { name: 'Home', exact: true }).click()

  await expect(page.getByRole('heading', { name: "Couldn't read your task record" })).toBeVisible()
  await expect(page.getByText(/^It isn't valid JSON/)).toBeVisible()
  await expect(page.getByText('Nothing can start or change in my realm until its record reads.', { exact: false })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Sections' }).getByRole('link')).toHaveCount(0)
  await page.waitForTimeout(100)
  await shot('failed-record')

  await page.keyboard.press('l')

  await expect(toast(/Back to the last good copy/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'No active quest' })).toBeVisible()
  expect(JSON.parse(await readFile(file, 'utf8')).project.name).toBe('my realm')
  const broken = (await readdir(folder)).find(name => name.includes('.broken-'))
  expect(await readFile(join(folder, broken!), 'utf8')).toBe('{ not json')
})

test('a record from a newer Queue-tea is left alone, with no copy offered', async () => {
  const newer = JSON.stringify({ version: 2, future: 'work' })
  await writeFile(file, newer)

  await expect(page.getByText(/written by a newer Queue-tea/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Use the last good copy' })).toBeHidden()
  await page.keyboard.press('l')
  await page.waitForTimeout(100)

  expect(await readFile(file, 'utf8')).toBe(newer)
  await writeFile(file, JSON.stringify(emptyRecord('my realm', realm)))
})
