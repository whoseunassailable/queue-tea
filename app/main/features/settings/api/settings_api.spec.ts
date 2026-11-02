import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { DEFAULT_SETTINGS, readSettings, saveSettings } from './settings_api'
import type { SettingsDeps } from './settings_api'

let dir: string
let deps: SettingsDeps

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'queue-tea-settings-'))
  const log = createLogger('prod', () => {})
  deps = { host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), file: join(dir, 'settings.json'), log }
})
afterEach(() => rm(dir, { recursive: true, force: true }))

describe('settings', () => {
  it('starts from the defaults', async () => {
    expect(await readSettings(deps)).toEqual({ ok: true, data: DEFAULT_SETTINGS })
  })

  it('keeps a chosen sky across reads', async () => {
    await saveSettings(deps, { sky: 'night' })

    expect(await readSettings(deps)).toMatchObject({ data: { sky: 'night' } })
  })

  it('a change keeps what was saved before', async () => {
    await saveSettings(deps, { sky: 'day' })
    await saveSettings(deps, { isCalm: true })

    expect(await readSettings(deps)).toMatchObject({ data: { sky: 'day', isCalm: true } })
  })

  it('refuses a value it cannot use and saves nothing', async () => {
    const saved = await saveSettings(deps, { sky: 'purple' })

    expect(saved).toEqual({ ok: false, error: { message: "That setting isn't one Queue-tea can use. Pick another." } })
    expect(await deps.host.exists(deps.file)).toBe(false)
  })

  it('a broken settings file falls back to the defaults', async () => {
    await writeFile(deps.file, '{oops')

    expect(await readSettings(deps)).toEqual({ ok: true, data: DEFAULT_SETTINGS })
  })

  it('a field with a bad value falls back and the rest are kept', async () => {
    await writeFile(deps.file, JSON.stringify({ sky: 'purple', isCalm: true }))

    expect(await readSettings(deps)).toMatchObject({ data: { sky: 'auto', isCalm: true } })
  })
})
