import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

// The Notes tab end to end: notes are real Markdown files in the home folder,
// and BrewQuest files quests into the realm's real record.

const APP = join(__dirname, '..')
const KEY = 'gait-abc123'

let home: string
let app: ElectronApplication
let page: Page
const errors: string[] = []

const notesDir = () => join(home, '.queue-tea/notes', KEY)
const noteFiles = async () => (await readdir(notesDir())).filter(name => name.endsWith('.md'))
const record = async () => JSON.parse(await readFile(join(home, '.queue-tea/projects', `${KEY}.json`), 'utf8'))

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-notes-'))
  await mkdir(join(home, 'gait'))
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify({ version: 2, project: { name: 'Gait-feedback', path: join(home, 'gait') }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))
  // A note Obsidian made, to link to.
  await mkdir(notesDir(), { recursive: true })
  await writeFile(join(notesDir(), 'Threat model.md'), '---\ntitle: Threat model\ntags:\n  - security\n---\nWhat could go wrong.')

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

test('⌘7 opens Notes on the newest note, read from its Markdown file', async () => {
  await page.keyboard.press('Meta+7')

  expect(page.url()).toContain('#/notes')
  await expect(page.getByLabel('Title *')).toHaveValue('Threat model')
  await expect(page.getByLabel('Tags')).toHaveValue('security')
})

test('a jotted idea becomes a note file, and typing saves into it', async () => {
  const capture = page.getByLabel('Jot an idea')
  await capture.fill('Bug Bounty Helper')
  await capture.press('Meta+Enter')
  await expect(page.getByLabel('Title *')).toHaveValue('Bug Bounty Helper')

  const body = page.getByRole('combobox', { name: 'Note' })
  await body.click()
  await body.pressSequentially('A security helper. See [[thr')
  await expect(page.getByRole('option', { name: /Threat model/ })).toBeVisible()
  await body.press('Enter')
  await body.pressSequentially('\n\n- [ ] Scan dependencies\n- [ ] Write the report')
  await expect(page.getByText(/^Saved \d\d:\d\d$/)).toBeVisible()

  const files = await noteFiles()
  expect(files).toHaveLength(2)
  const made = files.find(name => name.startsWith('n-'))!
  const text = await readFile(join(notesDir(), made), 'utf8')
  expect(text).toContain('title: "Bug Bounty Helper"')
  expect(text).toContain('aliases: ["Bug Bounty Helper"]')
  expect(text).toContain('A security helper. See [[Threat model]]\n\n- [ ] Scan dependencies\n- [ ] Write the report')
})

test('the linked note shows the backlink', async () => {
  await page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: /^Threat model/ }).click()

  await expect(page.getByRole('complementary', { name: 'About this note' }).getByRole('button', { name: 'Bug Bounty Helper' })).toBeVisible()
  await page.getByRole('complementary', { name: 'About this note' }).getByRole('button', { name: 'Bug Bounty Helper' }).click()
  await expect(page.getByLabel('Title *')).toHaveValue('Bug Bounty Helper')
})

test('BrewQuest files the checklist as a saga in the realm’s queue, linked back to the note', async () => {
  await page.getByRole('button', { name: 'Turn into quests…' }).click()
  const sheet = page.getByRole('dialog', { name: 'Turn Bug Bounty Helper into quests' })
  await expect(sheet.getByLabel('Parent quest *')).toHaveValue('Bug Bounty Helper')
  await sheet.getByRole('button', { name: 'File 3 quests' }).click()
  await expect(sheet).toBeHidden()

  const tasks = (await record()).tasks as { id: string; title: string; parentId: string | null; description: string }[]
  expect(tasks.map(task => task.title)).toEqual(['Bug Bounty Helper', 'Scan dependencies', 'Write the report'])
  expect(tasks[1]!.parentId).toBe(tasks[0]!.id)
  expect(tasks[1]!.description).toBe('From the note "Bug Bounty Helper" in Notes.')
  const about = page.getByRole('complementary', { name: 'About this note' })
  await expect(about.getByRole('button', { name: 'Open Scan dependencies in Quests' })).toBeVisible()

  await about.getByRole('button', { name: 'Open Scan dependencies in Quests' }).click()
  expect(page.url()).toContain('#/quests')
  expect(errors).toEqual([])
})

test('⇧⌘N from another screen opens Notes on a new Untitled note', async () => {
  await page.keyboard.press('Meta+2')
  expect(page.url()).toContain('#/quests')

  await page.keyboard.press('Meta+Shift+N')

  await expect(page.getByLabel('Title *')).toHaveValue('Untitled')
  expect(page.url()).toContain('#/notes')
  expect(await noteFiles()).toHaveLength(3)
})

