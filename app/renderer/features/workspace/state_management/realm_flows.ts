import type { EngineApi, FolderPick, Opened } from '../../../../shared/engine_api'
import { ask } from '../../../core/api/engine_client'
import type { Answer } from '../../../core/api/engine_client'
import { t } from '../../../l10n/en'
import type { Workspace } from './workspace_store'

// Adding a realm and putting a broken one right.
export const realmFlows = (engine: EngineApi, workspace: Workspace) => {
  const sayFailed = (message: string) => workspace.say({ tone: 'error', text: message })

  return {
    // The folder to ask about, or null when there's nothing to ask: the dialog
    // was cancelled, or Queue-tea knows it already and has gone there.
    openFolder: async (): Promise<FolderPick | null> => {
      const answer = await ask(engine, () => engine.openFolder())
      if (!answer.ok) {
        sayFailed(answer.message)

        return null
      }
      if (answer.data === null || !answer.data.isKnown) return answer.data
      await workspace.pick(answer.data.key)

      return null
    },

    add: async (path: string, isDetected = false): Promise<Answer<string>> => {
      const answer = await ask(engine, () => engine.addProject(path))
      if (!answer.ok) return answer
      await workspace.refresh()
      await workspace.pick(answer.data)
      if (isDetected) workspace.setDetected(answer.data)

      return answer
    },

    // A link or a notification. An unknown folder comes back to be asked about:
    // nothing is added on a link's word.
    arrived: async (opened: Opened, onAsk: (pick: FolderPick) => void, onHome: () => void): Promise<void> => {
      if (opened.kind === 'failed') sayFailed(opened.message)
      else if (opened.kind === 'judgement') {
        await workspace.pick(opened.key)
        onHome()
      } else if (opened.pick.isKnown) {
        workspace.setDetected(opened.pick.key)
        await workspace.pick(opened.pick.key)
      } else onAsk(opened.pick)
    },

    install: async (): Promise<boolean> => {
      const answer = await ask(engine, () => engine.installCommand())
      if (!answer.ok) sayFailed(answer.message)
      else workspace.say({ tone: answer.data.needsPath ? 'warning' : 'success', text: answer.data.needsPath ? t.settings.installedPath(answer.data.path) : t.settings.installed(answer.data.path) })

      return answer.ok
    },

    takeWaiting: async (onEach: (opened: Opened) => void): Promise<void> => {
      const answer = await ask(engine, () => engine.takeOpened())
      if (answer.ok) answer.data.forEach(opened => onEach(opened))
      else sayFailed(answer.message)
    },

    show: async (key: string): Promise<void> => {
      const answer = await ask(engine, () => engine.showRecord(key))
      if (!answer.ok) sayFailed(answer.message)
    },

    restore: async (key: string): Promise<void> => {
      const answer = await ask(engine, () => engine.restoreRealm(key))
      if (!answer.ok) {
        sayFailed(answer.message)

        return
      }
      workspace.say({ tone: 'success', text: t.failedRecord.restored(answer.data) })
      await workspace.refresh()
    },
  }
}

export type RealmFlows = ReturnType<typeof realmFlows>
