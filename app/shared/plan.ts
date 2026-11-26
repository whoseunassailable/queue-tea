// The Plan tab: the backlog, the quest board and what they plan with, as main
// builds them from the records and the window shows them. Pure: both sides
// use these rules, so what the window offers is what main accepts.
// docs/plan.md has the rules in words.

import type { Difficulty, Priority, QuestLink } from '../../types'

// Where a quest stands on the board. Read from the record, never stored:
// ready and blocked are queued quests, active and review are current ones.
export type PlanStatus = 'ready' | 'blocked' | 'active' | 'review' | 'done'
export const PLAN_STATUSES: readonly PlanStatus[] = ['ready', 'blocked', 'active', 'review', 'done']
// What the backlog shows while no status is picked: everything still open.
export const OPEN_STATUSES: readonly PlanStatus[] = ['ready', 'blocked', 'active', 'review']

export const PLAN_PRIORITIES: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']
export const PLAN_DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

// Effort points follow the usual planning scale, so sizes stay comparable.
export const EFFORT_POINTS: readonly number[] = [1, 2, 3, 5, 8, 13, 21]
export const PLAN_LIMITS = { tags: 10, tag: 24, views: 20, viewName: 40, search: 200, bulk: 200, title: 200, wip: 20 } as const

export type PlanQuest = {
  id: string
  title: string
  status: PlanStatus
  priority: Priority
  difficulty: Difficulty
  tags: string[]
  points: number | null
  rank: number | null
  // Its place in the realm's ★ order, for quests nobody has dragged.
  order: number
  // The sagas it is part of that are still there; the first is its home.
  sagaIds: string[]
  // The quest it is a child quest of, when that still holds.
  parentQuest: string | null
  // Quests are filed under it, so it is a saga.
  isSaga: boolean
  // The quests it waits for, done ones included; only open ones block it.
  dependsOn: string[]
  blockedReason: string | null
  links: QuestLink[]
  isStar: boolean
  created: string
  started: string | null
  finished: string | null
  minutes: number
  due: string | null
}

export type PlanRealm = { key: string; name: string; quests: PlanQuest[] }
export type PlanView = { realms: PlanRealm[]; unreadable: number }

export type PlanFilters = { statuses: PlanStatus[]; priorities: Priority[]; difficulties: Difficulty[]; realms: string[]; tags: string[] }
export const NO_FILTERS: PlanFilters = { statuses: [], priorities: [], difficulties: [], realms: [], tags: [] }

// How the board's rows are grouped.
export type PlanLanes = 'none' | 'saga' | 'realm' | 'priority'
export const PLAN_LANES: readonly PlanLanes[] = ['none', 'saga', 'realm', 'priority']

// A named set of filters, kept in the app's settings. Realms empty means the
// realm that is open, whichever it is.
export type SavedPlanView = { id: string; name: string; filters: PlanFilters; search: string; lanes: PlanLanes }

// Where a bulk move puts quests: into a saga, under a quest as its child
// quests, or on their own.
export type PlanTarget = { kind: 'saga'; id: string } | { kind: 'quest'; id: string } | { kind: 'none' }

export type BulkOp =
  | { kind: 'priority'; priority: Priority }
  | { kind: 'difficulty'; difficulty: Difficulty }
  | { kind: 'points'; points: number | null }
  | { kind: 'addTag'; tag: string }
  | { kind: 'removeTag'; tag: string }
  | { kind: 'move'; to: PlanTarget }
  | { kind: 'archive' }
  | { kind: 'rankTo'; edge: 'top' | 'bottom' }

// Depends on and blocks are the same wait, read from either end.
export type PlanLinkKind = 'dependsOn' | 'blocks' | 'relates' | 'duplicates'
export const PLAN_LINK_KINDS: readonly PlanLinkKind[] = ['dependsOn', 'blocks', 'relates', 'duplicates']

// What a quest was before a change, so Undo can put it back. Main writes one
// for every quest a change touched; state new is a quest the change added.
export type SnapshotState = 'queued' | 'current' | 'done' | 'removed' | 'new'
export const SNAPSHOT_STATES: readonly SnapshotState[] = ['queued', 'current', 'done', 'removed', 'new']
export type PlanSnapshot = {
  id: string
  state: SnapshotState
  priority: Priority
  difficulty: Difficulty
  tags: string[]
  points: number | null
  rank: number | null
  parentIds: string[]
  parentQuest: string | null
  blockedBy: string[]
  links: QuestLink[]
}

