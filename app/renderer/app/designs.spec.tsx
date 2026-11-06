// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { DesignComment, DesignRead, DesignsView, Scene, VersionRow, VersionView } from '../../shared/designs'
import type { EngineApi, Reply } from '../../shared/engine_api'
import { CommentsPanel } from '../features/designs/presentation/widgets/comments_panel'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { fakeEngine } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'

const open = async (over: Partial<EngineApi> = {}) => {
  window.location.hash = '#/designs'
  const { engine, fire } = fakeEngine(over)
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, fire }
}

const press = (name: string | RegExp, within_: HTMLElement = document.body) => act(() => void fireEvent.click(within(within_).getByRole('button', { name })))
const type = (label: string | RegExp, value: string) => {
  const field = within(screen.getByRole('dialog')).getByLabelText(label) as HTMLInputElement
  fireEvent.input(field, { target: { value } })
  fireEvent.blur(field)

  return field
}
const errorOf = (field: HTMLElement) => document.getElementById(field.getAttribute('aria-describedby') ?? '')?.textContent ?? null

const never = <T,>() => new Promise<T>(() => {})
const ok = <T,>(data: T): Reply<T> => ({ ok: true, data })

const row = (folder: string, over: Partial<VersionRow> = {}): VersionRow => ({ folder, label: folder, made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designCount: 2, open: 0, resolved: 0, sent: 0, sentTo: null, next: null, problem: null, ...over })
const designsOf = (versions: VersionRow[], coming: DesignsView['coming'] = []) => async (): Promise<Reply<DesignsView>> => ok({ versions, coming })
const versionOf = (over: Partial<VersionView> = {}) => async (_key: string, folder: string): Promise<Reply<VersionView>> => ok({ folder, label: folder, designs: ['welcome', 'pair'], comments: [], commentsProblem: null, uncommitted: 0, ...over })
const scene = (name: string): Scene => ({ format: 1, name, width: 390, height: 844, fill: '#F6F1E7', nodes: [{ id: 'headline', type: 'text', name: 'Headline', x: 24, y: 293, width: 342, text: 'Walk better', font: 'Nunito Sans', size: 28, weight: 400, color: '#2A2218' }] })
const ready = (name: string): Reply<DesignRead> => ok({ kind: 'ready', scene: scene(name), stamp: `stamp-${name}` })
const readEach = async (_key: string, _folder: string, id: string): Promise<Reply<DesignRead>> => ready(id === 'welcome' ? 'Welcome' : 'Pair your insoles')
const comment = (over: Partial<DesignComment> & { id: string }): DesignComment => ({ design: 'welcome', on: null, text: 'Make the headline shorter.', by: 'Rohan', at: '2026-11-05T10:00:00Z', resolved: null, sentTo: null, ...over })
// Every card has read and told the page its names, so the criteria can quote them.
const allRead = async () => {
  await screen.findByText('Pair your insoles')
  await waitFor(() => expect(screen.queryByText(t.designs.stillReading)).toBeNull())
}
const OPEN = [comment({ id: 'c1', on: 'headline' }), comment({ id: 'c2', text: 'The hero is too tall.' })]

afterEach(() => {
  cleanup()
  window.innerWidth = 1280
})

