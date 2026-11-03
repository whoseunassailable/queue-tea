import { describe, expect, it, vi } from 'vitest'

import type { ContinueOutcome, EngineApi, GitHold, ProjectView, Reply, StartCheck, StartOutcome } from '../../../../../shared/engine_api'
import { t } from '../../../../l10n/en'
import { activeQuest, fakeEngine, projectView, VICTORY } from '../../../../test_support'
import { createWorkspace } from '../../../workspace/state_management/workspace_store'
import { questFlows } from './quest_flows'

const KEY = 'a-000001'
const QUEST = { id: 'first', title: 'First quest' }
const ACTIVE = activeQuest()
const HOLD: GitHold = { kind: 'uncommitted', reason: '2 files not committed', branch: 'main', head: 'abc1234', files: ['a.txt', 'b.txt'], fileCount: 2, command: 'git status' }

// A reply the test lets go of, to look at the screen between two steps.
const held = <T,>() => {
  let release!: (reply: Reply<T>) => void
  const reply = new Promise<Reply<T>>(done => {
    release = done
  })

  return { reply, release }
}

const open = async (over: Partial<EngineApi> = {}, view: ProjectView = projectView(KEY)) => {
  const { engine } = fakeEngine({ readProject: async () => ({ ok: true, data: view }), ...over })
  const workspace = createWorkspace(engine)
  await workspace.start()

  return { engine, workspace, flows: questFlows(engine, workspace), flow: () => workspace.getState().flows[KEY], toasts: () => workspace.getState().toasts.map(toast => toast.text) }
}

const started = (over: Partial<Extract<StartOutcome, { kind: 'started' }>> = {}): Reply<StartOutcome> => ({
  ok: true,
  data: { kind: 'started', view: projectView(KEY, { active: ACTIVE }), branch: 'task/first', notice: null, handover: { kind: 'session' }, ...over },
})

describe('opening VS Code for the active quest', () => {
  it.each([null, '2026-11-03T16:00:00-06:00'])('only asks to paste Claude when Claude owns the quest (Codex since: %s)', async codexSince => {
    const active = { ...ACTIVE, codexSince }
    const { flows, toasts } = await open(
      { openClaude: async () => ({ ok: true, data: { kind: 'opened', terminal: 'vscode' } }) },
      projectView(KEY, { active }),
    )

    await flows.openClaude(KEY, active)

    expect(toasts()).toEqual(codexSince === null ? [t.flow.pasteVsCode] : [])
  })
})

