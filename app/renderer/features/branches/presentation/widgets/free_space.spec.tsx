// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact'
import { afterEach, expect, it, vi } from 'vitest'
import type { FolderSpace, TaskFolder } from '../../../../../shared/branches'
import type { EngineApi, Reply } from '../../../../../shared/engine_api'
import { fakeEngine } from '../../../../test_support'
import { FreeSpace } from './free_space'

const KEY = 'a-000001'
const folder = (over: Partial<TaskFolder> & { taskId: string }): TaskFolder => ({
  title: `Quest ${over.taskId}`, branch: `task/${over.taskId}`, path: `/quests/${over.taskId}`, bytes: 5e6, freeable: 2e6, folders: ['node_modules'],
  held: null, merged: false, changed: [], removable: false, ...over,
})
const space = (...folders: TaskFolder[]): Reply<FolderSpace> => ({ ok: true, data: { at: 0, folders } })
const open = async (over: Partial<EngineApi>, onClose = () => {}) => {
  const { engine } = fakeEngine(over)
  await act(async () => { render(<FreeSpace engine={engine} realm={KEY} onClose={onClose} />) })
  return engine
}
const click = async (el: HTMLElement) => act(() => void fireEvent.click(el))
const isDisabled = (el: HTMLElement) => (el as HTMLButtonElement | HTMLInputElement).disabled
afterEach(cleanup)

it('says it is measuring until the folders arrive, then shows each with its size', async () => {
  let answer!: (r: Reply<FolderSpace>) => void
  const engine = await open({ readFolderSpace: vi.fn(() => new Promise<Reply<FolderSpace>>(done => { answer = done })) })
  expect(screen.getByText('Measuring each quest folder… Large build folders can take a minute.')).toBeTruthy()
  expect(isDisabled(screen.getByRole('button', { name: 'Free space' }))).toBe(true)
  await act(async () => answer(space(folder({ taskId: 'one' }))))
  expect(await screen.findByText('Quest one')).toBeTruthy()
  expect(screen.getByText('5 MB on disk · clearing frees 2 MB')).toBeTruthy()
  expect(engine.readFolderSpace).toHaveBeenCalledWith(KEY)
})

it('says what went wrong when measuring fails, and measures again on Try again', async () => {
  const read = vi.fn<EngineApi['readFolderSpace']>()
    .mockResolvedValueOnce({ ok: false, error: { message: 'The task folders could not be measured. Check that the project folder is available, then try again.' } })
    .mockResolvedValueOnce(space(folder({ taskId: 'one' })))
  await open({ readFolderSpace: read })
  expect((await screen.findByRole('alert')).textContent).toContain('could not be measured')
  await click(screen.getByRole('button', { name: 'Try again' }))
  expect(await screen.findByText('Quest one')).toBeTruthy()
  expect(read).toHaveBeenCalledTimes(2)
})

it('says when there are no quest folders yet, and what makes one', async () => {
  await open({ readFolderSpace: async () => space() })
  expect(await screen.findByText('No quest folders yet')).toBeTruthy()
  expect(screen.getByText('A quest gets its own folder when the app starts it. Its folder shows here.')).toBeTruthy()
})

it('asks for a folder when Free space is pressed with none chosen, and clears nothing', async () => {
  const engine = await open({ readFolderSpace: async () => space(folder({ taskId: 'one' })) })
  await screen.findByText('Quest one')
  const submit = screen.getByRole('button', { name: 'Free space' })
  expect(isDisabled(submit)).toBe(false)
  await click(submit)
  expect(screen.getByRole('alert').textContent).toBe('Choose at least one folder to clear.')
  expect(engine.freeFolderSpace).not.toHaveBeenCalled()
})

it('frees the chosen folders, naming their total on the button and once done', async () => {
  const engine = await open({
    readFolderSpace: async () => space(folder({ taskId: 'one', freeable: 2e6 }), folder({ taskId: 'two', freeable: 1e6 }), folder({ taskId: 'three' })),
    freeFolderSpace: vi.fn(async () => space(folder({ taskId: 'one', folders: [], freeable: 0 }))),
  })
  await click(await screen.findByRole('checkbox', { name: 'Quest one' }))
  await click(screen.getByRole('checkbox', { name: 'Quest two' }))
  await click(screen.getByRole('button', { name: 'Free 3 MB from 2 folders' }))
  expect(engine.freeFolderSpace).toHaveBeenCalledWith(KEY, ['/quests/one', '/quests/two'])
  expect(await screen.findByText('Freed 3 MB. Run your install again in a folder when you go back to it.')).toBeTruthy()
})

