import { expect, test } from 'claude-code/testing'

import { beat, endBeat } from '../../../../hooks/app/session/session_beat'
import { live } from '../../../../hooks/core/session/live'
import { readSessions, removeSessionFile, writeSessionFile } from '../../../../hooks/shared/sessions/data/datasources/session_source'
import type { SessionFile } from '../../../../hooks/shared/sessions/domain/entities/session_file'
import { isFresh, parseSession, sessionPath, sessionsFolder, STALE_MS } from '../../../../hooks/shared/sessions/domain/services/session_rules'
import { CTX, fakePorts, makeTask, memoryHost } from '../../../helpers'

const session = (over: Partial<SessionFile> = {}): SessionFile => ({
  id: 's-1',
  projectPath: '/p',
  recordFile: CTX.file,
  currentTaskId: null,
  isTurnRunning: false,
  cup: { mood: 'idle', line: '' },
  allowance: null,
  options: CTX.options,
  heartbeat: 1000,
  startedAt: 1000,
  ...over,
})

const fresh = () => {
  live.ctx = CTX
  live.isTurnRunning = false
  live.sessionId = null
  live.startedAt = null
}

test('a session is fresh up to 90 s and stale past it', () => {
  expect(STALE_MS).toBe(90_000)
  expect(isFresh(session({ heartbeat: 0 }), 90_000)).toBe(true)
  expect(isFresh(session({ heartbeat: 0 }), 90_001)).toBe(false)
})

test('a file that is not a session reads as none', () => {
  expect(parseSession('{half')).toBe(null)
  expect(parseSession('{"id":"s"}')).toBe(null)
  expect(parseSession(JSON.stringify(session()))?.id).toBe('s-1')
})

test('a session file is written through a temp file, read and removed', async () => {
  const mem = memoryHost()

  await writeSessionFile(mem.host, '/h', session())

  expect(mem.writes).toEqual([`${sessionPath('/h', 's-1')}.tmp`])
  expect((await readSessions(mem.host, '/h')).map(s => s.id)).toEqual(['s-1'])
  await removeSessionFile(mem.host, '/h', 's-1')
  expect(await readSessions(mem.host, '/h')).toEqual([])
})

test('an unreadable session file is skipped, the rest still read', async () => {
  const folder = sessionsFolder('/h')
  const mem = memoryHost({ files: { [`${folder}/bad.json`]: '{nope', [`${folder}/s-1.json`]: JSON.stringify(session()) } })

  expect((await readSessions(mem.host, '/h')).map(s => s.id)).toEqual(['s-1'])
})

test('a beat writes where the session is, and its current task', async () => {
  fresh()
  const current = makeTask({ state: 'current' })
  const mem = memoryHost()
  const { ports } = fakePorts(mem, { view: { record: { version: 1, project: { name: 'p', path: '/p' }, docsLogPath: null, playNext: null, feature: null, tasks: [current], unassignedMinutesByDay: {}, requests: [] } } })

  await beat(ports)

  const written = parseSession(mem.files.get(sessionPath('/h', 's-1'))!)
  expect(written).toMatchObject({ id: 's-1', projectPath: '/p', recordFile: CTX.file, currentTaskId: current.id, isTurnRunning: false })
  expect(written?.heartbeat).toBe(Date.parse('2026-10-21T07:12:00Z'))
  expect(written?.options).toEqual(CTX.options)
})

test('a beat under a new id, after a /clear, removes the old file', async () => {
  fresh()
  const mem = memoryHost()
  const { ports } = fakePorts(mem)
  await beat(ports)
  ports.session.id = async () => 's-2'

  await beat(ports)

  expect(mem.files.has(sessionPath('/h', 's-1'))).toBe(false)
  expect(mem.files.has(sessionPath('/h', 's-2'))).toBe(true)
})

test('the session file goes at the session end', async () => {
  fresh()
  const mem = memoryHost()
  const { ports } = fakePorts(mem)
  await beat(ports)

  await endBeat(ports)

  expect(mem.files.has(sessionPath('/h', 's-1'))).toBe(false)
})

test('the first beat clears what crashed sessions left, and leaves live ones', async () => {
  fresh()
  const now = Date.parse('2026-10-21T07:12:00Z')
  const mem = memoryHost({
    files: {
      [sessionPath('/h', 'crashed')]: JSON.stringify(session({ id: 'crashed', heartbeat: now - STALE_MS - 1 })),
      [sessionPath('/h', 'alive')]: JSON.stringify(session({ id: 'alive', heartbeat: now })),
    },
  })
  const { ports } = fakePorts(mem)

  await beat(ports)

  expect(mem.files.has(sessionPath('/h', 'crashed'))).toBe(false)
  expect(mem.files.has(sessionPath('/h', 'alive'))).toBe(true)
})

test('a beat that cannot write leaves the session going', async () => {
  fresh()
  const mem = memoryHost()
  mem.host.write = async () => {
    throw new Error('disk full')
  }
  const { ports, done } = fakePorts(mem)

  await beat(ports)

  expect(done.logs.some(line => line.includes('session file'))).toBe(true)
})
