import { mkdir, mkdtemp, realpath, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication } from '@playwright/test'

import { emptyRecord } from '../../hooks/shared/records/data/datasources/record_source'
import { makeTask } from '../main/features/tasks/api/fixtures'

// The record lives in a temporary home. No real git operations or terminal
// sessions are needed to verify the watcher → IPC → activity pane flow.
test('a task shows the check it is running, then how it ended, as the record changes', async () => {
  const home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-activity-')))
  let app: ElectronApplication | undefined
  try {
    const folder = join(home, '.queue-tea/projects')
    const repo = join(home, 'demo')
    await mkdir(folder, { recursive: true })
    await mkdir(repo)
    const record = { ...emptyRecord('Activity demo', repo), tasks: [makeTask({ id: 'active', title: 'Show task activity', state: 'current',
      step: { id: 'check', at: '2026-11-04T12:00:00Z', finished: null, kind: 'test', status: 'running', subject: 'npm test' } })] }
    const file = join(folder, 'activity-abc123.json')
    await writeFile(file, JSON.stringify(record))
    app = await electron.launch({ args: [join(__dirname, '../out/main/main.js')], cwd: join(__dirname, '..'),
      env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' } })
    const page = await app.firstWindow()
    await page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: /Activity demo/ }).click()
    await page.getByRole('link', { name: 'Quests', exact: true }).click()
    await page.getByRole('button', { name: 'Show the details of Show task activity' }).click()
    const feed = page.getByRole('region', { name: 'Task activity' })
    const line = feed.getByLabel('Current step')
    await expect(line).toContainText('Now')
    await expect(line).toContainText('Running checks')
    const step = record.tasks[0]!.step!
    step.status = 'failed'
    step.finished = '2026-11-04T12:01:00Z'
    await writeFile(`${file}.tmp`, JSON.stringify(record))
    await rename(`${file}.tmp`, file)
    await expect(line).toContainText('Last step')
    await expect(line.getByText('Failed', { exact: true })).toBeVisible()
    await expect(feed.locator('pre')).toHaveCount(0)
  } finally {
    await app?.close()
    await rm(home, { recursive: true, force: true })
  }
})