describe('the Designs page', () => {
  it('says what it is reading while the realm\'s designs load', async () => {
    await open({ readDesigns: never })

    expect(screen.getByRole('status').textContent).toContain(t.designs.loading)
    expect(screen.getByText(t.designs.loadingWhere('a'))).toBeTruthy()
  })

  it('shows a failed read in plain words, with Try again', async () => {
    const readDesigns = vi.fn(async (): Promise<Reply<DesignsView>> => ({ ok: false, error: { message: "Couldn't read this realm's designs." } }))
    await open({ readDesigns })

    expect((await screen.findByRole('alert')).textContent).toContain("Couldn't read this realm's designs.")
    readDesigns.mockImplementationOnce(designsOf([row('5.4.3')]))
    await press(t.failed.tryAgain)
    expect(await screen.findByRole('heading', { name: '5.4.3' })).toBeTruthy()
  })

  it('offers a first design quest in a realm with no designs, needing no comments', async () => {
    const { engine } = await open()

    expect(await screen.findByRole('heading', { name: t.designs.emptyTitle('a') })).toBeTruthy()
    await press(t.designs.fileDesignQuest)

    const sheet = screen.getByRole('dialog', { name: t.designs.firstSheet })
    expect((within(sheet).getByLabelText(`${t.designs.versionLabel} *`) as HTMLInputElement).value).toBe('1')
    await press(t.designs.fileQuest, sheet)

    await waitFor(() => expect(engine.fileQuest).toHaveBeenCalledWith(KEY, expect.objectContaining({ title: t.designs.firstTitle('a') })))
    expect(engine.sendDesignComments).not.toHaveBeenCalled()
    expect(await screen.findByText(t.designs.firstFiledTitle)).toBeTruthy()
  })

  it('opens the newest version that reads, and another from the rail', async () => {
    const { engine } = await open({ readDesigns: designsOf([row('5.4.3'), row('onboarding-pass-2', { label: 'Onboarding pass 2' })]), readDesignVersion: vi.fn(versionOf()), readDesign: readEach })

    expect(await screen.findByRole('heading', { name: '5.4.3' })).toBeTruthy()
    await press(/Onboarding pass 2/)

    expect(await screen.findByRole('heading', { name: 'Onboarding pass 2' })).toBeTruthy()
    expect(engine.readDesignVersion).toHaveBeenLastCalledWith(KEY, 'onboarding-pass-2')
  })

  it('shows the version filed but not drafted yet as coming', async () => {
    await open({ readDesigns: designsOf([row('5.4.3')], [{ label: '5.4.4', quest: 'Designs 5.4.4', from: '5.4.3' }]), readDesignVersion: versionOf(), readDesign: readEach })

    const rail = await screen.findByRole('complementary', { name: t.designs.history })
    expect(within(rail).getByText('5.4.4')).toBeTruthy()
    expect(within(rail).getByText(t.designs.comingLine)).toBeTruthy()
    expect(within(rail).getByText(t.designs.comingFrom('5.4.3'))).toBeTruthy()
  })

  it('shows a version that does not read by its file and line, and can put its last good copy back', async () => {
    const problem = { file: 'docs/designs/5.4.2/version.json', detail: 'It has a mistake near line 3.', backupAt: Date.parse('2026-11-04T12:00:00Z') }
    const readDesigns = vi.fn(designsOf([row('5.4.2', { problem })]))
    const { engine } = await open({ readDesigns })

    const alert = await screen.findByRole('alert')
    expect(within(alert).getByRole('heading', { name: t.designs.versionBrokenTitle('5.4.2') })).toBeTruthy()
    expect(alert.textContent).toContain('It has a mistake near line 3.')
    expect(alert.textContent).toContain('docs/designs/5.4.2/version.json')
    const reads = readDesigns.mock.calls.length
    await press(t.designs.useLastGood, alert)

    await waitFor(() => expect(engine.restoreDesignFile).toHaveBeenCalledWith(KEY, '5.4.2', 'version'))
    await waitFor(() => expect(readDesigns.mock.calls.length).toBeGreaterThan(reads))
  })

  it('offers no last good copy when none was kept', async () => {
    await open({ readDesigns: designsOf([row('5.4.2', { problem: { file: 'docs/designs/5.4.2/version.json', detail: 'It has a mistake near line 3.', backupAt: null } })]) })

    await screen.findByRole('alert')
    expect(screen.queryByRole('button', { name: t.designs.useLastGood })).toBeNull()
    expect(screen.getByRole('button', { name: t.failed.tryAgain })).toBeTruthy()
  })

  it('shows the designs that have read, a spinner on the rest, and says so beside Next version', async () => {
    await open({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf(), readDesign: async (_k: string, _f: string, id: string) => (id === 'welcome' ? ready('Welcome') : never()) })

    expect(await screen.findByText('Welcome')).toBeTruthy()
    expect(screen.getByText(t.designs.readingDesign('pair'))).toBeTruthy()
    expect(screen.getByText(t.designs.stillReading)).toBeTruthy()
  })

  it('says which design does not read and near which line, never the parser\'s words', async () => {
    const problem = { file: 'docs/designs/5.4.3/pair.design.json', detail: 'It has a mistake near line 5.', backupAt: null }
    await open({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf(), readDesign: async (_k: string, _f: string, id: string) => (id === 'welcome' ? ready('Welcome') : ok<DesignRead>({ kind: 'broken', problem })) })

    expect(await screen.findByText(t.designs.brokenLine(problem.file, problem.detail))).toBeTruthy()
    expect(screen.getByRole('heading', { name: t.designs.brokenTitle('pair') })).toBeTruthy()
  })

  it('says a version with no designs has none yet', async () => {
    await open({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf({ designs: [] }) })

    expect(await screen.findByText(t.designs.noDesigns)).toBeTruthy()
  })

  describe('in a narrow window', () => {
    it('turns the rail into a menu that lists the coming version and shows the folder', async () => {
      window.innerWidth = 700
      const { engine } = await open({ readDesigns: designsOf([row('5.4.3'), row('5.4.2')], [{ label: '5.4.4', quest: 'Q', from: '5.4.3' }]), readDesignVersion: versionOf(), readDesign: readEach })

      await act(async () => void fireEvent.click(await screen.findByRole('button', { name: `${t.designs.versionMenu(1, 2)} ▾` })))

      const list = screen.getByRole('listbox', { name: t.designs.historyMenu })
      expect(within(list).getByRole('option', { name: /5\.4\.4/ }).getAttribute('aria-disabled')).toBe('true')
      await press(t.designs.showInFinder)
      await waitFor(() => expect(engine.showDesigns).toHaveBeenCalledWith(KEY))
    })

    it('says why the folder could not be shown', async () => {
      window.innerWidth = 700
      await open({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf(), readDesign: readEach, showDesigns: async () => ({ ok: false, error: { message: "Couldn't show the folder." } }) })

      await act(async () => void fireEvent.click(await screen.findByRole('button', { name: t.designs.showInFinder })))

      expect((await screen.findByRole('alert')).textContent).toBe("Couldn't show the folder.")
    })
  })
})

