import type { ProjectRecord, QuestLink, Task } from '../../../../../types'
import { parentsRefusal, setParents } from '../../../../../hooks/shared/backlog/domain/services/families'
import { newTask, removeTask } from '../../../../../hooks/shared/records/domain/services/queue_rules'
import { childQuestRefusal, linkRefusal, PLAN_LIMITS, rankMove, rankToEdge, storedLinks, storedParentQuest, storedPoints, storedRank, storedTags } from '../../../../shared/plan'
import type { BulkOp, PlanChange, PlanQuest, PlanRefusal, PlanSnapshot, PlanTarget } from '../../../../shared/plan'
import { planRealmOf } from './plan_view'

// What a Plan change does to one realm's record. Pure: the api runs it under
// the record's lock, so what it checks is what it changes. Every change is
// whole or refused, and it hands back what each quest it touched was before,
// for Undo. docs/plan.md has the rules in words.

export type PlanContext = { key: string; budget: number | null; now: string; newId: () => string }
export type Applied = { kind: 'changed'; record: ProjectRecord; undo: PlanSnapshot[] } | { kind: 'refused'; refusal: PlanRefusal }

class Refused extends Error {
  constructor(readonly refusal: PlanRefusal) {
    super(refusal.code)
  }
}
const refuse = (refusal: PlanRefusal): never => {
  throw new Refused(refusal)
}

// A planning field set, or taken off when it is null, so the task reads as one
// saved before the field existed.
type PlanField = 'rank' | 'tags' | 'points' | 'parentQuest' | 'links'
const withField = <K extends PlanField>(task: Task, field: K, value: Task[K] | null): Task => {
  if (value !== null) return { ...task, [field]: value }
  const { [field]: _dropped, ...rest } = task

  return rest as Task
}
const withList = <K extends 'tags' | 'links'>(task: Task, field: K, list: NonNullable<Task[K]>): Task =>
  withField(task, field, (list.length === 0 ? null : list) as Task[K] | null)

const mapIds = (tasks: Task[], ids: ReadonlySet<string>, fn: (task: Task) => Task): Task[] => tasks.map(t => (ids.has(t.id) ? fn(t) : t))
const withRanks = (tasks: Task[], ranks: ReadonlyMap<string, number>): Task[] => tasks.map(t => (ranks.has(t.id) ? { ...t, rank: ranks.get(t.id)! } : t))

const questsOf = (record: ProjectRecord, ctx: PlanContext): PlanQuest[] => planRealmOf(ctx.key, record, ctx.budget).quests

const found = (quests: PlanQuest[], id: string): PlanQuest => quests.find(q => q.id === id) ?? refuse({ code: 'gone' })

const openOnly = (quests: PlanQuest[], ids: readonly string[]): PlanQuest[] =>
  ids.map(id => {
    const quest = found(quests, id)
    if (quest.status === 'done') refuse({ code: 'closed', quest: quest.title })

    return quest
  })

// The sagas a quest's child quests stand in follow the quest, so the quest
// board still lists them with it.
const withChildrenFollowing = (tasks: Task[], quests: PlanQuest[], id: string, sagas: string[]): Task[] => {
  const children = new Set(quests.filter(q => q.parentQuest === id).map(q => q.id))

  return children.size === 0 ? tasks : [...children].reduce((all, child) => setParents(all, child, sagas), tasks)
}

const moved = (tasks: Task[], quests: PlanQuest[], quest: PlanQuest, to: PlanTarget): Task[] => {
  if (to.kind === 'quest') {
    const refused = childQuestRefusal(quests, quest.id, to.id)
    if (refused !== null) refuse(refused)
    const sagas = found(quests, to.id).sagaIds
    const filed = setParents(tasks, quest.id, sagas)

    return mapIds(filed, new Set([quest.id]), t => withField(withField(t, 'parentQuest', to.id), 'rank', null))
  }
  const sagas = to.kind === 'saga' ? [to.id] : []
  if (to.kind === 'saga') {
    const target = found(quests, to.id)
    if (target.parentQuest !== null) refuse({ code: 'cantBeSaga', quest: target.title, why: 'child' })
    if (!target.isSaga && quests.some(q => q.parentQuest === target.id)) refuse({ code: 'cantBeSaga', quest: target.title, why: 'parent' })
    const was = tasks.find(t => t.id === quest.id)?.parentIds ?? []
    const engine = was.includes(to.id) ? null : parentsRefusal(tasks, quest.id, [to.id])
    if (engine !== null) refuse({ code: 'engine', text: engine })
  }
  const filed = withChildrenFollowing(setParents(tasks, quest.id, sagas), quests, quest.id, sagas)

  return mapIds(filed, new Set([quest.id]), t => withField(withField(t, 'parentQuest', null), 'rank', null))
}

