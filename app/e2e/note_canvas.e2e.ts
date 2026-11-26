import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

const APP = join(__dirname, '..')
const KEY = 'board-abc123'

type Board = { nodes: { id: string; type: string; file?: string; x: number; y: number; width: number; height: number; [field: string]: unknown }[]; edges: { fromNode: string; toNode: string; [field: string]: unknown }[] }

let home: string
let app: ElectronApplication
let page: Page
const boardFile = async (): Promise<Board> => JSON.parse(await readFile(join(home, '.queue-tea/notes', KEY, 'Canvas.canvas'), 'utf8')) as Board
const cardOf = (board: Board, file: string) => board.nodes.find(node => node.file === file)!
const zoom = async () => Number((await page.locator('.nc-zoom .sub').textContent())!.replace('%', '')) / 100

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-canvas-'))
  const notes = join(home, '.queue-tea/notes', KEY)
  await mkdir(join(home, 'project'))
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(notes, { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify({ version: 2, project: { name: 'Board notes', path: join(home, 'project') }, tasks: [], requests: [] }))
  await writeFile(join(notes, 'Alpha.md'), '---\ntitle: Alpha\n---\nThe first idea.')
  await writeFile(join(notes, 'Beta.md'), '---\ntitle: Beta\n---\nThe second idea.')
  // A board as Obsidian leaves it: a coloured group and a text card, which must come back as they were.
  await writeFile(join(notes, 'Canvas.canvas'), JSON.stringify({ nodes: [{ id: 'g1', type: 'group', label: 'Week 1', color: '4', x: -40, y: -60, width: 800, height: 400 }, { id: 'a1', type: 'file', file: 'Alpha.md', x: 0, y: 0, width: 280, height: 160 }, { id: 't1', type: 'text', text: 'Ask the clinic', x: 0, y: 200, width: 240, height: 80 }], edges: [] }, null, '\t'))
  app = await electron.launch({ args: [join(APP, 'out/main/main.js')], cwd: APP, env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' } })
  page = await app.firstWindow()
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: /^Board notes/ }).click()
  await page.keyboard.press('Meta+4')
  await expect(page.getByLabel('Title *')).not.toHaveValue('')
  await page.getByRole('button', { name: 'Canvas', exact: true }).click()
  await expect(page.getByRole('region', { name: 'Canvas: 3 cards, 0 lines' })).toBeVisible()
})

test.afterAll(async () => {
  await page?.close()
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('a note added from the list lands on the board and in the file', async () => {
  await page.getByRole('button', { name: 'Add note or quest…' }).click()
  await page.getByLabel('Find a note or a quest').fill('bet')
  await page.getByRole('button', { name: 'Beta, note in Inbox' }).click()

  await expect(page.getByRole('group', { name: 'note Beta' })).toBeVisible()
  await expect.poll(async () => cardOf(await boardFile(), 'Beta.md')?.type).toBe('file')
})

test('dragging a card moves it, dragging its corner resizes it, and each saves once let go', async () => {
  const before = cardOf(await boardFile(), 'Alpha.md')
  const scale = await zoom()
  const alpha = page.getByRole('group', { name: 'note Alpha' })
  const box = (await alpha.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height - 20)
  await page.mouse.down()
  // Right, clear of Beta, which landed over Alpha's corner and would take the resize.
  await page.mouse.move(box.x + box.width / 2 + 300, box.y + box.height, { steps: 6 })
  await page.mouse.up()

  await expect.poll(async () => cardOf(await boardFile(), 'Alpha.md').x).toBeCloseTo(before.x + 300 / scale, -1)
  expect(cardOf(await boardFile(), 'Alpha.md').y).toBeCloseTo(before.y + 20 / scale, -1)

  const moved = (await alpha.boundingBox())!
  await page.mouse.move(moved.x + moved.width - 4, moved.y + moved.height - 4)
  await page.mouse.down()
  await page.mouse.move(moved.x + moved.width + 56, moved.y + moved.height + 26, { steps: 6 })
  await page.mouse.up()
  await expect.poll(async () => cardOf(await boardFile(), 'Alpha.md').width).toBeCloseTo(before.width + 60 / scale, -1)
})

test('Connect, then another card, draws a line between them, and Delete on the line removes it', async () => {
  // Beta first moves left off Alpha with the keyboard, so the line between them shows.
  const before = cardOf(await boardFile(), 'Beta.md').x
  await page.getByRole('group', { name: 'note Beta' }).focus()
  for (const _ of [1, 2, 3]) await page.keyboard.press('Shift+ArrowLeft')
  await expect.poll(async () => cardOf(await boardFile(), 'Beta.md').x).toBe(before - 240)
  const alpha = page.getByRole('group', { name: 'note Alpha' })
  // Alpha's right side, clear of every other card.
  const { width } = (await alpha.boundingBox())!
  await alpha.hover({ position: { x: width - 30, y: 40 } })
  await alpha.getByRole('button', { name: 'Connect note Alpha to another card' }).click()
  await expect(page.getByText('Pick the card to connect note Alpha to. Esc cancels.')).toBeVisible()
  const beta = (await page.getByRole('group', { name: 'note Beta' }).boundingBox())!
  await page.mouse.click(beta.x + beta.width / 2, beta.y + beta.height - 20)

  const line = page.getByRole('button', { name: 'Line from note Alpha to note Beta. Delete removes it.' })
  await expect(line).toBeAttached()
  await expect.poll(async () => (await boardFile()).edges.length).toBe(1)
  const { edges, nodes } = await boardFile()
  expect(edges[0]).toMatchObject({ fromNode: nodes.find(node => node.file === 'Alpha.md')!.id, toNode: nodes.find(node => node.file === 'Beta.md')!.id, fromSide: expect.any(String), toSide: expect.any(String) })
  await page.screenshot({ path: test.info().outputPath('canvas.png') })

  await line.focus()
  await page.keyboard.press('Delete')
  await expect.poll(async () => (await boardFile()).edges.length).toBe(0)
})

test("Obsidian's group and text card come back as they were, and the board is the same after leaving it", async () => {
  const board = await boardFile()
  expect(board.nodes.find(node => node.id === 'g1')).toEqual({ id: 'g1', type: 'group', label: 'Week 1', color: '4', x: -40, y: -60, width: 800, height: 400 })
  expect(board.nodes.find(node => node.id === 't1')).toEqual({ id: 't1', type: 'text', text: 'Ask the clinic', x: 0, y: 200, width: 240, height: 80 })

  const left = await page.getByRole('group', { name: 'note Alpha' }).evaluate(card => (card as HTMLElement).style.left)
  await page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: /^Beta/ }).click()
  await expect(page.getByLabel('Title *')).toHaveValue('Beta')
  await page.getByRole('button', { name: 'Canvas', exact: true }).click()
  await expect(page.getByRole('group', { name: 'note Alpha' })).toHaveCSS('left', left)
})
