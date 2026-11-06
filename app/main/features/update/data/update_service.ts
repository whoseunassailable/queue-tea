import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { AppIdentity, AppUpdate } from '../../../../shared/update'
import { changedBuild } from '../../../../shared/update'
import { queuePublished, readUpdate, updateFolder } from '../../../../tools/update_runner.mjs'
import type { PublishedRequest } from '../../../../tools/update_runner.mjs'
import type { Logger } from '../../../core/logger'
import { UPDATE_TEXT } from '../../../core/messages'

type Deps = { running: AppIdentity; repository: string | undefined; enabled: boolean; tools: string; isBusy: () => Promise<boolean>; installed: () => Promise<AppIdentity | null>; restart: () => Promise<void>; log: Logger }
export const updateService = (d: Deps) => {
  let pending: PublishedRequest | null = null
  const queue = async (request: PublishedRequest, retry = false) => {
    try {
      await queuePublished(request, { repository: d.repository, tools: d.tools, retry })
      pending = null
    } catch (err) {
      d.log.error('starting the acknowledged update failed', err)
      pending = request
    }
  }
  const read = async (): Promise<AppUpdate> => {
    const saved = d.enabled && !pending ? await readUpdate() : null
    const state = pending ? { phase: 'failed' as const, commit: pending.commit, detail: UPDATE_TEXT.startFailed } : saved && saved.repository === d.repository ? saved : { phase: 'idle' as const, commit: null, detail: null }
    const installed = d.enabled ? await d.installed() : null
    // A later push's build never touches the installed app until it swaps in, so only that swap holds a restart back.
    const canRestart = changedBuild(d.running, installed) && !(await d.isBusy()) && state.phase !== 'installing'
    return { running: d.running, installed, state, canRestart, canRetry: d.enabled && state.phase === 'failed' }
  }
  return {
    read,
    published: async (repo: string, remote: string, branch: string, commit: string) => {
      if (!d.enabled || !d.repository) return
      await queue({ repo, remote, branch, commit })
    },
    apply: async (): Promise<AppUpdate> => {
      const state = await read()
      // The button reads "Retry update" while a build failed, so a retry goes first; a restart here would drop an unsaved request.
      if (state.canRetry && d.repository) {
        const request: PublishedRequest = pending ?? JSON.parse(await readFile(join(updateFolder(), 'request.json'), 'utf8'))
        if (!pending && request.repository !== d.repository) throw new Error('The update request belongs to another repository.')
        await queue(request, true)
      } else if (state.canRestart) await d.restart()
      return read()
    },
  }
}
