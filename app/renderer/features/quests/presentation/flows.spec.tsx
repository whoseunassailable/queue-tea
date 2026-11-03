// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ActiveQuest, EngineApi, GitHold, ProjectRow, ProjectView, Reply, SessionState, Settings, StartCheck, Victory } from '../../../../shared/engine_api'
import { App } from '../../../app/app'
import { dayAndTime, refillTime } from '../../../core/domain/format'
import { t } from '../../../l10n/en'
import { activeQuest, fakeEngine, projectRow, projectView, quest, VICTORY } from '../../../test_support'
import { createWorkspace } from '../../workspace/state_management/workspace_store'

const KEY = 'a-000001'
const MAIN = quest({ id: 'first', title: 'First quest', isStar: true, why: 'urgent' })
const OTHER = quest({ id: 'second', title: 'Second quest' })
const SEALED = quest({ id: 'stuck', title: 'Stuck quest', sealedBecause: 'waiting for the clinic' })
const BOARD = projectView(KEY, { ready: [{ kind: 'quest', quest: MAIN }, { kind: 'quest', quest: OTHER }], sealed: [{ kind: 'quest', quest: SEALED }], canStart: 2, sealedCount: 1 })

const withActive = (over: Partial<ActiveQuest> = {}, session: SessionState = 'open', view = BOARD): ProjectView => ({ ...(view as Extract<ProjectView, { kind: 'readable' }>), active: activeQuest(over), session: { state: session, allowance: null } })

const hold = (over: Partial<GitHold> = {}): GitHold => ({ kind: 'uncommitted', reason: '10 files not committed', branch: 'task/old', head: 'abc1234', files: Array.from({ length: 10 }, (_, i) => `file${i}.md`), fileCount: 10, command: 'git status', ...over })
const held = (over: Partial<GitHold> = {}) => vi.fn(async (): Promise<Reply<StartCheck>> => ({ ok: true, data: { kind: 'held', hold: hold(over) } }))

const open = async (view: ProjectView, over: Partial<EngineApi> = {}) => {
  const { engine, fire } = fakeEngine({ readProject: async () => ({ ok: true, data: view }), ...over })
  const workspace = createWorkspace(engine)
  await act(async () => {
    render(<App workspace={workspace} engine={engine} />)
    await workspace.start()
  })

  return { engine, workspace, fire }
}

const key = (name: string, over: KeyboardEventInit = {}) => act(() => void fireEvent.keyDown(document.body, { key: name, ...over }))
const press = (name: string | RegExp) => act(() => void fireEvent.click(screen.getByRole('button', { name })))
const button = (name: string | RegExp) => screen.getByRole<HTMLButtonElement>('button', { name })

beforeEach(() => {
  window.location.hash = '#/home'
})
afterEach(cleanup)

describe('Start from Home', () => {
  it('names the main quest on its button', async () => {
    const { engine } = await open(BOARD)

    await press(t.actions.startNamed('First quest'))

    await waitFor(() => expect(engine.startQuest).toHaveBeenCalledWith(KEY, 'first', 'claude'))
  })

  it('s starts the main quest', async () => {
    const { engine } = await open(BOARD)

    await key('s')

    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledWith(KEY, 'first'))
  })

  it('leaves the arrow keys to scroll Home', async () => {
    await open(BOARD)

    expect(fireEvent.keyDown(document.body, { key: 'ArrowDown' })).toBe(true)
  })

  it('shows nothing to press with nothing on the board', async () => {
    await open(projectView(KEY))

    expect(screen.queryByRole('button', { name: /^Start/ })).toBeNull()
  })

  it('shows the working line on the card, in place of the Now card', async () => {
    const { engine } = await open(BOARD, { checkStart: () => new Promise(() => {}) })
    await press(t.actions.startNamed('First quest'))

    expect(within(screen.getByRole('status', { name: t.flow.working })).getByText(t.flow.checking)).toBeTruthy()
    expect(screen.queryByRole('heading', { name: t.quest.noneTitle })).toBeNull()
    expect(engine.startQuest).not.toHaveBeenCalled()
  })
})

