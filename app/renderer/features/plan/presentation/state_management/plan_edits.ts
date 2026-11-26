import type { EngineApi, ProjectView, Reply } from '../../../../../shared/engine_api'
import type { PlanChange, PlanRealm, PlanSnapshot } from '../../../../../shared/plan'
import type { Answer } from '../../../../core/api/engine_client'
import { t } from '../../../../l10n/en'
import type { Workspace } from '../../../workspace/state_management/workspace_store'

// Every Plan change goes through the workspace, so it gets the same toast,
// Try again and Undo as any other edit. The realm it hands back shows at once.
export const planEdits = (engine: EngineApi, workspace: Workspace, adoptRealm: (realm: PlanRealm) => void) => {
  const send = async (key: string, change: PlanChange, keep: (undo: PlanSnapshot[]) => void): Promise<Reply<ProjectView>> => {
    const answer = await engine.changePlan(key, change)
    if (!answer.ok) return answer
    keep(answer.data.undo)
    adoptRealm(answer.data.realm)

    return { ok: true, data: answer.data.view }
  }

  const change = (key: string, plan: PlanChange, said: string, isQuiet = false): Promise<Answer<ProjectView>> => {
    let undo: PlanSnapshot[] = []

    return workspace.run({
      key,
      call: () => send(key, plan, kept => (undo = kept)),
      said,
      isQuiet,
      // Nothing changed means nothing to put back.
      undo: { said: t.edit.undone, call: () => (undo.length === 0 ? engine.readProject(key) : send(key, { kind: 'restore', quests: undo }, () => undefined)) },
    })
  }

  return { change }
}

export type PlanEdits = ReturnType<typeof planEdits>