export type PlanChange =
  | { kind: 'rank'; id: string; before: string | null }
  | { kind: 'bulk'; ids: string[]; op: BulkOp }
  | { kind: 'link'; id: string; link: PlanLinkKind; to: string; isOn: boolean }
  | { kind: 'childQuest'; parentId: string; title: string }
  | { kind: 'restore'; quests: PlanSnapshot[] }

// Why a change was refused. Main and the window each say it in their own words.
export type PlanRefusal =
  | { code: 'gone' }
  | { code: 'notBeside' }
  | { code: 'childOfChild'; parent: string }
  | { code: 'childOfSaga'; parent: string }
  | { code: 'hasChildren'; quest: string }
  | { code: 'ownChild' }
  | { code: 'closedParent'; parent: string }
  | { code: 'archiveActive'; quest: string }
  | { code: 'cantBeSaga'; quest: string; why: 'child' | 'parent' }
  | { code: 'linkSelf' }
  | { code: 'loop'; quest: string; other: string }
  | { code: 'closedWait'; other: string }
  | { code: 'badTag' }
  | { code: 'tooManyTags'; quest: string }
  | { code: 'closed'; quest: string }
  | { code: 'engine'; text: string }

// ── Reading values ───────────────────────────────────────────────────────────

const isObject = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value)
const isString = (value: unknown): value is string => typeof value === 'string'
const isId = (value: unknown): value is string => isString(value) && value !== '' && value.length <= 200
const oneOf = <T>(list: readonly T[], value: unknown): value is T => list.includes(value as T)
const listOf = <T>(list: readonly T[], value: unknown): T[] | null =>
  Array.isArray(value) && value.every(item => oneOf(list, item)) ? [...new Set(value as T[])] : null

// A tag as the record keeps it: lower case, words joined by dashes, letters,
// digits and . _ - only. Null when nothing usable is left.
export const tagOf = (text: unknown): string | null => {
  if (!isString(text)) return null
  const tag = text.trim().toLowerCase().replace(/\s+/g, '-')

  return tag.length > 0 && tag.length <= PLAN_LIMITS.tag && /^[\p{L}\p{N}][\p{L}\p{N}._-]*$/u.test(tag) ? tag : null
}

// A task's tags, points, rank, parent quest and links as stored. A value that
// doesn't read counts as none, so a hand edit never costs the quest.
export const storedTags = (value: unknown): string[] =>
  Array.isArray(value) ? [...new Set(value.flatMap(tag => { const read = tagOf(tag); return read === null ? [] : [read] }))].slice(0, PLAN_LIMITS.tags) : []
export const storedPoints = (value: unknown): number | null => (typeof value === 'number' && EFFORT_POINTS.includes(value) ? value : null)
export const storedRank = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? value : null)
export const storedParentQuest = (value: unknown): string | null => (isId(value) ? value : null)
export const storedLinks = (value: unknown): QuestLink[] =>
  Array.isArray(value)
    ? value.flatMap(link => (isObject(link) && (link.kind === 'relates' || link.kind === 'duplicates') && isId(link.id) ? [{ kind: link.kind, id: link.id }] : []))
    : []

export const filtersOf = (value: unknown): PlanFilters | null => {
  if (!isObject(value)) return null
  const statuses = listOf(PLAN_STATUSES, value.statuses)
  const priorities = listOf(PLAN_PRIORITIES, value.priorities)
  const difficulties = listOf(PLAN_DIFFICULTIES, value.difficulties)
  const realms = Array.isArray(value.realms) && value.realms.every(isId) ? [...new Set(value.realms as string[])] : null
  const tags = Array.isArray(value.tags) ? value.tags.map(tagOf) : null
  if (statuses === null || priorities === null || difficulties === null || realms === null || tags === null || tags.some(tag => tag === null)) return null

  return { statuses, priorities, difficulties, realms, tags: [...new Set(tags as string[])] }
}

// A saved view's name, trimmed; null when it is empty or too long.
export const viewNameOf = (value: unknown): string | null => {
  const name = isString(value) ? value.trim().replace(/\s+/g, ' ') : ''

  return name === '' || name.length > PLAN_LIMITS.viewName ? null : name
}

export const savedViewOf = (value: unknown): SavedPlanView | null => {
  if (!isObject(value) || !isId(value.id)) return null
  const name = viewNameOf(value.name)
  const filters = filtersOf(value.filters)
  const search = isString(value.search) && value.search.length <= PLAN_LIMITS.search ? value.search : null
  const lanes = oneOf(PLAN_LANES, value.lanes) ? value.lanes : null

  return name === null || filters === null || search === null || lanes === null ? null : { id: value.id, name, filters, search, lanes }
}

