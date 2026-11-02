import type { ProjectRecord } from '../../../../../types'
import type { Host } from '../../../../../hooks/core/host/host'
import { backupPath, parseRecord, whyUnreadable } from '../../../../../hooks/shared/records/data/datasources/record_source'
import { projectsFolder } from '../../../core/constants'
import type { Logger } from '../../../core/logger'

export type Scanned =
  | { kind: 'readable'; key: string; file: string; record: ProjectRecord; modifiedAt: number }
  | { kind: 'unreadable'; key: string; file: string; name: string; isNewer: boolean; canRestore: boolean; modifiedAt: number }

// A record's name: `<key>.json`. The `.bak`, `.lock`, `.tmp` and `.broken-*`
// files beside it end differently, and a name starting with . is a scratch one.
export const isRecordName = (name: string): boolean => name.endsWith('.json') && !name.startsWith('.')

export const keyOf = (name: string): string => name.slice(0, -'.json'.length)

// `<folder>-<6 hex>` back to the folder, for a record too broken to name itself.
const nameOf = (key: string): string => key.replace(/-[0-9a-f]{6}$/, '')

const canRestoreFrom = async (host: Host, file: string): Promise<boolean> => {
  const bak = backupPath(file)

  return (await host.exists(bak)) && parseRecord(await host.read(bak)) !== 'unreadable'
}

// One record. Whatever goes wrong stays with this project; the rest still load.
export const scanRecord = async (host: Host, folder: string, name: string, log: Logger): Promise<Scanned> => {
  const key = keyOf(name)
  const file = `${folder}/${name}`
  const unreadable = (isNewer: boolean, canRestore: boolean, modifiedAt: number): Scanned => ({
    kind: 'unreadable',
    key,
    file,
    name: nameOf(key),
    isNewer,
    canRestore,
    modifiedAt,
  })
  try {
    const modifiedAt = (await host.modifiedAt(file)) ?? 0
    const text = await host.read(file)
    const record = parseRecord(text)
    if (record !== 'unreadable') return { kind: 'readable', key, file, record, modifiedAt }
    log.warn(`record ${key} doesn't read`)
    const { isNewer } = whyUnreadable(text)

    return unreadable(isNewer, !isNewer && (await canRestoreFrom(host, file)), modifiedAt)
  } catch (err) {
    log.error(`reading record ${key} failed`, err)

    return unreadable(false, false, 0)
  }
}

// Every record, the last changed first.
export const scanRecords = async (host: Host, home: string, log: Logger): Promise<Scanned[]> => {
  const folder = projectsFolder(home)
  const names = (await host.list(folder)).filter(isRecordName).sort()
  const scanned = await Promise.all(names.map(name => scanRecord(host, folder, name, log)))

  return scanned.sort((a, b) => b.modifiedAt - a.modifiedAt)
}
