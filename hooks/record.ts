import type { OtherProject, ProjectRecord, Task } from '../types'
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

export const readRecord = async (
  host: Host,
  file: string,
  name: string,
  path: string,
): Promise<ProjectRecord | 'unreadable'> =>
  (await host.exists(file)) ? parseRecord(await host.read(file)) : emptyRecord(name, path)

// Reads the file again right before writing, so another session's changes
// survive; writes a temp file of its own and renames it, so no half-written
// file is left and two sessions never share one.
// An unreadable file is never overwritten.
export const updateRecord = async (
  host: Host,
  file: string,
  change: (r: ProjectRecord) => ProjectRecord,
  name: string,
  path: string,
): Promise<ProjectRecord | 'unreadable'> => {
  const fresh = await readRecord(host, file, name, path)
  if (fresh === 'unreadable') return 'unreadable'

  const changed = change(fresh)
  const tag = [...crypto.getRandomValues(new Uint8Array(4))].map(b => b.toString(16).padStart(2, '0')).join('')
  const tmp = `${file}.${tag}.tmp`
  await host.write(tmp, JSON.stringify(changed, null, 2))
  const moved = await host.run(['mv', '-f', tmp, file])
  if (moved.exitCode !== 0) throw new Error(`mv of the record failed: ${moved.stderr}`)

  return changed
}

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