const tagged = (task: Task, title: string, tag: string, isOn: boolean): Task => {
  const tags = storedTags(task.tags)
  if (isOn && tags.includes(tag)) return task
  if (isOn && tags.length >= PLAN_LIMITS.tags) refuse({ code: 'tooManyTags', quest: title })

  return withList(task, 'tags', isOn ? [...tags, tag] : tags.filter(t => t !== tag))
}

const bulk = (record: ProjectRecord, quests: PlanQuest[], ids: string[], op: BulkOp, ctx: PlanContext): ProjectRecord => {
  const picked = openOnly(quests, ids)
  const set = new Set(ids)
  const { tasks } = record
  switch (op.kind) {
    case 'priority':
      return { ...record, tasks: mapIds(tasks, set, t => ({ ...t, priority: op.priority })) }
    case 'difficulty':
      return { ...record, tasks: mapIds(tasks, set, t => ({ ...t, difficulty: { ...t.difficulty, expected: op.difficulty } })) }
    case 'points':
      return { ...record, tasks: mapIds(tasks, set, t => withField(t, 'points', op.points)) }
    case 'addTag':
    case 'removeTag':
      return { ...record, tasks: tasks.map(t => (set.has(t.id) ? tagged(t, t.title, op.tag, op.kind === 'addTag') : t)) }
    case 'move': {
      // One at a time, each checked against the record as the ones before it left it.
      let now = tasks
      for (const quest of picked) now = moved(now, questsOf({ ...record, tasks: now }, ctx), quest, op.to)

      return { ...record, tasks: now }
    }
    case 'archive': {
      for (const quest of picked) if (quest.status === 'active' || quest.status === 'review') refuse({ code: 'archiveActive', quest: quest.title })
      const archived = ids.reduce((all, id) => removeTask(all, id), tasks)
      // Their child quests stay, on their own in the backlog.
      const freed = archived.map(t => (set.has(storedParentQuest(t.parentQuest) ?? '') ? withField(t, 'parentQuest', null) : t))

      return { ...record, feature: record.feature !== null && set.has(record.feature) ? null : record.feature, tasks: freed }
    }
    case 'rankTo':
      return { ...record, tasks: withRanks(tasks, rankToEdge(quests, ids, op.edge)) }
  }
}

const linked = (record: ProjectRecord, quests: PlanQuest[], change: Extract<PlanChange, { kind: 'link' }>): ProjectRecord => {
  const quest = found(quests, change.id)
  found(quests, change.to)
  if (change.isOn) {
    const refused = linkRefusal(quests, change.id, change.link, change.to)
    if (refused !== null) refuse(refused)
  }
  const { tasks } = record
  if (change.link === 'dependsOn' || change.link === 'blocks') {
    const [waiter, blocker] = change.link === 'dependsOn' ? [change.id, change.to] : [change.to, change.id]
    if (change.isOn && found(quests, waiter).status === 'done') refuse({ code: 'closed', quest: found(quests, waiter).title })

    return {
      ...record,
      tasks: mapIds(tasks, new Set([waiter]), t => ({
        ...t,
        blockedBy: change.isOn ? [...new Set([...t.blockedBy, blocker])] : t.blockedBy.filter(id => id !== blocker),
      })),
    }
  }
  const kind = change.link
  const linksOf = (t: Task): QuestLink[] => storedLinks(t.links)
  const has = (t: Task | undefined, id: string) => t !== undefined && linksOf(t).some(l => l.kind === kind && l.id === id)
  const here = tasks.find(t => t.id === quest.id)
  const there = tasks.find(t => t.id === change.to)
  if (change.isOn) {
    // Relates to reads the same from both ends, so it is kept once.
    if (has(here, change.to) || (kind === 'relates' && has(there, quest.id))) return record

    return { ...record, tasks: mapIds(tasks, new Set([quest.id]), t => withList(t, 'links', [...linksOf(t), { kind, id: change.to }])) }
  }
  const off = (t: Task, id: string) => withList(t, 'links', linksOf(t).filter(l => !(l.kind === kind && l.id === id)))

  return {
    ...record,
    tasks: tasks.map(t => (t.id === quest.id ? off(t, change.to) : kind === 'relates' && t.id === change.to ? off(t, quest.id) : t)),
  }
}

