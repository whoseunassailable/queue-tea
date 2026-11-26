import { isoLocal } from '../../../../../hooks/shared/time/domain/services/time'
import type { PlanChanged, Reply } from '../../../../shared/engine_api'
import { planChangeOf } from '../../../../shared/plan'
import type { PlanRefusal, PlanView } from '../../../../shared/plan'
import { inGameWords, MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { budgetOf } from '../../projects/data/budgets'
import { scanRecords } from '../../projects/data/projects_source'
import { realmView, scopeOf } from '../../tasks/api/scope'
import type { TasksDeps } from '../../tasks/api/scope'
import { applyPlanChange } from '../domain/plan_changes'
import type { Applied } from '../domain/plan_changes'
import { planRealmOf } from '../domain/plan_view'

// A refusal in the screens' words.
export const refusalText = (refusal: PlanRefusal): string => {
  switch (refusal.code) {
    case 'gone':
      return MESSAGES.planGone
    case 'notBeside':
      return MESSAGES.planNotBeside
    case 'childOfChild':
      return MESSAGES.planChildOfChild(refusal.parent)
    case 'childOfSaga':
      return MESSAGES.planChildOfSaga(refusal.parent)
    case 'hasChildren':
      return MESSAGES.planHasChildren(refusal.quest)
    case 'ownChild':
      return MESSAGES.planOwnChild
    case 'closedParent':
      return MESSAGES.planClosedParent(refusal.parent)
    case 'archiveActive':
      return MESSAGES.planArchiveActive(refusal.quest)
    case 'cantBeSaga':
      return refusal.why === 'child' ? MESSAGES.planCantBeSagaChild(refusal.quest) : MESSAGES.planCantBeSagaParent(refusal.quest)
    case 'linkSelf':
      return MESSAGES.planLinkSelf
    case 'loop':
      return MESSAGES.planLoop(refusal.quest, refusal.other)
    case 'closedWait':
      return MESSAGES.planClosedWait(refusal.other)
    case 'badTag':
      return MESSAGES.planBadTag
    case 'tooManyTags':
      return MESSAGES.planTooManyTags(refusal.quest)
    case 'closed':
      return MESSAGES.planClosed(refusal.quest)
    case 'engine':
      return inGameWords(refusal.text)
  }
}

// Every realm that reads. A broken record is counted, so the page can say
// what it left out.
export const readPlan = (d: TasksDeps): Promise<Reply<PlanView>> =>
  reply(d.log, MESSAGES.readPlan, async () => {
    const scanned = await scanRecords(d.host, d.home, d.log)
    const realms = scanned.flatMap(s => (s.kind === 'readable' ? [planRealmOf(s.key, s.record, budgetOf(s.key))] : []))

    return { realms, unreadable: scanned.length - realms.length }
  })

// One change to one realm, under its lock: whole, or refused saying why.
export const changePlan = (d: TasksDeps, key: unknown, input: unknown): Promise<Reply<PlanChanged>> =>
  reply(d.log, MESSAGES.changePlan, async () => {
    const change = planChangeOf(input)
    if (change === null) throw new Refusal(MESSAGES.badValue)
    const scope = await scopeOf(d, key)
    const ctx = { key: scope.key, budget: budgetOf(scope.key), now: isoLocal(d.now(), d.offsetMinutes()), newId: d.newId }
    let applied: Applied | null = null
    const saved = await scope.deps.records.update(record => {
      applied = applyPlanChange(record, change, ctx)

      return applied.kind === 'changed' ? applied.record : record
    })
    if (saved === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)
    const result = applied as Applied | null
    if (result === null) throw new Error('the plan change never ran')
    if (result.kind === 'refused') throw new Refusal(refusalText(result.refusal))

    return { view: await realmView(d, scope.key, saved), realm: planRealmOf(scope.key, saved, ctx.budget), undo: result.undo }
  })
