import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

// Daily notes end to end: Today and Open day make real Markdown files in
// Journal, from the realm's own "Daily template" note.

const APP = join(__dirname, '..')
const KEY = 'diary-abc123'

let home: string
let app: ElectronApplication
let page: Page
const errors: string[] = []

const notesDir = () => join(home, '.queue-tea/notes', KEY)
const at = new Date()
const today = `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(at.getDate()).padStart(2, '0')}`
// A day in another month, so the journal shows two month groups.
const OTHER = today.slice(5, 7) === '01' ? `${Number(today.slice(0, 4)) - 1}-12-01` : `${today.slice(0, 4)}-01-15`

const fileTitled = async (title: string): Promise<string> => {
  for (const name of await readdir(notesDir())) {
    const text = name.endsWith('.md') ? await readFile(join(notesDir(), name), 'utf8') : ''
    if (text.includes(`title: "${title}"`)) return text
  }
  throw new Error(`No note file titled ${title}`)
}

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-daily-'))
  await mkdir(join(home, 'diary'))
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify({ version: 2, project: { name: 'Diary', path: join(home, 'diary') }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))
  await mkdir(notesDir(), { recursive: true })
  await writeFile(join(notesDir(), 'Daily template.md'), '---\ntitle: Daily template\n---\n## Plan for {{date}}\n\n- [ ] ')

  app = await electron.launch({
    args: [join(APP, 'out/main/main.js')],
    cwd: APP,
    env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' },
  })
  page = await app.firstWindow()
  page.on('pageerror', err => errors.push(String(err)))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: /^Diary/ }).click()
  await page.keyboard.press('Meta+7')
})

test.afterAll(async () => {
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test("Today makes today's note in Journal from the realm's daily template", async () => {
  await page.getByRole('button', { name: `Open today's note, ${today}` }).click()

  await expect(page.getByLabel('Title *')).toHaveValue(today)
  await expect(page.getByRole('combobox', { name: 'Note' })).toBeFocused()
  await expect.poll(() => fileTitled(today).catch(() => '')).toContain(`## Plan for ${today}`)
  const text = await fileTitled(today)
  expect(text).toContain('folder: "Journal"')
  expect(text).toContain('type: "daily"')
})

test('Today again opens the same note, and the journal lists it', async () => {
  await page.getByRole('button', { name: `Open today's note, ${today}` }).click()
  await page.getByRole('button', { name: 'Journal (1)' }).click()

  await expect(page.getByRole('heading', { name: 'Journal 1' })).toBeVisible()
  await expect(page.getByRole('button', { name: new RegExp(`^${today}`) })).toBeVisible()
  expect((await readdir(notesDir())).filter(name => name.endsWith('.md'))).toHaveLength(2)
})

test('the day field says what is wrong, and Open day makes another day', async () => {
  const day = page.getByLabel('Day *')
  await day.fill('')
  // Tab in a date field steps between its parts, so leave the field outright.
  await day.blur()
  await expect(page.getByText('Day is required.')).toBeVisible()

  await day.fill(OTHER)
  await page.getByRole('button', { name: 'Open day' }).click()

  await expect(page.getByLabel('Title *')).toHaveValue(OTHER)
  await expect(page.getByRole('heading', { name: 'Journal 2' })).toBeVisible()
  await expect.poll(() => fileTitled(OTHER).catch(() => '')).toContain(`## Plan for ${OTHER}`)
  expect(errors).toEqual([])
})
