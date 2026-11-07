import { describe, expect, it, vi } from 'vitest'

import type { EngineApi, Reply } from '../../../../../shared/engine_api'
import type { NotesView } from '../../../../../shared/notes'
import { t } from '../../../../l10n/en'
import { fakeEngine, NOTES } from '../../../../test_support'
import { createWorkspace } from '../../../workspace/state_management/workspace_store'
import { jotIdea } from './note_flows'

const KEY = 'a-000001'

describe('jotting from another screen', () => {
  it('shows progress until the note is saved, then replaces it with Open', async () => {
    let finish!: (answer: Reply<{ view: NotesView; id: string }>) => void
    const { engine } = fakeEngine({ createNote: vi.fn<EngineApi['createNote']>(() => new Promise(resolve => { finish = resolve })) })
    const workspace = createWorkspace(engine)
    const onOpen = vi.fn()
    const saving = jotIdea(engine, workspace, KEY, ' Buy [milk] ', onOpen)
    expect(workspace.getState().toasts.map(toast => toast.text)).toEqual(['Jotting your idea into Inbox…'])
    finish({ ok: true, data: { view: NOTES, id: 'made' } })
    await saving
    expect(engine.createNote).toHaveBeenCalledWith(KEY, { title: 'Buy milk', folder: 'Inbox', body: 'Buy [milk]' })
    const toasts = workspace.getState().toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0]?.tone).toBe('success')
    toasts[0]?.action?.run()
    expect(onOpen).toHaveBeenCalledWith('made')
  })

  it('logs a rejected call and lets Try again save the same idea in the same realm', async () => {
    const createNote = vi.fn<EngineApi['createNote']>().mockRejectedValueOnce(new Error('private failure')).mockResolvedValueOnce({ ok: true, data: { view: NOTES, id: 'made' } })
    const { engine } = fakeEngine({ createNote })
    const workspace = createWorkspace(engine)
    await jotIdea(engine, workspace, KEY, 'Buy milk', vi.fn())
    expect(engine.log).toHaveBeenCalledWith('error', expect.stringContaining('private failure'))
    const failed = workspace.getState().toasts.at(-1)!
    expect(failed.text).toContain(t.failed.noAnswer)
    expect(failed.text).not.toContain('private failure')
    expect(failed.action?.label).toBe(t.failed.tryAgain)
    failed.action?.run()
    await vi.waitFor(() => expect(createNote).toHaveBeenCalledTimes(2))
    expect(createNote.mock.calls[1]).toEqual([KEY, { title: 'Buy milk', folder: 'Inbox', body: '' }])
  })

  it('does nothing with an empty idea', async () => {
    const { engine } = fakeEngine()
    const workspace = createWorkspace(engine)
    await jotIdea(engine, workspace, KEY, '  ', vi.fn())
    expect(engine.createNote).not.toHaveBeenCalled()
    expect(workspace.getState().toasts).toEqual([])
  })
})
