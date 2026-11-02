import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import type { ProjectRecord, Task } from '../../types'

const APP = join(__dirname, '..')
const KEY = 'demo-abc123'
const SHOTS = process.env.QUEUE_TEA_SHOTS

let home: string
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

const shot = async (name: string) => {
  if (SHOTS !== undefined) await page.screenshot({ path: join(SHOTS, `${name}.png`) })
}
const stored = async (id: string) => (JSON.parse(await readFile(file, 'utf8')) as ProjectRecord).tasks.find(t => t.id === id)!
const palette = () => page.getByRole('dialog', { name: 'Command palette' })
const resize = async (width: number, height: number) => {
  await app.evaluate(({ BrowserWindow }, size) => BrowserWindow.getAllWindows()[0]!.setContentSize(size.width, size.height), { width, height })
  await page.waitForFunction(w => window.innerWidth === w, width)
}
// A menu item, clicked as the mouse would.
const clickMenu = (top: string, label: string) =>
  app.evaluate(({ BrowserWindow, Menu }, path) => {
    const menu = Menu.getApplicationMenu()!.items.find(item => item.label === path.top)!.submenu!
    menu.items.find(item => item.label === path.label)!.click(undefined, BrowserWindow.getAllWindows()[0], undefined)
  }, { top, label })

test.beforeAll(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-shell-')))
  file = join(home, '.queue-tea/projects', `${KEY}.json`)
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  const seed: ProjectRecord = {
    version: 1,
    project: { name: 'Demo realm', path: '/p/demo' },
    docsLogPath: null,
    playNext: null,
    feature: null,
    tasks: [task({ id: 'one', title: 'Mend the gate', priority: 'high' }), task({ id: 'two', title: 'Feed the dragon', priority: 'low' })],
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
  await expect(page.getByRole('button', { name: /^Start ★/ })).toBeVisible()
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('⌘K opens the palette within 100 ms', async () => {
  const opened = await page.evaluate(
    () =>
      new Promise<number>(done => {
        const started = performance.now()
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, cancelable: true }))
        const look = () => (document.querySelector('[role="combobox"]') === null ? requestAnimationFrame(look) : done(performance.now() - started))
        look()
      }),
  )

  expect(opened).toBeLessThan(100)
  await expect(palette()).toBeVisible()
  await shot('palette')
  await page.keyboard.press('Escape')
})

test('typing finds a quest, and Return opens it on the board with no wait', async () => {
  await page.keyboard.press('Meta+k')
  await page.keyboard.type('feed')
  await page.keyboard.press('Enter')

  await expect(palette()).toBeHidden()
  await expect(page.locator('.qrow.sel .qc-title')).toHaveText('Feed the dragon')
})

test('a key pressed straight after the palette closes reaches the board', async () => {
  await page.keyboard.press('Meta+k')
  await page.keyboard.type('feed')
  await page.keyboard.press('Enter')
  await page.keyboard.press('2')

  await expect.poll(async () => (await stored('two')).priority).toBe('high')
})

test('what can\'t run stays dim, and Return leaves it open', async () => {
  await page.keyboard.press('Meta+k')
  await page.keyboard.type('back to the board')

  await expect(page.getByRole('option', { name: /No quest is active/ })).toHaveAttribute('aria-disabled', 'true')
  await page.keyboard.press('Enter')
  await expect(palette()).toBeVisible()
  await page.keyboard.press('Escape')
})

test('the menu bar is the real one, and its items reach the window', async () => {
  await clickMenu('File', 'New quest')

  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')

  await clickMenu('View', 'Command palette')
  await expect(palette()).toBeVisible()
  await page.keyboard.press('Escape')
})

test('a letter typed in a field stays a letter, though the menu shows it', async () => {
  await page.keyboard.press('Meta+n')
  const title = page.getByRole('dialog').getByLabel('Title *')

  await title.pressSequentially('sdbkxy')

  await expect(title).toHaveValue('sdbkxy')
  await page.keyboard.press('Escape')
})

test('below 1180 px the detail floats over the list, and closes', async () => {
  await resize(1000, 700)
  await expect(page.locator('.detail')).toBeHidden()

  await page.locator('.qrow-open').first().click()

  await expect(page.locator('.quests.floating .detail')).toBeVisible()
  await page.waitForTimeout(100)
  await shot('narrow-floating')
  await page.getByRole('button', { name: 'Close the quest details' }).click()
  await expect(page.locator('.detail')).toBeHidden()
})

test('below 900 px the sidebar goes, the tabs are a menu and the detail is a page', async () => {
  await resize(760, 600)

  await expect(page.getByRole('navigation', { name: 'Realms' })).toBeHidden()
  await expect(page.getByRole('combobox', { name: 'Go to a section' })).toBeVisible()
  await page.waitForTimeout(100)
  await shot('narrow-list')

  await page.locator('.qrow-open').first().click()
  await expect(page.locator('.detail')).toBeVisible()
  await expect(page.locator('.qlist')).toBeHidden()
  await shot('narrow-detail')

  await page.getByRole('button', { name: '‹ Quests' }).click()
  await expect(page.locator('.qlist')).toBeVisible()
})

test('below 900 px Home stacks, and every section stays reachable', async () => {
  await page.getByRole('combobox', { name: 'Go to a section' }).selectOption('/home')

  await expect(page.getByRole('heading', { name: 'Quest board' })).toBeVisible()
  await page.waitForTimeout(100)
  await shot('narrow-home')
  await page.getByRole('combobox', { name: 'Go to a section' }).selectOption('/quests')
  await expect(page.locator('.qlist')).toBeVisible()
})

test('below 900 px the realms come back as an overlay', async () => {
  await page.getByRole('button', { name: 'Show the realms' }).click()

  await expect(page.getByRole('navigation', { name: 'Realms' })).toBeVisible()
  await page.waitForTimeout(100)
  await shot('narrow-realms')
  await page.getByRole('button', { name: /^Demo realm/ }).click()
  await expect(page.getByRole('navigation', { name: 'Realms' })).toBeHidden()
})

test('the window can\'t go below 720 × 560', async () => {
  const size = await app.evaluate(({ BrowserWindow }) => {
    const window = BrowserWindow.getAllWindows()[0]!
    window.setContentSize(300, 200)

    return window.getContentSize()
  })

  expect(size[0]).toBeGreaterThanOrEqual(720)
  expect(size[1]).toBeGreaterThanOrEqual(530)
})
