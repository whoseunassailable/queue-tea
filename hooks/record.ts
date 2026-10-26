import type { LoadError, OtherProject, ProjectRecord, Task } from '../types'
import type { Host } from './host'

// FNV-1a, 32 bits: a short, stable code for a path.
const fnv1a = (text: string): string => {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }

  return hash.toString(16).padStart(8, '0')
}

// `<folder>-<6 hex>`, so two repositories with the same folder name differ.
export const projectKey = (path: string): string => {
  const trimmed = path.replace(/\/+$/, '')
  const folder = trimmed.split('/').pop() || 'project'

  return `${folder}-${fnv1a(trimmed).slice(0, 6)}`
}

export const recordPath = (home: string, key: string): string =>
  `${home}/.queue-tea/projects/${key}.json`

// Before the mod was Queue-tea its records were in ~/.queue-tie. The first
// start without ~/.queue-tea copies them over; the old folder is left as it was.
export const carryOverRecords = async (host: Host, home: string): Promise<'copied' | 'none'> => {
  const from = `${home}/.queue-tie/projects`
  const to = `${home}/.queue-tea/projects`
  if (home === '' || (await host.exists(to)) || !(await host.exists(from))) return 'none'

  for (const argv of [['mkdir', '-p', `${home}/.queue-tea`], ['cp', '-Rp', from, to]]) {
    const ran = await host.run(argv)
    if (ran.exitCode !== 0) throw new Error(`${argv[0]} of the old records failed: ${ran.stderr}`)
  }

  return 'copied'
}

export const emptyRecord = (name: string, path: string): ProjectRecord => ({
  version: 1,
  project: { name, path },
  docsLogPath: null,
  playNext: null,
  feature: null,
  tasks: [],
  unassignedMinutesByDay: {},
})

// A record written before a field existed gets the field's empty value. A
// task without an id gets one from its creation and title, the same at every
// read until it is written back.
const withDefaults = (t: Partial<Task>): Task =>
  ({
    id: `t-${fnv1a(`${t.created ?? ''}|${t.title ?? ''}`)}`,
    baseBranch: null,
    blockedBy: [],
    blockedReason: null,
    checkpoint: null,
    parentId: null,
    ...t,
  }) as Task

export const parseRecord = (text: string): ProjectRecord | 'unreadable' => {
  try {
    const parsed = JSON.parse(text) as Partial<ProjectRecord>

    return parsed?.version === 1 && Array.isArray(parsed.tasks)
      ? ({
          ...parsed,
          playNext: parsed.playNext ?? null,
          feature: parsed.feature ?? null,
          tasks: parsed.tasks.map(withDefaults),
        } as ProjectRecord)
      : 'unreadable'
  } catch {
    return 'unreadable'
  }
}

// The last record that read, kept beside it before every write. Its name
// doesn't end in .json, so it is never taken for another project's record.
export const backupPath = (file: string): string => `${file}.bak`

// Why a record's text can't be read, in plain words, and whether a newer
// Queue-tea wrote it: going back to an older copy would then lose its work.
export const whyUnreadable = (text: string): { reason: string; isNewer: boolean } => {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch (err) {
    return { reason: `it isn't valid JSON (${err instanceof Error ? err.message : String(err)})`, isNewer: false }
  }
  const version = (parsed as { version?: unknown } | null)?.version
  if (typeof version === 'number' && version > 1) {
    return { reason: `it was written by a newer Queue-tea (record version ${version}); update Queue-tea to read it`, isNewer: true }
  }

  return { reason: "it isn't a Queue-tea record", isNewer: false }
}

// What the menu says about a record that can't be read: why, and whether
// the last good copy can take its place. Null when it reads after all.
export const readProblem = async (host: Host, file: string): Promise<LoadError | null> => {
  if (!(await host.exists(file))) return null
  const text = await host.read(file)
  if (parseRecord(text) !== 'unreadable') return null
  const why = whyUnreadable(text)
  const bak = backupPath(file)
  const canRestore = !why.isNewer && (await host.exists(bak)) && parseRecord(await host.read(bak)) !== 'unreadable'

  return { reason: why.reason, canRestore }
}

