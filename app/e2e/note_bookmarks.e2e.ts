import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

const APP = join(__dirname, '..')
const KEY = 'marks-abc123'
// The guard refuses this Mac before any request, so the test needs no network.
const LINK = 'http://127.0.0.1:9/post'

let home: string
let app: ElectronApplication
let page: Page
const note = () => readFile(join(home, '.queue-tea/notes', KEY, 'Marks.md'), 'utf8')
// What Edit ▸ Paste and ⌘V do: paste the clipboard into whatever has focus.
const paste = (text: string) => app.evaluate(({ BrowserWindow, clipboard }, text) => {
  clipboard.writeText(text)
  BrowserWindow.getAllWindows()[0]!.webContents.paste()
}, text)

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-bookmarks-'))
  await mkdir(join(home, 'project'))
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(join(home, '.queue-tea/notes', KEY), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify({ version: 2, project: { name: 'Mark notes', path: join(home, 'project') }, tasks: [], requests: [] }))
  await writeFile(join(home, '.queue-tea/notes', KEY, 'Marks.md'), '---\ntitle: Marks\n---\nReading list')
  app = await electron.launch({ args: [join(APP, 'out/main/main.js')], cwd: APP, env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' } })
  page = await app.firstWindow()
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: /^Mark notes/ }).click()
  await page.keyboard.press('Meta+4')
  await expect(page.getByLabel('Title *')).toHaveValue('Marks')
})

test.afterAll(async () => {
  await page?.close()
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('a link pasted in Read goes in on a line of its own, saves, and its card says the guard refused it', async () => {
  await page.getByRole('button', { name: 'Read', exact: true }).click()
  await page.getByText('Reading list').click()
  await paste(LINK)

  await expect.poll(note).toContain(`Reading list\n\n${LINK}`)
  await expect(page.getByRole('alert')).toContainText('Queue-tea previews only public web pages')
  await expect(page.getByRole('link', { name: 'Open 127.0.0.1:9 (127.0.0.1:9) in the browser' })).toBeVisible()
})

test('turning to Read with ⌘E from Write and pasting a link at once puts it in the note', async () => {
  await page.getByRole('button', { name: 'Write', exact: true }).click()
  const body = page.getByRole('combobox', { name: 'Note' })
  await body.click()
  await body.press('Meta+e')
  await expect(page.locator('.nt-read')).toBeVisible()
  await paste('http://127.0.0.1:9/second')

  await expect.poll(note).toContain('http://127.0.0.1:9/second')
})