describe('Start', () => {
  it('shows one working line for each step, then the quest in hand', async () => {
    const check = held<StartCheck>()
    const start = held<StartOutcome>()
    const { flows, flow, workspace } = await open({ checkStart: () => check.reply, startQuest: () => start.reply })

    const running = flows.start(KEY, QUEST)
    expect(flow()).toMatchObject({ kind: 'working', line: t.flow.checking })

    check.release({ ok: true, data: { kind: 'clear', step: { kind: 'make', branch: 'task/first', from: 'main' } } })
    await vi.waitFor(() => expect(flow()).toMatchObject({ kind: 'working', line: t.flow.making('task/first', 'main') }))

    start.release(started())
    await running

    expect(flow()).toBeUndefined()
    expect(workspace.getState().project).toMatchObject({ status: 'ready', data: { active: { id: 'active' } } })
  })

  it('names the branch a put-back quest returns to', async () => {
    const start = held<StartOutcome>()
    const { flows, flow } = await open({
      checkStart: async () => ({ ok: true, data: { kind: 'clear', step: { kind: 'switch', branch: 'task/mine' } } }),
      startQuest: () => start.reply,
    })

    const running = flows.start(KEY, QUEST)
    await vi.waitFor(() => expect(flow()).toMatchObject({ line: t.flow.switching('task/mine') }))
    start.release(started())
    await running
  })

  it('says it set out, with the branch', async () => {
    const { flows, toasts } = await open({ startQuest: async () => started() })

    await flows.start(KEY, QUEST)

    expect(toasts()).toEqual([t.flow.setOut('First quest', 'task/first')])
  })

  it('passes on what the engine noticed', async () => {
    const { flows, toasts } = await open({ startQuest: async () => started({ notice: 'task/old was gone.' }) })

    await flows.start(KEY, QUEST)

    expect(toasts()).toContain('task/old was gone.')
  })

  it('tells you to paste into VS Code', async () => {
    const { flows, toasts } = await open({ startQuest: async () => started({ handover: { kind: 'opened', terminal: 'vscode' } }) })

    await flows.start(KEY, QUEST)

    expect(toasts()).toContain(t.flow.pasteVsCode)
  })

  it('stays out of the way when a terminal opened', async () => {
    const { flows, flow } = await open({ startQuest: async () => started({ handover: { kind: 'opened', terminal: 'terminal' } }) })

    await flows.start(KEY, QUEST)

    expect(flow()).toBeUndefined()
  })

  it('keeps the line to copy when the terminal would not open', async () => {
    const { flows, flow } = await open({ startQuest: async () => started({ handover: { kind: 'failed', terminal: 'iterm', command: "cd '/p' && claude" } }) })

    await flows.start(KEY, QUEST)

    expect(flow()).toEqual({ kind: 'openFailed', terminal: 'iterm', command: "cd '/p' && claude" })
  })

  it('shows a hold and changes nothing', async () => {
    const { engine, flows, flow } = await open({ checkStart: async () => ({ ok: true, data: { kind: 'held', hold: HOLD } }) })

    await flows.start(KEY, QUEST)

    expect(flow()).toMatchObject({ kind: 'held', hold: HOLD, isChecking: false })
    expect(engine.startQuest).not.toHaveBeenCalled()
  })

  it('Check again keeps the hold on screen, then starts when it has cleared', async () => {
    const check = held<StartCheck>()
    const checkStart = vi.fn<EngineApi['checkStart']>(async () => ({ ok: true, data: { kind: 'held', hold: HOLD } }))
    const { engine, flows, flow } = await open({ checkStart, startQuest: async () => started() })
    await flows.start(KEY, QUEST)

    checkStart.mockImplementation(() => check.reply)
    const running = flows.checkAgain(KEY)
    expect(flow()).toMatchObject({ kind: 'held', isChecking: true })

    check.release({ ok: true, data: { kind: 'clear', step: { kind: 'noRepo' } } })
    await running

    expect(flow()).toBeUndefined()
    expect(engine.checkStart).toHaveBeenCalledTimes(2)
  })

  it('holds when git changed between the check and the start', async () => {
    const { flows, flow } = await open({ startQuest: async () => ({ ok: true, data: { kind: 'held', hold: HOLD } }) })

    await flows.start(KEY, QUEST)

    expect(flow()).toMatchObject({ kind: 'held', hold: HOLD })
  })

  it('shows the refusal where the work was, in the engine\'s words', async () => {
    const { flows, flow } = await open({ checkStart: async () => ({ ok: false, error: { message: 'The other one was started first.' } }) })

    await flows.start(KEY, QUEST)

    expect(flow()).toMatchObject({ kind: 'refused', message: 'The other one was started first.' })
  })

  it('a second press while it runs starts nothing more', async () => {
    const check = held<StartCheck>()
    const checkStart = vi.fn(() => check.reply)
    const startQuest = vi.fn(async () => started())
    const { flows } = await open({ checkStart, startQuest })

    const first = flows.start(KEY, QUEST)
    await flows.start(KEY, QUEST)
    check.release({ ok: true, data: { kind: 'clear', step: { kind: 'noRepo' } } })
    await first

    expect(checkStart).toHaveBeenCalledTimes(1)
    expect(startQuest).toHaveBeenCalledTimes(1)
  })

  it('each realm keeps its own hold', async () => {
    const { flows, flow, workspace } = await open({ checkStart: async () => ({ ok: true, data: { kind: 'held', hold: HOLD } }) })
    await flows.start(KEY, QUEST)

    await workspace.pick('b-000002')
    expect(workspace.getState().flows['b-000002']).toBeUndefined()
    await workspace.pick(KEY)

    expect(flow()).toMatchObject({ kind: 'held' })
  })

  it('Cancel clears the hold', async () => {
    const { flows, flow } = await open({ checkStart: async () => ({ ok: true, data: { kind: 'held', hold: HOLD } }) })
    await flows.start(KEY, QUEST)

    flows.cancel(KEY)

    expect(flow()).toBeUndefined()
  })

  it('Cancel leaves a step that is running alone', async () => {
    const check = held<StartCheck>()
    const { flows, flow } = await open({ checkStart: () => check.reply })

    const running = flows.start(KEY, QUEST)
    flows.cancel(KEY)

    expect(flow()).toMatchObject({ kind: 'working' })
    check.release({ ok: true, data: { kind: 'held', hold: HOLD } })
    await running
  })

  it('closes the victory still showing', async () => {
    const { flows, workspace } = await open()
    await flows.finish(KEY, ACTIVE, 'hard', null)
    expect(workspace.getState().won).not.toBeNull()

    await flows.start(KEY, QUEST)

    expect(workspace.getState().won).toBeNull()
  })
})

