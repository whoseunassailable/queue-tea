import { childrenIn, isFiltered, questMatches, siblingsOf } from '../../../../shared/plan'
import type { PlanFilters, PlanQuest, PlanRealm } from '../../../../shared/plan'

// The backlog as rows: each realm shown, its quests in their places, a saga
// or a quest above what stands under it. Pure.

export type TreeRow = {
  quest: PlanQuest
  realm: PlanRealm
  // 0 at the top, 1 under a saga or quest, 2 a child quest in a saga.
  depth: number
  // Shown only because something under it matches.
  isContext: boolean
  hasChildren: boolean
  isFolded: boolean
}
export type TreeGroup = { realm: PlanRealm; rows: TreeRow[] }
export type Backlog = { groups: TreeGroup[]; matches: PlanQuest[] }

const isSaga = (q: PlanQuest) => q.isSaga

// Folded ids are per realm: `<realm>/<quest>`.
export const foldKey = (realm: string, id: string): string => `${realm}/${id}`

const rowsOf = (realm: PlanRealm, matched: ReadonlySet<string>, folded: ReadonlySet<string>): TreeRow[] => {
  const { quests } = realm
  const rows: TreeRow[] = []
  // Whether anything at or under a quest matches.
  const memo = new Map<string, boolean>()
  const shows = (q: PlanQuest): boolean => {
    const known = memo.get(q.id)
    if (known !== undefined) return known
    memo.set(q.id, false)
    const result = matched.has(q.id) || childrenIn(q.id, quests).some(shows)
    memo.set(q.id, result)

    return result
  }
  const walk = (list: PlanQuest[], depth: number) => {
    for (const quest of list) {
      if (!shows(quest)) continue
      const children = childrenIn(quest.id, quests).filter(shows)
      const isFolded = folded.has(foldKey(realm.key, quest.id))
      rows.push({ quest, realm, depth, isContext: !matched.has(quest.id), hasChildren: children.length > 0, isFolded })
      if (!isFolded && depth < 2) walk(children, depth + 1)
    }
  }
  walk(siblingsOf(null, quests), 0)

  return rows
}

export const backlogOf = (realms: readonly PlanRealm[], filters: PlanFilters, search: string, folded: ReadonlySet<string>): Backlog => {
  const groups: TreeGroup[] = []
  const matches: PlanQuest[] = []
  for (const realm of realms) {
    const found = realm.quests.filter(q => questMatches(q, filters, search))
    matches.push(...found)
    const rows = rowsOf(realm, new Set(found.map(q => q.id)), folded)
    if (rows.length > 0) groups.push({ realm, rows })
  }

  return { groups, matches }
}

// What the summary counts: effort points of what matched, sagas aside, since
// a saga's size is its chapters'.
export const pointsOf = (quests: readonly PlanQuest[]): { quests: number; points: number; unestimated: number } => {
  const sized = quests.filter(q => !isSaga(q))

  return { quests: quests.length, points: sized.reduce((sum, q) => sum + (q.points ?? 0), 0), unestimated: sized.filter(q => q.points === null).length }
}

// Where a keyboard move puts a quest among the quests beside it: the id to
// stand before, null for last, or undefined when it can go no further.
export const stepBefore = (quests: readonly PlanQuest[], quest: PlanQuest, container: string | null, delta: -1 | 1): string | null | undefined => {
  const siblings = siblingsOf(container, quests)
  const at = siblings.findIndex(q => q.id === quest.id)
  if (at === -1) return undefined
  if (delta === -1) return at === 0 ? undefined : siblings[at - 1]!.id
  if (at === siblings.length - 1) return undefined

  return siblings[at + 2]?.id ?? null
}

// Where a drop on `target` puts the dragged quest: before it when coming from
// below, after it when coming from above.
export const dropBefore = (quests: readonly PlanQuest[], dragged: PlanQuest, target: PlanQuest, container: string | null): string | null => {
  const siblings = siblingsOf(container, quests)
  const from = siblings.findIndex(q => q.id === dragged.id)
  const to = siblings.findIndex(q => q.id === target.id)
  if (from > to) return target.id

  return siblings[to + 1]?.id ?? null
}

export { isFiltered }
