import type { ProjectRecord, Task } from '../../../../../types'
import { childrenOf, parentsOf } from '../../../../../hooks/shared/backlog/domain/services/families'
import { blockedTasks, isBlocked, rankBacklog } from '../../../../../hooks/shared/backlog/domain/services/ranking'
import { storedLinks, storedParentQuest, storedPoints, storedRank, storedTags } from '../../../../shared/plan'
import type { PlanQuest, PlanRealm, PlanStatus } from '../../../../shared/plan'

const minutesOf = (task: Task): number => Object.values(task.minutesByDay).reduce((sum, m) => sum + m, 0)

const statusOf = (task: Task, tasks: Task[]): PlanStatus => {
  if (task.state === 'done') return 'done'
  if (task.state === 'current') return task.review === null ? 'active' : 'review'

  return isBlocked(task, tasks) ? 'blocked' : 'ready'
}

// The parent quests that hold, by quest. A child quest stands under a quest
// that is still there, that is not itself, that has no chapters, and that is
// not a child quest too; and it has no chapters of its own. Anything else in
// the record reads as none, so the backlog is never deeper than three and a
// loop in a hand edit can't hang it.
export const parentQuestsOf = (tasks: Task[]): Map<string, string> => {
  const byId = new Map(tasks.map(t => [t.id, t]))
  const isSaga = (t: Task) => childrenOf(t, tasks).length > 0
  const first = new Map<string, string>()
  for (const task of tasks) {
    const id = storedParentQuest(task.parentQuest)
    if (task.state === 'removed' || id === null || id === task.id) continue
    const parent = byId.get(id)
    if (parent === undefined || parent.state === 'removed' || isSaga(parent) || isSaga(task)) continue
    first.set(task.id, id)
  }

  return new Map([...first].filter(([, parent]) => !first.has(parent)))
}

// The realm as the Plan tab reads it: every quest but removed ones, with its
// place in the ★ order. The order is what the board ranks now, then sealed
// quests oldest first, then those in hand, then victories newest first.
export const planRealmOf = (key: string, record: ProjectRecord, budget: number | null): PlanRealm => {
  const { tasks } = record
  const ranked = rankBacklog(record, budget).map(r => r.task)
  const star = ranked[0]?.id ?? null
  const current = tasks.filter(t => t.state === 'current').sort((a, b) => Date.parse(a.started ?? a.created) - Date.parse(b.started ?? b.created))
  const done = tasks.filter(t => t.state === 'done').sort((a, b) => Date.parse(b.finished ?? b.created) - Date.parse(a.finished ?? a.created))
  const order = new Map([...ranked, ...blockedTasks(tasks), ...current, ...done].map((t, i) => [t.id, i]))
  const parentQuests = parentQuestsOf(tasks)

  const quests = tasks
    .filter(t => t.state !== 'removed')
    .map(
      (task): PlanQuest => ({
        id: task.id,
        title: task.title,
        status: statusOf(task, tasks),
        priority: task.priority,
        difficulty: task.difficulty.expected,
        tags: storedTags(task.tags),
        points: storedPoints(task.points),
        rank: storedRank(task.rank),
        order: order.get(task.id) ?? order.size,
        sagaIds: parentsOf(task, tasks).map(p => p.id),
        parentQuest: parentQuests.get(task.id) ?? null,
        isSaga: childrenOf(task, tasks).length > 0,
        dependsOn: task.blockedBy.filter(id => tasks.some(t => t.id === id && t.state !== 'removed')),
        blockedReason: task.blockedReason,
        links: storedLinks(task.links).filter(link => link.id !== task.id && tasks.some(t => t.id === link.id && t.state !== 'removed')),
        isStar: task.id === star,
        created: task.created,
        started: task.started,
        finished: task.finished,
        minutes: minutesOf(task),
        due: task.due ?? null,
      }),
    )

  return { key, name: record.project.name, quests }
}
