// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact'
import { afterEach, expect, it, vi } from 'vitest'

import { fakeEngine, note } from '../../../test_support'
import { AttachmentInput } from './widgets/attachment_input'
import { ReadView } from './widgets/read_view'

afterEach(cleanup)

it('still opens a note whose title contains a dot', () => {
  const { engine } = fakeEngine()
  const open = vi.fn()
  render(<ReadView engine={engine} realm="demo-abc123" body="[[Release 1.2#Changes|Release 1.2]]" notes={[note({ id: 'release', title: 'Release 1.2' })]} isLive onToggle={() => {}} onOpenNote={open} onOpenLink={() => {}} />)
  fireEvent.click(screen.getByRole('button', { name: 'Release 1.2' }))
  expect(open).toHaveBeenCalledWith('release')
  expect(engine.readNoteFile).not.toHaveBeenCalled()
})

it('shows local images, previews PDFs on request, and downloads other files without opening an external URL', async () => {
  const { engine } = fakeEngine()
  const external = vi.fn()
  render(<ReadView engine={engine} realm="demo-abc123" body={'![Diagram](attachments/photo.png)\n\n[Report](attachments/report.pdf)\n\n[[table.csv]]\n\n![[attachments/photo.png|Wiki picture]]\n\n`![[ignored.png]]`'} notes={[]} isLive onToggle={() => {}} onOpenNote={() => {}} onOpenLink={external} />)

  expect((await screen.findByAltText('Diagram')).getAttribute('src')).toContain('note-file://realm/demo-abc123/attachments/photo.png')
  expect(await screen.findByAltText('Wiki picture')).toBeTruthy()
  expect(engine.readNoteFile).not.toHaveBeenCalledWith(expect.anything(), 'ignored.png')
  fireEvent.click(await screen.findByRole('button', { name: 'Preview PDF: Report' }))
  expect(screen.getByTitle('PDF preview: Report').getAttribute('src')).toContain('attachments/report.pdf')
  fireEvent.click(await screen.findByRole('button', { name: 'Download table.csv' }))
  await waitFor(() => expect(engine.downloadNoteFile).toHaveBeenCalledWith('demo-abc123', 'table.csv'))
  expect(external).not.toHaveBeenCalled()
})

it('names a missing file and offers a retry that can recover', async () => {
  const { engine } = fakeEngine()
  vi.mocked(engine.readNoteFile).mockResolvedValueOnce({ ok: false, error: { message: 'File is missing. Put it back and try again.' } })
  render(<ReadView engine={engine} realm="demo-abc123" body="![Diagram](attachments/photo.png)" notes={[]} isLive onToggle={() => {}} onOpenNote={() => {}} onOpenLink={() => {}} />)
  expect((await screen.findByRole('alert')).textContent).toContain('File is missing')
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(await screen.findByAltText('Diagram')).toBeTruthy()
})

it('rejects an invalid drop before importing, then imports a pasted image and inserts its Markdown', async () => {
  const { engine } = fakeEngine()
  const insert = vi.fn(async (_markdown: string) => {})
  const { container } = render(<AttachmentInput engine={engine} realm="demo-abc123" id="n-1" onInsert={insert}><textarea aria-label="Body" /></AttachmentInput>)
  const zone = container.querySelector('.nt-dropzone')!
  fireEvent.drop(zone, { dataTransfer: { files: [new File(['text'], 'bad.txt', { type: 'text/plain' })] } })
  expect((await screen.findByRole('alert')).textContent).toContain('Only image or PDF files are accepted.')
  expect(engine.attachNoteFile).not.toHaveBeenCalled()
  fireEvent.paste(screen.getByLabelText('Body'), { clipboardData: { files: [new File(['image'], 'paste.png', { type: 'image/png' })] } })
  await waitFor(() => expect(insert).toHaveBeenCalledWith('![paste.png](<attachments/photo.png>)'))
  expect(engine.attachNoteFile).toHaveBeenCalledWith('demo-abc123', 'n-1', expect.objectContaining({ name: 'paste.png', bytes: expect.any(Uint8Array) }))
})

it('queues another drop while a file is being attached', async () => {
  const { engine } = fakeEngine()
  let finish: () => void = () => {}
  const saving = new Promise<void>(resolve => { finish = resolve })
  const insert = vi.fn().mockImplementationOnce(() => saving).mockResolvedValue(undefined)
  const { container } = render(<AttachmentInput engine={engine} realm="demo-abc123" id="n-1" onInsert={insert}><textarea /></AttachmentInput>)
  const zone = container.querySelector('.nt-dropzone')!
  fireEvent.drop(zone, { dataTransfer: { files: [new File(['one'], 'first.png', { type: 'image/png' })] } })
  await waitFor(() => expect(insert).toHaveBeenCalledTimes(1))
  fireEvent.drop(zone, { dataTransfer: { files: [new File(['two'], 'second.png', { type: 'image/png' })] } })
  finish()
  await waitFor(() => expect(insert).toHaveBeenCalledTimes(2))
  expect(insert.mock.calls[1]![0]).toContain('second.png')
})

it('retries a partial batch from the failed file without inserting the first link twice', async () => {
  const { engine } = fakeEngine()
  vi.mocked(engine.attachNoteFile)
    .mockResolvedValueOnce({ ok: true, data: { path: 'attachments/first.png', kind: 'image' } })
    .mockResolvedValueOnce({ ok: false, error: { message: 'Could not write the second file. Try again.' } })
    .mockResolvedValueOnce({ ok: true, data: { path: 'attachments/second.png', kind: 'image' } })
  const insert = vi.fn(async (_markdown: string) => {})
  const { container } = render(<AttachmentInput engine={engine} realm="demo-abc123" id="n-1" onInsert={insert}><textarea /></AttachmentInput>)
  fireEvent.drop(container.querySelector('.nt-dropzone')!, { dataTransfer: { files: [new File(['one'], 'first.png', { type: 'image/png' }), new File(['two'], 'second.png', { type: 'image/png' })] } })
  expect((await screen.findByRole('alert')).textContent).toContain('Could not write the second file')
  expect(insert).toHaveBeenCalledTimes(1)
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  await waitFor(() => expect(insert).toHaveBeenCalledTimes(2))
  expect(insert.mock.calls.map(call => call[0])).toEqual(['![first.png](<attachments/first.png>)', '![second.png](<attachments/second.png>)'])
})