describe('Open in Claude Code', () => {
  it('shows its line while the terminal opens', async () => {
    const opening = held<Awaited<ReturnType<EngineApi['openClaude']>> extends Reply<infer T> ? T : never>()
    const { flows, flow } = await open({ openClaude: () => opening.reply }, projectView(KEY, { active: ACTIVE }))

    const running = flows.openClaude(KEY, ACTIVE)
    expect(flow()).toMatchObject({ kind: 'working', line: t.flow.opening })

    opening.release({ ok: true, data: { kind: 'opened', terminal: 'terminal' } })
    await running

    expect(flow()).toBeUndefined()
  })

  it('offers the line to copy when it fails', async () => {
    const { flows, flow } = await open({ openClaude: async () => ({ ok: true, data: { kind: 'failed', terminal: 'terminal', command: 'cd x && claude' } }) })

    await flows.openClaude(KEY, ACTIVE)

    expect(flow()).toMatchObject({ kind: 'openFailed', command: 'cd x && claude' })
  })
})

describe('Finish quest', () => {
  it('shows the victory and takes the board as it now is', async () => {
    const { flows, workspace } = await open({}, projectView(KEY, { active: ACTIVE }))

    await flows.finish(KEY, ACTIVE, 'hard', null)

    expect(workspace.getState().won).toEqual({ victory: VICTORY, logPath: 'docs/task_log.md' })
    expect(workspace.getState().project).toMatchObject({ data: { active: null } })
  })

  it('leaves the quest with the ★ open next', async () => {
    const { flows, workspace } = await open({}, projectView(KEY, { active: ACTIVE }))
    workspace.openQuest(KEY, 'something-else')

    await flows.finish(KEY, ACTIVE, 'hard', null)

    expect(workspace.getState().openQuests[KEY]).toBeUndefined()
  })

  it('says each badge earned, for a while longer than other toasts', async () => {
    const finishQuest = vi.fn<EngineApi['finishQuest']>(async key => ({ ok: true, data: { view: projectView(key), logPath: 'log.md', logFailedAt: null, minutes: 1, victory: { ...VICTORY, newBadges: ['nightOwl'] }, isCodexTimeLost: false } }))
    const { flows, workspace } = await open({ finishQuest })

    await flows.finish(KEY, ACTIVE, 'hard', null)

    expect(workspace.getState().toasts).toMatchObject([{ text: t.win.badgeToast(t.badges.nightOwl), isLong: true }])
  })

  it('says it won with a toast when the game had no answer', async () => {
    const finishQuest = vi.fn<EngineApi['finishQuest']>(async key => ({ ok: true, data: { view: projectView(key), logPath: 'log.md', logFailedAt: null, minutes: 14, victory: null, isCodexTimeLost: false } }))
    const { flows, workspace, toasts } = await open({ finishQuest })

    await flows.finish(KEY, ACTIVE, 'hard', null)

    expect(workspace.getState().won).toBeNull()
    expect(toasts()).toEqual([t.flow.won('Active one', '14m', 'log.md')])
  })

  it('leaves the failure for the sheet to show, and the record to try again', async () => {
    const { flows, workspace } = await open({ finishQuest: async () => ({ ok: false, error: { message: 'That quest moved.' } }) })

    expect(await flows.finish(KEY, ACTIVE, 'hard', null)).toEqual({ ok: false, message: 'That quest moved.' })
    expect(workspace.getState().won).toBeNull()
    expect(workspace.getState().toasts).toEqual([])
  })

  it('offers Try again when the log could not be written, and it works', async () => {
    const finishQuest = vi.fn<EngineApi['finishQuest']>(async key => ({ ok: true, data: { view: projectView(key), logPath: 'log.md', logFailedAt: 'log.md', minutes: 1, victory: VICTORY, isCodexTimeLost: false } }))
    const { engine, flows, workspace } = await open({ finishQuest })

    await flows.finish(KEY, ACTIVE, 'hard', null)

    const toast = workspace.getState().toasts.find(item => item.tone === 'error')
    expect(toast?.text).toBe(t.flow.logFailed('log.md'))
    toast?.action?.run()
    await vi.waitFor(() => expect(workspace.getState().toasts.some(item => item.text === t.flow.logged('docs/task_log.md'))).toBe(true))
    expect(engine.retryTaskLog).toHaveBeenCalledWith(KEY, 'active', 'log.md')
  })

  it('offers Try again again when the retry fails too', async () => {
    const finishQuest = vi.fn<EngineApi['finishQuest']>(async key => ({ ok: true, data: { view: projectView(key), logPath: 'log.md', logFailedAt: 'log.md', minutes: 1, victory: VICTORY, isCodexTimeLost: false } }))
    const retryTaskLog = vi.fn<EngineApi['retryTaskLog']>(async key => ({ ok: true, data: { view: projectView(key), logPath: 'log.md', logFailedAt: 'log.md' } }))
    const { flows, workspace } = await open({ finishQuest, retryTaskLog })
    await flows.finish(KEY, ACTIVE, 'hard', null)

    workspace.getState().toasts.find(item => item.tone === 'error')?.action?.run()

    await vi.waitFor(() => expect(retryTaskLog).toHaveBeenCalledTimes(1))
    await vi.waitFor(() => expect(workspace.getState().toasts.filter(item => item.tone === 'error')).toHaveLength(2))
  })
})

