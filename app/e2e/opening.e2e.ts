import { mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import type { ProjectRecord } from '../../types'
import { emptyRecord, projectKey } from '../../hooks/shared/records/data/datasources/record_source'
import { makeTask } from '../main/features/tasks/api/fixtures'

const APP = join(__dirname, '..')

let home: string
let folder: string
let app: ElectronApplication
let page: Page
let alpha: string
let beta: string

const realmFile = (path: string) => join(folder, `${projectKey(path)}.json`)
const link = (path: string) => `queue-tea://open?path=${encodeURIComponent(path)}`
// macOS hands the app a link through this event, so the test does the same.
const follow = (url: string) => app.evaluate(({ app: electronApp }, target) => void electronApp.emit('open-url', { preventDefault() {} }, target), url)
const sidebarRow = (name: string) => page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: new RegExp(`^${name}`) })
const toast = (text: string | RegExp) => page.locator('.toast-item').filter({ hasText: text })
const shown = () => app.evaluate(() => (globalThis as unknown as { queueTeaShown: string[] }).queueTeaShown)

test.beforeAll(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-opening-')))
  folder = join(home, '.queue-tea/projects')
  alpha = join(home, 'alpha')
  beta = join(home, 'beta realm café')
  await mkdir(folder, { recursive: true })
  await mkdir(alpha)
  await mkdir(beta)
  await writeFile(realmFile(alpha), JSON.stringify(emptyRecord('alpha', alpha)))
  const record: ProjectRecord = { ...emptyRecord('beta realm café', beta), tasks: [makeTask({ id: 'one', title: 'The quest', state: 'current' })] }
  await writeFile(realmFile(beta), JSON.stringify(record))
  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  await expect(sidebarRow('alpha')).toBeVisible()
  // The system's banner can't be watched from here, so only showing it stands
  // in. What decides to show it, and what a click does, are the real ones.
  await app.evaluate(({ Notification }) => {
    const seen: string[] = []
    ;(globalThis as unknown as { queueTeaShown: string[]; queueTeaLast: Notification | null }).queueTeaShown = seen
    Notification.prototype.show = function show(this: Notification) {
      seen.push(this.body)
      ;(globalThis as unknown as { queueTeaLast: Notification }).queueTeaLast = this
    }
  })
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('a link to a realm it knows selects it and tags it Detected', async () => {
  await follow(link(alpha))

  await expect(sidebarRow('alpha')).toHaveClass(/sel/)
  await expect(sidebarRow('alpha')).toContainText('Detected')
})

test('a path with a space and an accent comes through whole', async () => {
  await follow(link(beta))

  await expect(sidebarRow('beta realm café')).toHaveClass(/sel/)
  await expect(sidebarRow('beta realm café')).toContainText('Detected')
  await expect(sidebarRow('alpha')).not.toContainText('Detected')
})

test('a link to a folder it doesn\'t know asks first, and writes nothing until told', async () => {
  const fresh = join(home, 'fresh')
  await mkdir(fresh)
  const before = await readdir(folder)

  await follow(link(fresh))

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText("fresh isn't in Queue-tea yet.")).toBeVisible()
  expect(await readdir(folder)).toEqual(before)

  await dialog.getByRole('button', { name: 'Add realm' }).click()

  await expect(dialog).toBeHidden()
  await expect(sidebarRow('fresh')).toContainText('Detected')
  expect(await readdir(fresh)).toEqual([])
})

test('a bad link says so', async () => {
  await follow('queue-tea://open')

  await expect(toast("That link doesn't name a folder Queue-tea can open.")).toBeVisible()
})

test('a link to a folder that has gone says so', async () => {
  await follow(link(join(home, 'gone')))

  await expect(toast(`There's no folder at ${join(home, 'gone')}.`)).toBeVisible()
})

test('Claude asking in the background taps you on the shoulder, once', async () => {
  await app.evaluate(({ app: electronApp, BrowserWindow }) => {
    BrowserWindow.getAllWindows()[0]!.blur()
    electronApp.hide()
  })
  await expect.poll(() => app.evaluate(({ BrowserWindow }) => BrowserWindow.getFocusedWindow() === null)).toBe(true)

  const record = JSON.parse(await readFile(realmFile(beta), 'utf8')) as ProjectRecord
  await writeFile(realmFile(beta), JSON.stringify({ ...record, tasks: record.tasks.map(t => ({ ...t, review: { at: '2026-11-02T12:00:00-06:00', checked: 'tests pass' } })) }))

  await expect.poll(shown).toEqual(['Claude says The quest looks done'])
  await new Promise(done => setTimeout(done, 600))
  expect(await shown()).toHaveLength(1)
})

test('clicking it opens that realm at the question', async () => {
  await page.getByRole('link', { name: 'Quests' }).evaluate((a: HTMLAnchorElement) => a.click())
  await sidebarRow('alpha').evaluate((b: HTMLButtonElement) => b.click())

  await app.evaluate(() => (globalThis as unknown as { queueTeaLast: { emit: (name: string) => void } }).queueTeaLast.emit('click'))

  await expect(page.getByRole('heading', { name: 'Is The quest done for now?' })).toBeVisible()
  await expect(sidebarRow('beta realm café')).toHaveClass(/sel/)
})

test('a link with no window open opens one, on that realm', async () => {
  const closed = app.waitForEvent('window')
  await app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]!.close())
  await follow(link(alpha))

  page = await closed
  await expect(sidebarRow('alpha')).toHaveClass(/sel/)
  await expect(sidebarRow('alpha')).toContainText('Detected')
})
