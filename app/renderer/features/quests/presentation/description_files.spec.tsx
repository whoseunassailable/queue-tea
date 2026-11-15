// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { EngineApi, ProjectView, QuestEdit, QuestRow, Reply } from '../../../../shared/engine_api'
import type { NoteAttachment } from '../../../../shared/note_attachments'
import { App } from '../../../app/app'
import { t } from '../../../l10n/en'
import { fakeEngine, projectView, quest } from '../../../test_support'
import { createWorkspace } from '../../workspace/state_management/workspace_store'

const KEY = 'a-000001'
const IMAGE = `attachments/${'a1'.repeat(32)}.png`
const PDF = `attachments/${'b2'.repeat(32)}.pdf`
const OTHER = `attachments/${'c3'.repeat(32)}.png`
const png = (name = 'mock.png') => new File(['image'], name, { type: 'image/png' })
const pdf = (name = 'spec.pdf') => new File(['%PDF-1.4'], name, { type: 'application/pdf' })
const saved = (path: string): Reply<NoteAttachment> => ({ ok: true, data: { path, kind: path.endsWith('.pdf') ? 'pdf' : 'image' } })
const later = <T,>() => {
  let done: (value: T) => void = () => {}
  const promise = new Promise<T>(resolve => { done = resolve })

  return { promise, done }
}

// One quest in the realm. Its edits land in the record and come back in the
// view, as main's do.
const open = async (description: string | null, over: Partial<EngineApi> = {}) => {
  let row: QuestRow = quest({ id: 'first', title: 'First quest', description })
  const view = (): ProjectView => projectView(KEY, { canStart: 1, ready: [{ kind: 'quest', quest: row }] })
  const editQuest = vi.fn(async (_key: string, _id: string, edit: QuestEdit): Promise<Reply<ProjectView>> => {
    row = { ...row, ...edit }

    return { ok: true, data: view() }
  })
  const { engine } = fakeEngine({
    readProject: async () => ({ ok: true, data: view() }),
    editQuest,
    attachNoteFile: vi.fn(async () => saved(IMAGE)),
    ...over,
  })
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, record: () => row }
}

const pane = () => document.querySelector('.detail') as HTMLElement
const box = () => within(pane()).getByRole('textbox', { name: t.detail.description }) as HTMLTextAreaElement
const pick = (...files: File[]) => fireEvent.change(within(pane()).getByLabelText(t.files.attachFile), { target: { files } })
const drop = (...files: File[]) => fireEvent.drop(box().closest('.nt-dropzone')!, { dataTransfer: { files } })

beforeEach(() => {
  window.location.hash = '#/quests'
})
afterEach(cleanup)