// Puts the last good copy in place of a record that can't be read. The
// broken file is kept beside it as <file>.broken-<stamp>, never deleted.
// Nothing changes when the record reads after all or there is no good copy.
export const restoreRecord = (
  host: Host,
  file: string,
  stamp: string,
): Promise<{ record: ProjectRecord; keptAt: string } | 'readable' | 'no-copy'> =>
  withLock(host, file, async () => {
    const broken = (await host.exists(file)) ? await host.read(file) : null
    if (broken !== null && parseRecord(broken) !== 'unreadable') return 'readable'
    const bak = backupPath(file)
    const text = (await host.exists(bak)) ? await host.read(bak) : null
    const record = text === null ? 'unreadable' : parseRecord(text)
    if (text === null || record === 'unreadable' || (broken !== null && whyUnreadable(broken).isNewer)) return 'no-copy'

    const keptAt = `${file}.broken-${stamp}`
    if (broken !== null) await host.write(keptAt, broken)
    await replaceWith(host, file, text)

    return { record, keptAt }
  })

// Writes a temp file of its own and renames it over the record, so no
// half-written file is left and two sessions never share one.
const replaceWith = async (host: Host, file: string, text: string): Promise<void> => {
  const tag = [...crypto.getRandomValues(new Uint8Array(4))].map(b => b.toString(16).padStart(2, '0')).join('')
  const tmp = `${file}.${tag}.tmp`
  await host.write(tmp, text)
  const moved = await host.run(['mv', '-f', tmp, file])
  if (moved.exitCode !== 0) throw new Error(`mv of the record failed: ${moved.stderr}`)
}

export const readRecord = async (
  host: Host,
  file: string,
  name: string,
  path: string,
): Promise<ProjectRecord | 'unreadable'> =>
  (await host.exists(file)) ? parseRecord(await host.read(file)) : emptyRecord(name, path)

const LOCK_TRIES = 40
const LOCK_WAIT_MS = 50

// One writer at a time across sessions. The lock is a folder beside the
// record, which mkdir makes only when it isn't there. A lock still there
// after two seconds of waiting is from a session that stopped mid-write,
// since a write takes milliseconds, so this write takes it over.
const withLock = async <T>(host: Host, file: string, work: () => Promise<T>): Promise<T> => {
  const lock = `${file}.lock`
  for (let tries = 0; tries < LOCK_TRIES; tries += 1) {
    if ((await host.run(['mkdir', lock])).exitCode === 0) break
    // No lock there: the folder above is missing, before the first record of
    // all, or the lock was let go just now. Either way, try again at once.
    if (!(await host.exists(lock))) await host.run(['mkdir', '-p', file.slice(0, file.lastIndexOf('/'))])
    else await host.sleep(LOCK_WAIT_MS)
  }
  try {
    return await work()
  } finally {
    await host.run(['rmdir', lock])
  }
}

// Reads the file again right before writing, so another session's changes
// survive, and keeps what it read as the last good copy before replacing it.
// An unreadable file is never overwritten.
export const updateRecord = (
  host: Host,
  file: string,
  change: (r: ProjectRecord) => ProjectRecord,
  name: string,
  path: string,
): Promise<ProjectRecord | 'unreadable'> =>
  withLock(host, file, async () => {
    const text = (await host.exists(file)) ? await host.read(file) : null
    const fresh = text === null ? emptyRecord(name, path) : parseRecord(text)
    if (fresh === 'unreadable') return 'unreadable'

    const changed = change(fresh)
    if (text !== null) await host.write(backupPath(file), text)
    await replaceWith(host, file, JSON.stringify(changed, null, 2))

    return changed
  })

// Every other project's queue, from the record files beside this one: its
// name, how many tasks wait, and its suggestion. Unreadable files are skipped.
export const readOthers = async (
  host: Host,
  file: string,
  suggestTitle: (r: ProjectRecord) => string | null,
): Promise<OtherProject[]> => {
  const dir = file.slice(0, file.lastIndexOf('/'))
  const own = file.slice(dir.length + 1)
  const others: OtherProject[] = []
  for (const name of (await host.list(dir)).filter(n => n.endsWith('.json') && n !== own).sort()) {
    const record = parseRecord(await host.read(`${dir}/${name}`))
    if (record === 'unreadable') continue
    const waiting = record.tasks.filter(t => t.state === 'queued').length
    if (waiting > 0) others.push({ name: record.project.name, waiting, next: suggestTitle(record) })
  }

  return others
}
