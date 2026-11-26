import type { PlanQuest, PlanRealm, PlanView } from '../../../shared/plan'

// A quest as the Plan tab reads it, for tests.
export const planQuest = (over: Partial<PlanQuest> & { id: string }): PlanQuest => ({
  title: over.id,
  status: 'ready',
  priority: 'mid',
  difficulty: 'medium',
  tags: [],
  points: null,
  rank: null,
  order: 0,
  sagaIds: [],
  parentQuest: null,
  isSaga: false,
  dependsOn: [],
  blockedReason: null,
  links: [],
  isStar: false,
  created: '2026-11-20T09:00:00+01:00',
  started: null,
  finished: null,
  minutes: 0,
  due: null,
  ...over,
})

export const planRealm = (key: string, quests: PlanQuest[], name = key.replace(/-[0-9a-f]{6}$/, '')): PlanRealm => ({ key, name, quests })

// One realm with a saga, its quest, a child quest under it, a sealed quest
// waiting for the quest, one in hand and a victory.
export const planView = (key = 'a-000001'): PlanView => ({
  realms: [
    planRealm(key, [
      planQuest({ id: 'saga', title: 'Billing saga', isSaga: true, order: 5 }),
      planQuest({ id: 'invoice', title: 'Send invoices', sagaIds: ['saga'], order: 0, isStar: true, points: 5, tags: ['billing'] }),
      planQuest({ id: 'pdf', title: 'Invoice PDF', sagaIds: ['saga'], parentQuest: 'invoice', order: 1, points: 2 }),
      planQuest({ id: 'remind', title: 'Payment reminders', status: 'blocked', dependsOn: ['invoice'], order: 6, priority: 'high' }),
      planQuest({ id: 'login', title: 'Fix login', status: 'active', order: 7, priority: 'urgent', started: '2026-11-25T10:00:00+01:00', minutes: 40 }),
      planQuest({ id: 'docs', title: 'Write docs', status: 'done', order: 8, finished: '2026-11-24T18:00:00+01:00', points: 3 }),
    ]),
  ],
  unreadable: 0,
})
