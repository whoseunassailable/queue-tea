import { activeFeature, parentOf } from '../../../../shared/backlog/domain/services/families'
import type { Deps } from './deps'

export type FeatureFound = { kind: 'say'; text: string } | { kind: 'set'; taskId: string | null }

// /feature: with nothing after it, says which feature is active; "off" (or
// "clear", "none") clears it; otherwise the words pick an open task on its
// own, by its id or its title.
export const findFeatureUseCase = async (d: Deps, args: string): Promise<FeatureFound> => {
  const words = args.trim()
  const record = await d.records.read()
  if (record === 'unreadable') return { kind: 'say', text: "Couldn't read the task record." }
  if (words === '') {
    const feature = activeFeature(record)

    return {
      kind: 'say',
      text:
        feature === null
          ? 'No active feature. /feature <title of a task> sets one; /feature off clears it.'
          : `Active feature: ${feature.title}. /feature off clears it.`,
    }
  }
  if (/^(off|clear|none)$/i.test(words)) return { kind: 'set', taskId: null }

  const said = words.toLowerCase()
  const open = record.tasks.filter(t => (t.state === 'queued' || t.state === 'current') && parentOf(t, record.tasks) === null)
  const byId = open.filter(t => t.id === words)
  const exact = open.filter(t => t.title.toLowerCase() === said)
  const found = byId.length > 0 ? byId : exact.length > 0 ? exact : open.filter(t => t.title.toLowerCase().includes(said))
  if (found.length === 1) return { kind: 'set', taskId: found[0]!.id }
  if (found.length > 1) return { kind: 'say', text: `Several tasks match: ${found.map(t => t.title).join('; ')}. Use more of the title.` }

  return { kind: 'say', text: `No open task matches "${words}". File it first with /steep, then /feature <its title>.` }
}
