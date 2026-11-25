import { execFile } from 'node:child_process'
import { access, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication } from '@playwright/test'
import { emptyRecord } from '../../hooks/shared/records/data/datasources/record_source'
import type { ProjectRecord } from '../../types'
import { makeTask } from '../main/features/tasks/api/fixtures'

// Free space through the window, IPC, real Git and the disk. The project, its
// two quest worktrees, the record and HOME are temporary. No commit, merge or
// push runs from the app; the test's own setup merges inside the temp repo.
const run = promisify(execFile)
const KEY = 'space-abc123'
const git = async (cwd: string, ...args: string[]) => (await run('git', args, { cwd, env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' } })).stdout.trim()
const isThere = (path: string) => access(path).then(() => true, () => false)

test('frees a quest folder\'s build output and removes a merged folder, keeping its branch', async () => {
  const home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-free-space-')))
  const repo = join(home, 'repo'); const one = join(home, 'quests/one'); const two = join(home, 'quests/two')
  const file = join(home, '.queue-tea/projects', `${KEY}.json`)
  let app: ElectronApplication | undefined
  try {
    await mkdir(repo, { recursive: true }); await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
    await git(repo, 'init', '-b', 'main'); await git(repo, 'config', 'user.name', 'Queue-tea test'); await git(repo, 'config', 'user.email', 'test@example.invalid')
    await git(repo, 'config', 'core.hooksPath', '/dev/null'); await git(repo, 'config', 'commit.gpgsign', 'false')
    await writeFile(join(repo, '.gitignore'), 'node_modules/\n.env\n'); await writeFile(join(repo, 'a.txt'), 'base\n')
    await git(repo, 'add', '.'); await git(repo, 'commit', '-m', 'Base')
    const startCommit = await git(repo, 'rev-parse', 'HEAD')
    await git(repo, 'worktree', 'add', '-b', 'task/one', one, 'main'); await git(repo, 'worktree', 'add', '-b', 'task/two', two, 'main')
    await writeFile(join(one, 'one.txt'), 'one\n'); await git(one, 'add', 'one.txt'); await git(one, 'commit', '-m', 'Work on one')
    await git(repo, 'merge', '--no-ff', '--no-edit', 'task/one')
    for (const path of [one, two]) {
      await mkdir(join(path, 'node_modules/pkg'), { recursive: true }); await writeFile(join(path, 'node_modules/pkg/index.js'), 'x'.repeat(200_000))
      await writeFile(join(path, '.env'), 'SECRET=1')
    }
    const quest = (id: string, worktreePath: string) => makeTask({ id, title: `Quest ${id}`, state: 'done', branch: `task/${id}`, baseBranch: 'main', startCommit, worktreePath })
    await writeFile(file, JSON.stringify({ ...emptyRecord('Space demo', repo), version: 2, tasks: [quest('one', one), quest('two', two)] }))

    app = await electron.launch({ args: [join(__dirname, '../out/main/main.js')], cwd: join(__dirname, '..'), env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' } })
    const page = await app.firstWindow()
    await page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: /Space demo/ }).click()
    await page.getByRole('link', { name: 'Branches', exact: true }).click()
    await page.getByRole('button', { name: 'Free space', exact: true }).click()
    const sheet = page.getByRole('dialog', { name: 'Free space' })
    await expect(sheet.getByRole('checkbox', { name: 'Quest two' })).toBeEnabled()

    await sheet.getByRole('checkbox', { name: 'Quest two' }).check()
    await sheet.getByRole('button', { name: /^Free .+ from 1 folder$/ }).click()
    await expect(sheet.getByText(/^Freed /)).toBeVisible()
    expect(await isThere(join(two, 'node_modules'))).toBe(false)
    expect(await readFile(join(two, '.env'), 'utf8')).toBe('SECRET=1')
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)

    await sheet.getByRole('button', { name: 'Remove folder', exact: true }).click()
    await sheet.getByRole('button', { name: 'Remove this folder', exact: true }).click()
    await expect(sheet.getByText('Removed the folder of Quest one. Its branch is kept.')).toBeVisible()
    expect(await isThere(one)).toBe(false)
    expect(await git(repo, 'branch', '--list', 'task/one')).toContain('task/one')
    const record = JSON.parse(await readFile(file, 'utf8')) as ProjectRecord
    expect(record.tasks.map(t => [t.id, t.worktreePath])).toEqual([['one', null], ['two', two]])
  } finally {
    await app?.close()
    await rm(home, { recursive: true, force: true })
  }
})
