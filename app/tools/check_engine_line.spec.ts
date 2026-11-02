import { execFile } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { describe, expect, it } from 'vitest'

const run = promisify(execFile)
const APP = join(__dirname, '..')

// Type checks one extra file with the app's own settings.
const check = async (source: string): Promise<string> => {
  const dir = await mkdtemp(join(APP, '.line-check-'))
  try {
    await writeFile(join(dir, 'probe.ts'), source)
    await writeFile(join(dir, 'tsconfig.json'), JSON.stringify({ extends: '../tsconfig.json', include: ['probe.ts'] }))
    try {
      await run('npx', ['tsc', '-p', dir], { cwd: APP })

      return ''
    } catch (err) {
      return (err as { stdout: string }).stdout
    }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

describe('the line between the app and Claude Code', () => {
  it('the type check fails on a file that imports claude-code through the mod', async () => {
    const output = await check("import { hostOf } from '../../hooks/core/host/claude_host'\nexport const h = hostOf\n")

    expect(output).toContain('claude-code')
  })

  it('the type check passes on the engine code the app uses', async () => {
    const output = await check("import { parseRecord } from '../../hooks/shared/records/data/datasources/record_source'\nexport const p = parseRecord\n")

    expect(output).toBe('')
  })
})
