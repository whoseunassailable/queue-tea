import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication } from '@playwright/test'
import { emptyRecord } from '../../hooks/shared/records/data/datasources/record_source'
import { makeTask } from '../main/features/tasks/api/fixtures'

// Uses existing local history read-only. All records/session fixtures and app
// settings live in a temporary HOME. No commit, merge, checkout, or push runs.
test('branch graph and review show actual local history through IPC', async ({}, testInfo) => {
  const home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-branches-ui-')))
  const repo = resolve(__dirname, '../..')
  let app: ElectronApplication | undefined
  try {
    const folder = join(home, '.queue-tea/projects')
    await mkdir(folder, { recursive: true })
    const task = makeTask({ id: 'branch-ui', title: 'Branch and merge GUI', state: 'current', branch: 'task/task-description', baseBranch: 'main', worktreePath: repo,
      activity: [{ id: 'test', at: new Date().toISOString(), finished: new Date().toISOString(), kind: 'test', status: 'succeeded', subject: 'Example observed check', output: 'This output is a test fixture.', truncated: false }] })
    const record = { ...emptyRecord('Branch review demo', repo), version: 2, tasks: [task] }
    await writeFile(join(folder, 'branches-abc123.json'), JSON.stringify(record))
    app = await electron.launch({ args: [join(__dirname, '../out/main/main.js')], cwd: join(__dirname, '..'), env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' } })
    const page = await app.firstWindow()
    await page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: /Branch review demo/ }).click()
    await page.getByRole('link', { name: 'Branches', exact: true }).click()
    await expect(page.getByRole('img', { name: /actual commit parents/ })).toBeVisible()
    const card = page.getByRole('article', { name: task.title })
    await expect(card.getByText('Paused', { exact: true })).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('branch-graph.png'), fullPage: true })
    await card.getByRole('button', { name: 'Review work' }).click()
    const review = page.getByRole('dialog', { name: 'Review work' })
    await expect(review.getByText('task/task-description → main', { exact: true })).toBeVisible()
    await expect(review.getByRole('button', { name: 'Prepare merge for review' })).toBeDisabled()
    await review.getByRole('tab', { name: 'Checks' }).click()
    await expect(review.getByText('Example observed check', { exact: true })).toBeVisible()
    await review.getByText('Command output', { exact: true }).click()
    await expect(review.locator('pre')).toContainText('This output is a test fixture.')
    await page.screenshot({ path: testInfo.outputPath('branch-review.png'), fullPage: true })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    expect(await page.locator('.observed-working').count()).toBe(0)
  } finally {
    await app?.close()
    await rm(home, { recursive: true, force: true })
  }
})
