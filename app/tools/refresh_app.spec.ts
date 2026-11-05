import { execFile } from 'node:child_process'
import { chmod, copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const run = promisify(execFile)
const SCRIPT = join(__dirname, 'refresh_app.sh')

// Every command that reaches outside is a stand-in that writes what it was
// asked to a journal, so nothing here builds or replaces the real app.
describe('refreshing the installed app', () => {
  let folder: string
  let app: string

  const journal = () => readFile(join(folder, 'journal'), 'utf8').catch(() => '')
  const standIn = async (name: string, body: string) => {
    await writeFile(join(folder, 'bin', name), `#!/bin/sh\necho "${name} $*" >>"${join(folder, 'journal')}"\n${body}\n`)
    await chmod(join(folder, 'bin', name), 0o755)
  }
  const refresh = () => run('/bin/sh', [join(app, 'tools/refresh_app.sh')], { env: { ...process.env, HOME: folder, PATH: `${join(folder, 'bin')}:/usr/bin:/bin:${process.env.PATH ?? ''}` } })
  const lock = () => join(folder, 'Library/Logs/Queue-tea/refresh.lock')

  beforeEach(async () => {
    folder = await mkdtemp(join(tmpdir(), 'queue-tea-refresh-'))
    app = join(folder, 'app')
    await mkdir(join(app, 'tools'), { recursive: true })
    await mkdir(join(app, 'node_modules/electron/dist/Electron.app'), { recursive: true })
    await mkdir(join(folder, 'bin'))
    await copyFile(SCRIPT, join(app, 'tools/refresh_app.sh'))
    // Guard policy has separate tests; this suite tests the updater after approval.
    await writeFile(join(app, 'tools/release_guard.mjs'), '')
    await writeFile(join(app, 'tools/install_app.sh'), `echo "install" >>"${join(folder, 'journal')}"\n`)
    await writeFile(join(app, 'package.json'), '{ "version": "1.2.0" }\n')
    await standIn('npm', `mkdir -p "${join(app, 'dist/mac-arm64')}"`)
    await standIn('osascript', '')
  })
  afterEach(() => rm(folder, { recursive: true, force: true }))

  it('builds, installs, tells you, and leaves no second app behind', async () => {
    await refresh()

    const said = await journal()
    expect(said).toContain('npm run package')
    expect(said).toContain('install')
    expect(said).toContain('Version 1.2.0 is installed')
    await expect(stat(join(app, 'dist'))).rejects.toThrow()
    await expect(stat(lock())).rejects.toThrow()
  })

  it('installs while the app is open, without waiting for it to quit', async () => {
    await standIn('pgrep', 'exit 0')

    await refresh()

    const said = await journal()
    expect(said).toContain('install\n')
    expect(said).not.toContain('Quit')
    expect(said).toContain('Version 1.2.0 is installed')
  })

  it('says so when the build fails, and installs nothing', async () => {
    await standIn('npm', 'exit 1')

    await refresh()

    const said = await journal()
    expect(said).toContain('refresh.log')
    expect(said).not.toContain('install\n')
    await expect(stat(lock())).rejects.toThrow()
  })

  it('a commit during a build asks that build to go round again', async () => {
    await mkdir(lock(), { recursive: true })
    await writeFile(join(lock(), 'pid'), String(process.pid))

    await refresh()

    await expect(stat(join(lock(), 'again'))).resolves.toBeDefined()
    expect(await journal()).toBe('')
  })

  it('goes round again without installing the build that is already out of date', async () => {
    await standIn('npm', `mkdir -p "${join(app, 'dist/mac-arm64')}"\n[ "$(grep -c '^npm' "${join(folder, 'journal')}")" -eq 1 ] && : >"${join(lock(), 'again')}"\nexit 0`)

    await refresh()

    const said = await journal()
    expect(said.match(/^npm run package$/gm)).toHaveLength(2)
    expect(said.match(/^install$/gm)).toHaveLength(1)
  })

  it('takes over from a run that was killed', async () => {
    await mkdir(lock(), { recursive: true })
    await writeFile(join(lock(), 'pid'), '999999')

    await refresh()

    expect(await journal()).toContain('Version 1.2.0 is installed')
  })

  it('fetches what the build needs in a folder that has never built', async () => {
    await rm(join(app, 'node_modules'), { recursive: true })
    await standIn('npx', '')

    await refresh()

    const said = await journal()
    expect(said).toContain('npm ci')
    expect(said).toContain('npx --no install-electron')
  })
})