describe('Start from Quests', () => {
  beforeEach(() => {
    window.location.hash = '#/quests'
  })

  it('the detail pane starts the quest open in it', async () => {
    const { engine, workspace } = await open(BOARD)
    await act(async () => workspace.openQuest(KEY, 'second'))

    await press(t.actions.start)

    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledWith(KEY, 'second'))
  })

  it('calls the main quest Start ★', async () => {
    await open(BOARD)

    expect(button(t.actions.startMain)).toBeTruthy()
  })

  it('s starts the row open, not the main quest', async () => {
    const { engine, workspace } = await open(BOARD)
    await act(async () => workspace.openQuest(KEY, 'second'))

    await key('s')

    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledWith(KEY, 'second'))
  })

  it('offers no Start on a sealed quest, and s does nothing there', async () => {
    const { engine, workspace } = await open(BOARD)
    await act(async () => workspace.openQuest(KEY, 'stuck'))

    expect(screen.queryByRole('button', { name: /^Start/ })).toBeNull()
    await key('s')
    expect(engine.checkStart).not.toHaveBeenCalled()
  })

  it('dims Start while a quest is active, and says why', async () => {
    const { engine } = await open(withActive())

    expect(button(t.actions.startMain).disabled).toBe(true)
    expect(screen.getByText(t.board.startHint)).toBeTruthy()
    await key('s')
    expect(engine.checkStart).not.toHaveBeenCalled()
  })

  it('shows the hold where the active quest would be', async () => {
    await open(BOARD, { checkStart: held() })
    await press(t.actions.startMain)

    await screen.findByText(t.flow.gate('First quest'))
    expect(document.querySelector('.qlist')?.textContent).toContain(t.flow.gate('First quest'))
  })

  it('keeps a missed checkpoint in the detail pane of that quest', async () => {
    const { workspace } = await open(BOARD)

    await act(async () => workspace.noteFor('first', t.flow.noCheckpointYet))

    expect(within(screen.getByRole('complementary')).getByText(t.flow.noCheckpointYet, { exact: false })).toBeTruthy()
  })
})

describe('the git hold', () => {
  const heldOpen = async (over: Partial<GitHold> = {}) => {
    const opened = await open(BOARD, { checkStart: held(over) })
    await press(t.actions.startNamed('First quest'))
    await screen.findByText(t.flow.gate('First quest'))

    return opened
  }

  it('says what holds it in the engine\'s words, on which branch, and what to do', async () => {
    await heldOpen()

    expect(screen.getByText('10 files not committed on task/old, abc1234')).toBeTruthy()
    expect(screen.getByText(`${t.flow.advice.uncommitted} ${t.flow.nothingChanged}`)).toBeTruthy()
  })

  it('lists seven files, and shows the rest when asked', async () => {
    await heldOpen()

    expect(screen.getByText('file6.md')).toBeTruthy()
    expect(screen.queryByText('file7.md')).toBeNull()
    await press(t.flow.more(3))
    expect(screen.getByText('file9.md')).toBeTruthy()
  })

  it('counts files it was not given', async () => {
    await heldOpen({ files: Array.from({ length: 20 }, (_, i) => `f${i}.md`), fileCount: 25 })

    await press(t.flow.more(18))

    expect(screen.getByText(t.flow.more(5))).toBeTruthy()
  })

  it('has no file list when no file holds it', async () => {
    await heldOpen({ kind: 'unpushed', reason: '2 commits not pushed', files: [], fileCount: 0, command: 'git push' })

    expect(document.querySelector('.files')).toBeNull()
    expect(screen.getByText(`${t.flow.advice.unpushed} ${t.flow.nothingChanged}`)).toBeTruthy()
  })

  it('copies a command, and no button reads Commit, Push, Merge or Pull', async () => {
    const { engine } = await heldOpen({ kind: 'unpushed', reason: '2 commits not pushed', files: [], fileCount: 0, command: 'git push' })

    expect(screen.getByText('git push')).toBeTruthy()
    await press(t.flow.copy)

    await waitFor(() => expect(engine.copyText).toHaveBeenCalledWith('git push'))
    for (const control of screen.getAllByRole('button')) {
      expect(`${control.textContent ?? ''} ${control.getAttribute('aria-label') ?? ''}`).not.toMatch(/\b(commit|push|merge|pull)\b/i)
    }
  })

  it('a branch that could not be made has no command to copy', async () => {
    await heldOpen({ kind: 'branch', reason: "Couldn't make the branch task/x. Check again to retry.", files: [], fileCount: 0, command: null })

    expect(screen.queryByRole('button', { name: t.flow.copy })).toBeNull()
  })

  it('Check again and r both check again', async () => {
    const { engine } = await heldOpen()

    await press(t.flow.checkAgain)
    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledTimes(2))
    await key('r')
    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledTimes(3))
  })

  it('Cancel and Esc both go back to the Now card', async () => {
    await heldOpen()

    await press(t.actions.cancel)
    expect(screen.getByRole('heading', { name: t.quest.noneTitle })).toBeTruthy()

    await press(t.actions.startNamed('First quest'))
    await screen.findByText(t.flow.gate('First quest'))
    await key('Escape')
    expect(screen.getByRole('heading', { name: t.quest.noneTitle })).toBeTruthy()
  })
})

