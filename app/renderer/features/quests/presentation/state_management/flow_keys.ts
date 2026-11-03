import type { Platform } from '../../../../../../types'
import type { ActiveQuest, ProjectView } from '../../../../../shared/engine_api'
import type { QuestFlow } from '../../../workspace/state_management/workspace_store'
import type { QuestKey } from './quest_keys'

type Named = { id: string; title: string }

// What the cards, the pages and the keys can ask of the quest in hand.
export type QuestActions = {
  onStart: (quest: Named, platform?: Platform) => void
  onContinueIn: (quest: ActiveQuest, platform: Platform) => void
  onFinish: (quest: ActiveQuest) => void
  onBack: (quest: ActiveQuest) => void
  onBackNow: (quest: ActiveQuest) => void
  onSealActive: (quest: ActiveQuest) => void
  onNotYet: (quest: ActiveQuest) => void
  onOpenClaude: () => void
  onCheckAgain: () => void
  onCancel: () => void
  onCopy: (text: string) => void
  onStepBudget: () => void
}

type Readable = Extract<ProjectView, { kind: 'readable' }>

// Acts on a key meant for the quest in hand, on either page, and says whether
// it was one. Keys for something that can't happen now do nothing.
export const runFlowKey = (key: QuestKey, view: Readable, flow: QuestFlow | undefined, actions: QuestActions): boolean => {
  const { active } = view
  const isFree = active !== null && active.asking !== 'putBack'
  if (key.kind === 'checkAgain') {
    if (flow?.kind === 'held' || flow?.kind === 'refused') actions.onCheckAgain()
  } else if (key.kind === 'cancel') {
    if (flow !== undefined) actions.onCancel()
  } else if (key.kind === 'open') {
    if (active !== null) actions.onOpenClaude()
  } else if (key.kind === 'finish') {
    if (isFree) actions.onFinish(active)
  } else if (key.kind === 'back') {
    if (isFree) actions.onBack(active)
  } else if (key.kind === 'yes') {
    if (active?.review != null) actions.onFinish(active)
  } else if (key.kind === 'notYet') {
    if (active?.review != null) actions.onNotYet(active)
  } else if (key.kind === 'time') actions.onStepBudget()
  else return false

  return true
}
