import { execFile } from 'node:child_process'
import { chmod, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import type { ProjectRecord, Task } from '../../types'

const APP = join(__dirname, '..')
const KEY = 'demo-abc123'
const SHOTS = process.env.QUEUE_TEA_SHOTS
const run = promisify(execFile)

let home: string
let repo: string
let file: string
let terminalLog: string
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
    helpers: { on: ['tea-dd'], ran: [], reminded: false },
    ...over,
  }) as Task

const git = async (...args: string[]) => (await run('git', args, { cwd: repo })).stdout.trim()
const onDisk = async (): Promise<ProjectRecord> => JSON.parse(await readFile(file, 'utf8'))
const stored = async (id: string) => (await onDisk()).tasks.find(t => t.id === id)!
// What a session does to the record, written the same way: a whole new file.
const change = async (edit: (record: ProjectRecord) => ProjectRecord) => writeFile(file, JSON.stringify(edit(await onDisk()), null, 2))
const editTask = (id: string, over: Partial<Task>) => change(r => ({ ...r, tasks: r.tasks.map(t => (t.id === id ? { ...t, ...over } : t)) }))
// A session taking what it was asked. It waits for the app's own write, because
// unlike a real session this edit doesn't go through the record's lock.
const noRequests = async () => {
  await expect.poll(async () => (await onDisk()).requests.length).toBeGreaterThan(0)
  await change(r => ({ ...r, requests: [] }))
}
const terminals = async () => {
  try {
    return await readFile(terminalLog, 'utf8')
  } catch {
    // No log yet means no terminal has been opened.
    return ''
  }
}
const session = (over: { isTurnRunning?: boolean } = {}) =>
  writeFile(
    join(home, '.queue-tea/sessions/s-1.json'),
    JSON.stringify({ id: 's-1', projectPath: repo, recordFile: file, currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: Date.now(), startedAt: Date.now(), ...over }),
  )
const noSession = () => rm(join(home, '.queue-tea/sessions/s-1.json'), { force: true })
const button = (name: string | RegExp) => page.getByRole('button', { name })
const heading = (name: string | RegExp) => page.getByRole('heading', { name })
const toast = (text: string | RegExp) => page.locator('.toast-item').filter({ hasText: text })
const shot = async (name: string) => {
  if (SHOTS !== undefined) await page.screenshot({ path: join(SHOTS, `${name}.png`) })
}

