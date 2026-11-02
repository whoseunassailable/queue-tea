import { dayKey } from '../../../../../hooks/shared/time/domain/services/time'
import type { ChronicleView, Reply } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import type { GameDeps } from '../../game/api/game_api'
import { isProjectKey } from '../../projects/api/projects_api'
import { scanRecords } from '../../projects/data/projects_source'
import { chronicleOf } from '../domain/chronicle'

const DAY = /^\d{4}-\d{2}-\d{2}$/

// One realm, or every realm that reads when `scope` is null. A broken record is
// counted, so the page can say what it left out.
export const readChronicle = (d: GameDeps, scope: unknown, day: unknown): Promise<Reply<ChronicleView>> =>
  reply(d.log, MESSAGES.readChronicle, async () => {
    if (scope !== null && !isProjectKey(scope)) throw new Refusal(MESSAGES.unknownProject)
    if (day !== null && (typeof day !== 'string' || !DAY.test(day))) throw new Refusal(MESSAGES.badValue)

    const scanned = (await scanRecords(d.host, d.home, d.log)).filter(s => scope === null || s.key === scope)
    if (scope !== null && scanned.length === 0) throw new Refusal(MESSAGES.unknownProject)
    const records = scanned.flatMap(s => (s.kind === 'readable' ? [s.record] : []))
    const today = dayKey(d.now(), d.offsetMinutes())

    return { ...chronicleOf(records, day ?? today, today), unreadable: scanned.length - records.length }
  })
