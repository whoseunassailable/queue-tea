import type { Host } from '../../../../../hooks/core/host/host'
import { readOptions } from '../../../../../hooks/core/session/options'
import { backupPath, emptyRecord, projectKey, restoreRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import { recordsRepositoryImpl } from '../../../../../hooks/shared/records/data/repositories/records_repository_impl'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import { isFresh } from '../../../../../hooks/shared/sessions/domain/services/session_rules'
import { isoLocal } from '../../../../../hooks/shared/time/domain/services/time'
import type { FolderPick, Reply, SettingsPage } from '../../../../shared/engine_api'
import { projectsFolder } from '../../../core/constants'
import type { Logger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { isProjectKey } from '../../projects/api/projects_api'
import { scanRecords } from '../../projects/data/projects_source'
import { findCommand } from '../../opening/data/command_file'
import { logPathOf } from '../../tasks/domain/task_input'

export type RealmsDeps = {
  host: Host
  home: string
  now: () => number
  offsetMinutes: () => number
  log: Logger
  // Shows a file or folder in Finder.
  reveal: (path: string) => void
  // Main's own folder dialog; null when it's cancelled.
  pickFolder: () => Promise<string | null>
}

const nameOf = (path: string): string => path.split('/').pop() || path

const fileOf = (d: RealmsDeps, key: string): string => `${projectsFolder(d.home)}/${key}.json`

const realmFile = async (d: RealmsDeps, key: unknown): Promise<{ key: string; file: string }> => {
  if (!isProjectKey(key)) throw new Refusal(MESSAGES.unknownProject)
  const file = fileOf(d, key)
  if (!(await d.host.exists(file))) throw new Refusal(MESSAGES.unknownProject)

  return { key, file }
}

export const readSettingsPage = (d: RealmsDeps & { commandDirs?: string[] }): Promise<Reply<SettingsPage>> =>
  reply(d.log, MESSAGES.readSettingsPage, async () => {
    const scanned = await scanRecords(d.host, d.home, d.log)
    const now = d.now()
    const live = (await sessionsRepositoryImpl(d.host, d.home).list()).filter(s => isFresh(s, now)).sort((a, b) => b.heartbeat - a.heartbeat)[0]
    const records = await Promise.all(
      scanned.map(async s => ({
        key: s.key,
        name: s.kind === 'readable' ? s.record.project.name : s.name,
        file: s.file.split('/').pop()!,
        hasCopy: await d.host.exists(backupPath(s.file)),
        logPath: s.kind === 'readable' ? s.record.docsLogPath : null,
        isReadable: s.kind === 'readable',
      })),
    )

    return {
      folder: projectsFolder(d.home),
      options: live?.options ?? readOptions({}),
      isDefault: live === undefined,
      records: records.sort((a, b) => a.name.localeCompare(b.name)),
      command: await findCommand(d.host, d.commandDirs ?? []),
    }
  })

export const setTaskLog = (d: RealmsDeps, key: unknown, path: unknown): Promise<Reply<null>> =>
  reply(d.log, MESSAGES.setTaskLog, async () => {
    const checked = logPathOf(path)
    if (checked === null) throw new Refusal(MESSAGES.logPathRequired)
    const realm = await realmFile(d, key)
    const scanned = (await scanRecords(d.host, d.home, d.log)).find(s => s.key === realm.key)
    if (scanned?.kind !== 'readable') throw new Refusal(MESSAGES.unreadableRealm)
    const { path: projectPath, name } = scanned.record.project
    const records = recordsRepositoryImpl(d.host, { cwd: projectPath, home: d.home, projectPath, projectName: name, file: realm.file, offsetMinutes: d.offsetMinutes(), options: readOptions({}) })
    const saved = await records.update(r => ({ ...r, docsLogPath: checked }))
    if (saved === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)

    return null
  })

// By key and never by path: the window can't ask for anything but a record.
export const showRecord = (d: RealmsDeps, key: unknown): Promise<Reply<null>> =>
  reply(d.log, MESSAGES.showRecord, async () => {
    d.reveal(key === null ? projectsFolder(d.home) : (await realmFile(d, key)).file)

    return null
  })

// The repository's top folder, as a session in it would use; a folder outside
// one stands for itself. Worked out the same for a dialog and for a link.
export const placeOf = async (d: RealmsDeps, path: string): Promise<FolderPick> => {
  const top = await d.host.run(['git', 'rev-parse', '--show-toplevel'], path)
  const root = top.exitCode === 0 ? top.stdout.trim() : ''
  const place = root === '' ? path : root
  const key = projectKey(place)

  return { path: place, name: nameOf(place), key, isKnown: await d.host.exists(fileOf(d, key)), isRepo: root !== '' }
}

export const openFolder = (d: RealmsDeps): Promise<Reply<FolderPick | null>> =>
  reply(d.log, MESSAGES.openFolder, async () => {
    const picked = await d.pickFolder()

    return picked === null ? null : placeOf(d, picked)
  })

// The record goes in ~/.queue-tea and nothing is written in the folder. One
// already there is left as it is.
export const addProject = (d: RealmsDeps, path: unknown): Promise<Reply<string>> =>
  reply(d.log, MESSAGES.addProject, async () => {
    if (typeof path !== 'string' || !path.startsWith('/')) throw new Refusal(MESSAGES.badFolder)
    if (!(await d.host.exists(path))) throw new Refusal(MESSAGES.badFolder)
    const place = await placeOf(d, path)
    if (place.isKnown) return place.key

    const made = await d.host.makeDirs(projectsFolder(d.home))
    if (made.exitCode !== 0) throw new Error(made.stderr)
    await d.host.write(fileOf(d, place.key), JSON.stringify(emptyRecord(place.name, place.path), null, 2))

    return place.key
  })

// Gives the name the broken record is kept under. restoreRecord itself refuses
// a newer record, whose copy would lose the newer work.
export const restoreRealm = (d: RealmsDeps, key: unknown): Promise<Reply<string>> =>
  reply(d.log, MESSAGES.restoreRealm, async () => {
    const { file } = await realmFile(d, key)
    const stamp = isoLocal(d.now(), d.offsetMinutes()).slice(0, 19).replace(/:/g, '-')
    const restored = await restoreRecord(d.host, file, stamp)
    if (restored === 'no-copy') throw new Refusal(MESSAGES.noGoodCopy)

    return restored === 'readable' ? '' : restored.keptAt.split('/').pop()!
  })
