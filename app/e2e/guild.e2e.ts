import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

const APP = join(__dirname, '..')
const SHOTS = process.env.QUEUE_TEA_SHOTS

let home: string
let app: ElectronApplication
let page: Page

const event = (value: object) => `printf '%s\\n' '${JSON.stringify(value)}'`

// A stand-in for claude, found before the real one, so no test spends tokens.
// It reads a file, then waits until the test lets it answer.
const plantClaude = async () => {
  const bin = join(home, 'bin')
  await mkdir(bin, { recursive: true })
  await writeFile(
    join(bin, 'claude'),
    `#!/bin/sh
echo "$*" >> '${home}/claude-calls'
${event({ type: 'system', subtype: 'init', agents: ['claude', 'queue-tea:commit-chai-n', 'queue-tea:mocha-mockup', 'queue-tea:chai-pter', 'queue-tea:tea-dd'] })}
${event({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Read', input: { file_path: '/x/timer.ts' } }] } })}
while [ ! -f '${home}/claude-go' ]; do sleep 0.05; done
rm '${home}/claude-go'
${event({ type: 'result', subtype: 'success', is_error: false, result: 'Added three tests.' })}
`,
  )
  await chmod(join(bin, 'claude'), 0o755)

  return bin
}

const card = (name: string) => page.locator('.member', { has: page.getByRole('heading', { name }) })
const shot = async (name: string) => {
  if (SHOTS !== undefined) await page.screenshot({ path: join(SHOTS, `${name}.png`) })
}

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-guild-'))
  const folder = join(home, '.queue-tea/projects')
  const realm = join(home, 'alpha')
  await mkdir(folder, { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await mkdir(realm)
  await writeFile(
    join(folder, 'alpha-abc123.json'),
    JSON.stringify({ version: 1, project: { name: 'alpha', path: realm }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }),
  )
  const bin = await plantClaude()

  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, PATH: `${bin}:${process.env.PATH ?? ''}`, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  await page.getByRole('button', { name: /^alpha/ }).click()
  await page.getByRole('link', { name: 'Guild Hall' }).click()
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('an empty order is caught before anything is sent', async () => {
  await card('Tea-DD').getByRole('button', { name: 'Send' }).click()

  await expect(card('Tea-DD').getByText('Order is required.')).toBeVisible()
})

test('a helper takes an order, shows what it is doing, then answers', async () => {
  const tea = card('Tea-DD')
  await expect(tea.getByText('Anything that needs a test?')).toBeVisible()

  await tea.getByLabel(/Order for Tea-DD/).fill('Write tests for the timer')
  await tea.getByRole('button', { name: 'Send' }).click()

  await expect(tea.getByText('Reading timer.ts…')).toBeVisible()
  await expect(tea.locator('.portrait.working')).toHaveCount(1)
  await expect(tea.getByText('At work')).toBeVisible()
  await shot('guild-working')

  await writeFile(join(home, 'claude-go'), '')

  await expect(tea.getByText('Added three tests.')).toBeVisible()
  await expect(tea.locator('.portrait.done')).toHaveCount(1)
  await shot('guild-done')
  expect(await readFile(join(home, 'claude-calls'), 'utf8')).toBe('-p --agent queue-tea:tea-dd --output-format stream-json --verbose -- Write tests for the timer\n')
})

test('a helper at work can be stopped', async () => {
  const chai = card('Chai-pter')
  await chai.getByLabel(/Order for Chai-pter/).fill('Write up the Guild Hall')
  await chai.getByRole('button', { name: 'Send' }).click()
  await expect(chai.getByText('Reading timer.ts…')).toBeVisible()

  await chai.getByRole('button', { name: 'Stop' }).click()

  await expect(chai.getByText('Stopped. Nothing after that step was done.')).toBeVisible()
  await expect(chai.getByRole('button', { name: 'Try again' })).toBeVisible()
})
