import type { Host } from '../../../../../hooks/core/host/host'
import type { ChronicleScope, HomeGroup, HomeNav, Reply, Settings, SkyChoice, TerminalChoice } from '../../../../shared/engine_api'
import type { Logger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { reply } from '../../../core/reply'
import { isGithubLogin } from '../../github/domain/accounts'

export type SettingsDeps = { host: Host; file: string; log: Logger }

export const DEFAULT_SETTINGS: Settings = { sky: 'auto', isCalm: false, lastProject: null, folds: {}, terminal: 'terminal', chronicleScope: 'realm', letterKeys: true, realmAccounts: {}, homeNav: {} }

const SKIES: readonly SkyChoice[] = ['auto', 'morning', 'day', 'evening', 'night']
const TERMINALS: readonly TerminalChoice[] = ['terminal', 'iterm', 'vscode']
const HOME_GROUPS: readonly HomeGroup[] = ['active', 'ready', 'sealed']

const isSky = (value: unknown): value is SkyChoice => SKIES.includes(value as SkyChoice)
const isTerminal = (value: unknown): value is TerminalChoice => TERMINALS.includes(value as TerminalChoice)
const isScope = (value: unknown): value is ChronicleScope => value === 'realm' || value === 'all'
const isLastProject = (value: unknown): value is string | null => value === null || typeof value === 'string'
const isFolds = (value: unknown): value is Settings['folds'] =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every(ids => Array.isArray(ids) && ids.every(id => typeof id === 'string'))

const isRealmAccounts = (value: unknown): value is Settings['realmAccounts'] =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && Object.values(value).every(isGithubLogin)

const isMap = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const isHomeNav = (value: unknown): value is HomeNav =>
  isMap(value) &&
  (value.open === null || typeof value.open === 'string') &&
  Array.isArray(value.folded) &&
  value.folded.every(group => HOME_GROUPS.includes(group as HomeGroup))

// Home's memory, realm by realm: a realm whose entry doesn't read is left out,
// and the others are kept.
const cleanHomeNav = (value: unknown): Settings['homeNav'] | undefined => {
  if (!isMap(value)) return undefined

  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, HomeNav] => isHomeNav(entry[1])).map(([key, nav]) => [key, { open: nav.open, folded: [...new Set(nav.folded)] }]))
}

const homeNavOf = (value: unknown): Pick<Settings, 'homeNav'> => {
  const homeNav = cleanHomeNav(value)

  return homeNav === undefined ? {} : { homeNav }
}

// What can be kept from a value read or sent: anything else stays out.
export const cleanSettings = (value: unknown): Partial<Settings> => {
  const v = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>

  return {
    ...(isSky(v.sky) ? { sky: v.sky } : {}),
    ...(typeof v.isCalm === 'boolean' ? { isCalm: v.isCalm } : {}),
    ...(isLastProject(v.lastProject) ? { lastProject: v.lastProject } : {}),
    ...(isFolds(v.folds) ? { folds: v.folds } : {}),
    ...(isTerminal(v.terminal) ? { terminal: v.terminal } : {}),
    ...(isScope(v.chronicleScope) ? { chronicleScope: v.chronicleScope } : {}),
    ...(typeof v.letterKeys === 'boolean' ? { letterKeys: v.letterKeys } : {}),
    ...(isRealmAccounts(v.realmAccounts) ? { realmAccounts: v.realmAccounts } : {}),
    ...homeNavOf(v.homeNav),
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