describe('Judgement', () => {
  it('Not yet clears the card in the same frame', async () => {
    const answer = held<ProjectView>()
    const reviewed = activeQuest({ review: { at: 'now', checked: 'tests pass' } })
    const { flows, workspace } = await open({ notYet: () => answer.reply }, projectView(KEY, { active: reviewed }))

    const running = flows.notYet(KEY, reviewed)
    expect(workspace.getState().project).toMatchObject({ data: { active: { review: null } } })

    answer.release({ ok: true, data: projectView(KEY, { active: activeQuest() }) })
    await running
  })

  it('brings the card back when the answer could not be saved', async () => {
    const reviewed = activeQuest({ review: { at: 'now', checked: null } })
    const { flows, workspace, toasts } = await open({ notYet: async () => ({ ok: false, error: { message: "Couldn't save your answer." } }) }, projectView(KEY, { active: reviewed }))

    await flows.notYet(KEY, reviewed)

    expect(workspace.getState().project).toMatchObject({ data: { active: { review: { at: 'now' } } } })
    expect(toasts()).toEqual(["Couldn't save your answer."])
  })
})

describe('Back to the board', () => {
  it('says so when it has gone back', async () => {
    const { flows, toasts } = await open({}, projectView(KEY, { active: ACTIVE }))

    await flows.back(KEY, ACTIVE)

    expect(toasts()).toEqual([t.flow.backOnBoard('Active one')])
  })

  it('stays quiet while a session is asked, and the view shows it waiting', async () => {
    const asked = projectView(KEY, { active: activeQuest({ asking: 'putBack' }) })
    const { flows, toasts, workspace } = await open({ putBackQuest: async () => ({ ok: true, data: { view: asked, went: 'asked', missedCheckpoint: null, isCodexTimeLost: false } }) })

    await flows.back(KEY, ACTIVE)

    expect(toasts()).toEqual([])
    expect(workspace.getState().project).toMatchObject({ data: { active: { asking: 'putBack' } } })
  })

  it('tells of the checkpoint it missed, beside the quest', async () => {
    const { flows, workspace } = await open({ putBackQuest: async key => ({ ok: true, data: { view: projectView(key), went: 'back', missedCheckpoint: { lastAt: '2026-10-26T16:35:00+01:00' }, isCodexTimeLost: false } }) })

    await flows.back(KEY, ACTIVE)

    expect(workspace.getState().questNotes.active).toBe(t.flow.noCheckpoint('26 Oct 16:35'))
  })

  it('tells of it with no checkpoint to fall back on', async () => {
    const { flows, workspace } = await open({ putBackQuest: async key => ({ ok: true, data: { view: projectView(key), went: 'back', missedCheckpoint: { lastAt: null }, isCodexTimeLost: false } }) })

    await flows.back(KEY, ACTIVE)

    expect(workspace.getState().questNotes.active).toBe(t.flow.noCheckpointYet)
  })

  it('a quest started again forgets the note', async () => {
    const { flows, workspace } = await open({ putBackQuest: async key => ({ ok: true, data: { view: projectView(key), went: 'back', missedCheckpoint: { lastAt: null }, isCodexTimeLost: false } }) })
    await flows.back(KEY, ACTIVE)

    await flows.start(KEY, { id: 'active', title: 'Active one' })

    expect(workspace.getState().questNotes.active).toBeUndefined()
  })

  it('offers Try again when it fails, and the card comes back', async () => {
    const { flows, flow, workspace } = await open({ putBackQuest: async () => ({ ok: false, error: { message: "Couldn't put the quest back." } }) })

    await flows.back(KEY, ACTIVE)

    expect(flow()).toBeUndefined()
    expect(workspace.getState().toasts).toMatchObject([{ tone: 'error', text: "Couldn't put the quest back.", action: { label: t.failed.tryAgain } }])
  })

  it('sealing the active quest says Sealed, and keeps a failure for its form', async () => {
    const putBackQuest = vi.fn<EngineApi['putBackQuest']>(async key => ({ ok: true, data: { view: projectView(key), went: 'back', missedCheckpoint: null, isCodexTimeLost: false } }))
    const { flows, toasts } = await open({ putBackQuest })

    await flows.sealActive(KEY, ACTIVE, { reason: 'waiting' })
    expect(toasts()).toEqual([t.edit.sealed('Active one')])
    expect(putBackQuest).toHaveBeenCalledWith(KEY, 'active', { reason: 'waiting' })

    putBackQuest.mockResolvedValueOnce({ ok: false, error: { message: 'Those two wait for each other.' } })
    expect(await flows.sealActive(KEY, ACTIVE, { reason: 'waiting' })).toEqual({ ok: false, message: 'Those two wait for each other.' })
    expect(toasts()).toHaveLength(1)
  })

  it('Put it back now goes without the session, and says no checkpoint was written', async () => {
    const { engine, flows, workspace } = await open()

    await flows.backNow(KEY, ACTIVE)

    expect(engine.putBackNow).toHaveBeenCalledWith(KEY, 'active')
    expect(workspace.getState().questNotes.active).toBe(t.flow.noCheckpointYet)
  })
})

