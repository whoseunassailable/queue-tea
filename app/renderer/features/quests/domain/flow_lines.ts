import type { ActiveQuest, SessionState, StartStep } from '../../../../shared/engine_api'
import { t } from '../../../l10n/en'

// The working line for what Start is about to do.
export const stepLine = (step: StartStep): string => {
  if (step.kind === 'noRepo') return t.flow.settingOut

  return step.kind === 'switch' ? t.flow.switching(step.branch) : t.flow.making(step.branch, step.from)
}

// What the card says while a session has yet to act on what it was asked,
// or null when nothing waits on it.
export const askingLine = (active: ActiveQuest, session: SessionState): string | null => {
  if (active.asking === null) return null
  const isBegin = active.asking === 'begin'
  if (session === 'none') return isBegin ? t.flow.takesWhenOpen : t.flow.noSessionToSave
  if (session === 'working') return isBegin ? t.flow.takesWhenTurnEnds : t.flow.savesWhenTurnEnds

  return isBegin ? t.flow.handing : t.flow.saving
}
