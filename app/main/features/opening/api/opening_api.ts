import type { InstalledCommand, Opened, Reply } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { placeOf } from '../../realms/api/realms_api'
import type { RealmsDeps } from '../../realms/api/realms_api'
import { commandFileIn, isOurs, needsPath } from '../data/command_file'
import { COMMAND_SCRIPT } from '../data/command_script'
import { pathFromUrl } from '../domain/open_url'

// commandDirs goes from best to last resort, and the last is the user's own.
export type OpeningDeps = RealmsDeps & { commandDirs: string[] }

// What a link comes to. It can only select a realm or ask about a folder: this
// writes nothing, because a link can come from any web page.
export const openedFromUrl = async (d: RealmsDeps, url: string): Promise<Opened> => {
  const path = pathFromUrl(url)
  if (path === null) return { kind: 'failed', message: MESSAGES.badLink }
  try {
    if (!(await d.host.exists(path))) return { kind: 'failed', message: MESSAGES.noFolder(path) }

    return { kind: 'folder', pick: await placeOf(d, path) }
  } catch (err) {
    d.log.error('opening a link failed', err)

    return { kind: 'failed', message: MESSAGES.openFolder }
  }
}

const canWrite = async (d: OpeningDeps, dir: string): Promise<boolean> => (await d.host.run(['test', '-d', dir, '-a', '-w', dir])).exitCode === 0

export const installCommand = (d: OpeningDeps): Promise<Reply<InstalledCommand>> =>
  reply(d.log, MESSAGES.installCommand, async () => {
    const lastResort = d.commandDirs.at(-1)
    if (lastResort !== undefined) await d.host.makeDirs(lastResort)

    for (const dir of d.commandDirs) {
      if (!(await canWrite(d, dir))) continue
      const file = commandFileIn(dir)
      if ((await d.host.exists(file)) && !(await isOurs(d.host, file))) throw new Refusal(MESSAGES.commandTaken(file))
      await d.host.write(file, COMMAND_SCRIPT)
      const made = await d.host.run(['chmod', '755', file])
      if (made.exitCode !== 0) throw new Error(made.stderr)

      return { path: file, needsPath: needsPath(d.commandDirs, dir) }
    }
    throw new Refusal(MESSAGES.noCommandFolder)
  })