it('shows the clearing line and locks the sheet while folders are cleared', async () => {
  let answer!: (r: Reply<FolderSpace>) => void
  await open({ readFolderSpace: async () => space(folder({ taskId: 'one' })), freeFolderSpace: vi.fn(() => new Promise<Reply<FolderSpace>>(done => { answer = done })) })
  await click(await screen.findByRole('checkbox', { name: 'Quest one' }))
  await click(screen.getByRole('button', { name: 'Free 2 MB from 1 folder' }))
  expect(screen.getByText('Clearing build folders…')).toBeTruthy()
  expect(isDisabled(screen.getByRole('checkbox', { name: 'Quest one' }))).toBe(true)
  expect(isDisabled(screen.getByRole('button', { name: 'Measure again' }))).toBe(true)
  await act(async () => answer(space(folder({ taskId: 'one', folders: [], freeable: 0 }))))
  await waitFor(() => expect(screen.queryByText('Clearing build folders…')).toBeNull())
})

it('shows the engine\'s refusal and keeps the folders on screen', async () => {
  await open({
    readFolderSpace: async () => space(folder({ taskId: 'one' })),
    freeFolderSpace: async () => ({ ok: false, error: { message: 'A quest or a session started working in one of these folders. Refresh and choose again.' } }),
  })
  await click(await screen.findByRole('checkbox', { name: 'Quest one' }))
  await click(screen.getByRole('button', { name: 'Free 2 MB from 1 folder' }))
  expect((await screen.findByRole('alert')).textContent).toContain('started working in one of these folders')
  expect(screen.getByText('Quest one')).toBeTruthy()
})

it('says who holds a folder, and neither a held folder nor one with nothing to clear can be chosen', async () => {
  const engine = await open({ readFolderSpace: async () => space(
    folder({ taskId: 'one' }), folder({ taskId: 'two', held: 'current' }), folder({ taskId: 'three', held: 'session' }), folder({ taskId: 'four', folders: [], freeable: 0 }),
  ) })
  expect(await screen.findByText('The current quest works here, so it is not touched.')).toBeTruthy()
  expect(screen.getByText('A Claude Code session is working here, so it is not touched.')).toBeTruthy()
  expect(screen.getByText('No build folders to clear.')).toBeTruthy()
  for (const title of ['Quest two', 'Quest three', 'Quest four']) expect(isDisabled(screen.getByRole('checkbox', { name: title }))).toBe(true)
  await click(screen.getByRole('checkbox', { name: 'Select every folder that can be cleared' }))
  await click(screen.getByRole('button', { name: 'Free 2 MB from 1 folder' }))
  expect(engine.freeFolderSpace).toHaveBeenCalledWith(KEY, ['/quests/one'])
})

it('removes a folder only after Remove this folder confirms it', async () => {
  const engine = await open({ readFolderSpace: async () => space(folder({ taskId: 'one', merged: true, removable: true })), removeTaskFolder: vi.fn(async () => space()) })
  await click(await screen.findByRole('button', { name: 'Remove folder' }))
  expect(screen.getByText(/Removing deletes the folder with its ignored files, \.env included\. The branch is kept/)).toBeTruthy()
  await click(screen.getByRole('button', { name: 'Keep it' }))
  expect(screen.queryByRole('button', { name: 'Remove this folder' })).toBeNull()
  expect(engine.removeTaskFolder).not.toHaveBeenCalled()
  await click(screen.getByRole('button', { name: 'Remove folder' }))
  await click(screen.getByRole('button', { name: 'Remove this folder' }))
  expect(engine.removeTaskFolder).toHaveBeenCalledWith(KEY, 'one')
  expect(await screen.findByText('Removed the folder of Quest one. Its branch is kept.')).toBeTruthy()
})

it('offers no removal for a merged folder with changes, and lists them collapsed', async () => {
  const changed = Array.from({ length: 102 }, (_, n) => ({ status: '??', path: `file-${n}.txt`, previous: null }))
  await open({ readFolderSpace: async () => space(folder({ taskId: 'one', merged: true, changed }), folder({ taskId: 'two', merged: true, changed: [{ status: ' M', path: 'a.ts', previous: null }] })) })
  const summary = await screen.findByText('Merged, but 102 uncommitted files keep this folder')
  expect(summary.closest('details')!.open).toBe(false)
  expect(screen.getAllByText(/^\?\? file-/)).toHaveLength(100)
  expect(screen.getByText('…and 2 more')).toBeTruthy()
  expect(screen.getByText('Merged, but 1 uncommitted file keeps this folder')).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Remove folder' })).toBeNull()
})

it('measures again only when asked, and closes from the header', async () => {
  const close = vi.fn()
  const engine = await open({ readFolderSpace: vi.fn(async () => space(folder({ taskId: 'one' }))) }, close)
  const again = await screen.findByRole('button', { name: 'Measure again' })
  expect(engine.readFolderSpace).toHaveBeenCalledTimes(1)
  await click(again)
  await screen.findByText('Quest one')
  expect(engine.readFolderSpace).toHaveBeenCalledTimes(2)
  await click(screen.getByRole('button', { name: 'Close' }))
  expect(close).toHaveBeenCalledTimes(1)
})
