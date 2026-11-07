import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { emptyRecord, parseRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Reply } from '../../../../shared/engine_api'
import type { NoteChange, NotesView } from '../../../../shared/notes'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { notesApi } from './notes_api'
import type { NotesDeps } from './notes_api'

const KEY = 'demo-abc123'
const NOW = Date.parse('2026-11-07T12:00:00Z')

let home: string
let dir: string
let api: ReturnType<typeof notesApi>
let deps: NotesDeps
let ids: number
const revealed: string[] = []

const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const refused = <T>(answer: Reply<T>): string => {
  if (answer.ok) throw new Error('should be refused')

  return answer.error.message
}
const change = (over: Partial<NoteChange> = {}): NoteChange => ({ title: 'Plan', folder: 'Ideas', type: null, isPinned: false, tags: [], body: 'Body', ...over })
const created = async (over: Partial<NoteChange> = {}) => data(await api.createNote(KEY, change(over)))
const only = (view: NotesView, id: string) => view.notes.find(n => n.id === id)!
const makeApi = (over: Partial<NotesDeps> = {}) => {
  const log = createLogger('dev', () => {})
  const host = nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' }))

  return notesApi({ host, home, now: () => NOW, offsetMinutes: () => 60, log, newId: () => `t-${(ids += 1)}`, newNoteId: () => `n-${(ids += 1)}`, terminal: async () => 'terminal', copy: () => {}, prepareCodex: async () => [], reveal: path => void revealed.push(path), ...over })
}

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-notes-')))
  dir = join(home, '.queue-tea/notes', KEY)
  ids = 0
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify(emptyRecord('demo', '/p/demo')))