describe('when Start is refused', () => {
  it('says why in plain words, with a way to try again', async () => {
    const checkStart = vi.fn(async (): Promise<Reply<StartCheck>> => ({ ok: false, error: { message: 'The other one was started first.' } }))
    const { engine } = await open(BOARD, { checkStart })

    await press(t.actions.startNamed('First quest'))

    expect((await screen.findByRole('alert')).textContent).toContain('The other one was started first.')
    await press(t.failed.tryAgain)
    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledTimes(2))
  })
})

describe('a terminal that would not open', () => {
  const failed = { startQuest: async () => ({ ok: true as const, data: { kind: 'started' as const, view: withActive({}, 'none'), branch: 'task/x', notice: null, handover: { kind: 'failed' as const, terminal: 'iterm' as const, command: "cd '/p' && claude" } } }) }

  it('names it, and offers another try and the line to copy', async () => {
    const { engine } = await open(BOARD, failed)
    await press(t.actions.startNamed('First quest'))

    expect(await screen.findByText(t.flow.couldntOpen('iTerm2'))).toBeTruthy()
    expect(screen.getByText("cd '/p' && claude")).toBeTruthy()
    await press(t.failed.tryAgain)
    await waitFor(() => expect(engine.openClaude).toHaveBeenCalledWith(KEY))
  })
})

describe('the active quest', () => {
  it('offers its four actions', async () => {
    await open(withActive())

    for (const name of [t.actions.openClaude, t.actions.finish, t.actions.back, t.actions.seal]) expect(button(name)).toBeTruthy()
  })

  it.each([
    ['open', t.flow.handing],
    ['working', t.flow.takesWhenTurnEnds],
    ['none', t.flow.takesWhenOpen],
  ] as const)('with a begin waiting and a session %s, says what happens next', async (session, line) => {
    await open(withActive({ asking: 'begin' }, session))

    expect(screen.getByText(line)).toBeTruthy()
  })

  it.each([
    ['open', t.flow.saving],
    ['working', t.flow.savesWhenTurnEnds],
    ['none', t.flow.noSessionToSave],
  ] as const)('with a checkpoint awaited and a session %s, offers to go without', async (session, line) => {
    const { engine } = await open(withActive({ asking: 'putBack' }, session))

    expect(screen.getByText(line)).toBeTruthy()
    expect(screen.queryByRole('button', { name: t.actions.finish })).toBeNull()
    await press(t.actions.backNow)
    await waitFor(() => expect(engine.putBackNow).toHaveBeenCalledWith(KEY, 'active'))
  })

  it('Open in Claude Code opens it, as does c and ⌘↩', async () => {
    const { engine } = await open(withActive())

    await press(t.actions.openClaude)
    await waitFor(() => expect(engine.openClaude).toHaveBeenCalledTimes(1))
    await key('c')
    await waitFor(() => expect(engine.openClaude).toHaveBeenCalledTimes(2))
    await key('Enter', { metaKey: true })
    await waitFor(() => expect(engine.openClaude).toHaveBeenCalledTimes(3))
  })

  it('Back to the board and b both put it back', async () => {
    const putBackQuest = vi.fn<EngineApi['putBackQuest']>(async () => ({ ok: true, data: { view: withActive(), went: 'asked', missedCheckpoint: null, isCodexTimeLost: false } }))
    const { engine } = await open(withActive(), { putBackQuest })

    await press(t.actions.back)
    await waitFor(() => expect(engine.putBackQuest).toHaveBeenCalledWith(KEY, 'active', null))
    await key('b')
    await waitFor(() => expect(engine.putBackQuest).toHaveBeenCalledTimes(2))
  })

  it('b does nothing while the checkpoint is awaited', async () => {
    const { engine } = await open(withActive({ asking: 'putBack' }))

    await key('b')

    expect(engine.putBackQuest).not.toHaveBeenCalled()
  })

  it('shows on the board too', async () => {
    window.location.hash = '#/quests'
    await open(withActive())

    expect(within(document.querySelector('.qlist') as HTMLElement).getByRole('button', { name: t.actions.finish })).toBeTruthy()
  })
})