// Saved views from the settings file: those that read, each name once.
export const savedViewsOf = (value: unknown): SavedPlanView[] | null => {
  if (!Array.isArray(value)) return null
  const views: SavedPlanView[] = []
  for (const item of value) {
    const view = savedViewOf(item)
    if (view !== null && !views.some(v => v.id === view.id || v.name.toLowerCase() === view.name.toLowerCase())) views.push(view)
  }

  return views.slice(0, PLAN_LIMITS.views)
}

// Work-in-progress limits by realm: whole numbers from 1 to the most.
export const wipLimitsOf = (value: unknown): Record<string, number> | null =>
  isObject(value) && Object.entries(value).every(([key, limit]) => isId(key) && Number.isInteger(limit) && (limit as number) >= 1 && (limit as number) <= PLAN_LIMITS.wip)
    ? (value as Record<string, number>)
    : null

const targetOf = (value: unknown): PlanTarget | null => {
  if (!isObject(value)) return null
  if (value.kind === 'none') return { kind: 'none' }

  return (value.kind === 'saga' || value.kind === 'quest') && isId(value.id) ? { kind: value.kind, id: value.id } : null
}

const bulkOpOf = (value: unknown): BulkOp | null => {
  if (!isObject(value)) return null
  switch (value.kind) {
    case 'priority':
      return oneOf(PLAN_PRIORITIES, value.priority) ? { kind: 'priority', priority: value.priority } : null
    case 'difficulty':
      return oneOf(PLAN_DIFFICULTIES, value.difficulty) ? { kind: 'difficulty', difficulty: value.difficulty } : null
    case 'points':
      return value.points === null || storedPoints(value.points) !== null ? { kind: 'points', points: value.points as number | null } : null
    case 'addTag':
    case 'removeTag': {
      const tag = tagOf(value.tag)

      return tag === null ? null : { kind: value.kind, tag }
    }
    case 'move': {
      const to = targetOf(value.to)

      return to === null ? null : { kind: 'move', to }
    }
    case 'archive':
      return { kind: 'archive' }
    case 'rankTo':
      return value.edge === 'top' || value.edge === 'bottom' ? { kind: 'rankTo', edge: value.edge } : null
    default:
      return null
  }
}

const idsOf = (value: unknown): string[] | null => (Array.isArray(value) && value.every(isId) ? [...new Set(value as string[])] : null)

const snapshotOf = (value: unknown): PlanSnapshot | null => {
  if (!isObject(value) || !isId(value.id) || !oneOf(SNAPSHOT_STATES, value.state)) return null
  if (!oneOf(PLAN_PRIORITIES, value.priority) || !oneOf(PLAN_DIFFICULTIES, value.difficulty) || !Array.isArray(value.tags) || !Array.isArray(value.links)) return null
  if (!(value.points === null || storedPoints(value.points) !== null) || !(value.rank === null || storedRank(value.rank) !== null)) return null
  if (!(value.parentQuest === null || isId(value.parentQuest))) return null
  const parentIds = idsOf(value.parentIds)
  const blockedBy = idsOf(value.blockedBy)
  if (parentIds === null || blockedBy === null) return null

  return {
    id: value.id,
    state: value.state,
    priority: value.priority,
    difficulty: value.difficulty,
    tags: storedTags(value.tags),
    points: value.points as number | null,
    rank: value.rank as number | null,
    parentIds,
    parentQuest: value.parentQuest as string | null,
    blockedBy,
    links: storedLinks(value.links),
  }
}

// A change from the window, checked again in main: null when it doesn't read.
export const planChangeOf = (value: unknown): PlanChange | null => {
  if (!isObject(value)) return null
  switch (value.kind) {
    case 'rank':
      return isId(value.id) && (value.before === null || isId(value.before)) ? { kind: 'rank', id: value.id, before: value.before as string | null } : null
    case 'bulk': {
      const op = bulkOpOf(value.op)
      const ids = Array.isArray(value.ids) && value.ids.every(isId) ? [...new Set(value.ids as string[])] : null

      return op === null || ids === null || ids.length === 0 || ids.length > PLAN_LIMITS.bulk ? null : { kind: 'bulk', ids, op }
    }
    case 'link':
      return isId(value.id) && isId(value.to) && oneOf(PLAN_LINK_KINDS, value.link) && typeof value.isOn === 'boolean'
        ? { kind: 'link', id: value.id, link: value.link, to: value.to, isOn: value.isOn }
        : null
    case 'childQuest': {
      const title = isString(value.title) ? value.title.trim() : ''

      return isId(value.parentId) && title !== '' && title.length <= PLAN_LIMITS.title ? { kind: 'childQuest', parentId: value.parentId, title } : null
    }
    case 'restore': {
      const quests = Array.isArray(value.quests) ? value.quests.map(snapshotOf) : null

      return quests === null || quests.length === 0 || quests.length > PLAN_LIMITS.bulk || quests.some(q => q === null) ? null : { kind: 'restore', quests: quests as PlanSnapshot[] }
    }
    default:
      return null
  }
}

