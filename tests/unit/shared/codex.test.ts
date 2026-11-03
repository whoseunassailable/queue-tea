import { expect, test } from 'claude-code/testing'

import { readCodexActivity } from '../../../hooks/shared/codex/data/datasources/codex_log_source'
import { memoryHost } from '../../helpers'

const SINCE = Date.parse('2026-10-21T06:00:00Z')
const NOW = Date.parse('2026-10-21T07:12:00Z')
const SESSIONS = '/h/.codex/sessions'

// Lines the way Codex writes them: the timestamp first, the session's folder
// in the first line's payload.
const session = (cwd: string, stamps: string[]) =>
  [
    JSON.stringify({ timestamp: stamps[0], type: 'session_meta', payload: { id: 's', timestamp: stamps[0], cwd } }),
    ...stamps.slice(1).map(at => JSON.stringify({ timestamp: at, type: 'event_msg', payload: { type: 'agent_message' } })),
    '',
  ].join('\n')

// Codex's log in memory: each file with its text and when it last changed.
const codexLog = (files: Record<string, { text: string; modified: number }>) => {
  const mem = memoryHost({ files: Object.fromEntries(Object.entries(files).map(([path, f]) => [path, f.text])) })
  for (const path of Object.keys(files)) mem.dirs.add(path.slice(0, path.lastIndexOf('/')))
  mem.host.modifiedAt = async path => files[path]?.modified ?? null
  const reads: string[] = []
  const read = mem.host.read
  mem.host.read = async path => {
    reads.push(path)

    return read(path)
  }

  return { host: mem.host, reads }
}

test('only sessions run in the folder count, and only from the moment given', async () => {
  const { host } = codexLog({
    [`${SESSIONS}/2026/10/21/rollout-a.jsonl`]: { text: session('/p', ['2026-10-21T05:50:00Z', '2026-10-21T06:05:00Z', '2026-10-21T06:10:00Z']), modified: NOW },
    [`${SESSIONS}/2026/10/21/rollout-b.jsonl`]: { text: session('/elsewhere', ['2026-10-21T06:01:00Z', '2026-10-21T06:20:00Z']), modified: NOW },
  })

  const stamps = await readCodexActivity(host, '/h', '/p', SINCE, NOW)

  expect(stamps.sort()).toEqual([Date.parse('2026-10-21T06:05:00Z'), Date.parse('2026-10-21T06:10:00Z')])
})

test('a session last changed before the moment given is not opened', async () => {
  const old = `${SESSIONS}/2026/10/21/rollout-old.jsonl`
  const { host, reads } = codexLog({ [old]: { text: session('/p', ['2026-10-21T05:00:00Z', '2026-10-21T05:30:00Z']), modified: SINCE - 1 } })

  expect(await readCodexActivity(host, '/h', '/p', SINCE, NOW)).toEqual([])
  expect(reads).toEqual([])
})

test('a first line Codex has not finished writing is skipped, and the other sessions still count', async () => {
  const { host } = codexLog({
    [`${SESSIONS}/2026/10/21/rollout-new.jsonl`]: { text: '{"timestamp":"2026-10-21T06:30:00Z","type":"session_me', modified: NOW },
    [`${SESSIONS}/2026/10/21/rollout-a.jsonl`]: { text: session('/p', ['2026-10-21T06:05:00Z']), modified: NOW },
  })

  expect(await readCodexActivity(host, '/h', '/p', SINCE, NOW)).toEqual([Date.parse('2026-10-21T06:05:00Z')])
})

test('files that are not sessions are passed over', async () => {
  const { host } = codexLog({ [`${SESSIONS}/2026/10/21/notes.txt`]: { text: session('/p', ['2026-10-21T06:05:00Z']), modified: NOW } })

  expect(await readCodexActivity(host, '/h', '/p', SINCE, NOW)).toEqual([])
})

test('days with no Codex folder are passed over, and no Codex at all reads as nothing', async () => {
  const { host } = codexLog({ [`${SESSIONS}/2026/10/21/rollout-a.jsonl`]: { text: session('/p', ['2026-10-21T06:05:00Z']), modified: NOW } })

  expect(await readCodexActivity(host, '/h', '/p', SINCE, NOW)).toEqual([Date.parse('2026-10-21T06:05:00Z')])
  expect(await readCodexActivity(codexLog({}).host, '/h', '/p', SINCE, NOW)).toEqual([])
})

test('a session started the day before, in the folder of that day, counts from the moment given', async () => {
  const { host } = codexLog({
    [`${SESSIONS}/2026/10/20/rollout-a.jsonl`]: { text: session('/p', ['2026-10-20T23:00:00Z', '2026-10-21T05:00:00Z', '2026-10-21T06:05:00Z']), modified: NOW },
  })

  expect(await readCodexActivity(host, '/h', '/p', SINCE, NOW)).toEqual([Date.parse('2026-10-21T06:05:00Z')])
})

test('east of UTC, a session started after local midnight on the last day counts', async () => {
  // Codex names its folders by local date. At +02:00, 22:10Z on the 22nd is
  // 00:10 on the 23rd, so the session is in the 23rd's folder.
  const since = Date.parse('2026-10-21T23:00:00Z')
  const now = Date.parse('2026-10-22T22:30:00Z')
  const { host } = codexLog({
    [`${SESSIONS}/2026/10/23/rollout-a.jsonl`]: { text: session('/p', ['2026-10-22T22:10:00Z', '2026-10-22T22:20:00Z']), modified: now },
  })

  expect(await readCodexActivity(host, '/h', '/p', since, now)).toEqual([Date.parse('2026-10-22T22:10:00Z'), Date.parse('2026-10-22T22:20:00Z')])
})

test('a session file that cannot be read fails the whole read, so its time is not quietly lost', async () => {
  const file = `${SESSIONS}/2026/10/21/rollout-a.jsonl`
  const { host } = codexLog({ [file]: { text: session('/p', ['2026-10-21T06:05:00Z']), modified: NOW } })
  host.read = async () => {
    throw new Error('EACCES')
  }

  await expect(readCodexActivity(host, '/h', '/p', SINCE, NOW)).rejects.toThrow('EACCES')
})
