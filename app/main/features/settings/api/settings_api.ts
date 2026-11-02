import type { Host } from '../../../../../hooks/core/host/host'
import type { Reply, Settings, SkyChoice } from '../../../../shared/engine_api'
import type { Logger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { reply } from '../../../core/reply'

export type SettingsDeps = { host: Host; file: string; log: Logger }

export const DEFAULT_SETTINGS: Settings = { sky: 'auto', isCalm: false, lastProject: null }

const SKIES: readonly SkyChoice[] = ['auto', 'morning', 'day', 'evening', 'night']

const isSky = (value: unknown): value is SkyChoice => SKIES.includes(value as SkyChoice)
const isLastProject = (value: unknown): value is string | null => value === null || typeof value === 'string'

// What can be kept from a value read or sent: anything else stays out.
export const cleanSettings = (value: unknown): Partial<Settings> => {
  const v = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>

  return {
    ...(isSky(v.sky) ? { sky: v.sky } : {}),
    ...(typeof v.isCalm === 'boolean' ? { isCalm: v.isCalm } : {}),
    ...(isLastProject(v.lastProject) ? { lastProject: v.lastProject } : {}),
  }
}

const load = async ({ host, file, log }: SettingsDeps): Promise<Settings> => {
  if (!(await host.exists(file))) return DEFAULT_SETTINGS
  try {
    return { ...DEFAULT_SETTINGS, ...cleanSettings(JSON.parse(await host.read(file))) }
  } catch (err) {
    log.error('the settings file does not read, so the defaults are in use', err)

    return DEFAULT_SETTINGS
  }
}

export const readSettings = (d: SettingsDeps): Promise<Reply<Settings>> => reply(d.log, MESSAGES.readSettings, () => load(d))

export const saveSettings = async (d: SettingsDeps, patch: unknown): Promise<Reply<Settings>> => {
  const clean = cleanSettings(patch)
  if (Object.keys(clean).length === 0) {
    d.log.warn('saveSettings was given nothing it could use')

    return { ok: false, error: { message: MESSAGES.badSetting } }
  }

  return reply(d.log, MESSAGES.saveSettings, async () => {
    const saved = { ...(await load(d)), ...clean }
    await d.host.write(d.file, JSON.stringify(saved, null, 2))

    return saved
  })
}
