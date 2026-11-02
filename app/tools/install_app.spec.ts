import { execFile } from 'node:child_process'
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const run = promisify(execFile)
const SCRIPT = join(__dirname, 'install_app.sh')

// Only the ways it stops are run here: going on would replace the real app.
describe('installing the app', () => {
  let folder: string

  const pgrepSays = async (exitCode: number) => {
    await mkdir(join(folder, 'bin'))
    await writeFile(join(folder, 'bin/pgrep'), `#!/bin/sh\nexit ${exitCode}\n`)
    await chmod(join(folder, 'bin/pgrep'), 0o755)
  }
  const install = () => run('/bin/sh', [SCRIPT], { cwd: folder, env: { ...process.env, PATH: `${join(folder, 'bin')}:/usr/bin:/bin` } })

  beforeEach(async () => {
    folder = await mkdtemp(join(tmpdir(), 'queue-tea-install-'))
  })
  afterEach(() => rm(folder, { recursive: true, force: true }))

  it('stops with no build, and says what to run', async () => {
    await expect(install()).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('npm run package') })
  })

  it('stops while the app is running, rather than pulling it out from under you', async () => {
    await mkdir(join(folder, 'dist/mac-arm64/Queue-tea.app'), { recursive: true })
    await pgrepSays(0)

    await expect(install()).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('Quit it') })
  })
})
