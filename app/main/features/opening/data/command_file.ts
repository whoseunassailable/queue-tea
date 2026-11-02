import type { Host } from '../../../../../hooks/core/host/host'
import type { InstalledCommand } from '../../../../shared/engine_api'
import { COMMAND_MARK } from './command_script'

const COMMAND_NAME = 'queue-tea'

export const commandFileIn = (dir: string): string => `${dir}/${COMMAND_NAME}`

export const isOurs = async (host: Host, file: string): Promise<boolean> => (await host.read(file)).includes(COMMAND_MARK)

// The last of the folders is the user's own, which may not be on the PATH.
export const needsPath = (dirs: string[], dir: string): boolean => dir === dirs.at(-1)

// The copy already in place, for Settings. Only ours counts.
export const findCommand = async (host: Host, dirs: string[]): Promise<InstalledCommand | null> => {
  for (const dir of dirs) {
    const file = commandFileIn(dir)
    if ((await host.exists(file)) && (await isOurs(host, file))) return { path: file, needsPath: needsPath(dirs, dir) }
  }

  return null
}
