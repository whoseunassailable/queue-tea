import type { Ctx } from '../../../../core/env/env'
import { debug } from '../../../../core/logger/logger'
import type { Ports } from '../../../../core/ports/ports'
import { live } from '../../../../core/session/live'
import type { ProjectRecord, Task } from '../../../../../types'
import { suggest } from '../../../backlog/domain/services/ranking'
import { recordsRepositoryOf } from '../../records_providers'

// The menu's failed state, with why the record can't be read and whether
// its last good copy can take its place. Nothing is written to it.
export const markUnreadable = async (p: Ports, ctx: Ctx): Promise<void> => {
  try {
    await p.set('loadError', await recordsRepositoryOf(p, ctx).problem())
  } catch (err) {
    p.log(`reading why the record can't be read failed: ${err instanceof Error ? err.message : String(err)}`)
    await p.set('loadError', null)
  }
  await p.set('load', 'failed')
}

// Changes the record; on an unreadable one says so in the panel and changes
// nothing. Returns the record as saved, or null.
export const change = async (p: Ports, ctx: Ctx, fn: (r: ProjectRecord) => ProjectRecord) => {
  const saved = await recordsRepositoryOf(p, ctx).update(fn)
  if (saved === 'unreadable') {
    await markUnreadable(p, ctx)

    return null
  }
  await p.set('record', saved)

  return saved
}

export const changeTask = (p: Ports, ctx: Ctx, id: string, fn: (t: Task) => Task) =>
  change(p, ctx, r => ({ ...r, tasks: r.tasks.map(t => (t.id === id ? fn(t) : t)) }))

export async function loadRecord(p: Ports) {
  const ctx = live.ctx
  if (ctx === null) {
    await p.set('load', 'failed')

    return
  }
  await p.set('load', 'loading')
  try {
    const record = await recordsRepositoryOf(p, ctx).read()
    if (record === 'unreadable') {
      await markUnreadable(p, ctx)

      return
    }
    await p.set('record', record)
    await p.set('loadError', null)
    await p.set('load', 'ready')
  } catch (err) {
    debug(p, 'reading the record failed', err)
    await p.set('load', 'failed')

    return
  }
  try {
    await p.set('others', await recordsRepositoryOf(p, ctx).others(r => suggest(r, null)?.title ?? null))
  } catch (err) {
    debug(p, "reading the other projects' records failed", err)
  }
}

export async function changeRecord(p: Ports, fn: (r: ProjectRecord) => ProjectRecord) {
  const ctx = live.ctx
  if (ctx === null) return
  try {
    await change(p, ctx, fn)
  } catch (err) {
    debug(p, 'writing the record failed', err)
  }
}