test.beforeAll(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-flows-')))
  repo = join(home, 'demo')
  file = join(home, '.queue-tea/projects', `${KEY}.json`)
  terminalLog = join(home, 'terminals.log')
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await mkdir(repo)
  await run('git', ['init', '--bare', '-b', 'main', join(home, 'remote.git')])
  await git('init', '-b', 'main')
  await git('config', 'user.email', 'test@example.com')
  await git('config', 'user.name', 'Test')
  await writeFile(join(repo, 'a.txt'), 'a\n')
  await git('add', '.')
  await git('commit', '-m', 'first')
  await git('remote', 'add', 'origin', join(home, 'remote.git'))
  await git('push', '-u', 'origin', 'main')

  // Stands in for osascript, so no real terminal opens during the tests.
  const bin = join(home, 'bin')
  await mkdir(bin)
  await writeFile(join(bin, 'osascript'), `#!/bin/sh\nprintf '%s\\n' "$*" >> '${terminalLog}'\n`)
  await chmod(join(bin, 'osascript'), 0o755)

  const seed: ProjectRecord = {
    version: 1,
    project: { name: 'Demo realm', path: repo },
    docsLogPath: null,
    playNext: null,
    feature: null,
    tasks: [
      task({ id: 'one', title: 'First quest', priority: 'urgent', difficulty: { expected: 'hard', actual: null }, criteria: ['Docs build'] }),
      task({ id: 'two', title: 'Second quest', priority: 'high' }),
      task({ id: 'three', title: 'Third quest', priority: 'low' }),
    ],
    unassignedMinutesByDay: {},
    requests: [],
  }
  await writeFile(file, JSON.stringify(seed, null, 2))

  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, PATH: `${bin}:${process.env.PATH}`, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  await expect(button('Start ★ First quest')).toBeVisible()
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('Start stops at the git hold, and changes nothing', async () => {
  await writeFile(join(repo, 'uncommitted.txt'), 'x\n')
  const before = await readFile(file, 'utf8')

  await button('Start ★ First quest').click()

  await expect(page.getByText("The gate is sealed: First quest can't start yet")).toBeVisible()
  await expect(page.getByText('1 file not committed on main,')).toBeVisible()
  await expect(page.locator('.files')).toContainText('uncommitted.txt')
  await expect(page.locator('.copy-line code')).toHaveText('git status')
  await shot('hold')
  expect(await readFile(file, 'utf8')).toBe(before)
  expect(await git('branch', '--format=%(refname:short)')).toBe('main')
})

test('no button anywhere offers to run git', async () => {
  for (const control of await page.getByRole('button').all()) {
    const words = `${(await control.textContent()) ?? ''} ${(await control.getAttribute('aria-label')) ?? ''}`
    expect(words).not.toMatch(/\b(commit|push|merge|pull)\b/i)
  }
})

test('copying a command puts it on the clipboard', async () => {
  await button('Copy this command').click()

  await expect(toast('Copied')).toBeVisible()
  expect(await app.evaluate(({ clipboard }) => clipboard.readText())).toBe('git status')
})

test('Check again still holds while git does', async () => {
  await page.keyboard.press('r')

  await expect(page.getByText("The gate is sealed: First quest can't start yet")).toBeVisible()
  expect((await stored('one')).state).toBe('queued')
})

test('once git is clear, Check again makes the branch and opens the terminal', async () => {
  await rm(join(repo, 'uncommitted.txt'))

  await page.keyboard.press('r')

  await expect(heading('First quest')).toBeVisible()
  await expect(toast('Set out: First quest · task/first-quest')).toBeVisible()
  expect(await git('branch', '--show-current')).toBe('task/first-quest')
  expect(await stored('one')).toMatchObject({ state: 'current', branch: 'task/first-quest', baseBranch: 'main' })
  expect((await onDisk()).requests.map(q => ({ kind: q.kind, taskId: q.taskId }))).toEqual([{ kind: 'begin', taskId: 'one' }])
  expect(await terminals()).toContain(`cd '${repo}' && claude`)
  await expect(page.getByText('Claude Code takes it as soon as it opens here.')).toBeVisible()
  await shot('waiting-for-session')
})

test('Judgement comes up within 2 s of the mod setting it, and Not yet clears it', async () => {
  await noRequests()
  await editTask('one', { review: { at: '2026-10-27T18:00:00+01:00', checked: 'docs build and typecheck pass' } })

  await expect(heading('Is First quest done for now?')).toBeVisible({ timeout: 2_000 })
  await expect(page.getByText('docs build and typecheck pass')).toBeVisible()
  await expect(page.getByText('Docs build', { exact: true })).toBeVisible()
  await shot('judgement')

  await page.keyboard.press('n')

  await expect(heading('First quest')).toBeVisible()
  await expect.poll(async () => (await stored('one')).review).toBeNull()
})

test('the first finish asks where the log goes, and the victory follows the win', async () => {
  await editTask('one', { minutesByDay: { '2026-10-27': 14 } })
  await editTask('one', { review: { at: '2026-10-27T18:00:00+01:00', checked: null } })
  await expect(heading('Is First quest done for now?')).toBeVisible()

  await page.keyboard.press('y')

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('button', { name: 'Hard · 50 XP · expected' })).toHaveAttribute('aria-pressed', 'true')
  const path = dialog.getByLabel('Task log path *')
  await expect(path).toHaveValue('docs/task_log.md')

  await path.fill('')
  await path.blur()
  await expect(dialog.getByText('Task log path is required.')).toBeVisible()
  await dialog.getByRole('button', { name: /^Finish/ }).click()
  expect((await stored('one')).state).toBe('current')

  await path.fill('docs/task_log.md')
  await dialog.getByRole('button', { name: 'Medium · 25 XP' }).click()
  await shot('finish')
  await page.keyboard.press('Meta+Enter')

  await expect(heading('Victory!')).toBeVisible()
  await expect(page.getByText('Boss quest won')).toBeVisible()
  await expect(page.locator('.win-rows')).toContainText('+25 XP')
  await expect(page.locator('.win-rows')).toContainText('+25 gold')
  await expect(page.locator('.win-rows')).toContainText('First Flame')
  await expect(toast('Badge earned: First Flame')).toBeVisible()
  await expect(page.locator('[data-testid="root"]')).toHaveClass(/m-cheer/)
  await page.waitForTimeout(1_500)
  await shot('victory')

  expect(await stored('one')).toMatchObject({ state: 'done', review: null, difficulty: { expected: 'hard', actual: 'medium' } })
  expect((await onDisk()).docsLogPath).toBe('docs/task_log.md')
  expect(await readFile(join(repo, 'docs/task_log.md'), 'utf8')).toContain('| First quest | Urgent | Hard → Medium | 14m | `task/first-quest` |')
})

test('Esc closes the victory, and the next quest is ready', async () => {
  await page.keyboard.press('Escape')

  await expect(heading('Victory!')).toBeHidden()
  await expect(toast('Badge earned')).toBeHidden()
  await expect(page.locator('[data-testid="root"]')).not.toHaveClass(/m-cheer/)
  await expect(button('Start ★ Second quest')).toBeVisible()
})