describe("a file in a quest's description", () => {
  it('picked, is kept for the realm, says it is attaching, then is saved once with its link at the end', async () => {
    const upload = later<Reply<NoteAttachment>>()
    const { engine } = await open('Why it matters', { attachNoteFile: vi.fn(() => upload.promise) })

    pick(png())

    await waitFor(() => expect(engine.attachNoteFile).toHaveBeenCalledWith(KEY, null, expect.objectContaining({ name: 'mock.png', type: 'image/png', bytes: expect.any(Uint8Array) })))
    expect(pane().textContent).toContain(t.files.attaching('mock.png'))
    expect(engine.editQuest).not.toHaveBeenCalled()

    await act(async () => upload.done(saved(IMAGE)))

    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledTimes(1))
    expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: `Why it matters\n![mock.png](<${IMAGE}>)\n` })
    expect(pane().textContent).toContain(t.files.attached)
    expect(box().value).toBe(`Why it matters\n![mock.png](<${IMAGE}>)\n`)
  })

  it('dropped on an empty description, becomes its first line', async () => {
    const { engine } = await open(null, { attachNoteFile: vi.fn(async () => saved(PDF)) })

    drop(pdf())

    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: `[spec.pdf](<${PDF}>)\n` }))
    expect(engine.attachNoteFile).toHaveBeenCalledWith(KEY, null, expect.objectContaining({ name: 'spec.pdf' }))
  })

  it('pasted while the box has focus, goes in at the caret and the caret moves past it', async () => {
    const { engine } = await open('First line\nSecond line')
    const text = box()
    text.focus()
    text.setSelectionRange(11, 11)

    fireEvent.paste(text, { clipboardData: { files: [png()] } })

    const next = `First line\n![mock.png](<${IMAGE}>)\nSecond line`
    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: next }))
    expect(engine.editQuest).toHaveBeenCalledTimes(1)
    expect(box().value).toBe(next)
    await waitFor(() => expect(box().selectionStart).toBe(next.indexOf('Second line')))
  })

  it('dropped just after typing, keeps what was typed', async () => {
    const { engine } = await open(null)
    fireEvent.input(box(), { target: { value: 'Half a thought' } })

    drop(png())

    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: `Half a thought\n![mock.png](<${IMAGE}>)\n` }))
    expect(engine.editQuest).toHaveBeenCalledTimes(1)
  })

  it('landing while the typed text is still saving, keeps that text', async () => {
    const first = later<Reply<ProjectView>>()
    const { engine } = await open(null)
    vi.mocked(engine.editQuest).mockImplementationOnce(() => first.promise)
    fireEvent.input(box(), { target: { value: 'Typed' } })
    fireEvent.blur(box())

    drop(png())

    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledTimes(2))
    expect(vi.mocked(engine.editQuest).mock.calls.map(call => call[2])).toEqual([{ description: 'Typed' }, { description: `Typed\n![mock.png](<${IMAGE}>)\n` }])
    await act(async () => first.done({ ok: true, data: projectView(KEY, { canStart: 1, ready: [{ kind: 'quest', quest: quest({ id: 'first', title: 'First quest', description: 'Typed' }) }] }) }))
  })

  it('in a batch, every file keeps its link', async () => {
    const { engine, record } = await open('Two of them')
    vi.mocked(engine.attachNoteFile).mockResolvedValueOnce(saved(IMAGE)).mockResolvedValueOnce(saved(PDF))

    drop(png(), pdf())

    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledTimes(2))
    expect(record().description).toBe(`Two of them\n![mock.png](<${IMAGE}>)\n[spec.pdf](<${PDF}>)\n`)
  })

  // Main answers edits in the order they were sent, and each answer is
  // adopted as it lands, so an older answer can arrive after a newer save.
  it('in a batch dropped while typed text is saving, keeps the text and every link whenever the saves come back', async () => {
    let row = quest({ id: 'first', title: 'First quest', description: null })
    const view = (): ProjectView => projectView(KEY, { canStart: 1, ready: [{ kind: 'quest', quest: row }] })
    const answers: (() => void)[] = []
    const editQuest = vi.fn((_key: string, _id: string, edit: QuestEdit) => new Promise<Reply<ProjectView>>(resolve => {
      answers.push(() => {
        row = { ...row, ...edit }
        resolve({ ok: true, data: view() })
      })
    }))
    const second = later<Reply<NoteAttachment>>()
    const attachNoteFile = vi.fn<EngineApi['attachNoteFile']>().mockResolvedValueOnce(saved(IMAGE)).mockImplementationOnce(() => second.promise)
    const { engine } = fakeEngine({ readProject: async () => ({ ok: true, data: view() }), editQuest, attachNoteFile })
    const workspace = createWorkspace(engine)
    await act(async () => {
      render(<App workspace={workspace} engine={engine} />)
      await workspace.start()
    })
    fireEvent.input(box(), { target: { value: 'Typed' } })
    fireEvent.blur(box())

    drop(png(), png('other.png'))
    await waitFor(() => expect(editQuest).toHaveBeenCalledTimes(2))
    // The typed text's save comes back before the second file is in.
    await act(async () => answers[0]!())
    await act(async () => second.done(saved(OTHER)))
    await waitFor(() => expect(editQuest).toHaveBeenCalledTimes(3))
    await act(async () => answers[1]!())
    await act(async () => answers[2]!())

    expect(editQuest.mock.calls.at(-1)![2]).toEqual({ description: `Typed\n![mock.png](<${IMAGE}>)\n![other.png](<${OTHER}>)\n` })
    expect(row.description).toBe(`Typed\n![mock.png](<${IMAGE}>)\n![other.png](<${OTHER}>)\n`)
  })

  it('that fails to attach, says so with Try again and leaves the description as it was', async () => {
    const message = "Couldn't attach this file. Your quest is unchanged. Try again."
    const { engine } = await open('Why it matters')
    vi.mocked(engine.attachNoteFile).mockResolvedValueOnce({ ok: false, error: { message } })

    pick(png())

    expect((await within(pane()).findByRole('alert')).textContent).toContain(message)
    expect(engine.editQuest).not.toHaveBeenCalled()
    expect(box().value).toBe('Why it matters')

    fireEvent.click(within(pane()).getByRole('button', { name: t.failed.tryAgain }))

    await waitFor(() => expect(engine.editQuest).toHaveBeenCalledWith(KEY, 'first', { description: `Why it matters\n![mock.png](<${IMAGE}>)\n` }))
  })

  it.each([
    ['the Attach file… button', () => within(pane()).getByRole('button', { name: t.files.attachFile })],
    ["a preview's Download button", () => within(pane()).getByRole('button', { name: t.files.downloadFile('mock.png') })],
  ])('a web link pasted while %s has focus leaves the description alone', async (_where, target) => {
    const { engine } = await open(`Why it matters\n![mock.png](<${IMAGE}>)`)
    await within(pane()).findByAltText('mock.png')
    const button = target()
    button.focus()

    fireEvent.paste(button, { clipboardData: { files: [], getData: (type: string) => (type === 'text/plain' ? 'https://example.com/post' : '') } })

    await new Promise(resolve => setTimeout(resolve, 50))
    expect(engine.editQuest).not.toHaveBeenCalled()
    expect(box().value).toBe(`Why it matters\n![mock.png](<${IMAGE}>)`)
  })

  it.each([
    ['a text file', new File(['words'], 'notes.txt', { type: 'text/plain' }), t.files.fileType],
    ['a 12 MB image', new File([new Uint8Array(12 * 1024 * 1024)], 'huge.png', { type: 'image/png' }), t.files.fileSize],
  ])('that is %s, shows why under the box and asks the engine nothing', async (_kind, file, message) => {
    const { engine } = await open('Why it matters')

    pick(file)

    expect((await within(pane()).findByRole('alert')).textContent).toContain(message)
    expect(engine.attachNoteFile).not.toHaveBeenCalled()
    expect(engine.editQuest).not.toHaveBeenCalled()
  })
})

