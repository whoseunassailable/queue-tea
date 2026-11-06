import { mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import type { ProjectRecord, Task } from '../../types'
import { emptyRecord, projectKey } from '../../hooks/shared/records/data/datasources/record_source'
import { makeTask } from '../main/features/tasks/api/fixtures'
import { plantGh } from './fake_gh'

const APP = join(__dirname, '..')
const SHOTS = process.env.QUEUE_TEA_SHOTS
const FIRST = 'first-account'
const SECOND = 'second-account'

let home: string
let folder: string
let mine: string
let secret: string
let app: ElectronApplication
let page: Page
let gh: Awaited<ReturnType<typeof plantGh>>

const shot = async (name: string) => {
  if (SHOTS === undefined) return
  // Bars ease into place, so a picture waits for them.
  await page.waitForTimeout(1_300)
  await page.screenshot({ path: join(SHOTS, `${name}.png`) })
}
const fileOf = (path: string) => join(folder, `${projectKey(path)}.json`)
const saved = async () => JSON.parse(await readFile(join(home, 'user-data/settings.json'), 'utf8'))
const realm = (name: string) => page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: new RegExp(`^${name}`) })
// Yesterday on this computer's clock; toISOString alone is UTC, which is "today" here in the evening.
const dayBefore = () => new Date(Date.now() - 86_400_000 - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
const won = (id: string, actual: Task['difficulty']['actual']): Task => makeTask({ id, title: id, state: 'done', finished: `${dayBefore()}T12:00:00+00:00`, difficulty: { expected: 'medium', actual }, minutesByDay: { [dayBefore()]: 45 } })
// Everything that holds a project's data, to show what didn't land there.
const records = async () => (await Promise.all((await readdir(folder)).map(name => readFile(join(folder, name), 'utf8')))).join('\n')

test.beforeAll(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-feedback-')))
  folder = join(home, '.queue-tea/projects')
  mine = join(home, 'mine')
  secret = join(home, 'private diary')
  await mkdir(folder, { recursive: true })
  await mkdir(mine)
  await mkdir(secret)
  await mkdir(join(home, 'nothing yet'))
  gh = await plantGh(home, [{ login: FIRST, active: true }])

  // 285 XP: level 2, 15 short of level 3, with the last win yesterday.
  const wins = [won('w1', 'hard'), won('w2', 'hard'), won('w3', 'hard'), won('w4', 'hard'), won('w5', 'hard'), won('w6', 'medium'), won('w7', 'light')]
  const quest = makeTask({ id: 'next', title: 'Tidy the docs', priority: 'urgent' })
  await writeFile(fileOf(mine), JSON.stringify({ ...emptyRecord('mine', mine), tasks: [...wins, quest] } satisfies ProjectRecord))
  await writeFile(fileOf(secret), JSON.stringify({ ...emptyRecord('private diary', secret), docsLogPath: 'docs/task_log.md', tasks: [makeTask({ id: 's', title: 'Something private' })] } satisfies ProjectRecord))
  await writeFile(fileOf(join(home, 'nothing yet')), JSON.stringify(emptyRecord('nothing yet', join(home, 'nothing yet'))))

  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  await expect(realm('mine')).toBeVisible()
  await realm('mine').click()
  await expect(page.locator('.hud-chip.lvl')).toBeVisible()
  // The browser and the clipboard are the Mac's own, so these stand in for them.
  await app.evaluate(({ clipboard, shell }) => {
    const seen = { opened: [] as string[], copied: [] as string[] }
    ;(globalThis as unknown as { queueTeaSeen: typeof seen }).queueTeaSeen = seen
    shell.openExternal = (async (url: string) => void seen.opened.push(url)) as typeof shell.openExternal
    clipboard.writeText = ((text: string) => void seen.copied.push(text)) as unknown as typeof clipboard.writeText
  })
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('the level bar says what the next quest does for you', async () => {
  const level = page.locator('.hud-chip.lvl')

  await expect(level).toContainText('15 XP to Lv 3')
  await expect(level).toContainText('Tidy the docs takes you to level 3')
  await expect(level).toHaveClass(/close/)
  await expect(level.locator('.gain')).toBeVisible()
  await expect(page.locator('.hud-chip.risk')).toContainText('1 day')
  await shot('hud-close')
})

test('mana stays out of the way until it is known', async () => {
  await expect(page.locator('.hud')).not.toContainText(/mana/i)
})

test('the HUD chips go where they say', async () => {
  await page.locator('.hud').getByRole('link', { name: /Open the chronicle/ }).click()
  await expect(page.getByRole('heading', { name: 'Chronicle' })).toBeVisible()

  await page.locator('.hud').getByRole('link', { name: /gold\. Open the hoard/ }).click()
  await expect(page.getByRole('heading', { name: 'Your hoard' })).toBeVisible()
})

test('Settings shows the realm you are in and no other', async () => {
  await page.getByRole('link', { name: 'Settings' }).click()

  await expect(page.getByRole('heading', { name: 'This realm · mine' })).toBeVisible()
  const text = await page.getByRole('main').innerText()
  expect(text).not.toContain('private diary')
  expect(text).not.toContain(projectKey(secret))
  await shot('settings-realm')

  await realm('private diary').click()
  await expect(page.getByRole('heading', { name: 'This realm · private diary' })).toBeVisible()
  await expect(page.getByRole('main')).not.toContainText(projectKey(mine))
  await realm('mine').click()
})

test('a task log that would leave the realm is refused, and writes nothing', async () => {
  await expect(page.getByRole('heading', { name: 'This realm · mine' })).toBeVisible()
  await page.getByRole('button', { name: 'Set now…' }).click()
  const dialog = page.getByRole('dialog')
  const field = dialog.getByLabel('Task log path *')

  await field.fill('../private diary/docs/task_log.md')
  await dialog.getByRole('button', { name: 'Save' }).click()

  await expect(dialog.getByText("The task log has to stay inside this realm's folder.")).toBeVisible()
  expect(JSON.parse(await readFile(fileOf(mine), 'utf8')).docsLogPath).toBeNull()
  await field.fill(join(secret, 'log.md'))
  await field.blur()
  await expect(dialog.getByText("The task log has to stay inside this realm's folder.")).toBeVisible()
  await dialog.getByRole('button', { name: 'Cancel' }).click()
  expect(await readdir(secret)).toEqual([])
})

test('an empty board says how to fill it', async () => {
  await page.getByRole('link', { name: 'Home' }).click()
  await realm('nothing yet').click()

  await expect(page.getByText('Add one here, or file it in Claude Code with /steep.')).toBeVisible()
  await shot('empty-board')
  await page.getByRole('button', { name: 'File a quest…' }).click()
  await expect(page.getByRole('dialog', { name: /New quest/ })).toBeVisible()
  await page.keyboard.press('Escape')
  await realm('mine').click()
})

test('adding an account runs gh, and the terminal keeps its own', async () => {
  await page.getByRole('button', { name: 'Connect GitHub' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('radio', { name: new RegExp(FIRST) })).toBeChecked()

  await dialog.getByRole('button', { name: 'Add account…' }).click()

  await expect(dialog.getByText('100F-29B8')).toBeVisible()
  await shot('github-code')
  await dialog.getByRole('button', { name: 'Copy the code and open GitHub' }).click()
  const seen = () => app.evaluate(() => (globalThis as unknown as { queueTeaSeen: { opened: string[]; copied: string[] } }).queueTeaSeen)
  await expect.poll(seen).toEqual({ opened: ['https://github.com/login/device'], copied: ['100F-29B8'] })

  await gh.finishSignIn([{ login: FIRST, active: false }, { login: SECOND, active: true }])

  await expect(dialog.getByRole('radio', { name: new RegExp(SECOND) })).toBeChecked()
  expect(await readFile(gh.place('calls'), 'utf8')).toContain(`auth switch --hostname github.com --user ${FIRST}`)
  await shot('github-picked')
})

test('a realm remembers its account in the settings, and in no record', async () => {
  await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click()

  await expect(page.locator('.hud').getByRole('button', { name: /GitHub account: second-account/ })).toContainText(`@${SECOND}`)
  await expect.poll(async () => (await saved()).realmAccounts).toEqual({ [projectKey(mine)]: SECOND })
  expect(await records()).not.toContain(SECOND)

  await realm('private diary').click()
  await expect(page.locator('.hud').getByRole('button', { name: 'Connect GitHub' })).toBeVisible()
  await realm('mine').click()
  await shot('hud-connected')
})

test('cancelling a sign-in stops gh', async () => {
  await page.locator('.hud').getByRole('button', { name: /GitHub account/ }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Add account…' }).click()
  await expect(dialog.getByText('100F-29B8')).toBeVisible()
  const pid = Number((await readFile(gh.place('pid'), 'utf8')).trim())
  const isRunning = () => {
    try {
      process.kill(pid, 0)

      return true
    } catch {
      return false
    }
  }
  expect(isRunning()).toBe(true)

  await dialog.getByRole('button', { name: 'Cancel' }).click()

  await expect(dialog).toBeHidden()
  await expect.poll(isRunning).toBe(false)
})

test('a new realm asks which account it belongs to', async () => {
  const fresh = join(home, 'fresh realm')
  await mkdir(fresh)
  await app.evaluate(({ dialog }, path) => {
    dialog.showOpenDialog = (async () => ({ canceled: false, filePaths: [path] })) as typeof dialog.showOpenDialog
  }, fresh)
  const before = await readdir(folder)

  await page.getByRole('button', { name: 'Open a folder as a realm' }).click()

  const asked = page.getByRole('dialog')
  await expect(asked.getByRole('radio', { name: new RegExp(SECOND) })).toBeVisible()
  await expect(asked.getByRole('radio', { name: 'No GitHub account' })).toBeVisible()
  await shot('new-realm')
  await asked.getByRole('button', { name: 'Add realm' }).click()
  await expect(asked.getByText('Pick a GitHub account, or No GitHub account.')).toBeVisible()
  expect(await readdir(folder)).toEqual(before)

  await asked.getByRole('radio', { name: new RegExp(FIRST) }).check()
  await asked.getByRole('button', { name: 'Add realm' }).click()

  await expect(asked).toBeHidden()
  await expect.poll(async () => (await saved()).realmAccounts[projectKey(fresh)]).toBe(FIRST)
  await expect(page.locator('.hud')).toContainText(`@${FIRST}`)
})

test('Settings lists the accounts and this realm\'s own', async () => {
  await page.getByRole('link', { name: 'Settings' }).click()

  const accounts = page.getByRole('region', { name: 'GitHub accounts' })
  await expect(accounts.getByText(FIRST, { exact: true })).toBeVisible()
  await expect(accounts.getByText(SECOND, { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: "Change fresh realm's GitHub account" })).toBeVisible()
  await shot('settings-github')
})

test('the Library keeps your place, apart from every realm', async () => {
  await page.getByRole('link', { name: 'Library' }).click()
  await expect(page.getByText("No books yet. Add what you're reading, and it keeps your place.")).toBeVisible()
  await shot('library-empty')

  await page.getByRole('button', { name: 'Add a book…' }).click()
  const sheet = page.getByRole('dialog')
  await sheet.getByRole('button', { name: 'Add book' }).click()
  await expect(sheet.getByText('Title is required.')).toBeVisible()
  await expect(sheet.getByText('Total pages is required.')).toBeVisible()
  await sheet.getByLabel('Title *').fill('Dune')
  await sheet.getByLabel('Author').fill('Frank Herbert')
  await sheet.getByLabel('Total pages *').fill('412')
  await sheet.getByRole('button', { name: 'Add book' }).click()
  await expect(sheet).toBeHidden()

  const field = page.getByLabel("Page you've reached in Dune")
  await field.fill('500')
  await field.blur()
  await expect(page.getByText('Enter a page from 0 to 412.')).toBeVisible()
  await field.fill('103')
  await field.blur()
  await expect(page.getByText('25% · 309 pages left')).toBeVisible()
  await expect(page.getByText('103 pages today · 103 this week')).toBeVisible()
  await shot('library-reading')

  await page.getByRole('button', { name: 'Mark Dune finished' }).click()
  await expect(page.getByText(/Finished .* · 412 pages/)).toBeVisible()
  await expect(page.getByText('1 book finished · 412 pages read')).toBeVisible()
  await shot('library-finished')

  const shelf = JSON.parse(await readFile(join(home, '.queue-tea/library.json'), 'utf8'))
  expect(shelf.books[0]).toMatchObject({ title: 'Dune', page: 412 })
  expect(await records()).not.toContain('Dune')
})

test('the Library comes back as it was left', async () => {
  await page.getByRole('button', { name: 'Remove Dune' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Remove book' }).click()

  await expect(page.getByText("No books yet. Add what you're reading, and it keeps your place.")).toBeVisible()
  expect(JSON.parse(await readFile(join(home, '.queue-tea/library.json'), 'utf8')).books).toEqual([])
})
