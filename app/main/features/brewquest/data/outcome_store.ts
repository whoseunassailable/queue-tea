import type { Host } from '../../../../../hooks/core/host/host'
import type { Logger } from '../../../core/logger'
import { keptOf, OUTCOME_LIMITS } from '../domain/brew_lessons'
import type { KeptOutcome } from '../domain/brew_lessons'

// One file a realm, beside the realms' records: ~/.queue-tea/brewquest/<key>.json.
export const outcomesFolder = (home: string): string => `${home}/.queue-tea/brewquest`
const pathOf = (home: string, key: string) => `${outcomesFolder(home)}/${key}.json`

export type OutcomeDeps = { host: Host; home: string; log: Logger }

// The realm's kept reviews; none when there's no file yet or it doesn't read,
// since learning only ever adds to a draft.
export const readOutcomes = async (d: OutcomeDeps, key: string): Promise<KeptOutcome[]> => {
  const path = pathOf(d.home, key)
  try {
    if (!(await d.host.exists(path))) return []

    return keptOf(JSON.parse(await d.host.read(path)))
  } catch (err) {
    d.log.warn(`brewquest outcomes at ${path} didn't read: ${String(err)}`)

    return []
  }
}

// Adds one review and keeps the last few, written whole and then moved into place.
export const keepOutcome = async (d: OutcomeDeps, key: string, outcome: KeptOutcome): Promise<void> => {
  const kept = [...(await readOutcomes(d, key)), outcome].slice(-OUTCOME_LIMITS.kept)
  const made = await d.host.makeDirs(outcomesFolder(d.home))
  if (made.exitCode !== 0) throw new Error(made.stderr)
  const path = pathOf(d.home, key)
  await d.host.write(`${path}.tmp`, `${JSON.stringify(kept, null, 2)}\n`)
  const moved = await d.host.move(`${path}.tmp`, path)
  if (moved.exitCode !== 0) throw new Error(moved.stderr)
  d.log.debug(`brewquest outcome kept: ${path}`)
}
