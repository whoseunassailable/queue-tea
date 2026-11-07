import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { _electron as electron, expect, test } from '@playwright/test'
import type { ElectronApplication, Page } from '@playwright/test'

const APP = join(__dirname, '..')
const KEY = 'files-abc123'
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64')
const pdf = () => {
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 300] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>', '<< /Length 45 >>\nstream\nBT /F1 18 Tf 30 250 Td (Notes attachment) Tj ET\nendstream', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>']
  let text = '%PDF-1.4\n'
  const offsets = [0]
  for (const [i, object] of objects.entries()) { offsets.push(Buffer.byteLength(text)); text += `${i + 1} 0 obj\n${object}\nendobj\n` }
  const xref = Buffer.byteLength(text)
  text += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => String(offset).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`

  return Buffer.from(text)
}

let home: string
let app: ElectronApplication
let page: Page
const errors: string[] = []
const vault = () => join(home, '.queue-tea/notes', KEY)

test.beforeAll(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-attachments-'))
  await mkdir(join(home, 'project'))
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(vault(), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify({ version: 2, project: { name: 'File notes', path: join(home, 'project') }, tasks: [], requests: [] }))
  await writeFile(join(vault(), 'Files.md'), '---\ntitle: Files\n---\nBefore\n\n[Table](table.csv)')
  await writeFile(join(vault(), 'table.csv'), 'a,b\n1,2')
  app = await electron.launch({ args: [join(APP, 'out/main/main.js')], cwd: APP, env: { ...process.env, HOME: home, QUEUE_TEA_USER_DATA: join(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' } })
  page = await app.firstWindow()
  page.on('pageerror', error => errors.push(String(error)))
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: /^File notes/ }).click()
  await page.keyboard.press('Meta+7')
  await expect(page.getByLabel('Title *')).toHaveValue('Files')
})

test.afterAll(async () => {
  // Close the renderer and its PDF guest before detaching Playwright's main
  // debugger session. Otherwise Electron can wait on the guest at app.quit.
  await page?.close()
  await app?.close()
  await rm(home, { recursive: true, force: true })
})

test('picking, dropping and pasting persist portable links and Read renders image and PDF previews', async ({}, testInfo) => {
  const body = page.getByRole('combobox', { name: 'Note' })
  await body.click()
  await body.press('Meta+End')
  await page.getByLabel('Attach file…', { exact: true }).setInputFiles({ name: 'picked.png', mimeType: 'image/png', buffer: PNG })
  await expect(body).toHaveValue(/!\[picked.png\]\(<attachments\/.+\.png>\)/)
  await page.evaluate(({ image }) => {
    const transfer = new DataTransfer()
    transfer.items.add(new File([Uint8Array.from(atob(image), c => c.charCodeAt(0))], 'Pasted image', { type: 'image/png' }))
    document.querySelector('textarea#nt-body')!.dispatchEvent(new ClipboardEvent('paste', { clipboardData: transfer, bubbles: true, cancelable: true }))
  }, { image: PNG.toString('base64') })
  await expect(body).toHaveValue(/Pasted image/)
  await page.evaluate(({ report }) => {
    const transfer = new DataTransfer()
    transfer.items.add(new File([Uint8Array.from(atob(report), c => c.charCodeAt(0))], 'report.pdf', { type: 'application/pdf' }))
    document.querySelector('.nt-dropzone')!.dispatchEvent(new DragEvent('drop', { dataTransfer: transfer, bubbles: true, cancelable: true }))
  }, { report: pdf().toString('base64') })
  await expect(body).toHaveValue(/\[report.pdf\]\(<attachments\/.+\.pdf>\)/)
  await expect(page.getByText(/^Saved \d\d:\d\d$/)).toBeVisible()
  const text = await readFile(join(vault(), 'Files.md'), 'utf8')
  expect(text).toContain('picked.png')
  expect(text).toContain('Pasted image')
  expect(text).toContain('report.pdf')
  expect(text).not.toContain('note-file:')
  expect(await readdir(join(vault(), 'attachments'))).toHaveLength(2)

  await page.getByRole('button', { name: 'Read', exact: true }).click()
  await expect(page.getByAltText('picked.png')).toBeVisible()
  await expect.poll(() => page.getByAltText('picked.png').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(1)
  await page.getByRole('button', { name: 'Preview PDF: report.pdf' }).click()
  await expect(page.getByTitle('PDF preview: report.pdf')).toBeVisible()
  // Chromium's built-in PDF viewer must actually load; an iframe alone is
  // not evidence that Electron accepted the document.
  await expect.poll(() => page.frames().map(frame => frame.url()).some(url => url.startsWith('chrome-extension://') && url.includes('/index.html'))).toBe(true)
  const viewer = page.frames().find(frame => frame.url().startsWith('chrome-extension://') && frame.url().includes('/index.html'))!
  await expect.poll(() => viewer.evaluate(() => {
    const pdf = document.querySelector('pdf-viewer') as HTMLElement & { docLength_?: number }

    return pdf?.docLength_ ?? 0
  }), { timeout: 15_000 }).toBe(1)
  await page.screenshot({ path: testInfo.outputPath('attachments.png'), fullPage: true })
  const downloaded = join(home, 'downloaded.csv')
  await app.evaluate(({ dialog }, filePath) => { dialog.showSaveDialog = async () => ({ canceled: false, filePath }) }, downloaded)
  await page.getByRole('button', { name: 'Download Table' }).click()
  await expect(page.getByText('File downloaded.')).toBeVisible()
  expect(await readFile(downloaded, 'utf8')).toBe('a,b\n1,2')
  await page.setViewportSize({ width: 760, height: 900 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('invalid files show inline errors and cannot be imported through IPC', async () => {
  const filesBefore = await readdir(join(vault(), 'attachments')).catch(() => [])
  await page.getByRole('button', { name: 'Write', exact: true }).click()
  await page.getByLabel('Attach file…', { exact: true }).setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('bad') })
  await expect(page.getByRole('alert').filter({ hasText: 'Only image or PDF files are accepted.' })).toBeVisible()
  const answer = await page.evaluate(async key => window.engine.attachNoteFile(key, 'Files', { name: 'forged.png', type: 'image/png', bytes: new Uint8Array([1, 2, 3]) }), KEY)
  expect(answer.ok).toBe(false)
  expect(await readdir(join(vault(), 'attachments')).catch(() => [])).toEqual(filesBefore)
})
