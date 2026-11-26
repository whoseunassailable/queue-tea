import { PLAN_PRIORITIES, PLAN_STATUSES } from '../../../../shared/plan'
import type { PlanLanes, PlanQuest, PlanRealm, PlanStatus } from '../../../../shared/plan'
import type { Priority } from '../../../../../types'

// The quest board: a column for each status, lanes across them, and which
// moves between columns can happen. Pure.

export type BoardCard = { quest: PlanQuest; realm: PlanRealm }
export type BoardLane = { key: string; label: string | null; columns: Record<PlanStatus, BoardCard[]> }

// Victories shown before the board points to the Chronicle.
export const DONE_SHOWN = 12

const emptyColumns = (): Record<PlanStatus, BoardCard[]> => ({ ready: [], blocked: [], active: [], review: [], done: [] })

const laneOf = (card: BoardCard, lanes: PlanLanes, noSaga: string): { key: string; label: string; order: number } => {
  const { quest, realm } = card
  if (lanes === 'realm') return { key: `realm:${realm.key}`, label: realm.name, order: 0 }
  if (lanes === 'priority') return { key: `priority:${quest.priority}`, label: quest.priority, order: PLAN_PRIORITIES.indexOf(quest.priority) }
  const sagaId = quest.isSaga ? quest.id : quest.sagaIds[0]
  const saga = sagaId === undefined ? undefined : realm.quests.find(q => q.id === sagaId)
  if (saga === undefined) return { key: 'saga:none', label: noSaga, order: Number.MAX_SAFE_INTEGER }

  return { key: `saga:${realm.key}/${saga.id}`, label: saga.title, order: saga.order }
}

// Cards in their columns, in ★ order; victories newest first. Lanes keep
// their realms' order, then each lane's own: a saga's place, a priority's.
export const boardOf = (cards: readonly BoardCard[], lanes: PlanLanes, noSaga: string, priorityLabel: (p: Priority) => string): BoardLane[] => {
  const sorted = [...cards].sort((a, b) => a.quest.order - b.quest.order)
  if (lanes === 'none') {
    const columns = emptyColumns()
    for (const card of sorted) columns[card.quest.status].push(card)

    return [{ key: 'all', label: null, columns }]
  }
  const found = new Map<string, { lane: BoardLane; order: number; realmAt: number }>()
  const realmOrder = [...new Set(cards.map(c => c.realm.key))]
  for (const card of sorted) {
    const { key, label, order } = laneOf(card, lanes, noSaga)
    const entry = found.get(key) ?? { lane: { key, label: lanes === 'priority' ? priorityLabel(card.quest.priority) : label, columns: emptyColumns() }, order, realmAt: lanes === 'priority' ? 0 : realmOrder.indexOf(card.realm.key) }
    entry.lane.columns[card.quest.status].push(card)
    found.set(key, entry)
  }

  return [...found.values()].sort((a, b) => a.realmAt - b.realmAt || a.order - b.order).map(e => e.lane)
}

export const countIn = (lanes: readonly BoardLane[], status: PlanStatus): number => lanes.reduce((n, lane) => n + lane.columns[status].length, 0)

// What a move between columns does, using the flows the Quests page uses, or
// why it can't happen.
export type Move = 'start' | 'seal' | 'unseal' | 'back' | 'sealActive' | 'finish' | 'notYet'
export type MoveRefusal =
  | { code: 'otherRealm'; realm: string }
  | { code: 'wip'; limit: number }
  | { code: 'stillWaits'; waits: string[] }
  | { code: 'unsealFirst' }
  | { code: 'startFirst' }
  | { code: 'review' }
  | { code: 'victory' }
export type Transition = { kind: 'none' } | { kind: 'move'; move: Move } | { kind: 'refused'; refusal: MoveRefusal }

export type MoveContext = {
  // The realm open now: only its quests can move, through its flows.
  openRealm: string
  active: number
  wipLimit: number | null
}

const refused = (refusal: MoveRefusal): Transition => ({ kind: 'refused', refusal })
const move = (m: Move): Transition => ({ kind: 'move', move: m })

// The quests still open that it waits for.
export const openWaits = (quest: PlanQuest, realm: PlanRealm): PlanQuest[] =>
  quest.dependsOn.flatMap(id => {
    const other = realm.quests.find(q => q.id === id)

    return other === undefined || other.status === 'done' ? [] : [other]
  })

export const transitionOf = (card: BoardCard, to: PlanStatus, ctx: MoveContext): Transition => {
  const { quest, realm } = card
  const from = quest.status
  if (from === to) return { kind: 'none' }
  if (from === 'done') return refused({ code: 'victory' })
  if (realm.key !== ctx.openRealm) return refused({ code: 'otherRealm', realm: realm.name })
  if (to === 'review') return refused({ code: 'review' })
  switch (from) {
    case 'ready':
      if (to === 'active') return ctx.wipLimit !== null && ctx.active >= ctx.wipLimit ? refused({ code: 'wip', limit: ctx.wipLimit }) : move('start')
      if (to === 'blocked') return move('seal')

      return refused({ code: 'startFirst' })
    case 'blocked': {
      if (to !== 'ready') return refused({ code: 'unsealFirst' })
      const waits = openWaits(quest, realm)

      return waits.length > 0 ? refused({ code: 'stillWaits', waits: waits.map(q => q.title) }) : move('unseal')
    }
    case 'active':
    case 'review':
      if (to === 'ready') return move('back')
      if (to === 'blocked') return move('sealActive')
      if (to === 'done') return move('finish')

      return from === 'review' ? move('notYet') : { kind: 'none' }
  }
}

// The columns a card can go to, for its menu.
export const targetsOf = (card: BoardCard, ctx: MoveContext): PlanStatus[] => PLAN_STATUSES.filter(s => transitionOf(card, s, ctx).kind === 'move')
