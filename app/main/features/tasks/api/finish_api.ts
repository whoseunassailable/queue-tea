import type { ProjectRecord } from '../../../../../types'
import { finishTaskUseCase } from '../../../../../hooks/features/tasks/domain/usecases/finish_task'
import { saveDocsPathUseCase } from '../../../../../hooks/features/tasks/domain/usecases/save_docs_path'
import { setReviewUseCase } from '../../../../../hooks/features/tasks/domain/usecases/set_review'
import type { FinishOutcome, LogOutcome, Reply, Victory } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { victoryOf } from '../../game/domain/services/victory'
import { scanRecords } from '../../projects/data/projects_source'
import { difficultyOf, logPathIn, questIdOf } from '../domain/task_input'
import { edit, realmView, scopeOf } from './scope'
import type { Scope, TasksDeps } from './scope'

const minutesOf = (record: ProjectRecord, id: string): number => Object.values(record.tasks.find(t => t.id === id)?.minutesByDay ?? {}).reduce((sum, m) => sum + m, 0)

export const notYet = (d: TasksDeps, key: unknown, taskId: unknown) => edit(d, key, MESSAGES.notYet, ({ deps }) => setReviewUseCase(deps, questIdOf(taskId), null))

type Logged = { record: ProjectRecord; logPath: string; logFailedAt: string | null }

// The win is saved by now, so a log that can't be kept is said beside it and
// never takes the win away.
const keepLog = async (d: TasksDeps, scope: Scope, id: string, path: string, record: ProjectRecord): Promise<Logged> => {
  try {
    const saved = await saveDocsPathUseCase(scope.deps, scope.ctx, id, path)
    if (saved.kind === 'saved') return { record: saved.record, logPath: path, logFailedAt: saved.logFailedAt }
  } catch (err) {
    d.log.error('keeping the task log failed', err)
  }

  return { record, logPath: path, logFailedAt: path }
}

// Worked out after the win is saved, and only ever read. The game can fail and
// the quest is still won: the window says so with a toast in place of the panel.
const victoryFor = async (d: TasksDeps, scope: Scope, id: string): Promise<Victory | null> => {
  try {
    const records = (await scanRecords(d.host, d.home, d.log)).flatMap(s => (s.kind === 'readable' ? [s.record] : []))

    return victoryOf(records, scope.ctx.projectPath, id, scope.ctx.offsetMinutes, d.now())
  } catch (err) {
    d.log.error('working out the victory failed', err)

    return null
  }
}

export const finishQuest = (d: TasksDeps, key: unknown, taskId: unknown, actual: unknown, logPath: unknown): Promise<Reply<FinishOutcome>> =>
  reply(d.log, MESSAGES.finishQuest, async () => {
    const scope = await scopeOf(d, key)
    const id = questIdOf(taskId)
    const chosen = difficultyOf(actual)
    const path = logPathIn(logPath, scope.ctx.projectPath)
    // The use case would finish a quest in any state, and this one may have
    // gone back to the board while the sheet was open.
    if (scope.record.tasks.find(t => t.id === id)?.state !== 'current') throw new Refusal(MESSAGES.notActiveFinish)
    if (scope.record.docsLogPath === null && path === null) throw new Refusal(MESSAGES.logPathRequired)

    const finished = await finishTaskUseCase(scope.deps, scope.ctx, id, chosen)
    if (finished.kind === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)
    if (finished.kind === 'skipped') throw new Refusal(MESSAGES.notActiveFinish)

    const logged = finished.askPath
      ? await keepLog(d, scope, id, path!, finished.record)
      : { record: finished.record, logPath: finished.record.docsLogPath!, logFailedAt: finished.logFailedAt }

    return {
      view: await realmView(d, scope.key, logged.record),
      logPath: logged.logPath,
      logFailedAt: logged.logFailedAt,
      minutes: minutesOf(logged.record, id),
      victory: await victoryFor(d, scope, id),
    }
  })

export const retryTaskLog = (d: TasksDeps, key: unknown, taskId: unknown, path: unknown): Promise<Reply<LogOutcome>> =>
  reply(d.log, MESSAGES.retryTaskLog, async () => {
    const scope = await scopeOf(d, key)
    const id = questIdOf(taskId)
    const checked = logPathIn(path, scope.ctx.projectPath)
    if (checked === null) throw new Refusal(MESSAGES.logPathRequired)
    if (scope.record.tasks.find(t => t.id === id)?.state !== 'done') throw new Refusal(MESSAGES.badQuest)

    const logged = await keepLog(d, scope, id, checked, scope.record)

    return { view: await realmView(d, scope.key, logged.record), logPath: logged.logPath, logFailedAt: logged.logFailedAt }
  })
