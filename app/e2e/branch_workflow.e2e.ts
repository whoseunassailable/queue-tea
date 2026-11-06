import { execFile } from 'node:child_process'
import { appendFile, chmod, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'
import { emptyRecord } from '../../hooks/shared/records/data/datasources/record_source'
import type { ProjectRecord } from '../../types'
import { makeTask } from '../main/features/tasks/api/fixtures'

// Full GUI → IPC → real Git/process/files → GUI flow. All data and the bare
// remote are temporary. No network, production app, or task repository writes.
const run = promisify(execFile)
const KEY = 'workflow-abc123'
let home: string; let repo: string; let file: string; let app: ElectronApplication; let page: Page
const git = async (cwd: string, ...args: string[]) => (await run('git', args, { cwd, env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' } })).stdout.trim()
const record = async () => JSON.parse(await readFile(file, 'utf8')) as ProjectRecord
const event = (type: string, payload: Record<string, unknown>) => JSON.stringify({ timestamp: new Date().toISOString(), type, payload }) + '\n'
const dialog = () => page.getByRole('dialog', { name: 'Review work' })
const mergeButton = () => dialog().getByRole('button', { name: 'Merge task/visible-workflow into main', exact: true })

test.beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-gui-workflow-')))
  repo = join(home, 'repo'); file = join(home, '.queue-tea/projects', `${KEY}.json`)
  await mkdir(repo); await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await git(repo, 'init', '-b', 'main'); await git(repo, 'config', 'user.name', 'Queue-tea test'); await git(repo, 'config', 'user.email', 'test@example.invalid'); await git(repo, 'config', 'commit.gpgsign', 'false')
  const hooks = join(home, 'test-hooks'); await mkdir(hooks)
  await writeFile(join(hooks, 'pre-commit'), '#!/bin/sh\necho "COMMIT START"\nsleep 2\necho "COMMIT END"\n'); await chmod(join(hooks, 'pre-commit'), 0o755)
  // Seed with hooks disabled, then enable only the temporary streaming hook.
  await git(repo, 'config', 'core.hooksPath', '/dev/null')
  await writeFile(join(repo, '.gitignore'), '.check-fail\n')
  await writeFile(join(repo, 'a.txt'), 'base\n')
  await writeFile(join(repo, 'package.json'), JSON.stringify({ name: 'workflow-fixture', private: true, scripts: { test: 'node check.cjs' } }))
  await writeFile(join(repo, 'check.cjs'), "const fs=require('node:fs');console.log('CHECK START');setTimeout(()=>{if(fs.existsSync('.check-fail')){console.error('CHECK FAILED');process.exit(1)}console.log('CHECK PASSED')},1200)")
  await git(repo, 'add', '.'); await git(repo, 'commit', '-m', 'Base fixture')
  await git(repo, 'config', 'core.hooksPath', hooks)
  const remote = join(home, 'remote.git'); await mkdir(remote); await git(remote, 'init', '--bare'); await git(repo, 'remote', 'add', 'origin', remote)
  const bin = join(home, 'bin'); await mkdir(bin)
  await writeFile(join(bin, 'osascript'), '#!/bin/sh\nexit 0\n'); await chmod(join(bin, 'osascript'), 0o755)
  await writeFile(file, JSON.stringify({ ...emptyRecord('Workflow demo', repo), tasks: [makeTask({ id: 'one', title: 'Visible workflow', priority: 'urgent' })] }))
  app = await electron.launch({ args: [join(__dirname, '../out/main/main.js')], cwd: join(__dirname, '..'), env: { ...process.env, HOME: home, PATH: `${bin}:/usr/bin:/bin`, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' } })
  page = await app.firstWindow()
  await page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: /Workflow demo/ }).click()
})
test.afterEach(async () => { await app?.close(); if (home) await rm(home, { recursive: true, force: true }) })

const start = async () => {
  await page.getByRole('link', { name: 'Quests', exact: true }).click()
  await page.getByRole('button', { name: /^Visible workflow/ }).click()
  await page.getByRole('button', { name: 'Start in Codex', exact: true }).click()
  await expect.poll(async () => (await record()).tasks[0]!.state).toBe('current')
  const task = (await record()).tasks[0]!
  expect(task.branch).toBe('task/visible-workflow')
  expect(await git(repo, 'branch', '--show-current')).toBe('main')
  return task.worktreePath!
}
const openReview = async () => {
  await page.getByRole('link', { name: 'Branches', exact: true }).click()
  await page.getByRole('article', { name: 'Visible workflow' }).getByRole('button', { name: 'Review work', exact: true }).click()
  await expect(dialog()).toBeVisible()
}
const commitSelected = async (name: string) => {
  await dialog().getByRole('tab', { name: 'Changes', exact: true }).click()
  await dialog().getByRole('checkbox', { name: new RegExp(name.replace('.', '\\.')) }).check()
  await dialog().getByLabel('Commit message *', { exact: true }).fill('Implement visible workflow')
  await dialog().getByRole('checkbox', { name: /I have stopped/ }).first().check()
  await dialog().getByRole('button', { name: 'Commit selected files', exact: true }).click()
  await expect(dialog().getByRole('log', { name: 'Live commit output' })).toContainText('COMMIT START')
  await expect(dialog().getByRole('log', { name: 'Live commit output' })).toContainText('COMMIT END')
}
const prepare = async () => {
  await dialog().getByRole('checkbox', { name: /I have stopped/ }).last().check()
  await dialog().getByRole('button', { name: 'Prepare merge for review' }).click()
  await expect(dialog().getByRole('region', { name: 'Checks on the prepared result' })).toBeVisible()
}
const check = async () => {
  const checks = dialog().getByRole('region', { name: 'Checks on the prepared result' })
  await checks.getByRole('checkbox', { name: /^test/ }).check()
  await checks.getByRole('button', { name: 'Run selected checks' }).click()
  await expect(checks.getByRole('log', { name: 'Live output: test' }).last()).toContainText('CHECK START')
  await expect(checks.getByRole('log', { name: 'Live output: test' }).last()).toContainText('CHECK PASSED')
  await expect(checks.getByText('Passed', { exact: true }).last()).toBeVisible()
}
const merge = async () => {
  await dialog().getByRole('checkbox', { name: /I have stopped/ }).last().check()
  await expect(mergeButton()).toBeEnabled()
  await mergeButton().click()
  await expect(dialog().getByText(/Merged locally into main at/)).toBeVisible()
}

test('start, live Codex work, commit output, checks, approved merge, and separate local push', async ({}, testInfo) => {
  const source = await start()
  // Old session date with events appended now verifies resumed-session discovery.
  const logs = join(home, '.codex/sessions/2024/01/01'); await mkdir(logs, { recursive: true })
  const log = join(logs, 'resumed.jsonl')
  const command = { type: 'CommandExecution', id: 'agent-command', command: ['/bin/zsh', '-lc', 'node check.cjs'], process_id: 'fixture-process', status: 'in_progress', exit_code: null, aggregated_output: 'AGENT CHECK START' }
  await writeFile(log, event('session_meta', { cwd: source }) + event('event_msg', { type: 'task_started' }) + event('event_msg', { type: 'item_completed', item: command }))
  await page.getByRole('button', { name: 'Show the details of Visible workflow', exact: true }).click()
  await expect(page.getByRole('region', { name: 'Task activity' }).getByText('node check.cjs', { exact: true })).toBeVisible({ timeout: 15000 })
  await page.getByRole('link', { name: 'Branches', exact: true }).click()
  const card = page.getByRole('article', { name: 'Visible workflow' })
  await expect(card.getByText('Working now', { exact: true })).toBeVisible({ timeout: 15000 })
  await expect(card.locator('.observed-working')).toHaveCount(1)
  await card.getByRole('button', { name: 'Review work', exact: true }).click()
  await dialog().getByRole('tab', { name: 'Activity', exact: true }).click()
  await expect(dialog().getByText('node check.cjs', { exact: true })).toBeVisible()
  await dialog().getByText('Command output', { exact: true }).click()
  await expect(dialog().locator('pre')).toContainText('AGENT CHECK START')
  await writeFile(join(source, 'feature.txt'), 'feature complete\n')
  await appendFile(log, event('event_msg', { type: 'item_completed', item: { ...command, id: 'agent-result', status: 'completed', exit_code: 0, aggregated_output: 'AGENT CHECK PASSED' } }) + event('event_msg', { type: 'item_completed', item: { type: 'FileChange', id: 'file-edit', status: 'completed', changes: { 'feature.txt': { type: 'add' } } } }) + event('event_msg', { type: 'task_complete' }))
  await expect(dialog().getByText('feature.txt', { exact: true })).toBeVisible({ timeout: 15000 })
  await commitSelected('feature.txt')
  await expect.poll(() => git(source, 'status', '--porcelain')).toBe('')
  await prepare()
  await expect(mergeButton()).toBeDisabled()
  await check()
  await page.screenshot({ path: testInfo.outputPath('checks-ready.png'), fullPage: true })
  await merge()
  const head = await git(repo, 'rev-parse', 'HEAD')
  expect((await git(repo, 'show', '-s', '--format=%P', head)).split(' ')).toHaveLength(2)
  expect(await readFile(join(repo, 'feature.txt'), 'utf8')).toBe('feature complete\n')
  await dialog().getByRole('button', { name: 'Check remote for push' }).click()
  await dialog().getByRole('button', { name: 'Push to origin/main', exact: true }).click()
  await expect(dialog().getByText(/Published .* to origin\/main/)).toBeVisible()
  expect(await git(join(home, 'remote.git'), 'rev-parse', 'refs/heads/main')).toBe(head)
})

test('resolves a real conflict, shows a failed check, reruns it, and merges only after success', async ({}, testInfo) => {
  const source = await start()
  await writeFile(join(source, 'a.txt'), 'task version\n')
  await writeFile(join(repo, 'a.txt'), 'main version\n'); await git(repo, 'add', 'a.txt'); await git(repo, '-c', 'core.hooksPath=/dev/null', 'commit', '-m', 'Other task changed main')
  await openReview(); await commitSelected('a.txt')
  await dialog().getByRole('checkbox', { name: /I have stopped/ }).last().check()
  await dialog().getByRole('button', { name: 'Prepare merge for review' }).click()
  await expect(dialog().getByRole('heading', { name: 'Resolve conflicts', exact: true })).toBeVisible()
  await expect(dialog().getByRole('button', { name: 'Send Commit Chai-n to resolve these conflicts' })).toBeEnabled()
  await page.screenshot({ path: testInfo.outputPath('helper-bench.png'), fullPage: true })
  await dialog().getByLabel('Resolved result', { exact: true }).fill('combined result\n')
  await dialog().getByRole('button', { name: 'Save resolved file' }).click()
  const checks = dialog().getByRole('region', { name: 'Checks on the prepared result' })
  await expect(checks).toBeVisible()
  const review = await page.evaluate(async key => {
    const w = window as unknown as { engine: { readBranch: (key: string, id: string, target: string) => Promise<{ ok: boolean; data: { operation: { id: string } } }> } }
    return w.engine.readBranch(key, 'one', 'main')
  }, KEY)
  const integration = join(home, '.queue-tea/integrations', KEY, review.data.operation.id, 'worktree')
  await writeFile(join(integration, '.check-fail'), 'fail')
  await checks.getByRole('checkbox', { name: /^test/ }).check(); await checks.getByRole('button', { name: 'Run selected checks' }).click()
  await expect(checks.getByRole('log', { name: 'Live output: test' }).last()).toContainText('CHECK FAILED')
  await expect(mergeButton()).toBeDisabled()
  await page.screenshot({ path: testInfo.outputPath('failed-check.png'), fullPage: true })
  await rm(join(integration, '.check-fail'))
  await check(); await merge()
  expect(await readFile(join(repo, 'a.txt'), 'utf8')).toBe('combined result\n')
  expect(await readFile(join(source, 'a.txt'), 'utf8')).toBe('task version\n')
})
