import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { emptyRecord, parseRecord, updateRecord } from '../../../hooks/shared/records/data/datasources/record_source'
import { createLogger } from './logger'
import { isForbiddenGit, nodeHost } from './node_host'

const log = createLogger('prod', () => {})
const host = nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' }))
let dir: string

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'queue-tea-host-'))
})
afterEach(() => rm(dir, { recursive: true, force: true }))

describe('the rule on git', () => {
  it.each([
    [['git', 'commit', '-m', 'x']],
    [['git', 'push']],
    [['git', 'merge', 'main']],
    [['git', 'pull']],
    [['git', '-C', '/p', 'commit']],
    [['git', '-c', 'a=b', 'push']],
    [['git', '--no-pager', 'pull']],
  ])('refuses %j', argv => {
    expect(isForbiddenGit(argv)).toBe(true)
  })

  it.each([[['git', 'status']], [['git', 'switch', '-c', 'task/commit']], [['git', 'log', '--grep', 'push']], [['ls', 'commit']]])('lets %j through', argv => {
    expect(isForbiddenGit(argv)).toBe(false)
  })

  it('never starts a refused command', async () => {
    const ran = await host.run(['git', 'commit', '-m', 'x'], dir)

    expect(ran.exitCode).toBe(1)
    expect(ran.stderr).toContain('yours to make')
  })
})

describe('the record, on real files', () => {
  it('two writers at once lose neither change', async () => {
    const file = `${dir}/projects/p-000000.json`
    const add = (id: string) =>
      updateRecord(host, file, r => ({ ...r, requests: [...r.requests, { id, kind: 'begin', taskId: 't', at: 'x' }] }), 'p', '/p')

    await Promise.all(['a', 'b', 'c', 'd', 'e', 'f'].map(add))

    const read = parseRecord(await readFile(file, 'utf8'))
    if (read === 'unreadable') throw new Error('should read')
    expect(read.requests.map(q => q.id).sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
    expect(await host.exists(`${file}.lock`)).toBe(false)
  })

  it('keeps the last good copy beside the record', async () => {
    const file = `${dir}/p.json`
    await writeFile(file, JSON.stringify(emptyRecord('p', '/p')))

    await updateRecord(host, file, r => ({ ...r, playNext: 'x' }), 'p', '/p')

    expect(JSON.parse(await readFile(`${file}.bak`, 'utf8')).playNext).toBe(null)
  })
})

describe('the file calls', () => {
  it('a lock folder can be taken once', async () => {
    const lock = join(dir, 'x.lock')

    expect((await host.makeDir(lock)).exitCode).toBe(0)
    expect((await host.makeDir(lock)).exitCode).not.toBe(0)
    expect((await host.removeDir(lock)).exitCode).toBe(0)
  })

  it('a missing folder lists as empty and a missing file has no time', async () => {
    expect(await host.list(join(dir, 'none'))).toEqual([])
    expect(await host.modifiedAt(join(dir, 'none'))).toBe(null)
  })

  it('a command that fails says so rather than throwing', async () => {
    const ran = await host.run(['no-such-command-here'])

    expect(ran.exitCode).not.toBe(0)
    expect(ran.stderr).not.toBe('')
  })
})
