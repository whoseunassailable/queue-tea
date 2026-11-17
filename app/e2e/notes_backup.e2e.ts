import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

// Export notes and Restore from backup end to end: the backup is a real
// folder beside the vault, and restore puts back what went missing.

const APP = join(__dirname, '..')
const KEY = 'backup-abc123'
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64')
const PICTURE = `attachments/${createHash('sha256').update(PNG).digest('hex')}.png`
const PLAN = '---\ntitle: Plan\nupdated: 2026-11-10T09:00:00\n---\nThe plan.\n\n![Diagram](<' + PICTURE + '>)\n'
const WINDOWS = '---\r\ntitle: Windows\r\nupdated: 2026-11-01T09:00:00\r\n---\r\nLine one\r\nLine two\r\n'
const EXPORTED = ['Plan.md', 'Windows.md', PICTURE, 'table.csv']

let home: string
let app: ElectronApplication
let page: Page
const errors: string[] = []
const vault = () => join(home, '.queue-tea/notes', KEY)
const backups = () => join(home, 'Backups')

// The folder picker is the operating system's, so only it stands in for itself.
const pickerAnswers = (path: string) =>
  app.evaluate(({ dialog }, folder) => {
    const asked: string[] = []
    ;(globalThis as { asked?: string[] }).asked = asked
    dialog.showOpenDialog = (async (...args: unknown[]) => {
      asked.push((args.at(-1) as { buttonLabel?: string }).buttonLabel ?? '')

      return { canceled: false, filePaths: [folder] }
    }) as typeof dialog.showOpenDialog
  }, path)
const pickerButtons = () => app.evaluate(() => (globalThis as { asked?: string[] }).asked ?? [])

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-backup-'))
  await mkdir(join(home, 'project'))
  await mkdir(backups())
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(join(vault(), 'attachments'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify({ version: 2, project: { name: 'Backup notes', path: join(home, 'project') }, tasks: [], requests: [] }))
  await writeFile(join(vault(), 'Plan.md'), PLAN)
  await writeFile(join(vault(), 'Windows.md'), WINDOWS)
  await writeFile(join(vault(), PICTURE), PNG)
  await writeFile(join(vault(), 'table.csv'), 'a,b\n1,2\n')
  app = await electron.launch({ args: [join(APP, 'out/main/main.js')], cwd: APP, env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' } })
  page = await app.firstWindow()
  page.on('pageerror', error => errors.push(String(error)))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: /^Backup notes/ }).click()
  await page.keyboard.press('Meta+7')
  await expect(page.getByLabel('Title *')).toHaveValue('Plan')
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('Export notes copies the vault into a new backup folder byte for byte, and Restore puts back what went missing', async ({}, testInfo) => {
  await pickerAnswers(backups())
  await page.getByRole('button', { name: 'Export notes…' }).click()

  const exported = page.getByRole('dialog', { name: 'Notes exported' })
  await expect(exported.getByText(/^Saved 2 notes and 2 files in “Notes backup backup-abc123 \d{4}-\d\d-\d\d”\.$/)).toBeVisible()
  await expect(exported.getByText("Note history stays in Queue-tea; it isn't in the backup.")).toBeVisible()
  expect(await pickerButtons()).toEqual(['Export here'])
  const [folder] = await readdir(backups())
  const backup = join(backups(), folder!)
  expect((await readdir(backup)).sort()).toEqual(['Plan.md', 'Windows.md', 'attachments', 'queue-tea-notes.json', 'table.csv'])
  for (const path of EXPORTED) expect(await readFile(join(backup, path)), path).toEqual(await readFile(join(vault(), path)))
  expect(JSON.parse(await readFile(join(backup, 'queue-tea-notes.json'), 'utf8'))).toMatchObject({ format: 1, realm: KEY, notes: 2, files: 2 })
  await exported.getByRole('button', { name: 'Close' }).click()
  await expect(exported).toBeHidden()

  // Lost outside the app: a note and the picture it shows.
  await rm(join(vault(), 'Windows.md'))
  await rm(join(vault(), PICTURE))
  await pickerAnswers(backup)
  await page.getByRole('button', { name: 'Restore from backup…' }).click()

  const restored = page.getByRole('dialog', { name: 'Notes restored' })
  await expect(restored.getByText('Added 1 note and 1 file.')).toBeVisible()
  await expect(restored.getByText('1 note was already here.')).toBeVisible()
  expect(await pickerButtons()).toEqual(['Restore'])
  for (const path of EXPORTED) expect(await readFile(join(vault(), path)), path).toEqual(await readFile(join(backup, path)))
  expect(await readdir(vault())).not.toContain('queue-tea-notes.json')
  await expect(page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: /^Windows/ })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('restored.png'), fullPage: true })
  await restored.getByRole('button', { name: 'Close' }).click()

  await page.getByRole('button', { name: 'Restore from backup…' }).click()
  const again = page.getByRole('dialog', { name: 'Notes restored' })
  await expect(again.getByText('Everything in this backup is already in your notes.')).toBeVisible()
  expect((await readdir(vault())).sort()).toEqual(['Plan.md', 'Windows.md', 'attachments', 'table.csv'])
  await again.getByRole('button', { name: 'Close' }).click()
  await expect(again).toBeHidden()
  expect(errors).toEqual([])
})

test('the result dialog dims the whole window, as every other dialog does, not just the notes list', async () => {
  await pickerAnswers(backups())
  await page.getByRole('button', { name: 'Export notes…' }).click()
  const exported = page.getByRole('dialog', { name: 'Notes exported' })
  await expect(exported).toBeVisible()

  expect(await exported.locator('xpath=..').boundingBox()).toEqual({ x: 0, y: 0, width: 1440, height: 900 })
  await exported.getByRole('button', { name: 'Close' }).click()
  await expect(exported).toBeHidden()
})