describe("the description's previews", () => {
  it('show one per linked file, in order, and one goes when its link is deleted', async () => {
    const { engine } = await open(`Look:\n![mock.png](<${IMAGE}>)\n[spec.pdf](<${PDF}>)\n[site](https://example.com)`)

    expect((await within(pane()).findByAltText('mock.png')).getAttribute('src')).toBe(`note-file://realm/${KEY}/${IMAGE}`)
    expect(await within(pane()).findByRole('button', { name: t.files.previewPdfName('spec.pdf') })).toBeTruthy()
    expect(within(pane()).getAllByRole('button', { name: /^Download / }).map(button => button.getAttribute('aria-label'))).toEqual([t.files.downloadFile('mock.png'), t.files.downloadFile('spec.pdf')])
    expect(engine.readNoteFile).toHaveBeenCalledWith(KEY, IMAGE)
    expect(engine.readNoteFile).toHaveBeenCalledWith(KEY, PDF)

    fireEvent.input(box(), { target: { value: `Look:\n[spec.pdf](<${PDF}>)` } })

    await waitFor(() => expect(within(pane()).queryByAltText('mock.png')).toBe(null))
    expect(within(pane()).getByRole('button', { name: t.files.downloadFile('spec.pdf') })).toBeTruthy()
  })

  it('a description with no saved file shows no previews', async () => {
    const { engine } = await open('Just words, and [a site](https://example.com)')

    expect(document.querySelector('.d-files')).toBe(null)
    expect(engine.readNoteFile).not.toHaveBeenCalled()
  })

  it('a missing file names itself, says what went wrong, and Try again can bring it back', async () => {
    const { engine } = fakeEngine()
    const missing = "Couldn't read this file. Check that it is still in the notes folder, then try again."
    const readNoteFile = vi.fn(engine.readNoteFile).mockResolvedValueOnce({ ok: false, error: { message: missing } })
    await open(`![mock.png](<${IMAGE}>)`, { readNoteFile })

    const alert = await within(pane()).findByRole('alert')
    expect(alert.textContent).toContain(`mock.png: ${missing}`)

    fireEvent.click(within(alert).getByRole('button', { name: t.failed.tryAgain }))

    expect(await within(pane()).findByAltText('mock.png')).toBeTruthy()
  })
})

