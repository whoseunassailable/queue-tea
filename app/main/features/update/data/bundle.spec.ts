import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { describe, expect, it } from 'vitest'

import { relaunchArgv, restoredOf, versionOfPlist } from './bundle'

const run = promisify(execFile)

describe('the bundle on disk', () => {
  it('reads the version from Info.plist', () => {
    const plist = '<dict>\n\t<key>CFBundleName</key>\n\t<string>Queue-tea</string>\n\t<key>CFBundleShortVersionString</key>\n\t<string>1.5.0</string>\n</dict>'

    expect(versionOfPlist(plist)).toBe('1.5.0')
    expect(versionOfPlist('<dict></dict>')).toBeNull()
  })

  it('opens the app again only after this one has ended, behind what you use unless you asked', async () => {
    expect(relaunchArgv(42, '/Applications/Queue-tea.app', false)[2]).toContain('open -g "$2"')
    expect(relaunchArgv(42, '/Applications/Queue-tea.app', true)[2]).not.toContain('-g')

    // The real shell, with open swapped for echo: it waits for the pid, then runs once.
    const folder = await mkdtemp(join(tmpdir(), 'queue-tea-relaunch-'))
    const out = join(folder, 'opened')
    const [shell, flag, script, ...rest] = relaunchArgv(999999, out, false)
    await run(shell!, [flag!, script!.replace('open -g "$2"', 'echo opened >"$2"'), ...rest])
    await new Promise(done => setTimeout(done, 300))

    expect(await readFile(out, 'utf8')).toBe('opened\n')
    await rm(folder, { recursive: true, force: true })
  })
})

describe('where the window was', () => {
  const bounds = { x: 10, y: 20, width: 1280, height: 800 }

  it('reads back what the restart wrote', () => {
    expect(restoredOf(JSON.stringify({ hash: '#/quests', bounds, isInFront: false }))).toEqual({ hash: '#/quests', bounds, isInFront: false })
    expect(restoredOf('null')).toBeNull()
  })

  it('ignores anything off, so the app opens as it always does', () => {
    expect(restoredOf('"text"')).toBeUndefined()
    expect(restoredOf(JSON.stringify({ hash: '#/quests', bounds: { ...bounds, width: 'wide' }, isInFront: false }))).toBeUndefined()
    expect(restoredOf(JSON.stringify({ hash: 3, bounds, isInFront: true }))).toBeUndefined()
    expect(() => restoredOf('{')).toThrow()
  })
})
