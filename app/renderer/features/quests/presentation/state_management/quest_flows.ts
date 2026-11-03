import type { Difficulty, Platform } from '../../../../../../types'
import { nextBudget } from '../../../../../../hooks/shared/backlog/domain/services/ranking'
import type { ActiveQuest, BackOutcome, EngineApi, FinishOutcome, GitHold, Handover, Reply, Seal, StartOutcome } from '../../../../../shared/engine_api'
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
  const hold = (key: string, quest: Named, gitHold: GitHold, platform: Platform) =>
    workspace.setFlow(key, { kind: 'held', questId: quest.id, title: quest.title, hold: gitHold, isChecking: false, platform })
  const refuse = (key: string, quest: Named, message: string, platform: Platform) => workspace.setFlow(key, { kind: 'refused', questId: quest.id, title: quest.title, message, platform })

  const sayHandover = (handover: Handover, platform: Platform) => {
    if (handover.kind === 'opened' && handover.terminal === 'vscode') workspace.say({ tone: 'info', text: platform === 'codex' ? t.flow.pasteCodex : t.flow.pasteVsCode })
  }

  const sayStarted = (quest: Named, outcome: Extract<StartOutcome, { kind: 'started' }>, platform: Platform) => {
    workspace.say({ tone: 'success', text: platform === 'codex' ? t.flow.setOutCodex(quest.title, outcome.branch) : t.flow.setOut(quest.title, outcome.branch) })
    if (outcome.notice !== null) workspace.say({ tone: 'info', text: outcome.notice })
    sayHandover(outcome.handover, platform)
  }

  const sayTimeLost = (isLost: boolean) => {
    if (isLost) workspace.say({ tone: 'error', text: t.flow.codexTimeLost, isLong: true })
  }

  const start = async (key: string, quest: Named, platform: Platform = 'claude'): Promise<void> => {
    if (isBusy(key)) return
    workspace.showWon(null)
    const was = flowOf(key)
    if (was?.kind === 'held' && was.questId === quest.id) workspace.setFlow(key, { ...was, isChecking: true })
    else work(key, quest, t.flow.checking)

    const check = await ask(engine, () => engine.checkStart(key, quest.id))
    if (!check.ok) return refuse(key, quest, check.message, platform)
    if (check.data.kind === 'held') return hold(key, quest, check.data.hold, platform)

    work(key, quest, stepLine(check.data.step))
    const started = await ask(engine, () => engine.startQuest(key, quest.id, platform))
    if (!started.ok) return refuse(key, quest, started.message, platform)
    if (started.data.kind === 'held') return hold(key, quest, started.data.hold, platform)

    const { view, handover } = started.data
    workspace.adopt(key, view)
    workspace.noteFor(quest.id, null)
    workspace.setFlow(key, handover.kind === 'failed' ? { kind: 'openFailed', terminal: handover.terminal, command: handover.command } : null)
    sayStarted(quest, started.data, platform)
  }

  const checkAgain = async (key: string): Promise<void> => {
    const flow = flowOf(key)
    if (flow?.kind === 'held' || flow?.kind === 'refused') await start(key, { id: flow.questId, title: flow.title }, flow.platform)
  }

  const cancel = (key: string) => {
    if (!isBusy(key)) workspace.setFlow(key, null)
  }

  const needsClaudeCommand = () => {
    const { project } = workspace.getState()

    return project.status === 'ready' && project.data.kind === 'readable' && project.data.session.state === 'none' && (project.data.active?.codexSince ?? null) === null
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
    else if (data.kind === 'opened' && data.terminal === 'vscode' && needsClaudeCommand()) workspace.say({ tone: 'info', text: t.flow.pasteVsCode })
  }

  // Claude Code and Codex never work on the quest at once: a refusal changes
  // nothing and says why.
  const continueIn = async (key: string, quest: Named, platform: Platform): Promise<void> => {
    if (isBusy(key)) return
    work(key, quest, platform === 'codex' ? t.flow.toCodex : t.flow.toClaude)
    const answer = await ask(engine, () => engine.continueIn(key, quest.id, platform))
    workspace.setFlow(key, null)
    if (!answer.ok) {
      workspace.say({ tone: 'error', text: answer.message, isLong: true, action: { label: t.failed.tryAgain, run: () => void continueIn(key, quest, platform) } })

      return
    }
    const { view, handover, isCodexTimeLost } = answer.data
    workspace.adopt(key, view)
    if (handover.kind === 'failed') workspace.setFlow(key, { kind: 'openFailed', terminal: handover.terminal, command: handover.command })
    workspace.say({ tone: 'success', text: platform === 'codex' ? t.flow.nowCodex(quest.title) : t.flow.nowClaude(quest.title) })
    sayHandover(handover, platform)
    sayTimeLost(isCodexTimeLost)
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
    sayTimeLost(answer.data.isCodexTimeLost)
    // The HUD fills up now rather than when the watcher hears of it.
    void workspace.refresh()

    return answer
  }

  const notYet = (key: string, quest: Named) => workspace.run({ key, preview: withoutReview, call: () => engine.notYet(key, quest.id) })

  const settled = (key: string, quest: Named, outcome: BackOutcome, said: string) => {
    workspace.adopt(key, outcome.view)
    if (outcome.went === 'back') workspace.say({ tone: 'success', text: said })
    sayTimeLost(outcome.isCodexTimeLost)
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

  // Where Time I have is heading, by realm. The board only changes when main
  // answers, so steps pressed faster than that have to build on each other.
  const heading = new Map<string, number | null>()

  const stepBudget = async (key: string, shown: number | null): Promise<void> => {
    const budget = nextBudget(heading.has(key) ? heading.get(key)! : shown)
    heading.set(key, budget)
    const answer = await ask(engine, () => engine.setTimeBudget(key, budget))
    const isLatest = heading.get(key) === budget
    if (isLatest || !answer.ok) heading.delete(key)
    if (answer.ok) workspace.adopt(key, answer.data)
    else workspace.say({ tone: 'error', text: answer.message })
  }

  const switchBranch = async (key: string, branch: string): Promise<boolean> => {
    const answer = await ask(engine, () => engine.switchBranch(key))
    workspace.say(answer.ok ? { tone: 'success', text: t.live.switched(branch) } : { tone: 'error', text: answer.message })

    return answer.ok
  }

  const copy = async (text: string): Promise<void> => {
    const answer = await ask(engine, () => engine.copyText(text))
    workspace.say(answer.ok ? { tone: 'info', text: t.flow.copied } : { tone: 'error', text: answer.message })
  }

  return { start, checkAgain, cancel, openClaude, continueIn, finish, notYet, back, backNow, sealActive, copy, stepBudget, switchBranch }
}

export type QuestFlows = ReturnType<typeof questFlows>