const childQuest = (record: ProjectRecord, quests: PlanQuest[], change: Extract<PlanChange, { kind: 'childQuest' }>, ctx: PlanContext): ProjectRecord => {
  const refused = childQuestRefusal(quests, null, change.parentId)
  if (refused !== null) refuse(refused)
  const parent = found(quests, change.parentId)
  const task = newTask({ title: change.title, priority: parent.priority, difficulty: 'medium', messages: [], now: ctx.now, id: ctx.newId(), parentIds: parent.sagaIds })

  return { ...record, tasks: [...record.tasks, { ...task, parentQuest: parent.id }] }
}

const restored = (task: Task, was: PlanSnapshot): Task => {
  if (was.state === 'new') return task.state === 'queued' ? { ...task, state: 'removed' } : task
  const back: Task = {
    ...task,
    state: was.state === 'queued' && task.state === 'removed' ? 'queued' : task.state,
    priority: was.priority,
    difficulty: { ...task.difficulty, expected: was.difficulty },
    parentIds: was.parentIds,
    blockedBy: was.blockedBy,
  }
  const fields: [PlanField, Task[PlanField] | null][] = [
    ['tags', was.tags.length === 0 ? null : was.tags],
    ['points', was.points],
    ['rank', was.rank],
    ['parentQuest', was.parentQuest],
    ['links', was.links.length === 0 ? null : was.links],
  ]

  return fields.reduce((t, [field, value]) => withField(t, field, value as never), back)
}

const restore = (record: ProjectRecord, change: Extract<PlanChange, { kind: 'restore' }>): ProjectRecord => {
  const byId = new Map(change.quests.map(q => [q.id, q]))

  return { ...record, tasks: record.tasks.map(t => (byId.has(t.id) ? restored(t, byId.get(t.id)!) : t)) }
}

const snapshotOf = (task: Task): PlanSnapshot => ({
  id: task.id,
  state: task.state,
  priority: task.priority,
  difficulty: task.difficulty.expected,
  tags: storedTags(task.tags),
  points: storedPoints(task.points),
  rank: storedRank(task.rank),
  parentIds: task.parentIds,
  parentQuest: storedParentQuest(task.parentQuest),
  blockedBy: task.blockedBy,
  links: storedLinks(task.links),
})
const sameAs = (a: PlanSnapshot, b: PlanSnapshot) => JSON.stringify(a) === JSON.stringify(b)

// What each quest the change touched was before it, and a new one as new.
export const undoOf = (before: ProjectRecord, after: ProjectRecord): PlanSnapshot[] => {
  const was = new Map(before.tasks.map(t => [t.id, t]))

  return after.tasks.flatMap(t => {
    const old = was.get(t.id)
    if (old === undefined) return [{ ...snapshotOf(t), state: 'new' as const }]

    return sameAs(snapshotOf(old), snapshotOf(t)) ? [] : [snapshotOf(old)]
  })
}

export const applyPlanChange = (record: ProjectRecord, change: PlanChange, ctx: PlanContext): Applied => {
  try {
    const quests = questsOf(record, ctx)
    const next = (() => {
      switch (change.kind) {
        case 'rank': {
          const quest = found(quests, change.id)
          if (quest.status === 'done') refuse({ code: 'closed', quest: quest.title })
          const ranks = rankMove(quests, change.id, change.before)

          return ranks instanceof Map ? { ...record, tasks: withRanks(record.tasks, ranks) } : refuse(ranks)
        }
        case 'bulk':
          return bulk(record, quests, change.ids, change.op, ctx)
        case 'link':
          return linked(record, quests, change)
        case 'childQuest':
          return childQuest(record, quests, change, ctx)
        case 'restore':
          return restore(record, change)
      }
    })()

    return { kind: 'changed', record: next, undo: undoOf(record, next) }
  } catch (err) {
    if (err instanceof Refused) return { kind: 'refused', refusal: err.refusal }
    throw err
  }
}
