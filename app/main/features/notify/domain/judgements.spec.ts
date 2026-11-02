import { describe, expect, it, vi } from 'vitest'

import type { Task } from '../../../../../types'
import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Scanned } from '../../projects/data/projects_source'
import { makeTask } from '../../tasks/api/fixtures'
import { askedOf, judgementWatch } from './judgements'

const realm = (key: string, tasks: Task[]): Scanned => ({ kind: 'readable', key, file: `/f/${key}.json`, modifiedAt: 0, record: { ...emptyRecord(key, `/p/${key}`), tasks } })
const broken: Scanned = { kind: 'unreadable', key: 'bad-000001', file: '/f/bad.json', name: 'bad', reason: 'no', isNewer: false, canRestore: false, modifiedAt: 0 }
const asking = (id: string, at = '2026-10-27T18:00:00+01:00') => makeTask({ id, title: `Quest ${id}`, state: 'current', review: { at, checked: null } })

const setup = (first: Scanned[] = []) => {
  let scanned = first
  let isAway = true
  const notify = vi.fn()
  const log = { error: vi.fn() }
  const check = judgementWatch({ scan: async () => scanned, isAway: () => isAway, notify, log })

  return { check, notify, log, show: (next: Scanned[]) => void (scanned = next), away: (value: boolean) => void (isAway = value) }
}

describe('who is asking', () => {
  it('finds the active quest asking, in any realm', () => {
    expect(askedOf([realm('a', [asking('one')]), realm('b', [makeTask({ id: 'two', state: 'current' })])])).toEqual([{ key: 'a', taskId: 'one', title: 'Quest one', at: '2026-10-27T18:00:00+01:00' }])
  })

  it('skips a record that doesn\'t read', () => {
    expect(askedOf([broken])).toEqual([])
  })
})

describe('the notification', () => {
  it('says nothing about what was already asked when the app opened', async () => {
    const { check, notify, log } = setup([realm('a', [asking('one')])])

    await check()

    expect(notify).not.toHaveBeenCalled()
    // Quiet because it knew to be, not because something fell over.
    expect(log.error).not.toHaveBeenCalled()
  })

  it('says once when Claude newly asks, in the background', async () => {
    const { check, notify, show } = setup([realm('a', [makeTask({ id: 'one', state: 'current' })])])
    await check()

    show([realm('a', [asking('one')])])
    await check()
    await check()

    expect(notify).toHaveBeenCalledTimes(1)
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ key: 'a', title: 'Quest one' }))
  })

  it('stays quiet with the app in front', async () => {
    const { check, notify, show, away } = setup()
    await check()
    away(false)

    show([realm('a', [asking('one')])])
    await check()

    expect(notify).not.toHaveBeenCalled()
  })

  it('doesn\'t bring it up later, once seen in front', async () => {
    const { check, notify, show, away } = setup()
    await check()
    away(false)
    show([realm('a', [asking('one')])])
    await check()

    away(true)
    await check()

    expect(notify).not.toHaveBeenCalled()
  })

  it('tells of a realm the window isn\'t showing', async () => {
    const { check, notify, show } = setup([realm('a', [])])
    await check()

    show([realm('a', []), realm('b', [asking('two')])])
    await check()

    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ key: 'b' }))
  })

  it('tells again when Claude asks again after Not yet', async () => {
    const { check, notify, show } = setup([realm('a', [makeTask({ id: 'one', state: 'current' })])])
    await check()
    show([realm('a', [asking('one', '2026-10-27T18:00:00+01:00')])])
    await check()
    show([realm('a', [makeTask({ id: 'one', state: 'current' })])])
    await check()

    show([realm('a', [asking('one', '2026-10-27T18:30:00+01:00')])])
    await check()

    expect(notify).toHaveBeenCalledTimes(2)
  })

  it('tells once when two changes land together', async () => {
    let release = () => {}
    const scans: Promise<void>[] = []
    let scanned: Scanned[] = []
    const notify = vi.fn()
    const check = judgementWatch({
      scan: async () => {
        if (scans.length === 1) {
          scans.push(new Promise(done => (release = done)))
          await scans[1]
        } else scans.push(Promise.resolve())

        return scanned
      },
      isAway: () => true,
      notify,
      log: { error: vi.fn() },
    })
    await check()
    scanned = [realm('a', [asking('one')])]

    const first = check()
    const second = check()
    release()
    await Promise.all([first, second])

    expect(notify).toHaveBeenCalledTimes(1)
  })

  it('logs a scan that fails, and carries on', async () => {
    const log = { error: vi.fn() }
    const scan = vi.fn<() => Promise<Scanned[]>>().mockRejectedValueOnce(new Error('disk')).mockResolvedValue([])
    const check = judgementWatch({ scan, isAway: () => true, notify: vi.fn(), log })

    await check()
    await check()

    expect(log.error).toHaveBeenCalledTimes(1)
    expect(scan).toHaveBeenCalledTimes(2)
  })
})