describe('a session putting the quest back itself', () => {
  it('says it has gone back when the session has acted', async () => {
    const asked = projectView(KEY, { active: activeQuest({ asking: 'putBack' }) })
    let view = asked
    const { engine } = fakeEngine({ readProject: async () => ({ ok: true, data: view }) })
    const workspace = createWorkspace(engine)
    await workspace.start()

    view = projectView(KEY)
    await workspace.refresh()

    expect(workspace.getState().toasts.map(toast => toast.text)).toEqual([t.flow.backOnBoard('Active one')])
  })
})

describe('Time I have', () => {
  const answers = () => {
    const replies: ((reply: Reply<ProjectView>) => void)[] = []
    const setTimeBudget = vi.fn<EngineApi['setTimeBudget']>(() => new Promise(done => void replies.push(done)))

    return { replies, setTimeBudget }
  }

  it('steps on from the last step, not the board on screen, when pressed fast', async () => {
    const { replies, setTimeBudget } = answers()
    const { flows } = await open({ setTimeBudget })

    const steps = [flows.stepBudget(KEY, null), flows.stepBudget(KEY, null), flows.stepBudget(KEY, null)]

    expect(setTimeBudget.mock.calls.map(call => call[1])).toEqual([30, 60, 120])
    replies.forEach(release => release({ ok: true, data: projectView(KEY) }))
    await Promise.all(steps)
  })

  it('goes round to any', async () => {
    const setTimeBudget = vi.fn<EngineApi['setTimeBudget']>(async key => ({ ok: true, data: projectView(key) }))
    const { flows } = await open({ setTimeBudget })

    await flows.stepBudget(KEY, 120)

    expect(setTimeBudget).toHaveBeenCalledWith(KEY, null)
  })

  it('starts from the board again once the steps have landed', async () => {
    const setTimeBudget = vi.fn<EngineApi['setTimeBudget']>(async key => ({ ok: true, data: projectView(key) }))
    const { flows } = await open({ setTimeBudget })

    await flows.stepBudget(KEY, null)
    await flows.stepBudget(KEY, 60)

    expect(setTimeBudget).toHaveBeenLastCalledWith(KEY, 120)
  })

  it('forgets a step that failed', async () => {
    const setTimeBudget = vi.fn<EngineApi['setTimeBudget']>(async () => ({ ok: false, error: { message: 'No.' } }))
    const { flows } = await open({ setTimeBudget })

    await flows.stepBudget(KEY, null)
    await flows.stepBudget(KEY, null)

    expect(setTimeBudget.mock.calls.map(call => call[1])).toEqual([30, 30])
  })

  it('keeps each realm\'s steps apart', async () => {
    const { replies, setTimeBudget } = answers()
    const { flows } = await open({ setTimeBudget })

    const steps = [flows.stepBudget(KEY, null), flows.stepBudget('b-000002', null)]

    expect(setTimeBudget.mock.calls.map(call => call[1])).toEqual([30, 30])
    replies.forEach(release => release({ ok: true, data: projectView(KEY) }))
    await Promise.all(steps)
  })
})

