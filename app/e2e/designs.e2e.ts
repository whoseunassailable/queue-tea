import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

// The Designs tab on a realm that is a git folder with sample designs: the
// editor's gestures need real pointer events and layout, so they're covered here.

const APP = join(__dirname, '..')
const run = promisify(execFile)

let home: string
let realm: string
let app: ElectronApplication
let page: Page
const errors: string[] = []

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`
const designFile = (folder: string, file: string) => join(realm, 'docs/designs', folder, file)
const onDisk = async (folder: string, file: string) => JSON.parse(await readFile(designFile(folder, file), 'utf8'))
const layerOn = async (id: string) => (await onDisk('5.4.3', 'welcome.design.json')).nodes.flatMap((l: { children?: unknown[] }) => [l, ...(l.children ?? [])]).find((l: { id: string }) => l.id === id)

const text = (id: string, name: string, x: number, y: number, width: number, words: string, size = 15, weight = 400, color = '#2A2218', font = 'Nunito Sans') => ({ id, type: 'text', name, x, y, width, text: words, font, size, weight, color })
const frame = (id: string, name: string, x: number, y: number, width: number, height: number, fill: string, radius = 0, children: unknown[] = []) => ({ id, type: 'frame', name, x, y, width, height, fill, radius, children })

// A layer type the editor doesn't know: it shows as a grey box and is kept.
const CHART = { id: 'chart', type: 'chart', name: 'Stride chart', x: 24, y: 600, width: 342, height: 60, series: [1, 2, 3] }
const HEADLINE = 'Walk better every step'
const WELCOME = {
  format: 1,
  name: 'Welcome',
  width: 390,
  height: 844,
  fill: '#F6F1E7',
  edited: { by: 'claude', at: '2026-11-04T22:20:00.000Z' },
  nodes: [
    frame('hero', 'Hero', 0, 0, 390, 420, '#BFE3D5', 0, [frame('sun', 'Sun', 250, 60, 90, 90, '#FFE9A8', 45)]),
    text('headline', 'Headline', 24, 293, 342, HEADLINE, 28, 400, '#2A2218', 'Marcellus'),
    text('body', 'Body', 24, 340, 342, 'Your insoles listen to each step and play a soft note when your stride starts to drift.', 15, 400, '#54473A'),
    frame('tip', 'Tip card', 24, 467, 342, 104, '#DDF2E8', 12, [text('tip-title', 'Tip title', 16, 16, 310, 'Pair both insoles first', 15, 700, '#1B6650'), text('tip-body', 'Tip body', 16, 44, 310, 'Hold the button on each insole until it glows.', 13, 400, '#1B6650')]),
    frame('cta', 'Get started', 24, 700, 342, 52, '#2E9C7E', 26, [{ ...text('cta-label', 'Label', 0, 15, 342, 'Get started', 16, 800, '#FFFFFF'), align: 'center' }]),
    CHART,
  ],
}
const PAIR = {
  format: 1,
  name: 'Pair your insoles',
  width: 390,
  height: 844,
  fill: '#FFFAEE',
  edited: { by: 'claude', at: '2026-11-04T22:20:00.000Z' },
  nodes: [text('h', 'Headline', 24, 120, 342, 'Pair your insoles', 30, 400, '#2A2218', 'Marcellus'), frame('l', 'Left insole', 40, 260, 140, 300, '#E2BC66', 70), frame('r', 'Right insole', 210, 260, 140, 300, '#E2BC66', 70)],
}
// A comma missing after "width": 390.
const LIVE_WALK = '{\n  "format": 1,\n  "name": "Live walk",\n  "width": 390\n  "height": 844\n}\n'
const comment = (id: string, on: string | null, words: string, over: Record<string, unknown> = {}) => ({ id, design: 'welcome', on, text: words, by: 'Rohan', at: '2026-11-05T10:00:00.000Z', resolved: null, sentTo: null, ...over })

const writeVersion = async (folder: string, files: Record<string, unknown>) => {
  await mkdir(join(realm, 'docs/designs', folder), { recursive: true })
  for (const [file, value] of Object.entries(files)) await writeFile(designFile(folder, file), typeof value === 'string' ? value : json(value))
}

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-designs-'))
  realm = join(home, 'gait')
  await mkdir(realm)
  for (const args of [['init', '-q', '-b', 'main'], ['config', 'user.name', 'Rohan Bhande'], ['config', 'user.email', 'rohan@example.com']]) await run('git', args, { cwd: realm })
  await writeVersion('5.4.3', {
    'version.json': { format: 1, label: '5.4.3', made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designs: ['welcome', 'pair-your-insoles', 'live-walk'] },
    'welcome.design.json': WELCOME,
    'pair-your-insoles.design.json': PAIR,
    'live-walk.design.json': LIVE_WALK,
    'comments.json': {
      format: 1,
      comments: [
        comment('c1', 'headline', 'Make the headline shorter, it wraps to three lines on a small phone.'),
        comment('c2', null, 'The hero is too tall: the button drops below the fold on an SE.'),
        comment('c3', 'tip', 'Use the jade tip card, not grey.', { resolved: '2026-11-04T15:00:00.000Z' }),
      ],
    },
  })
  await writeVersion('onboarding-pass-2', { 'version.json': { format: 1, label: 'Onboarding pass 2', made: '2026-11-01T10:00:00-06:00', by: 'you', from: 'v5', designs: ['welcome'] }, 'welcome.design.json': { ...WELCOME, nodes: WELCOME.nodes.slice(0, 3) } })
  await writeVersion('5.4.2', { 'version.json': '{ "format": 1, "label": "5.4.2",\n  "made": "2026-10-28T16:02:00-06:00"\n  "designs": [] }\n', 'welcome.design.json': WELCOME })

  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects/gait-abc123.json'), JSON.stringify({ version: 2, project: { name: 'Gait-feedback', path: realm }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))

  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  page.on('pageerror', err => errors.push(String(err)))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: /^Gait-feedback/ }).click()
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('⌘3 opens Designs at the newest version that reads', async () => {
  await page.keyboard.press('Meta+3')

  await expect(page.getByRole('heading', { name: '5.4.3', level: 1 })).toBeVisible()
  expect(page.url()).toContain('#/designs')
  await expect(page.getByRole('button', { name: /^Welcome/ })).toBeVisible()
  await expect(page.getByText('docs/designs/5.4.3/live-walk.design.json: It has a mistake near line 5.', { exact: false })).toBeVisible()
})

test('a version in the history rail shows its designs, and one that does not read says why', async () => {
  const rail = page.getByRole('complementary', { name: 'History' })

  await rail.getByRole('button', { name: /^Onboarding pass 2/ }).click()
  await expect(page.getByRole('heading', { name: 'Onboarding pass 2', level: 1 })).toBeVisible()
  await expect(page.locator('.dz-cards').getByRole('button')).toHaveCount(1)

  await rail.getByRole('button', { name: /^5\.4\.2/ }).click()
  await expect(page.getByRole('heading', { name: "5.4.2 doesn't read" })).toBeVisible()
  await expect(page.getByText('It has a mistake near line 3.', { exact: false })).toBeVisible()

  await rail.getByRole('button', { name: /^5\.4\.3/ }).click()
  await expect(page.getByRole('heading', { name: '5.4.3', level: 1 })).toBeVisible()
})

test('a card opens in the editor, which shows a layer it does not know as a grey box', async () => {
  await page.getByRole('button', { name: /^Welcome/ }).click()

  await expect(page.getByRole('application', { name: /^Welcome, the design/ })).toBeVisible()
  await expect(page.locator('[data-layer="chart"]')).toHaveText("Can't show this layer yet")
})

test('dragging the tip card\'s corner handle changes its W and H in the inspector', async () => {
  const inspector = page.getByRole('region', { name: 'Inspector' })
  const tip = (await page.locator('[data-layer="tip"]').boundingBox())!
  // Its bottom-right corner, clear of the texts it holds.
  await page.mouse.click(tip.x + tip.width - 6, tip.y + tip.height - 6)
  await expect(inspector.getByRole('heading', { name: /Tip card/ })).toBeVisible()
  await expect(inspector.getByLabel('W', { exact: true })).toHaveValue('342')
  await expect(inspector.getByLabel('H', { exact: true })).toHaveValue('104')

  const handle = (await page.locator('.dz-handle.h-se').boundingBox())!
  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2)
  await page.mouse.down()
  await page.mouse.move(handle.x + 40, handle.y + 30, { steps: 5 })
  await page.mouse.up()

  await expect.poll(async () => Number(await inspector.getByLabel('W', { exact: true }).inputValue())).toBeGreaterThan(342)
  await expect.poll(async () => Number(await inspector.getByLabel('H', { exact: true }).inputValue())).toBeGreaterThan(104)
})

test('double-clicking a text edits it in place, and Esc finishes', async () => {
  await page.locator('[data-layer="headline"]').dblclick()
  const box = page.getByRole('textbox', { name: 'Headline', exact: true })
  await expect(box).toBeFocused()

  // The editor selects the whole text, so typing replaces it.
  await page.keyboard.type('Walk better today')
  await page.keyboard.press('Escape')

  await expect(box).toHaveCount(0)
  await expect(page.locator('[data-layer="headline"]')).toHaveText('Walk better today')
})

test('the design is saved to disk, keeping the layer the editor does not know', async () => {
  await expect.poll(async () => (await layerOn('headline')).text, { timeout: 10_000 }).toBe('Walk better today')

  const saved = await onDisk('5.4.3', 'welcome.design.json')
  expect((await layerOn('tip')).width).toBeGreaterThan(342)
  expect(saved.nodes.find((l: { id: string }) => l.id === 'chart')).toEqual(CHART)
  expect(saved.edited.by).toBe('you')
  await expect(page.getByRole('button', { name: /^Saved \d\d:\d\d$/ })).toBeVisible()
})

test('⌘Z undoes the text, and the undo is saved too', async () => {
  await page.keyboard.press('Meta+z')

  await expect(page.locator('[data-layer="headline"]')).toHaveText(HEADLINE)
  await expect.poll(async () => (await layerOn('headline')).text, { timeout: 10_000 }).toBe(HEADLINE)
  expect((await layerOn('tip')).width).toBeGreaterThan(342)
})

test('a comment is added about the selected layer', async () => {
  await page.locator('[data-layer="headline"]').click()
  await expect(page.getByText('About Headline')).toBeVisible()

  await page.getByLabel('Your comment *').fill('Warmer colours on the headline')
  await page.getByRole('button', { name: 'Add comment' }).click()

  await expect(page.locator('.dz-c-text').filter({ hasText: 'Warmer colours on the headline' })).toBeVisible()
  await expect(page.getByLabel('Your comment *')).toHaveValue('')
  await expect
    .poll(async () => (await onDisk('5.4.3', 'comments.json')).comments.at(-1))
    .toMatchObject({ design: 'welcome', on: 'headline', text: 'Warmer colours on the headline', by: 'Rohan', resolved: null, sentTo: null })
})

test('Next version files a quest from the open comments and shows the version coming', async () => {
  await page.getByRole('button', { name: '‹ 5.4.3' }).click()
  await expect(page.getByRole('heading', { name: '5.4.3', level: 1 })).toBeVisible()
  await expect(page.getByText('3 open comments on 1 design.', { exact: false })).toBeVisible()

  await page.getByRole('button', { name: 'Next version…' }).click()
  const sheet = page.getByRole('dialog', { name: 'Next version from 5.4.3' })
  await expect(sheet.getByLabel('Version label *')).toHaveValue('5.4.4')
  await sheet.getByRole('button', { name: 'File quest' }).click()

  await expect(page.getByText('Next version filed')).toBeVisible()
  await expect(page.getByRole('complementary', { name: 'History' }).getByText('Quest queued · not drafted yet')).toBeVisible()
  await expect
    .poll(async () => JSON.parse(await readFile(join(home, '.queue-tea/projects/gait-abc123.json'), 'utf8')).tasks.map((task: { title: string }) => task.title))
    .toEqual(["Designs 5.4.4 from 5.4.3's feedback"])
  const comments = (await onDisk('5.4.3', 'comments.json')).comments as { id: string; sentTo: string | null }[]
  expect(comments.map(c => c.sentTo)).toEqual(['5.4.4', '5.4.4', null, '5.4.4'])
  expect((await onDisk('5.4.3', 'version.json')).next).toEqual({ label: '5.4.4', quest: "Designs 5.4.4 from 5.4.3's feedback" })
})

test('nothing in the window threw', () => {
  expect(errors).toEqual([])
})
