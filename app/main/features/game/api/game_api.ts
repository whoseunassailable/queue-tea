import type { Host } from '../../../../../hooks/core/host/host'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import { isFresh } from '../../../../../hooks/shared/sessions/domain/services/session_rules'
import type { GameView, HoardView, Reply } from '../../../../shared/engine_api'
import type { Logger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { reply } from '../../../core/reply'
import { scanRecords } from '../../projects/data/projects_source'
import { gameOf } from '../domain/services/game'

export type GameDeps = { host: Host; home: string; now: () => number; offsetMinutes: () => number; log: Logger }

// The game over every record that reads, and the mana from the newest session
// that knows it. A broken record costs its own victories until it reads again.
export const readGame = (d: GameDeps): Promise<Reply<GameView>> =>
  reply(d.log, MESSAGES.readGame, async () => {
    const now = d.now()
    const records = (await scanRecords(d.host, d.home, d.log)).flatMap(s => (s.kind === 'readable' ? [s.record] : []))
    const sessions = await sessionsRepositoryImpl(d.host, d.home).list()
    const withMana = sessions.filter(s => isFresh(s, now) && s.allowance !== null).sort((a, b) => b.heartbeat - a.heartbeat)

    return { ...gameOf(records, d.offsetMinutes(), now), allowance: withMana[0]?.allowance ?? null }
  })

// Gold by realm lists every record that reads, so one with no victories shows 0.
export const readHoard = (d: GameDeps): Promise<Reply<HoardView>> =>
  reply(d.log, MESSAGES.readHoard, async () => {
    const now = d.now()
    const offset = d.offsetMinutes()
    const scanned = await scanRecords(d.host, d.home, d.log)
    const readable = scanned.flatMap(s => (s.kind === 'readable' ? [s] : []))
    const realms = readable.map(({ key, record }) => {
      const { victories, gold } = gameOf([record], offset, now)

      return { key, name: record.project.name, victories, gold }
    })

    return { game: gameOf(readable.map(s => s.record), offset, now), realms: realms.sort((a, b) => b.gold - a.gold), unreadable: scanned.length - readable.length }
  })