describe('a file in New quest', () => {
  const dialog = () => screen.getByRole('dialog')
  const openSheet = async (over: Partial<EngineApi> = {}) => {
    const opened = await open(null, over)
    fireEvent.click(screen.getAllByRole('button', { name: t.actions.newQuest })[0]!)
    await waitFor(() => expect(within(dialog()).getByLabelText(`${t.form.title} *`)).toBeTruthy())

    return opened
  }
  const description = () => within(dialog()).getByLabelText(t.form.description) as HTMLTextAreaElement
  const attach = (...files: File[]) => fireEvent.change(within(dialog()).getByLabelText(t.files.attachFile), { target: { files } })
  const submit = () => fireEvent.click(within(dialog()).getByRole('button', { name: t.actions.add }))

  it('goes at the end of the description, with its preview under it', async () => {
    const { engine } = await openSheet()
    fireEvent.input(description(), { target: { value: 'Like this' } })

    attach(png())

    await waitFor(() => expect(description().value).toBe(`Like this\n![mock.png](<${IMAGE}>)\n`))
    expect(engine.attachNoteFile).toHaveBeenCalledWith(KEY, null, expect.objectContaining({ name: 'mock.png' }))
    expect((await within(dialog()).findByAltText('mock.png')).getAttribute('src')).toBe(`note-file://realm/${KEY}/${IMAGE}`)
  })

  it('still attaching holds the filing with a line under Description, and once in, the quest files with its link', async () => {
    const upload = later<Reply<NoteAttachment>>()
    const { engine } = await openSheet({ attachNoteFile: vi.fn(() => upload.promise) })
    fireEvent.input(within(dialog()).getByLabelText(`${t.form.title} *`), { target: { value: 'With a mock' } })
    attach(png())
    await waitFor(() => expect(dialog().textContent).toContain(t.files.attaching('mock.png')))

    submit()

    await waitFor(() => expect(within(dialog()).getByText(t.form.stillAttaching)).toBeTruthy())
    expect(description().getAttribute('aria-invalid')).toBe('true')
    expect(engine.fileQuest).not.toHaveBeenCalled()

    await act(async () => upload.done(saved(IMAGE)))

    await waitFor(() => expect(within(dialog()).queryByText(t.form.stillAttaching)).toBe(null))
    submit()
    await waitFor(() => expect(engine.fileQuest).toHaveBeenCalledWith(KEY, expect.objectContaining({ title: 'With a mock', description: `![mock.png](<${IMAGE}>)` })))
    expect(engine.fileQuest).toHaveBeenCalledTimes(1)
  })
})