describe('copying', () => {
  it('says it copied', async () => {
    const { engine, flows, toasts } = await open()

    await flows.copy('git status')

    expect(engine.copyText).toHaveBeenCalledWith('git status')
    expect(toasts()).toEqual([t.flow.copied])
  })

  it('says when it could not', async () => {
    const { flows, workspace } = await open({ copyText: async () => ({ ok: false, error: { message: "Couldn't copy that." } }) })

    await flows.copy('git status')

    expect(workspace.getState().toasts).toMatchObject([{ tone: 'error', text: "Couldn't copy that." }])
  })
})

describe('Start in Codex', () => {
  it('asks the engine for Claude Code when no platform is given', async () => {
    const { engine, flows } = await open({ startQuest: vi.fn<EngineApi['startQuest']>(async () => started()) })

    await flows.start(KEY, QUEST)

    expect(engine.startQuest).toHaveBeenCalledWith(KEY, 'first', 'claude')
  })

  it('asks the engine to start it in Codex, and says it set out with Codex', async () => {
    const { engine, flows, toasts } = await open({ startQuest: vi.fn<EngineApi['startQuest']>(async () => started()) })

    await flows.start(KEY, QUEST, 'codex')

    expect(engine.startQuest).toHaveBeenCalledWith(KEY, 'first', 'codex')
    expect(toasts()).toEqual([t.flow.setOutCodex('First quest', 'task/first')])
  })

  it('keeps Codex through a hold, so Check again starts it in Codex', async () => {
    const checkStart = vi.fn<EngineApi['checkStart']>(async () => ({ ok: true, data: { kind: 'held', hold: HOLD } }))
    const startQuest = vi.fn<EngineApi['startQuest']>(async () => started())
    const { flows, flow } = await open({ checkStart, startQuest })

    await flows.start(KEY, QUEST, 'codex')
    expect(flow()).toMatchObject({ kind: 'held', platform: 'codex' })

    checkStart.mockResolvedValue({ ok: true, data: { kind: 'clear', step: { kind: 'noRepo' } } })
    await flows.checkAgain(KEY)

    expect(startQuest).toHaveBeenCalledTimes(1)
    expect(startQuest).toHaveBeenCalledWith(KEY, 'first', 'codex')
  })

  it('keeps Codex through a hold at the start itself, and through a refusal', async () => {
    const startQuest = vi.fn<EngineApi['startQuest']>(async () => ({ ok: true, data: { kind: 'held', hold: HOLD } }))
    const { flows, flow } = await open({ startQuest })

    await flows.start(KEY, QUEST, 'codex')
    expect(flow()).toMatchObject({ kind: 'held', platform: 'codex' })

    startQuest.mockResolvedValueOnce({ ok: false, error: { message: 'The other one was started first.' } })
    await flows.checkAgain(KEY)
    expect(flow()).toMatchObject({ kind: 'refused', platform: 'codex' })

    startQuest.mockResolvedValueOnce(started())
    await flows.checkAgain(KEY)
    expect(startQuest.mock.calls.map(call => call[2])).toEqual(['codex', 'codex', 'codex'])
  })

  it('says the Codex line is copied when VS Code has to have it pasted', async () => {
    const { flows, toasts } = await open({ startQuest: async () => started({ handover: { kind: 'opened', terminal: 'vscode' } }) })

    await flows.start(KEY, QUEST, 'codex')

    expect(toasts()).toContain(t.flow.pasteCodex)
    expect(toasts()).not.toContain(t.flow.pasteVsCode)
  })
})

