import type { Difficulty } from '../../../../../../types'
import type { ActiveQuest, BackOutcome, EngineApi, FinishOutcome, GitHold, Reply, Seal, StartOutcome } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import type { Answer } from '../../../../core/api/engine_client'
import { dayAndTime, formatMinutes } from '../../../../core/domain/format'
import { t } from '../../../../l10n/en'
import type { Workspace } from '../../../workspace/state_management/workspace_store'
import { withoutReview } from '../../domain/edits'
import { stepLine } from '../../domain/flow_lines'

type Named = { id: string; title: string }

// What takes a quest out and brings it back. Each step shows its own working
// line, and that realm's quest is locked while one runs.
export const questFlows = (engine: EngineApi, workspace: Workspace) => {
  const flowOf = (key: string) => workspace.getState().flows[key]
  const isBusy = (key: string) => {
    const flow = flowOf(key)

    return flow?.kind === 'working' || (flow?.kind === 'held' && flow.isChecking)
  }
  const work = (key: string, quest: Named, line: string) => workspace.setFlow(key, { kind: 'working', questId: quest.id, title: quest.title, line })
  const hold = (key: string, quest: Named, gitHold: GitHold) => workspace.setFlow(key, { kind: 'held', questId: quest.id, title: quest.title, hold: gitHold, isChecking: false })
  const refuse = (key: string, quest: Named, message: string) => workspace.setFlow(key, { kind: 'refused', questId: quest.id, title: quest.title, message })

  const sayStarted = (quest: Named, outcome: Extract<StartOutcome, { kind: 'started' }>) => {
    workspace.say({ tone: 'success', text: t.flow.setOut(quest.title, outcome.branch) })
    if (outcome.notice !== null) workspace.say({ tone: 'info', text: outcome.notice })
    if (outcome.handover.kind === 'opened' && outcome.handover.terminal === 'vscode') workspace.say({ tone: 'info', text: t.flow.pasteVsCode })
  }

  const start = async (key: string, quest: Named): Promise<void> => {
    if (isBusy(key)) return
    workspace.showWon(null)
    const was = flowOf(key)
    if (was?.kind === 'held' && was.questId === quest.id) workspace.setFlow(key, { ...was, isChecking: true })
    else work(key, quest, t.flow.checking)

    const check = await ask(engine, () => engine.checkStart(key, quest.id))
    if (!check.ok) return refuse(key, quest, check.message)
    if (check.data.kind === 'held') return hold(key, quest, check.data.hold)

    work(key, quest, stepLine(check.data.step))
    const started = await ask(engine, () => engine.startQuest(key, quest.id))
    if (!started.ok) return refuse(key, quest, started.message)
    if (started.data.kind === 'held') return hold(key, quest, started.data.hold)

    const { view, handover } = started.data
    workspace.adopt(key, view)
    workspace.noteFor(quest.id, null)
    workspace.setFlow(key, handover.kind === 'failed' ? { kind: 'openFailed', terminal: handover.terminal, command: handover.command } : null)
    sayStarted(quest, started.data)
  }

  const checkAgain = async (key: string): Promise<void> => {
    const flow = flowOf(key)
    if (flow?.kind === 'held' || flow?.kind === 'refused') await start(key, { id: flow.questId, title: flow.title })
  }

  const cancel = (key: string) => {
    if (!isBusy(key)) workspace.setFlow(key, null)
  }

  const noSession = () => {
    const { project } = workspace.getState()

    return project.status === 'ready' && project.data.kind === 'readable' && project.data.session.state === 'none'
  }

  const openClaude = async (key: string, quest: Named): Promise<void> => {
    if (isBusy(key)) return
    work(key, quest, t.flow.opening)
    const answer = await ask(engine, () => engine.openClaude(key))
    workspace.setFlow(key, null)
    if (!answer.ok) {
      workspace.say({ tone: 'error', text: answer.message, action: { label: t.failed.tryAgain, run: () => void openClaude(key, quest) } })

      return
    }
    const { data } = answer
    if (data.kind === 'failed') workspace.setFlow(key, { kind: 'openFailed', terminal: data.terminal, command: data.command })
    else if (data.kind === 'opened' && data.terminal === 'vscode' && noSession()) workspace.say({ tone: 'info', text: t.flow.pasteVsCode })
  }

  const sayLogFailed = (key: string, questId: string, path: string) =>
    workspace.say({ tone: 'error', text: t.flow.logFailed(path), action: { label: t.failed.tryAgain, run: () => void retryLog(key, questId, path) } })

  const retryLog = async (key: string, questId: string, path: string): Promise<void> => {
    const answer = await ask(engine, () => engine.retryTaskLog(key, questId, path))
    if (!answer.ok || answer.data.logFailedAt !== null) {
      sayLogFailed(key, questId, path)

      return
    }
    workspace.adopt(key, answer.data.view)
    workspace.say({ tone: 'success', text: t.flow.logged(answer.data.logPath) })
  }

  const finish = async (key: string, quest: ActiveQuest, actual: Difficulty, logPath: string | null): Promise<Answer<FinishOutcome>> => {
    const answer = await ask(engine, () => engine.finishQuest(key, quest.id, actual, logPath))
    if (!answer.ok) return answer

    const { view, victory, logFailedAt, minutes } = answer.data
    workspace.adopt(key, view)
    workspace.closeQuest(key)
    if (victory === null) workspace.say({ tone: 'success', text: t.flow.won(quest.title, formatMinutes(minutes), answer.data.logPath) })
    else {
      workspace.showWon({ victory, logPath: answer.data.logPath })
      for (const badge of victory.newBadges) workspace.say({ tone: 'success', text: t.win.badgeToast(t.badges[badge]), isLong: true })
    }
    if (logFailedAt !== null) sayLogFailed(key, quest.id, logFailedAt)
    // The HUD fills up now rather than when the watcher hears of it.
    void workspace.refresh()

    return answer
  }

  const notYet = (key: string, quest: Named) => workspace.run({ key, preview: withoutReview, call: () => engine.notYet(key, quest.id) })

  const settled = (key: string, quest: Named, outcome: BackOutcome, said: string) => {
    workspace.adopt(key, outcome.view)
    if (outcome.went === 'back') workspace.say({ tone: 'success', text: said })
    const missed = outcome.missedCheckpoint
    if (missed !== null) workspace.noteFor(quest.id, missed.lastAt === null ? t.flow.noCheckpointYet : t.flow.noCheckpoint(dayAndTime(missed.lastAt)))
  }

  const goBack = async (key: string, quest: Named, said: string, call: () => Promise<Reply<BackOutcome>>): Promise<Answer<BackOutcome>> => {
    work(key, quest, t.flow.putting)
    const answer = await ask(engine, call)
    workspace.setFlow(key, null)
    if (answer.ok) settled(key, quest, answer.data, said)

    return answer
  }

  const back = async (key: string, quest: Named): Promise<void> => {
    if (isBusy(key)) return
    const answer = await goBack(key, quest, t.flow.backOnBoard(quest.title), () => engine.putBackQuest(key, quest.id, null))
    if (!answer.ok) workspace.say({ tone: 'error', text: answer.message, action: { label: t.failed.tryAgain, run: () => void back(key, quest) } })
  }

  const backNow = async (key: string, quest: Named): Promise<void> => {
    if (isBusy(key)) return
    const answer = await goBack(key, quest, t.flow.backOnBoard(quest.title), () => engine.putBackNow(key, quest.id))
    if (!answer.ok) workspace.say({ tone: 'error', text: answer.message, action: { label: t.failed.tryAgain, run: () => void backNow(key, quest) } })
  }

  // Its form shows a failure beside its fields, so this stays quiet about one.
  const sealActive = (key: string, quest: Named, seal: Seal) => goBack(key, quest, t.edit.sealed(quest.title), () => engine.putBackQuest(key, quest.id, seal))

  const copy = async (text: string): Promise<void> => {
    const answer = await ask(engine, () => engine.copyText(text))
    workspace.say(answer.ok ? { tone: 'info', text: t.flow.copied } : { tone: 'error', text: answer.message })
  }

  return { start, checkAgain, cancel, openClaude, finish, notYet, back, backNow, sealActive, copy }
}

export type QuestFlows = ReturnType<typeof questFlows>