test('narrower windows float the inspector behind Details, then put the list in a drawer', async () => {
  await page.setViewportSize({ width: 1000, height: 900 })
  await expect(page.getByRole('complementary', { name: 'About this note' })).toBeHidden()
  await page.getByRole('button', { name: 'Details' }).click()
  await expect(page.getByRole('complementary', { name: 'About this note' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('complementary', { name: 'About this note' })).toBeHidden()

  await page.setViewportSize({ width: 760, height: 900 })
  await expect(page.getByLabel('Search notes')).toBeHidden()
  await page.getByRole('button', { name: 'Notes', exact: true }).click()
  await expect(page.getByLabel('Jot an idea')).toBeFocused()
  await page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: /^Threat model/ }).click()
  await expect(page.getByLabel('Title *')).toHaveValue('Threat model')
  await expect(page.getByLabel('Search notes')).toBeHidden()
  await page.setViewportSize({ width: 1440, height: 900 })
  expect(errors).toEqual([])
})

test('⌘E reads the note, and ticking a box there writes [x] into the file', async () => {
  await page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: /^Bug Bounty Helper/ }).click()
  await page.keyboard.press('Meta+e')

  await expect(page.getByRole('button', { name: 'Read', pressed: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Threat model' }).first()).toBeVisible()
  await page.getByLabel('Done: Scan dependencies').check()
  await expect(page.getByText(/^Saved \d\d:\d\d$/)).toBeVisible()

  const made = (await noteFiles()).find(name => name.startsWith('n-') && name !== 'Threat model.md')!
  const files = await Promise.all((await noteFiles()).map(name => readFile(join(notesDir(), name), 'utf8')))
  expect(files.some(text => text.includes('- [x] Scan dependencies'))).toBe(true)
  expect(made).toBeTruthy()
  await page.keyboard.press('Meta+e')
  await expect(page.getByRole('combobox', { name: 'Note' })).toBeVisible()
  expect(errors).toEqual([])
})

test('a template, folder move, rename and pin survive reopening, with links still opening', async () => {
  await page.getByRole('button', { name: 'New note', exact: true }).click()
  const templates = page.getByRole('group', { name: 'Start from a template' })
  await templates.getByRole('button', { name: 'Bug', exact: true }).click()
  const body = page.getByRole('combobox', { name: 'Note' })
  await expect(body).toHaveValue(/## Steps to reproduce/)
  await expect(page.getByLabel('Type', { exact: true })).toHaveValue('bug')
  await page.getByLabel('Title *').fill('Incident review')
  await page.getByLabel('Title *').press('Tab')
  await body.fill('## Steps to reproduce\n\nSee [[Threat model]].\n\n- [ ] Reproduce')
  await page.getByLabel('Folder', { exact: true }).fill('Incidents')
  await page.getByLabel('Folder', { exact: true }).press('Tab')
  await expect(page.getByRole('region', { name: 'Incidents' })).toBeVisible()
  await page.getByRole('button', { name: 'Rename the folder Incidents' }).click()
  const dialog = page.getByRole('dialog', { name: 'Rename Incidents' })
  await dialog.getByLabel('Folder name *').fill('Casebook')
  await dialog.getByRole('button', { name: 'Rename folder', exact: true }).click()
  await expect(dialog).toBeHidden()
  await expect(page.getByLabel('Folder', { exact: true })).toHaveValue('Casebook')
  await page.getByRole('button', { name: 'Pin note', exact: true }).click()
  await expect(page.getByRole('region', { name: 'Pinned', exact: true }).getByRole('button', { name: /^Incident review/ })).toBeVisible()

  const saved = async () => {
    const files = await Promise.all((await noteFiles()).map(name => readFile(join(notesDir(), name), 'utf8')))

    return files.find(text => text.includes('title: "Incident review"')) ?? ''
  }
  expect(await saved()).toContain('type: "bug"')
  expect(await saved()).toContain('folder: "Casebook"')
  expect(await saved()).toContain('pinned: true')
  expect(await saved()).toContain('[[Threat model]]')

  await page.reload()
  await expect(page.getByLabel('Title *')).toHaveValue('Incident review')
  await expect(page.getByLabel('Type', { exact: true })).toHaveValue('bug')
  await expect(page.getByLabel('Folder', { exact: true })).toHaveValue('Casebook')
  await page.getByRole('button', { name: 'Unpin note', exact: true }).click()
  await expect(page.getByRole('region', { name: 'Casebook' }).getByRole('button', { name: /^Incident review/ })).toBeVisible()
  await page.getByRole('button', { name: 'Read', exact: true }).click()
  await page.locator('.nt-read').getByRole('button', { name: 'Threat model', exact: true }).click()
  await expect(page.getByLabel('Title *')).toHaveValue('Threat model')
  await expect(page.getByRole('complementary', { name: 'About this note' }).getByRole('button', { name: 'Incident review', exact: true })).toBeVisible()
  expect(errors).toEqual([])
})
