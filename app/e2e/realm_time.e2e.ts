import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication } from '@playwright/test'

import type { ProjectRecord } from '../../types'
import { applyPending, createTracker } from '../../hooks/shared/effort/domain/services/effort_tracker'
import { emptyRecord } from '../../hooks/shared/records/data/datasources/record_source'
import { dayKey } from '../../hooks/shared/time/domain/services/time'
import { makeTask } from '../main/features/tasks/api/fixtures'

const APP = join(__dirname, '..')
const MINUTE = 60_000

test('Realm totals merge parallel task work and survive restarting the app', async () => {
  const home = await mkdtemp(join(tmpdir(), 'queue-tea-realm-time-ui-'))
  let app: ElectronApplication | undefined
  try {
    const offset = -new Date().getTimezoneOffset()
    const day = dayKey(Date.now(), offset)
    const at = (hour: number) => Date.parse(`${day}T00:00:00Z`) + (hour * 60 - offset) * MINUTE
    let record: ProjectRecord = {
      ...emptyRecord('overlap', '/p/overlap'),
      tasks: ['one', 'two'].map(id => makeTask({ id, title: `Task ${id}`, state: 'current', worktreePath: `/trees/${id}` })),
    }
    for (const [id, start, end] of [['one', 13, 16], ['two', 14, 17]] as const) {
      const tracker = createTracker(15, offset)
      for (let time = at(start); time <= at(end); time += 15 * MINUTE) tracker.activity(time)
      record = applyPending(record, tracker.take(), undefined, { cwd: `/trees/${id}`, projectPath: '/p/overlap' })
    }
    record.tasks = record.tasks.map(task => ({ ...task, state: 'done', finished: new Date(at(17)).toISOString() }))
    const folder = join(home, '.queue-tea/projects')
    await mkdir(folder, { recursive: true })
    await writeFile(join(folder, 'overlap-abc123.json'), JSON.stringify(record))

    for (let launch = 0; launch < 2; launch += 1) {
      app = await electron.launch({
        args: [join(APP, 'out/main/main.js')], cwd: APP,
        env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
      })
      const page = await app.firstWindow()
      await page.getByRole('button', { name: /^overlap/ }).click()
      await page.keyboard.press('Meta+7')
      await expect(page.locator('[aria-labelledby="today-h"] .big')).toHaveText('4h 0m')
      await expect(page.locator('[aria-labelledby="week-h"] .big')).toHaveText('4h 0m')
      for (const id of ['one', 'two']) {
        await expect(page.locator('.bar-row').filter({ hasText: `Task ${id}` }).locator('.num')).toHaveText('3h 0m')
      }
      await page.keyboard.press('Meta+6')
      await expect(page.locator('.summary')).toContainText('4h 0m')
      await app.close()
      app = undefined
    }
  } finally {
    await app?.close()
    await rm(home, { recursive: true, force: true })
  }
})