const moved = (over: Partial<ContinueOutcome> = {}): Reply<ContinueOutcome> => ({
  ok: true,
  data: { view: projectView(KEY, { active: { ...ACTIVE, codexSince: '2026-10-27T18:50:00+01:00' } }), handover: { kind: 'opened', terminal: 'terminal' }, isCodexTimeLost: false, ...over },
})

describe('Continue in', () => {
  it('shows its line while the quest moves to Codex, then says Codex has it', async () => {
    const move = held<ContinueOutcome>()
    const continueIn = vi.fn<EngineApi['continueIn']>(() => move.reply)
    const { flows, flow, toasts, workspace } = await open({ continueIn })

    const running = flows.continueIn(KEY, ACTIVE, 'codex')
    expect(flow()).toMatchObject({ kind: 'working', line: t.flow.toCodex })

    move.release(moved())
    await running

    expect(continueIn).toHaveBeenCalledWith(KEY, 'active', 'codex')
    expect(flow()).toBeUndefined()
    expect(toasts()).toEqual([t.flow.nowCodex('Active one')])
    expect(workspace.getState().project).toMatchObject({ data: { active: { codexSince: '2026-10-27T18:50:00+01:00' } } })
  })

  it('bringing it back says Claude Code has it again', async () => {
    const { flows, flow, toasts } = await open({ continueIn: async () => moved() })

    const running = flows.continueIn(KEY, ACTIVE, 'claude')
    expect(flow()).toMatchObject({ kind: 'working', line: t.flow.toClaude })
    await running

    expect(toasts()).toEqual([t.flow.nowClaude('Active one')])
  })

  it('a refusal leaves the quest where it was, says why, and Try again asks again', async () => {
    const refusal = 'Claude Code is still working on Active one. Nothing has changed.'
    const continueIn = vi.fn<EngineApi['continueIn']>(async () => ({ ok: false, error: { message: refusal } }))
    const { flows, flow, workspace } = await open({ continueIn })

    await flows.continueIn(KEY, ACTIVE, 'codex')

    expect(flow()).toBeUndefined()
    const toast = workspace.getState().toasts[0]
    expect(toast).toMatchObject({ tone: 'error', text: refusal, action: { label: t.failed.tryAgain } })
    toast?.action?.run()
    await vi.waitFor(() => expect(continueIn).toHaveBeenCalledTimes(2))
    expect(continueIn).toHaveBeenLastCalledWith(KEY, 'active', 'codex')
  })

  it('keeps the line to copy when Codex would not open', async () => {
    const { flows, flow } = await open({ continueIn: async () => moved({ handover: { kind: 'failed', terminal: 'iterm', command: "cd '/p' && codex 'brief'" } }) })

    await flows.continueIn(KEY, ACTIVE, 'codex')

    expect(flow()).toEqual({ kind: 'openFailed', terminal: 'iterm', command: "cd '/p' && codex 'brief'" })
  })

  it('a second press while it moves asks nothing more', async () => {
    const move = held<ContinueOutcome>()
    const continueIn = vi.fn<EngineApi['continueIn']>(() => move.reply)
    const { flows } = await open({ continueIn })

    const running = flows.continueIn(KEY, ACTIVE, 'codex')
    await flows.continueIn(KEY, ACTIVE, 'codex')
    move.release(moved())
    await running

    expect(continueIn).toHaveBeenCalledTimes(1)
  })
})