// ── The hierarchy ────────────────────────────────────────────────────────────

export const byIdOf = (quests: readonly PlanQuest[]): Map<string, PlanQuest> => new Map(quests.map(q => [q.id, q]))

// What a quest stands under in the backlog: its parent quest, else its first
// saga, else nothing (null: the top).
export const containerOf = (quest: PlanQuest, byId: ReadonlyMap<string, PlanQuest>): string | null => {
  if (quest.parentQuest !== null && byId.has(quest.parentQuest)) return quest.parentQuest

  return quest.sagaIds.find(id => byId.has(id)) ?? null
}

// Ranked quests first, lowest rank first; then the rest in the ★ order.
export const compareSiblings = (a: PlanQuest, b: PlanQuest): number => {
  if (a.rank !== null && b.rank !== null) return a.rank - b.rank || a.order - b.order
  if (a.rank !== null) return -1
  if (b.rank !== null) return 1

  return a.order - b.order
}

// The quests standing under the same container, in backlog order.
export const siblingsOf = (container: string | null, quests: readonly PlanQuest[]): PlanQuest[] => {
  const byId = byIdOf(quests)

  return quests.filter(q => containerOf(q, byId) === container).sort(compareSiblings)
}

// The quests under a container, in order: what a row folds.
export const childrenIn = (id: string, quests: readonly PlanQuest[]): PlanQuest[] => siblingsOf(id, quests)

// The ranks after moving `id` to stand just before `before` among its
// siblings, or last with `before` null. Every sibling is renumbered from 0, so
// the order is the one shown, whatever was stored before. Refused when
// `before` stands somewhere else: a drag reorders, it never refiles.
export const rankMove = (quests: readonly PlanQuest[], id: string, before: string | null): Map<string, number> | PlanRefusal => {
  const byId = byIdOf(quests)
  const quest = byId.get(id)
  if (quest === undefined) return { code: 'gone' }
  const container = containerOf(quest, byId)
  const siblings = siblingsOf(container, quests).filter(q => q.id !== id)
  if (before !== null) {
    const target = byId.get(before)
    if (target === undefined) return { code: 'gone' }
    if (containerOf(target, byId) !== container) return { code: 'notBeside' }
  }
  const at = before === null ? siblings.length : siblings.findIndex(q => q.id === before)
  const order = [...siblings.slice(0, at), quest, ...siblings.slice(at)]

  return new Map(order.map((q, i) => [q.id, i]))
}

// Ranks that put the quests given first (or last) among their siblings, in the
// order they stand now, each container on its own.
export const rankToEdge = (quests: readonly PlanQuest[], ids: readonly string[], edge: 'top' | 'bottom'): Map<string, number> => {
  const byId = byIdOf(quests)
  const containers = new Set(ids.flatMap(id => { const q = byId.get(id); return q === undefined ? [] : [containerOf(q, byId)] }))
  const ranks = new Map<string, number>()
  for (const container of containers) {
    const siblings = siblingsOf(container, quests)
    const moved = siblings.filter(q => ids.includes(q.id))
    const rest = siblings.filter(q => !ids.includes(q.id))
    const order = edge === 'top' ? [...moved, ...rest] : [...rest, ...moved]
    order.forEach((q, i) => ranks.set(q.id, i))
  }

  return ranks
}

// Why `childId` can't be a child quest of `parentId`; null when it can. A
// child quest stands under a quest, never under a saga or another child
// quest, and has none of its own, so the backlog is at most three deep.
export const childQuestRefusal = (quests: readonly PlanQuest[], childId: string | null, parentId: string): PlanRefusal | null => {
  const byId = byIdOf(quests)
  const parent = byId.get(parentId)
  if (parent === undefined) return { code: 'gone' }
  if (childId === parentId) return { code: 'ownChild' }
  if (parent.status === 'done') return { code: 'closedParent', parent: parent.title }
  if (parent.isSaga) return { code: 'childOfSaga', parent: parent.title }
  if (parent.parentQuest !== null && byId.has(parent.parentQuest)) return { code: 'childOfChild', parent: parent.title }
  if (childId === null) return null
  const child = byId.get(childId)
  if (child === undefined) return { code: 'gone' }
  if (child.isSaga || quests.some(q => q.parentQuest === childId && q.id !== parentId)) return { code: 'hasChildren', quest: child.title }

  return null
}

