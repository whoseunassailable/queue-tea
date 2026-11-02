import { mkdtemp, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createLogger } from './logger'
import { hasChanged, watchFolders } from './watcher'

const log = createLogger('prod', () => {})
let dir: string
let stop: () => void = () => {}

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'queue-tea-watch-'))
})
afterEach(async () => {
  stop()
  await rm(dir, { recursive: true, force: true })
})

describe('hasChanged', () => {
  it('sees a new, a gone and a rewritten file, and nothing else', () => {
    expect(hasChanged({ a: 1 }, { a: 1 })).toBe(false)
    expect(hasChanged({ a: 1 }, { a: 2 })).toBe(true)
    expect(hasChanged({ a: 1 }, { a: 1, b: 1 })).toBe(true)
    expect(hasChanged({ a: 1, b: 1 }, { a: 1 })).toBe(true)
  })
})

describe('watchFolders', () => {
  it('makes a folder that is not there yet', async () => {
    stop = await watchFolders([join(dir, 'new')], () => {}, { settleMs: 5, sweepMs: 1000, log })

    await expect(writeFile(join(dir, 'new', 'x.json'), '{}')).resolves.toBeUndefined()
  })

  it('sees an atomic replace, and only once for a burst', async () => {
    const file = join(dir, 'r.json')
    await writeFile(file, '{}')
    const changed = vi.fn()
    stop = await watchFolders([dir], changed, { settleMs: 30, sweepMs: 10_000, log })

    await writeFile(`${file}.tmp`, '{"a":1}')
    await rename(`${file}.tmp`, file)

    await vi.waitFor(() => expect(changed).toHaveBeenCalledTimes(1))
    await new Promise(done => setTimeout(done, 80))
    expect(changed).toHaveBeenCalledTimes(1)
  })

  it('stays quiet when an event changes nothing', async () => {
    const changed = vi.fn()
    await writeFile(join(dir, 'r.json'), '{}')
    stop = await watchFolders([dir], changed, { settleMs: 5, sweepMs: 20, log })

    await new Promise(done => setTimeout(done, 70))

    expect(changed).not.toHaveBeenCalled()
  })

  it('the sweep catches what the events miss', async () => {
    const changed = vi.fn()
    stop = await watchFolders([dir], changed, { settleMs: 100_000, sweepMs: 20, log })

    await writeFile(join(dir, 'late.json'), '{}')

    await vi.waitFor(() => expect(changed).toHaveBeenCalled())
  })
})
