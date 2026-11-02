import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { describe, expect, it } from 'vitest'

import { appleScriptText, bringForwardArgv, claudeLine, openClaudeArgv, shellQuote } from './mac'

const run = promisify(execFile)

const NASTY = ['plain', 'with space', "o'brien", 'say "hi"', '$(touch pwned)', '`touch pwned`', 'back\\slash', 'semi;colon', 'amp&ersand']

describe('the line given to a terminal', () => {
  it.each(NASTY)('reaches the folder %s and runs nothing else', async name => {
    const root = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-quote-')))
    const folder = join(root, name)
    await mkdir(folder)
    try {
      // The same line, with pwd in claude's place, run by a real shell.
      const line = claudeLine(folder).replace(/claude$/, 'pwd')
      const { stdout } = await run('sh', ['-c', line], { cwd: root })

      expect(stdout.trim()).toBe(folder)
      await expect(run('ls', [join(root, 'pwned')])).rejects.toThrow()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('quotes a single quote so the shell gets it back whole', () => {
    expect(shellQuote("o'brien")).toBe(`'o'\\''brien'`)
  })
})

describe('AppleScript text', () => {
  it.runIf(process.platform === 'darwin').each(NASTY)('keeps %s as it is', async text => {
    const { stdout } = await run('osascript', ['-e', `return ${appleScriptText(text)}`])

    expect(stdout.replace(/\n$/, '')).toBe(text)
  })
})

describe('opening Claude Code', () => {
  it('Terminal runs claude in a new window and comes forward', () => {
    const argv = openClaudeArgv('terminal', '/p/my realm')

    expect(argv[0]).toBe('osascript')
    expect(argv.join(' ')).toContain(`tell application "Terminal" to do script "cd '/p/my realm' && claude"`)
    expect(argv.join(' ')).toContain('activate')
  })

  it('iTerm2 writes the line into a new window', () => {
    const argv = openClaudeArgv('iterm', '/p/demo')

    expect(argv[0]).toBe('osascript')
    expect(argv.join(' ')).toContain('create window with default profile')
    expect(argv.join(' ')).toContain(`write text "cd '/p/demo' && claude"`)
  })

  it('VS Code opens the folder by name, since an installed app has no shell PATH', () => {
    expect(openClaudeArgv('vscode', '/p/demo')).toEqual(['open', '-a', 'Visual Studio Code', '/p/demo'])
  })

  it('bringing a terminal forward never runs claude', () => {
    for (const terminal of ['terminal', 'iterm', 'vscode'] as const) {
      expect(bringForwardArgv(terminal, '/p/demo').join(' ')).not.toContain('claude')
    }
  })
})
