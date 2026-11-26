import { execFile } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { describe, expect, it } from 'vitest'

import { TYPE_CHECK_TIMEOUT_MS } from './test_limits'

const run = promisify(execFile)
const APP = join(__dirname, '..')
// The app's own TypeScript, run by Node itself: npx would start npm first.
const TSC = join(APP, 'node_modules/typescript/bin/tsc')

// Type checks one extra file with the app's own settings.
const check = async (source: string): Promise<string> => {
  const dir = await mkdtemp(join(APP, '.line-check-'))
  try {
    await writeFile(join(dir, 'probe.ts'), source)
    await writeFile(join(dir, 'tsconfig.json'), JSON.stringify({ extends: '../tsconfig.json', include: ['probe.ts'] }))
    try {
      await run(process.execPath, [TSC, '-p', dir], { cwd: APP })

      return ''
    } catch (err) {
      // tsc prints its errors on stdout; a run that never got that far must not read as a clean check.
      const { stdout, stderr } = err as { stdout?: string; stderr?: string }

      return stdout || stderr || String(err)
    }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

describe('the line between the app and Claude Code', () => {
  it('the type check fails on a file that imports claude-code through the mod', async () => {
    const output = await check("import { hostOf } from '../../hooks/core/host/claude_host'\nexport const h = hostOf\n")

    expect(output).toContain('claude-code')
  }, TYPE_CHECK_TIMEOUT_MS)

  it('the type check passes on the engine code the app uses', async () => {
    const output = await check("import { parseRecord } from '../../hooks/shared/records/data/datasources/record_source'\nexport const p = parseRecord\n")

    expect(output).toBe('')
  }, TYPE_CHECK_TIMEOUT_MS)
})