// ── Relationships ────────────────────────────────────────────────────────────

// The quests that wait for this one: the other end of depends on.
export const blocksOf = (id: string, quests: readonly PlanQuest[]): PlanQuest[] => quests.filter(q => q.dependsOn.includes(id))

// The links a quest shows, both ends of every one, to quests still there.
export type ShownLink = { kind: 'dependsOn' | 'blocks' | 'relates' | 'duplicates' | 'duplicatedBy'; quest: PlanQuest }

export const linksOf = (quest: PlanQuest, quests: readonly PlanQuest[]): ShownLink[] => {
  const byId = byIdOf(quests)
  const found = (id: string) => byId.get(id)
  const out: ShownLink[] = []
  for (const id of quest.dependsOn) {
    const other = found(id)
    if (other !== undefined) out.push({ kind: 'dependsOn', quest: other })
  }
  for (const other of blocksOf(quest.id, quests)) out.push({ kind: 'blocks', quest: other })
  for (const link of quest.links) {
    const other = found(link.id)
    if (other !== undefined) out.push({ kind: link.kind, quest: other })
  }
  for (const other of quests) {
    if (other.id === quest.id) continue
    for (const link of other.links) {
      if (link.id !== quest.id) continue
      // Relates to reads the same from both ends, so it shows once.
      if (link.kind === 'relates' && !out.some(l => l.kind === 'relates' && l.quest.id === other.id)) out.push({ kind: 'relates', quest: other })
      if (link.kind === 'duplicates') out.push({ kind: 'duplicatedBy', quest: other })
    }
  }

  return out
}

// True when `waiter` waiting for `blocker` would close a loop of waits.
export const waitLoops = (quests: readonly PlanQuest[], waiter: string, blocker: string): boolean => {
  const byId = byIdOf(quests)
  const seen = new Set<string>()
  const stack = [blocker]
  while (stack.length > 0) {
    const id = stack.pop()!
    if (id === waiter) return true
    if (seen.has(id)) continue
    seen.add(id)
    stack.push(...(byId.get(id)?.dependsOn ?? []))
  }

  return false
}

// Why a link can't be added; null when it can. Taking one off is always fine.
export const linkRefusal = (quests: readonly PlanQuest[], id: string, link: PlanLinkKind, to: string): PlanRefusal | null => {
  const byId = byIdOf(quests)
  const quest = byId.get(id)
  const other = byId.get(to)
  if (quest === undefined || other === undefined) return { code: 'gone' }
  if (id === to) return { code: 'linkSelf' }
  if (link === 'dependsOn' || link === 'blocks') {
    const [waiter, blocker] = link === 'dependsOn' ? [quest, other] : [other, quest]
    if (blocker.status === 'done') return { code: 'closedWait', other: blocker.title }
    if (waitLoops(quests, waiter.id, blocker.id)) return { code: 'loop', quest: waiter.title, other: blocker.title }
  }

  return null
}

// ── Filters ──────────────────────────────────────────────────────────────────

export const isFiltered = (filters: PlanFilters, search: string): boolean =>
  search.trim() !== '' || filters.statuses.length > 0 || filters.priorities.length > 0 || filters.difficulties.length > 0 || filters.tags.length > 0

const words = (text: string) => text.toLowerCase().split(/\s+/).filter(word => word !== '')

// Within one kind of filter any value picked matches; across kinds all must.
// No status picked shows the open quests. Every word searched must be in the
// title or a tag. Realms are chosen before this, by which realms are read.
export const questMatches = (quest: PlanQuest, filters: PlanFilters, search: string): boolean => {
  const statuses = filters.statuses.length === 0 ? OPEN_STATUSES : filters.statuses
  if (!statuses.includes(quest.status)) return false
  if (filters.priorities.length > 0 && !filters.priorities.includes(quest.priority)) return false
  if (filters.difficulties.length > 0 && !filters.difficulties.includes(quest.difficulty)) return false
  if (filters.tags.length > 0 && !filters.tags.some(tag => quest.tags.includes(tag))) return false
  const haystack = `${quest.title} ${quest.tags.join(' ')}`.toLowerCase()

  return words(search).every(word => haystack.includes(word))
}

// The realms a view reads: those it names that are still there, else the one open.
export const realmsShown = (filters: PlanFilters, open: string | null, known: readonly string[]): string[] => {
  const named = filters.realms.filter(key => known.includes(key))
  if (named.length > 0) return named

  return open !== null && known.includes(open) ? [open] : []
}