describe('Next version', () => {
  const withComments = (comments: DesignComment[], over: Partial<EngineApi> = {}) =>
    open({ readDesigns: designsOf([row('5.4.3'), row('5.4.2')]), readDesignVersion: versionOf({ comments }), readDesign: readEach, ...over })
  const openSheet = async () => {
    await press(t.designs.nextVersion)

    return screen.getByRole('dialog', { name: t.designs.nextSheet('5.4.3') })
  }

  it('asks for a comment first, and files nothing, with no open comments', async () => {
    const { engine } = await withComments([comment({ id: 'c3', resolved: '2026-11-05T11:00:00Z' }), comment({ id: 'c4', sentTo: '5.4.3' })])
    await screen.findByRole('heading', { name: '5.4.3' })

    await press(t.designs.nextVersion)

    expect(screen.getByRole('alert').textContent).toBe('Add a comment first: the next version is built from your feedback.')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(engine.fileQuest).not.toHaveBeenCalled()
  })

  it('says how many open comments it would send', async () => {
    await withComments(OPEN)

    expect(await screen.findByText(t.designs.nextLine(2, 1, '5.4.4'))).toBeTruthy()
  })

  it('starts with the next free label and one criterion per open comment', async () => {
    await withComments(OPEN)
    await allRead()

    const sheet = await openSheet()

    expect((within(sheet).getByLabelText(`${t.designs.versionLabel} *`) as HTMLInputElement).value).toBe('5.4.4')
    expect((within(sheet).getByLabelText(`${t.designs.questTitle} *`) as HTMLInputElement).value).toBe(t.designs.nextTitle('5.4.4', '5.4.3'))
    expect((within(sheet).getByLabelText(t.designs.criteria) as HTMLTextAreaElement).value.split('\n')).toEqual([
      'Welcome · Headline: Make the headline shorter.',
      'Welcome: The hero is too tall.',
      t.designs.nextVersionLine('docs/designs/5.4.4/version.json', '5.4.3'),
    ])
  })

  it('says uncommitted changes should be committed first', async () => {
    await open({ readDesigns: designsOf([row('5.4.3')]), readDesignVersion: versionOf({ comments: OPEN, uncommitted: 2 }), readDesign: readEach })
    await screen.findByRole('heading', { name: '5.4.3' })

    const sheet = await openSheet()

    expect(within(sheet).getByText(t.designs.uncommitted('5.4.3', 2))).toBeTruthy()
  })

  it('shows the required errors under the label and title once they lose focus', async () => {
    await withComments(OPEN)
    await screen.findByRole('heading', { name: '5.4.3' })
    await openSheet()

    const label = type(`${t.designs.versionLabel} *`, '  ')
    const title = type(`${t.designs.questTitle} *`, '')

    expect(errorOf(label)).toBe('Version label is required.')
    expect(errorOf(title)).toBe('Quest title is required.')
    expect(label.closest('.form-field')?.contains(document.getElementById(label.getAttribute('aria-describedby')!))).toBe(true)
  })

  it('names a label that is already taken', async () => {
    await withComments(OPEN)
    await screen.findByRole('heading', { name: '5.4.3' })
    await openSheet()

    expect(errorOf(type(`${t.designs.versionLabel} *`, '5.4.2'))).toBe('A version called 5.4.2 already exists. Pick another label.')
  })

  it('shows every error and files nothing when pressed with a field wrong', async () => {
    const { engine } = await withComments(OPEN)
    await screen.findByRole('heading', { name: '5.4.3' })
    const sheet = await openSheet()
    const title = within(sheet).getByLabelText(`${t.designs.questTitle} *`) as HTMLInputElement
    fireEvent.input(title, { target: { value: '' } })

    await press(t.designs.fileQuest, sheet)

    expect(errorOf(title)).toBe(t.designs.questTitleRequired)
    expect(engine.fileQuest).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: t.designs.fileQuest })).toHaveProperty('disabled', false)
  })

  it('files the quest, then marks the comments as sent to the new label', async () => {
    const { engine } = await withComments(OPEN)
    await allRead()
    const sheet = await openSheet()

    await press(t.designs.fileQuest, sheet)

    await waitFor(() => expect(engine.sendDesignComments).toHaveBeenCalledWith(KEY, '5.4.3', { label: '5.4.4', quest: t.designs.nextTitle('5.4.4', '5.4.3') }))
    expect(engine.fileQuest).toHaveBeenCalledWith(KEY, expect.objectContaining({ title: t.designs.nextTitle('5.4.4', '5.4.3'), criteria: expect.arrayContaining(['Welcome: The hero is too tall.']) }))
    expect(await screen.findByText(t.designs.filedTitle)).toBeTruthy()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it.each<[string, DesignsView]>([
    ['a version merged under that label', { versions: [row('5.4.3'), row('5.4.2'), row('5.4.4')], coming: [] }],
    ['another version filed it as coming', { versions: [row('5.4.3'), row('5.4.2')], coming: [{ label: '5.4.4', quest: 'Designs 5.4.4', from: '5.4.2' }] }],
  ])('reads the realm again before filing, and files nothing once %s', async (_, later) => {
    const readDesigns = vi.fn(async (): Promise<Reply<DesignsView>> => ok(later))
    readDesigns.mockImplementationOnce(designsOf([row('5.4.3'), row('5.4.2')]))
    const { engine } = await withComments(OPEN, { readDesigns })
    await screen.findByRole('heading', { name: '5.4.3' })
    const sheet = await openSheet()
    const label = within(sheet).getByLabelText(`${t.designs.versionLabel} *`) as HTMLInputElement
    expect(label.value).toBe('5.4.4')

    await press(t.designs.fileQuest, sheet)

    expect((await within(sheet).findByRole('alert')).textContent).toBe(t.designs.labelTaken('5.4.4'))
    expect(engine.fileQuest).not.toHaveBeenCalled()
    expect(engine.sendDesignComments).not.toHaveBeenCalled()
    // Not the after-filing lock: the label can still be changed and filed.
    expect(label.matches(':disabled')).toBe(false)
    expect(within(sheet).getByRole('button', { name: t.designs.fileQuest })).toBeTruthy()
    fireEvent.input(label, { target: { value: '5.4.5' } })
    await press(t.designs.fileQuest, sheet)
    await waitFor(() => expect(engine.sendDesignComments).toHaveBeenCalledWith(KEY, '5.4.3', expect.objectContaining({ label: '5.4.5' })))
    expect(engine.fileQuest).toHaveBeenCalledTimes(1)
  })

  it('shows a failed re-read before filing, and files nothing', async () => {
    const readDesigns = vi.fn(async (): Promise<Reply<DesignsView>> => ({ ok: false, error: { message: "Couldn't read this realm's designs. Check that docs/designs can be read, then try again." } }))
    readDesigns.mockImplementationOnce(designsOf([row('5.4.3'), row('5.4.2')]))
    const { engine } = await withComments(OPEN, { readDesigns })
    await screen.findByRole('heading', { name: '5.4.3' })
    const sheet = await openSheet()

    await press(t.designs.fileQuest, sheet)

    expect((await within(sheet).findByRole('alert')).textContent).toBe("Couldn't read this realm's designs. Check that docs/designs can be read, then try again.")
    expect(engine.fileQuest).not.toHaveBeenCalled()
    expect(engine.sendDesignComments).not.toHaveBeenCalled()
    expect((within(sheet).getByLabelText(`${t.designs.versionLabel} *`) as HTMLInputElement).matches(':disabled')).toBe(false)
  })

  it('keeps the dialog open with the reason when filing fails, and marks nothing', async () => {
    const { engine } = await withComments(OPEN, { fileQuest: vi.fn(async () => ({ ok: false as const, error: { message: "Couldn't file the quest." } })) })
    await screen.findByRole('heading', { name: '5.4.3' })
    const sheet = await openSheet()

    await press(t.designs.fileQuest, sheet)

    expect((await within(sheet).findByRole('alert')).textContent).toBe("Couldn't file the quest.")
    expect(engine.sendDesignComments).not.toHaveBeenCalled()
  })

  it('offers Try again that only marks, when marking fails after filing', async () => {
    const sendDesignComments = vi.fn(async (): Promise<Reply<null>> => ({ ok: true, data: null }))
    sendDesignComments.mockResolvedValueOnce({ ok: false, error: { message: 'Try again.' } })
    const { engine } = await withComments(OPEN, { sendDesignComments })
    await screen.findByRole('heading', { name: '5.4.3' })
    const sheet = await openSheet()

    await press(t.designs.fileQuest, sheet)

    expect((await within(sheet).findByRole('alert')).textContent).toBe(t.designs.filedButNotMarked('Try again.'))
    await press(t.failed.tryAgain, sheet)

    await waitFor(() => expect(sendDesignComments).toHaveBeenCalledTimes(2))
    expect(engine.fileQuest).toHaveBeenCalledTimes(1)
    expect(await screen.findByText(t.designs.filedTitle)).toBeTruthy()
  })
})

