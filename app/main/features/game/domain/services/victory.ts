import type { ProjectRecord, Task } from '../../../../../../types'
import { childrenOf } from '../../../../../../hooks/shared/backlog/domain/services/families'
import type { BadgeId, GameState, Victory, VictoryKind } from '../../../../../shared/engine_api'
import { gameOf, xpOf } from './game'

const isSagaWon = (task: Task, tasks: Task[]): boolean => {
  const saga = task.parentId === null ? task : tasks.find(t => t.id === task.parentId)
  if (saga === undefined) return false
  const chapters = childrenOf(saga, tasks)

  return chapters.length > 0 && [saga, ...chapters].every(t => t.state === 'done')
}

const kindOf = (task: Task, tasks: Task[]): VictoryKind => {
  if (isSagaWon(task, tasks)) return 'saga'

  return task.priority === 'urgent' ? 'boss' : 'quest'
}

const newBadges = (was: GameState, now: GameState): BadgeId[] =>
  now.badges.filter(badge => badge.earnedOn !== null && was.badges.find(b => b.id === badge.id)?.earnedOn === null).map(badge => badge.id)

// What one win earned: the game now, against the same records without it.
// Nothing is kept, and the records aren't touched.
export const victoryOf = (records: ProjectRecord[], path: string, taskId: string, offsetMinutes: number, nowMs: number): Victory => {
  const record = records.find(r => r.project.path === path)
  const task = record?.tasks.find(t => t.id === taskId)
  if (record === undefined || task === undefined) throw new Error(`the win ${taskId} is not in the records`)

  const without = records.map(r => (r !== record ? r : { ...r, tasks: r.tasks.map(t => (t.id === taskId ? { ...t, state: 'current' as const, finished: null } : t)) }))
  const was = gameOf(without, offsetMinutes, nowMs)
  const now = gameOf(records, offsetMinutes, nowMs)
  const actual = task.difficulty.actual ?? task.difficulty.expected
  const xp = xpOf(actual)

  return {
    kind: kindOf(task, record.tasks),
    title: task.title,
    actual,
    expected: task.difficulty.expected,
    xp,
    gold: xp,
    level: now.level,
    didLevelUp: now.level > was.level,
    xpIntoLevel: now.xpIntoLevel,
    xpToNextLevel: now.xpToNextLevel,
    nextLevelAt: now.xp - now.xpIntoLevel + now.xpToNextLevel,
    hoard: now.gold,
    stage: now.stage,
    newBadges: newBadges(was, now),
  }
}
