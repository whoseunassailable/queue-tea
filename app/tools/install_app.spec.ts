import { execFile } from 'node:child_process'
import { chmod, mkdir, mkdtemp, open, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const run = promisify(execFile)
const SCRIPT = join(__dirname, 'install_app.sh')

// Run against a folder of its own, never the real /Applications.
describe('installing the app', () => {
  let folder: string

  // Writes what it was asked to a journal; pgrep's is there to show no one asks.
  const standIn = async (name: string) => {
    await mkdir(join(folder, 'bin'), { recursive: true })
    await writeFile(join(folder, 'bin', name), `#!/bin/sh\necho "${name} $*" >>"${join(folder, 'journal')}"\n`)
    await chmod(join(folder, 'bin', name), 0o755)
  }
  const install = () => run('/bin/sh', [SCRIPT], { cwd: folder, env: { ...process.env, PATH: `${join(folder, 'bin')}:/usr/bin:/bin` } })

  beforeEach(async () => {
    folder = await mkdtemp(join(tmpdir(), 'queue-tea-install-'))
  })
  afterEach(() => rm(folder, { recursive: true, force: true }))

  it('stops with no build, and says what to run', async () => {
    await expect(install()).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('npm run package') })
  })

  it('swaps the new copy in under an open app, leaving nothing else behind', async () => {
    const apps = join(folder, 'Applications')
    await mkdir(join(folder, 'dist/mac-arm64/Queue-tea.app/Contents'), { recursive: true })
    await writeFile(join(folder, 'dist/mac-arm64/Queue-tea.app/Contents/Info.plist'), 'new')
    await mkdir(join(apps, 'Queue-tea.app/Contents'), { recursive: true })
    await writeFile(join(apps, 'Queue-tea.app/Contents/Info.plist'), 'old')
    await standIn('lsregister')
    await standIn('pgrep')
    // What the open app holds keeps reading as it was.
    const held = await open(join(apps, 'Queue-tea.app/Contents/Info.plist'), 'r')

    await run('/bin/sh', [SCRIPT], { cwd: folder, env: { ...process.env, QUEUE_TEA_APPLICATIONS: apps, PATH: `${join(folder, 'bin')}:/usr/bin:/bin` } })

    expect(await readFile(join(apps, 'Queue-tea.app/Contents/Info.plist'), 'utf8')).toBe('new')
    expect((await held.readFile()).toString()).toBe('old')
    await held.close()
    expect(await readdir(apps)).toEqual(['Queue-tea.app'])
    expect(await readFile(join(folder, 'journal'), 'utf8')).toBe(`lsregister -f ${join(apps, 'Queue-tea.app')}\n`)
  })
})
