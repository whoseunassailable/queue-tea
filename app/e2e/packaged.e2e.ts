import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

import type { ProjectRecord } from '../../types'
import { emptyRecord, projectKey } from '../../hooks/shared/records/data/datasources/record_source'
import { makeTask } from '../main/features/tasks/api/fixtures'

// The built app, not the development one: run with `npm run e2e:packaged`.
test.skip(process.env.QUEUE_TEA_PACKAGED === undefined, 'needs a build')

const BUNDLE = join(__dirname, '../dist/mac-arm64/Queue-tea.app')
const STAGE = join(__dirname, '../dist/stage/mac-arm64/Queue-tea stage.app')
const run = promisify(execFile)

let home: string
let repo: string
let file: string
let app: ElectronApplication
let page: Page

const git = async (...args: string[]) => (await run('git', args, { cwd: repo })).stdout.trim()
const plist = async (key: string) => (await run('plutil', ['-extract', key, 'raw', join(BUNDLE, 'Contents/Info.plist')])).stdout.trim()

test.beforeAll(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-packaged-')))
  repo = join(home, 'demo')
  file = join(home, '.queue-tea/projects', `${projectKey(repo)}.json`)
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
  const record: ProjectRecord = { ...emptyRecord('demo', repo), tasks: [makeTask({ id: 'one', title: 'Packaged quest' })] }
  await writeFile(file, JSON.stringify(record))
  // A session is open, so Start asks it and no real terminal opens.
  await writeFile(join(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: repo, recordFile: file, currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: Date.now() + 600_000, startedAt: Date.now() }))

  app = await electron.launch({
    executablePath: join(BUNDLE, 'Contents/MacOS/Queue-tea'),
    args: [],
    // The PATH an app opened from the Finder gets, with no shell behind it.
    env: { HOME: home, PATH: '/usr/bin:/bin:/usr/sbin:/sbin', QUEUE_TEA_USER_DATA: join(home, 'user-data') },
  })
  page = await app.firstWindow()
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('the bundle is signed, and claims its link', async () => {
  await run('codesign', ['--verify', '--deep', '--strict', BUNDLE])

  expect(await plist('CFBundleIdentifier')).toBe('dev.queue-tea.app')
  expect(await plist('CFBundleURLTypes.0.CFBundleURLSchemes.0')).toBe('queue-tea')
  expect(await plist('CFBundleIconFile')).toMatch(/\.icns$/)
})

test('it runs as the packaged prod app', async () => {
  const info = await app.evaluate(({ app: electronApp }) => ({ isPackaged: electronApp.isPackaged, name: electronApp.getName() }))

  expect(info).toEqual({ isPackaged: true, name: 'Queue-tea' })
})

test('it reads the realm, with its fonts', async () => {
  await expect(page.getByRole('button', { name: /^Start ★/ })).toBeVisible()

  expect(await page.evaluate(async () => {
    await document.fonts.ready

    return document.fonts.check('16px Marcellus')
  })).toBe(true)
})

test('the art bundled from outside the app folder is there', async () => {
  await page.getByRole('link', { name: 'Guild Hall' }).click()

  await expect(page.locator('.member')).toHaveCount(4)
  for (const img of await page.locator('.portrait img, .guild-h img').all()) {
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
  }
  await page.getByRole('link', { name: 'Home', exact: true }).click()
})

test('git works from the PATH the Finder gives it: Start makes the branch', async () => {
  await page.getByRole('button', { name: 'Start ★ Packaged quest' }).click()

  await expect(page.getByRole('heading', { name: 'Packaged quest' })).toBeVisible()
  expect(await git('branch', '--show-current')).toBe('task/packaged-quest')
  expect((JSON.parse(await readFile(file, 'utf8')) as ProjectRecord).requests.map(q => q.kind)).toEqual(['begin'])
})

test('the stage build stands beside it, with its own id, and leaves the link alone', async () => {
  const info = join(STAGE, 'Contents/Info.plist')
  await run('codesign', ['--verify', '--deep', '--strict', STAGE])

  expect((await run('plutil', ['-extract', 'CFBundleIdentifier', 'raw', info])).stdout.trim()).toBe('dev.queue-tea.app.stage')
  await expect(run('plutil', ['-extract', 'CFBundleURLTypes', 'raw', info])).rejects.toThrow()

  const stage = await electron.launch({ executablePath: join(STAGE, 'Contents/MacOS/Queue-tea stage'), args: [], env: { HOME: home, PATH: '/usr/bin:/bin', QUEUE_TEA_USER_DATA: join(home, 'stage-data') } })
  try {
    expect(await stage.evaluate(({ app: electronApp }) => electronApp.getName())).toBe('Queue-tea stage')
  } finally {
    await stage.close()
  }
})

test('the menu bar is the app\'s own', async () => {
  const labels = await app.evaluate(({ Menu }) => Menu.getApplicationMenu()!.items.map(item => item.label))

  expect(labels.slice(0, 5)).toEqual(['Queue-tea', 'File', 'Edit', 'Quest', 'View'])
})