test('with no session, Back to the board goes at once and keeps the branch', async () => {
  // The task log is an uncommitted change until Rohan commits it.
  await git('add', '.')
  await git('commit', '-m', 'log')
  await git('push', '-u', 'origin', 'task/first-quest')

  await page.keyboard.press('s')
  await expect(heading('Second quest')).toBeVisible()
  await noRequests()
  await expect(page.getByText('No Claude Code session')).toBeVisible()
  const { branch, startCommit } = await stored('two')

  await page.keyboard.press('b')

  await expect.poll(async () => (await stored('two')).state).toBe('queued')
  await expect(toast('Back on the board: Second quest')).toBeVisible()
  expect(await stored('two')).toMatchObject({ state: 'queued', branch, startCommit })

  await page.getByRole('link', { name: 'Quests', exact: true }).click()
  await expect(page.locator('.detail')).toContainText("Claude's checkpoint wasn't written")
  await shot('back-no-session')
})

test('Back right after Start, before Claude has begun, needs no checkpoint', async () => {
  await git('push', '-u', 'origin', 'task/second-quest').catch(() => {})
  await page.getByRole('button', { name: 'Start ★', exact: true }).click()
  await expect(page.locator('.qlist .aq-title')).toHaveText('Second quest')
  expect((await onDisk()).requests).toHaveLength(1)

  await page.keyboard.press('b')

  await expect.poll(async () => (await stored('two')).state).toBe('queued')
  expect((await onDisk()).requests).toEqual([])
})

test('with a session open, Start asks it and opens nothing', async () => {
  await session()
  await expect(page.locator('.detail')).toBeVisible()
  const before = await terminals()

  await page.getByRole('button', { name: 'Start ★', exact: true }).click()

  await expect(page.locator('.qlist .aq-title')).toHaveText('Second quest')
  expect((await onDisk()).requests.map(q => q.kind)).toEqual(['begin'])
  expect(await terminals()).toBe(before)
})

test('with a session open, Back waits for its checkpoint, and says when it has gone', async () => {
  await noRequests()
  await expect(button('Back to the board')).toBeVisible()

  await page.keyboard.press('b')

  await expect(page.getByText('Saving a checkpoint… Claude writes it, then the quest goes back.')).toBeVisible()
  await expect(button('Put it back now, without one')).toBeVisible()
  await expect(button('Finish quest…')).toBeHidden()
  expect((await onDisk()).requests.map(q => q.kind)).toEqual(['putBack'])
  expect((await stored('two')).state).toBe('current')
  await shot('saving-checkpoint')

  // The session writes its checkpoint and puts the quest back.
  await change(r => ({ ...r, requests: [], tasks: r.tasks.map(t => (t.id === 'two' ? { ...t, state: 'queued' } : t)) }))

  await expect(toast('Back on the board: Second quest')).toBeVisible()
})

test('when the session ends while a checkpoint is awaited, Put it back now still works', async () => {
  await page.getByRole('button', { name: 'Start ★', exact: true }).click()
  await expect(page.locator('.qlist .aq-title')).toHaveText('Second quest')
  await noRequests()
  await expect(button('Back to the board')).toBeVisible()
  await page.keyboard.press('b')
  await expect(page.getByText('Saving a checkpoint')).toBeVisible()

  await noSession()

  await expect(page.getByText('No Claude Code session is open to save a checkpoint.')).toBeVisible({ timeout: 10_000 })
  await button('Put it back now, without one').click()

  // Read from the record: the last test's toast may still be showing.
  await expect.poll(async () => (await stored('two')).state).toBe('queued')
  expect((await onDisk()).requests).toEqual([])
})

test('sealing the active quest puts it back sealed', async () => {
  await page.getByRole('button', { name: 'Start ★', exact: true }).click()
  await expect(page.locator('.qlist .aq-title')).toHaveText('Second quest')
  await noRequests()
  await button('Seal…').first().click()

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('It goes back on the board with a checkpoint.')).toBeVisible()
  await dialog.getByLabel('Or a reason').fill('waiting for the clinic')
  await dialog.getByRole('button', { name: 'Seal' }).click()

  await expect.poll(async () => (await stored('two')).state).toBe('queued')
  await expect(toast('Sealed: Second quest')).toBeVisible()
  expect(await stored('two')).toMatchObject({ state: 'queued', blockedReason: 'waiting for the clinic' })
})

test('c opens Claude Code from Home', async () => {
  await page.getByRole('link', { name: 'Home' }).click()
  await expect(button('Start ★ Third quest')).toBeVisible()
  await page.keyboard.press('s')
  await expect(heading('Third quest')).toBeVisible()
  const before = await terminals()

  await page.keyboard.press('c')

  await expect.poll(async () => (await terminals()).length).toBeGreaterThan(before.length)
})