describe('the comments box', () => {
  const SCENE = scene('Welcome')
  const HEADLINE = SCENE.nodes[0]!
  const panel = (over: Partial<Parameters<typeof CommentsPanel>[0]> = {}) => {
    const onAdd = vi.fn(async () => ({ ok: true as const, data: [] }))
    const onSet = vi.fn(async () => ({ ok: true as const, data: [] }))
    render(<CommentsPanel scene={SCENE} designId="welcome" comments={[]} problem={null} about={null} onAdd={onAdd} onSet={onSet} {...over} />)

    return { onAdd, onSet, box: screen.getByLabelText(`${t.designs.yourComment} *`) as HTMLTextAreaElement }
  }

  it('says a comment is required when sent empty, under the box, and sends nothing', async () => {
    const { onAdd, box } = panel()

    await press(t.designs.addComment)

    expect(errorOf(box)).toBe('Comment is required.')
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('checks the box when it loses focus after typing', async () => {
    const { box } = panel()

    fireEvent.input(box, { target: { value: '   ' } })
    fireEvent.blur(box)

    await waitFor(() => expect(errorOf(box)).toBe(t.designs.commentRequired))
  })

  it('says nothing when it loses focus before anything is typed', () => {
    const { box } = panel()

    fireEvent.blur(box)

    expect(errorOf(box)).toBeNull()
  })

  it('refuses a comment over 2,000 characters', async () => {
    const { onAdd, box } = panel()
    fireEvent.input(box, { target: { value: 'x'.repeat(2001) } })

    await press(t.designs.addComment)

    expect(errorOf(box)).toBe(t.designs.commentLong)
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('sends a comment about the selected layer, trimmed, and empties the box', async () => {
    const { onAdd, box } = panel({ about: HEADLINE })
    fireEvent.input(box, { target: { value: '  Shorter please  ' } })

    await press(t.designs.addComment)

    expect(onAdd).toHaveBeenCalledWith({ design: 'welcome', on: 'headline', text: 'Shorter please' })
    await waitFor(() => expect(box.value).toBe(''))
  })

  it('sends it about the whole design once the layer is cleared', async () => {
    const { onAdd, box } = panel({ about: HEADLINE })
    await press(t.designs.clearAbout)
    fireEvent.input(box, { target: { value: 'Warmer colours' } })

    await press(t.designs.addComment)

    expect(onAdd).toHaveBeenCalledWith({ design: 'welcome', on: null, text: 'Warmer colours' })
  })

  it('keeps what was typed and says why when the comment could not be saved', async () => {
    const { box } = panel({ onAdd: vi.fn(async () => ({ ok: false as const, message: "Couldn't save your comment. Try again." })) })
    fireEvent.input(box, { target: { value: 'Shorter' } })

    await press(t.designs.addComment)

    expect((await screen.findByRole('alert')).textContent).toBe("Couldn't save your comment. Try again.")
    expect(box.value).toBe('Shorter')
  })

  it('lists open comments newest first and folds the rest, each with Resolve or Reopen', async () => {
    const comments = [comment({ id: 'old', text: 'Older', at: '2026-11-04T10:00:00Z' }), comment({ id: 'new', text: 'Newer', at: '2026-11-05T10:00:00Z', on: 'headline' }), comment({ id: 'done', text: 'Done', resolved: '2026-11-05T11:00:00Z' })]
    const { onSet } = panel({ comments })

    const open = screen.getAllByRole('list')[0]!
    expect(within(open).getAllByRole('listitem').map(item => item.querySelector('.dz-c-text')?.textContent)).toEqual(['Newer', 'Older'])
    expect(within(open).getByText(t.designs.onLayer('Headline'))).toBeTruthy()
    expect(screen.getByText(t.designs.resolvedFold(1))).toBeTruthy()
    await press(t.designs.reopen)
    expect(onSet).toHaveBeenCalledWith('done', false)
  })

  it('shows why comments cannot be added when their file does not read', () => {
    render(<CommentsPanel scene={SCENE} designId="welcome" comments={[]} problem={{ file: 'docs/designs/5.4.3/comments.json', detail: 'It has a mistake near line 3.', backupAt: null }} about={null} onAdd={vi.fn()} onSet={vi.fn()} />)

    expect(screen.getByRole('alert').textContent).toContain('docs/designs/5.4.3/comments.json: It has a mistake near line 3.')
    expect(screen.queryByLabelText(`${t.designs.yourComment} *`)).toBeNull()
  })
})
