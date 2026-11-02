import type { Priority } from '../../../../../../types'
import type { EngineApi, NewQuest, QuestEdit, QuestRow, Seal } from '../../../../../shared/engine_api'
import { t } from '../../../../l10n/en'
import type { Workspace } from '../../../workspace/state_management/workspace_store'
import { withoutQuest, withPlayNext, withPriority } from '../../domain/edits'

// Every edit to a realm, as the screens ask for it. The ones a form makes stay
// quiet on failure, because the form shows the error beside its fields.
export const questEdits = (engine: EngineApi, workspace: Workspace) => ({
  setPriority: (key: string, quest: QuestRow, priority: Priority) =>
    workspace.run({
      key,
      questId: quest.id,
      preview: withPriority(quest.id, priority),
      call: () => engine.setPriority(key, quest.id, priority),
      said: t.edit.priority(t.priority[quest.priority], t.priority[priority], quest.title),
      undo: { said: t.edit.undone, call: () => engine.setPriority(key, quest.id, quest.priority) },
    }),

  togglePlayNext: (key: string, quest: QuestRow) =>
    workspace.run({
      key,
      preview: withPlayNext(quest.id),
      call: () => engine.togglePlayNext(key, quest.id),
      said: quest.isPlayNext ? t.edit.playNextOff(quest.title) : t.edit.playNextOn(quest.title),
      undo: { said: t.edit.undone, call: () => engine.togglePlayNext(key, quest.id) },
    }),

  remove: (key: string, quest: QuestRow) =>
    workspace.run({
      key,
      preview: withoutQuest(quest.id),
      call: () => engine.removeQuest(key, quest.id),
      said: t.edit.removed(quest.title),
      undo: { said: t.edit.undone, call: () => engine.restoreQuest(key, quest.id) },
    }),

  // A saga's chapters change, so it asks first and has no Undo.
  removeSaga: (key: string, quest: QuestRow) =>
    workspace.run({ key, call: () => engine.removeQuest(key, quest.id), said: t.edit.removed(quest.title), isQuiet: true }),

  unseal: (key: string, quest: QuestRow) => workspace.run({ key, call: () => engine.unsealQuest(key, quest.id), said: t.edit.unsealed(quest.title) }),

  seal: (key: string, quest: QuestRow, seal: Seal) =>
    workspace.run({
      key,
      call: () => engine.sealQuest(key, quest.id, seal),
      said: t.edit.sealed(quest.title),
      undo: { said: t.edit.undone, call: () => engine.unsealQuest(key, quest.id) },
      isQuiet: true,
    }),

  move: (key: string, quest: QuestRow, parentId: string | null, parentTitle: string | null) =>
    workspace.run({
      key,
      call: () => engine.moveQuest(key, quest.id, parentId),
      said: parentTitle === null ? t.edit.alone(quest.title) : t.edit.moved(parentTitle, quest.title),
      undo: { said: t.edit.undone, call: () => engine.moveQuest(key, quest.id, quest.parentId) },
      isQuiet: true,
    }),

  file: (key: string, quest: NewQuest, sagaTitle: string | null, isQuiet = true) =>
    workspace.run({
      key,
      call: () => engine.fileQuest(key, quest),
      said: t.edit.queued(quest.title, t.priority[quest.priority], sagaTitle),
      isQuiet,
    }),

  edit: (key: string, quest: QuestRow, edit: QuestEdit) =>
    workspace.run({ key, questId: quest.id, call: () => engine.editQuest(key, quest.id, edit) }),

  setActiveSaga: (key: string, quest: QuestRow | null) =>
    workspace.run({
      key,
      call: () => engine.setActiveSaga(key, quest?.id ?? null),
      said: quest === null ? t.edit.sagaOff : t.edit.sagaOn(quest.title),
    }),
})

export type QuestEdits = ReturnType<typeof questEdits>