describe('sealing the active quest', () => {
  const sealOpen = async (over: Partial<EngineApi> = {}) => {
    const opened = await open(withActive(), over)
    await press(t.actions.seal)
    await screen.findByRole('dialog')

    return opened
  }

  it('says it goes back with a checkpoint', async () => {
    await sealOpen()

    expect(screen.getByText(t.form.sealActive)).toBeTruthy()
  })

  it('puts it back with the seal, and closes', async () => {
    const { engine } = await sealOpen()

    await act(async () => void fireEvent.input(screen.getByLabelText(t.form.reason), { target: { value: 'waiting for the clinic' } }))
    await press(t.actions.sealIt)

    await waitFor(() => expect(engine.putBackQuest).toHaveBeenCalledWith(KEY, 'active', { reason: 'waiting for the clinic' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('shows a refusal in the dialog and keeps it open', async () => {
    await sealOpen({ putBackQuest: async () => ({ ok: false, error: { message: 'Those two wait for each other.' } }) })

    await act(async () => void fireEvent.input(screen.getByLabelText(t.form.reason), { target: { value: 'waiting' } }))
    await press(t.actions.sealIt)

    expect((await screen.findByRole('alert')).textContent).toBe('Those two wait for each other.')
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('k seals it from Home', async () => {
    await open(withActive())

    await key('k')

    expect(await screen.findByRole('dialog')).toBeTruthy()
  })
})

describe('Judgement', () => {
  const REVIEW = { at: 'now', checked: 'docs build and typecheck pass' }

  it('asks the question with what Claude checked, in place of the Now card', async () => {
    await open(withActive({ review: REVIEW }))

    expect(screen.getByRole('heading', { name: t.judgement.ask('Active one') })).toBeTruthy()
    expect(screen.getByText(REVIEW.checked, { exact: false })).toBeTruthy()
    expect(screen.queryByRole('button', { name: t.actions.finish })).toBeNull()
  })

  it('shows the completion criteria under it', async () => {
    await open(withActive({ review: REVIEW, criteria: ['Docs build'] }))

    expect(screen.getByText('Docs build')).toBeTruthy()
  })

  it('leaves out the line when Claude said nothing', async () => {
    await open(withActive({ review: { at: 'now', checked: null } }))

    expect(screen.queryByText(t.judgement.checked)).toBeNull()
  })

  it('Yes and y both open the Finish sheet', async () => {
    await open(withActive({ review: REVIEW }))

    await press(t.judgement.yes)
    expect(within(screen.getByRole('dialog')).getByText(t.finish.howHard)).toBeTruthy()
    await key('Escape')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())

    await key('y')
    expect(await screen.findByRole('dialog')).toBeTruthy()
  })

  it('Not yet and n both clear the question', async () => {
    const { engine } = await open(withActive({ review: REVIEW }))

    await key('n')

    await waitFor(() => expect(engine.notYet).toHaveBeenCalledWith(KEY, 'active'))
  })

  it('y and n mean nothing with no question asked', async () => {
    const { engine } = await open(withActive())

    await key('n')
    await key('y')

    expect(engine.notYet).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('marks the realm in the sidebar', async () => {
    const row: ProjectRow = projectRow(KEY, { status: { kind: 'judgement' } })
    await open(withActive({ review: REVIEW }), { listProjects: async () => ({ ok: true, data: [row] }) })

    expect(screen.getByText(t.status.judgement)).toBeTruthy()
  })
})

describe('the Finish sheet', () => {
  const sheet = async (over: Partial<EngineApi> = {}, view: ProjectView = withActive()) => {
    const opened = await open(view, over)
    await press(t.actions.finish)

    return { ...opened, dialog: screen.getByRole('dialog') }
  }
  const pressed = (name: string) => within(screen.getByRole('group', { name: t.finish.howHard })).getByRole('button', { name }).getAttribute('aria-pressed')
  const noLog = withActive({}, 'open', { ...BOARD, docsLogPath: null } as ProjectView)

  it('starts on the difficulty expected, and says what will happen', async () => {
    await sheet()

    expect(pressed(t.finish.option('Hard', 50, true))).toBe('true')
    expect(screen.getByText(t.finish.meta('14m', 'task/active', 1))).toBeTruthy()
    expect(screen.getByText(t.finish.row('docs/task_log.md'), { exact: false })).toBeTruthy()
  })

  it('d opens it', async () => {
    await open(withActive())

    await key('d')

    expect(await screen.findByRole('dialog')).toBeTruthy()
  })

  it('finishes as the difficulty picked', async () => {
    const { engine } = await sheet()

    await press(t.finish.option('Light', 10, false))
    await press(t.finish.go)

    await waitFor(() => expect(engine.finishQuest).toHaveBeenCalledWith(KEY, 'active', 'light', null))
  })

  it('asks where the task log goes the first time, offering docs/task_log.md', async () => {
    const { engine } = await sheet({}, noLog)

    expect((screen.getByLabelText(`${t.finish.path} *`) as HTMLInputElement).value).toBe('docs/task_log.md')
    await press(t.finish.go)

    await waitFor(() => expect(engine.finishQuest).toHaveBeenCalledWith(KEY, 'active', 'hard', 'docs/task_log.md'))
  })

  it('shows the error under the path as it loses focus', async () => {
    await sheet({}, noLog)
    const field = screen.getByLabelText(`${t.finish.path} *`)

    await act(async () => void fireEvent.input(field, { target: { value: '  ' } }))
    await act(async () => void fireEvent.blur(field))

    expect(screen.getByText(t.finish.pathRequired)).toBeTruthy()
  })

  it('blocks Finish on a bad path, with the button still enabled and the error shown', async () => {
    const { engine } = await sheet({}, noLog)

    await act(async () => void fireEvent.input(screen.getByLabelText(`${t.finish.path} *`), { target: { value: 'docs/' } }))
    expect(button(t.finish.go).disabled).toBe(false)
    await press(t.finish.go)

    expect(screen.getByText(t.finish.pathBad)).toBeTruthy()
    expect(engine.finishQuest).not.toHaveBeenCalled()
  })

  it('reads Finishing… while it works, and a second ⌘↩ does nothing', async () => {
    const finishQuest = vi.fn<EngineApi['finishQuest']>(() => new Promise(() => {}))
    await sheet({ finishQuest })

    await key('Enter', { metaKey: true })
    expect(screen.getByRole('button', { name: t.finish.going })).toBeTruthy()
    await key('Enter', { metaKey: true })

    expect(finishQuest).toHaveBeenCalledTimes(1)
  })

  it('stays open with the reason when it fails', async () => {
    await sheet({ finishQuest: async () => ({ ok: false, error: { message: 'That quest is no longer the active one.' } }) })

    await press(t.finish.go)

    expect((await screen.findByRole('alert')).textContent).toBe('That quest is no longer the active one.')
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('closes on a win, showing the victory', async () => {
    await sheet()

    await press(t.finish.go)

    expect(await screen.findByRole('heading', { name: t.win.title })).toBeTruthy()
    expect(screen.queryByText(t.finish.howHard)).toBeNull()
  })
})

describe('the victory', () => {
  const won = async (victory: Partial<Victory> = {}, settings: Partial<Settings> = {}, view: ProjectView = withActive()) => {
    const finishQuest = vi.fn<EngineApi['finishQuest']>(async key => ({ ok: true, data: { view: { ...BOARD, key }, logPath: 'docs/task_log.md', logFailedAt: null, minutes: 14, victory: { ...VICTORY, ...victory }, isCodexTimeLost: false } }))
    const opened = await open(view, {
      finishQuest,
      readSettings: async () => ({ ok: true, data: { sky: 'day', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {}, ...settings } }),
    })
    await press(t.actions.finish)
    await press(t.finish.go)
    await screen.findByRole('heading', { name: t.win.title })

    return opened
  }

  it('shows what was earned', async () => {
    await won()

    expect(screen.getByText(t.win.kicker.quest)).toBeTruthy()
    expect(screen.getByText(t.quest.xp(50))).toBeTruthy()
    expect(screen.getByText(t.win.toLevel(70, 200, 3))).toBeTruthy()
    expect(screen.getByText(t.quest.gold(50))).toBeTruthy()
    expect(screen.getByText(t.win.hoard(170))).toBeTruthy()
    expect(screen.getByText(`${t.win.finishedAs('Hard', 'Hard')} · ${t.win.rowWent('docs/task_log.md')}`)).toBeTruthy()
  })

  it('calls a boss a boss', async () => {
    await won({ kind: 'boss' })

    expect(screen.getByText(t.win.kicker.boss)).toBeTruthy()
  })

  it('shows a level-up and how the dragon grows', async () => {
    await won({ didLevelUp: true, level: 3 })

    expect(screen.getByText(t.win.level(3))).toBeTruthy()
    expect(screen.getByText(t.win.nextLevel(300))).toBeTruthy()
    expect(screen.getByText(t.win.grows(t.stage.hatchling, 5))).toBeTruthy()
  })

  it('shows a badge in the panel and in a toast', async () => {
    await won({ newBadges: ['firstFlame'] })

    expect(within(screen.getByRole('dialog')).getByText(t.badges.firstFlame)).toBeTruthy()
    expect(screen.getByText(t.win.badgeToast(t.badges.firstFlame))).toBeTruthy()
  })

  it('the dragon cheers until it closes', async () => {
    await won()

    expect(document.querySelector('.rm')?.className).toContain('m-cheer')
    await press(t.win.close)
    expect(document.querySelector('.rm')?.className).not.toContain('m-cheer')
  })

  it('closes with Back to the lair', async () => {
    await won()

    await press(t.win.close)

    expect(screen.queryByRole('heading', { name: t.win.title })).toBeNull()
  })

  it('Esc closes it and the badge toast together', async () => {
    await won({ newBadges: ['firstFlame'] })

    await key('Escape')

    expect(screen.queryByRole('heading', { name: t.win.title })).toBeNull()
    expect(screen.queryByText(t.win.badgeToast(t.badges.firstFlame))).toBeNull()
  })

  it('closes on a click on the sky, but not on the panel', async () => {
    await won()

    await act(async () => void fireEvent.click(screen.getByRole('heading', { name: t.win.title })))
    expect(screen.getByRole('heading', { name: t.win.title })).toBeTruthy()

    await act(async () => void fireEvent.click(document.querySelector('.win-layer') as HTMLElement))
    expect(screen.queryByRole('heading', { name: t.win.title })).toBeNull()
  })

  it('leaves the keys working: s starts the next quest and closes it', async () => {
    const { engine } = await won()

    await key('s')

    await waitFor(() => expect(engine.checkStart).toHaveBeenCalledWith(KEY, 'first'))
    await waitFor(() => expect(screen.queryByRole('heading', { name: t.win.title })).toBeNull())
  })

  it('drops the coins in Calm mode', async () => {
    await won({}, { isCalm: true })

    expect(document.querySelector('.coins')).toBeNull()
  })

  it('throws coins otherwise', async () => {
    await won()

    expect(document.querySelectorAll('.cn')).toHaveLength(8)
  })
})

describe('Start in Codex', () => {
  it('on Home, starts the main quest in Codex, beside Start ★', async () => {
    const { engine } = await open(BOARD)

    await press(t.actions.startCodex)

    await waitFor(() => expect(engine.startQuest).toHaveBeenCalledWith(KEY, 'first', 'codex'))
  })

  it('in the detail pane, starts the quest open in it in Codex', async () => {
    window.location.hash = '#/quests'
    const { engine, workspace } = await open(BOARD)
    await act(async () => workspace.openQuest(KEY, 'second'))

    await press(t.actions.startCodex)

    await waitFor(() => expect(engine.startQuest).toHaveBeenCalledWith(KEY, 'second', 'codex'))
  })

  it('is dimmed while a quest is active, and missing on a sealed quest', async () => {
    window.location.hash = '#/quests'
    const { workspace } = await open(withActive())
    expect(button(t.actions.startCodex).disabled).toBe(true)

    await act(async () => workspace.openQuest(KEY, 'stuck'))
    expect(screen.queryByRole('button', { name: t.actions.startCodex })).toBeNull()
  })
})

describe('the active quest and Codex', () => {
  const SINCE = '2026-10-27T18:00:00+01:00'

  it('with Claude Code, offers Continue in Codex, which moves it', async () => {
    const { engine } = await open(withActive())

    expect(button(t.actions.openClaude)).toBeTruthy()
    expect(screen.queryByRole('button', { name: t.actions.reopenCodex })).toBeNull()
    await press(t.actions.continueCodex)

    await waitFor(() => expect(engine.continueIn).toHaveBeenCalledWith(KEY, 'active', 'codex'))
  })

  it('with Codex, says since when in place of the session, and offers Show Codex instead of Open in Claude Code', async () => {
    const { engine } = await open(withActive({ codexSince: SINCE }))

    expect(screen.getByText(t.quest.withCodex(dayAndTime(SINCE)))).toBeTruthy()
    expect(screen.queryByText(t.session.open)).toBeNull()
    expect(screen.queryByRole('button', { name: t.actions.openClaude })).toBeNull()
    await press(t.actions.showCodex)

    await waitFor(() => expect(engine.openClaude).toHaveBeenCalledWith(KEY))
  })

  it('with Codex, Continue in Claude Code brings it back, and Open Codex again opens Codex on it', async () => {
    const view = withActive({ codexSince: SINCE })
    const { engine } = await open(view, { continueIn: vi.fn(async () => ({ ok: true as const, data: { view, handover: { kind: 'opened' as const, terminal: 'terminal' as const }, isCodexTimeLost: false } })) })

    await press(t.actions.continueClaude)
    await waitFor(() => expect(engine.continueIn).toHaveBeenCalledWith(KEY, 'active', 'claude'))
    await press(t.actions.reopenCodex)
    await waitFor(() => expect(engine.continueIn).toHaveBeenLastCalledWith(KEY, 'active', 'codex'))
  })

  it('a refusal to move shows why, and the quest stays with Claude Code', async () => {
    const message = 'Claude Code is still working on Active one. Wait for its turn to end, or stop it with Esc in its terminal, then try again. Nothing has changed.'
    await open(withActive({}, 'working'), { continueIn: async () => ({ ok: false, error: { message } }) })

    await press(t.actions.continueCodex)

    expect(await screen.findByText(message)).toBeTruthy()
    expect(button(t.actions.continueCodex)).toBeTruthy()
  })
})

describe("when Claude's allowance is used up", () => {
  const allowance = { percent: 100, resetsAt: new Date(Date.now() + 3_600_000).toISOString() }
  const line = `! ${t.quest.claudeOut(refillTime(allowance))}`
  const out = (view: ProjectView): ProjectView => ({ ...(view as Extract<ProjectView, { kind: 'readable' }>), session: { state: 'open', allowance } })

  it('says Codex can carry on beside Start on Home, with Start ★ still first', async () => {
    await open(out(BOARD))

    expect(screen.getByText(line)).toBeTruthy()
    const actions = screen.getAllByRole('button').map(b => b.textContent)
    expect(actions.indexOf(t.actions.startNamed('First quest'))).toBeLessThan(actions.indexOf(t.actions.startCodex))
  })

  it('says so in the detail pane of a quest that can start', async () => {
    window.location.hash = '#/quests'
    const { workspace } = await open(out(BOARD))
    await act(async () => workspace.openQuest(KEY, 'second'))

    expect(within(screen.getByRole('complementary', { name: t.detail.label })).getByText(line)).toBeTruthy()
  })

  it('says so on a quest with Claude Code, and not on one with Codex', async () => {
    await open(out(withActive()))
    expect(screen.getByText(line)).toBeTruthy()
    cleanup()

    await open(out(withActive({ codexSince: '2026-10-27T18:00:00+01:00' })))
    expect(screen.queryByText(line)).toBeNull()
  })

  it('says nothing while the allowance lasts', async () => {
    await open({ ...(BOARD as Extract<ProjectView, { kind: 'readable' }>), session: { state: 'open', allowance: { percent: 99, resetsAt: allowance.resetsAt } } })

    expect(screen.queryByText(line)).toBeNull()
    expect(screen.queryByText(/allowance is used up/)).toBeNull()
  })
})