describe("Codex's time not added", () => {
  it('says so, for a while, when a quest comes back to Claude Code', async () => {
    const { flows, workspace } = await open({ continueIn: async () => moved({ isCodexTimeLost: true }) })

    await flows.continueIn(KEY, ACTIVE, 'claude')

    expect(workspace.getState().toasts).toContainEqual(expect.objectContaining({ tone: 'error', text: t.flow.codexTimeLost, isLong: true }))
  })

  it('says so when a quest is finished', async () => {
    const { flows, toasts } = await open({
      finishQuest: async key => ({ ok: true, data: { view: projectView(key), logPath: 'log.md', logFailedAt: null, minutes: 14, victory: VICTORY, isCodexTimeLost: true } }),
    })

    await flows.finish(KEY, ACTIVE, 'hard', null)

    expect(toasts()).toContain(t.flow.codexTimeLost)
  })

  it('says so when a quest goes back', async () => {
    const { flows, toasts } = await open({ putBackQuest: async key => ({ ok: true, data: { view: projectView(key), went: 'back', missedCheckpoint: null, isCodexTimeLost: true } }) })

    await flows.back(KEY, ACTIVE)

    expect(toasts()).toContain(t.flow.codexTimeLost)
  })

  it('says nothing of it when the time was added', async () => {
    const { flows, toasts } = await open({ putBackQuest: async key => ({ ok: true, data: { view: projectView(key), went: 'back', missedCheckpoint: null, isCodexTimeLost: false } }) })

    await flows.back(KEY, ACTIVE)

    expect(toasts()).not.toContain(t.flow.codexTimeLost)
  })
})
