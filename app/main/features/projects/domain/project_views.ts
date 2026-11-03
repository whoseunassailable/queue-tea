import type { AppRequest, ProjectRecord, Task } from '../../../../../types'
import { activeFeature, groupBacklog, progressOf } from '../../../../../hooks/shared/backlog/domain/services/families'
import type { Entry } from '../../../../../hooks/shared/backlog/domain/services/families'
import { blockedTasks, blockedText, estimateMinutes, isBlocked, rankBacklog, suggest } from '../../../../../hooks/shared/backlog/domain/services/ranking'
import type { Ranked } from '../../../../../hooks/shared/backlog/domain/services/ranking'
import { currentTask } from '../../../../../hooks/shared/records/domain/services/queue_rules'
import type { SessionFile } from '../../../../../hooks/shared/sessions/domain/entities/session_file'
import { isFresh } from '../../../../../hooks/shared/sessions/domain/services/session_rules'
import { finishedTasks } from '../../../../../hooks/shared/time/domain/services/week_stats'
import type { ActiveQuest, BoardEntry, ProjectRow, ProjectStatus, ProjectView, QuestRow, SessionInfo, SessionState, VictoryRow } from '../../../../shared/engine_api'
import { xpOf } from '../../game/domain/services/game'

const RECENT_VICTORIES = 3

const minutesOf = (task: Task): number => Object.values(task.minutesByDay).reduce((sum, m) => sum + m, 0)
const difficultyOf = (task: Task) => task.difficulty.actual ?? task.difficulty.expected

// The sessions in this project that are still alive, newest first.
export const sessionsIn = (sessions: SessionFile[], projectPath: string, nowMs: number): SessionFile[] =>
  sessions.filter(s => s.projectPath === projectPath && isFresh(s, nowMs)).sort((a, b) => b.heartbeat - a.heartbeat)

export const sessionInfoOf = (sessions: SessionFile[], projectPath: string, nowMs: number): SessionInfo => {
  const alive = sessionsIn(sessions, projectPath, nowMs)
  const newest = alive[0]
  if (newest === undefined) return { state: 'none', allowance: null }
  const state: SessionState = alive.length > 1 ? 'several' : newest.cup.mood === 'attention' ? 'needsYou' : newest.isTurnRunning ? 'working' : 'open'

  return { state, allowance: newest.allowance }
}

// First match wins: needs you, working, the current task, what waits, nothing.
export const statusOf = (record: ProjectRecord, session: SessionState): ProjectStatus => {
  const current = currentTask(record.tasks)
  if (current?.review != null) return { kind: 'judgement' }
  if (session === 'needsYou') return { kind: 'needsYou' }
  if (session === 'working') return { kind: 'working' }
  if (current !== null) return { kind: 'current', title: current.title }
  const waiting = record.tasks.filter(t => t.state === 'queued').length

  return waiting === 0 ? { kind: 'nothing' } : { kind: 'waiting', count: waiting, title: suggest(record, null)?.title ?? null }
}

export const rowOf = (key: string, record: ProjectRecord, sessions: SessionFile[], nowMs: number): ProjectRow => {
  const { state } = sessionInfoOf(sessions, record.project.path, nowMs)

  return {
    kind: 'readable',
    key,
    name: record.project.name,
    path: record.project.path,
    waiting: record.tasks.filter(t => t.state === 'queued').length,
    status: statusOf(record, state),
    session: state,
  }
}

const questOf = (task: Task, tasks: Task[], nowMs: number, row: Ranked | null, starId: string | null, playNext: string | null): QuestRow => ({
  id: task.id,
  title: task.title,
  priority: task.priority,
  difficulty: task.difficulty.expected,
  xp: xpOf(task.difficulty.expected),
  estimateMinutes: row?.estimate ?? estimateMinutes(task, tasks),
  waitedMs: Math.max(0, nowMs - Date.parse(task.created)),
  why: task.id === starId ? (row?.why ?? null) : null,
  isStar: task.id === starId,
  isPlayNext: task.id === playNext,
  parentId: task.parentId,
  sealedBecause: isBlocked(task, tasks) ? blockedText(task, tasks) : null,
  branch: task.branch,
  created: task.created,
  description: task.description,
  criteria: task.criteria,
  fits: row?.fits ?? null,
  goal: task.checkpoint?.goal || null,
  acceptance: task.checkpoint?.acceptance ?? [],
  helpers: task.helpers.on,
})

const entryOf = (entry: Entry, tasks: Task[], nowMs: number, ranked: Ranked[], playNext: string | null): BoardEntry => {
  const starId = ranked[0]?.task.id ?? null
  const quest = (task: Task, row: Ranked | null) => questOf(task, tasks, nowMs, row, starId, playNext)
  if (entry.kind === 'task') return { kind: 'quest', quest: quest(entry.row.task, entry.row) }
  if (entry.kind === 'blocked') return { kind: 'quest', quest: quest(entry.task, null) }

  const { group } = entry
  const own = group.rows.find(r => r.task.id === group.parent.id) ?? null
  const chapters = group.rows.filter(r => r.task.id !== group.parent.id).map(r => quest(r.task, r))
  const sealedChapters = group.blocked.filter(t => t.id !== group.parent.id).map(t => quest(t, null))

  return {
    kind: 'saga',
    quest: quest(group.parent, own),
    chapters: [...chapters, ...sealedChapters],
    progress: progressOf(group.parent, tasks),
    hasStar: group.hasStar,
  }
}

const activeOf = (task: Task, requests: AppRequest[]): ActiveQuest => ({
  id: task.id,
  title: task.title,
  priority: task.priority,
  difficulty: task.difficulty.expected,
  xp: xpOf(task.difficulty.expected),
  branch: task.branch,
  minutes: minutesOf(task),
  started: task.started,
  isBoss: task.priority === 'urgent',
  improvingMessages: task.effort.improvingMessages,
  filesChanged: task.effort.filesChanged,
  review: task.review,
  criteria: task.criteria,
  helpers: task.helpers.on,
  asking: requests.find(q => q.taskId === task.id)?.kind ?? null,
  codexSince: task.codexSince,
})

const victoryOf = (task: Task): VictoryRow => ({
  id: task.id,
  title: task.title,
  finished: task.finished!,
  minutes: minutesOf(task),
  xp: xpOf(difficultyOf(task)),
})

export const viewOf = (key: string, record: ProjectRecord, sessions: SessionFile[], nowMs: number, budget: number | null = null): ProjectView => {
  const { tasks, playNext } = record
  const ranked = rankBacklog(record, budget)
  const blocked = blockedTasks(tasks)
  const { ready, blocked: stuck } = groupBacklog(ranked, blocked, tasks)
  const current = currentTask(tasks)
  const wins = finishedTasks(tasks)
  const entry = (e: Entry) => entryOf(e, tasks, nowMs, ranked, playNext)

  return {
    kind: 'readable',
    key,
    name: record.project.name,
    path: record.project.path,
    session: sessionInfoOf(sessions, record.project.path, nowMs),
    active: current === null ? null : activeOf(current, record.requests),
    ready: ready.map(entry),
    sealed: stuck.map(entry),
    canStart: ranked.length,
    sealedCount: blocked.length,
    activeSaga: activeFeature(record)?.title ?? null,
    activeSagaId: activeFeature(record)?.id ?? null,
    victories: wins.slice(0, RECENT_VICTORIES).map(victoryOf),
    victoryCount: wins.length,
    docsLogPath: record.docsLogPath,
    budget,
  }
}
