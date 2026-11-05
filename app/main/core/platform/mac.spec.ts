import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { describe, expect, it } from 'vitest'

import { appleScriptText, bringForwardArgv, claudeLine, codexLine, codexPasteLine, openLineArgv, shellQuote } from './mac'

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

// Each argument codex gets, in <>, from a real shell with codex as a function.
const codexArgs = async (line: string, cwd: string) =>
  (await run('sh', ['-c', `codex() { for arg in "$@"; do printf '<%s>' "$arg"; done; }; ${line}`], { cwd })).stdout

const BRIEF = 'From Queue-tea:\n- Don\'t commit; say "done".\n$(touch pwned) `touch pwned` back\\slash'

describe('the line that opens Codex', () => {
  it('reaches the folder and gives codex its guard, then the brief from the file whole, running nothing else', async () => {
    const root = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-codex-')))
    const folder = join(root, "o'brien $(touch pwned)")
    const briefs = join(root, 'say "hi"')
    await mkdir(folder)
    await mkdir(briefs)
    const file = join(briefs, 't-1.md')
    await writeFile(file, `${BRIEF}\n`)
    try {
      const args = await codexArgs(codexLine(folder, file), root)

      expect(args).toBe(`<--sandbox><workspace-write><--ask-for-approval><on-request><${BRIEF}>`)
      await expect(run('ls', [join(root, 'pwned')])).rejects.toThrow()
      await expect(run('ls', [join(folder, 'pwned')])).rejects.toThrow()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('to paste, carries the brief itself, quoted, and needs no file', async () => {
    const root = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-codex-')))
    try {
      const line = codexPasteLine(root, BRIEF)

      expect(line).not.toContain('$(cat')
      expect(line).toContain(`'From Queue-tea:\n- Don'\\''t commit;`)
      expect(await codexArgs(line, root)).toBe(`<--sandbox><workspace-write><--ask-for-approval><on-request><${BRIEF}>`)
      await expect(run('ls', [join(root, 'pwned')])).rejects.toThrow()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})

describe('AppleScript text', () => {
  it.runIf(process.platform === 'darwin').each(NASTY)('keeps %s as it is', async text => {
    const { stdout } = await run('osascript', ['-e', `return ${appleScriptText(text)}`])

    expect(stdout.replace(/\n$/, '')).toBe(text)
  })

  it.runIf(process.platform === 'darwin')('keeps the Codex line as it is', async () => {
    const line = codexLine("/p/o'brien", '/h/.queue-tea/briefs/t-1.md')
    const { stdout } = await run('osascript', ['-e', `return ${appleScriptText(line)}`])

    expect(stdout.replace(/\n$/, '')).toBe(line)
  })
})

describe('opening Claude Code', () => {
  it('Terminal runs claude in a new window and comes forward', () => {
    const argv = openLineArgv('terminal', '/p/my realm', claudeLine('/p/my realm'))

    expect(argv[0]).toBe('osascript')
    expect(argv.join(' ')).toContain(`set queueTeaTab to do script "cd '/p/my realm' && claude"`)
    expect(argv.join(' ')).toContain('activate')
  })

  it('iTerm2 writes the line into a new window', () => {
    const argv = openLineArgv('iterm', '/p/demo', claudeLine('/p/demo'))

    expect(argv[0]).toBe('osascript')
    expect(argv.join(' ')).toContain('create window with default profile')
    expect(argv.join(' ')).toContain(`write text "cd '/p/demo' && claude"`)
  })

  it('VS Code opens the folder by name, since an installed app has no shell PATH', () => {
    expect(openLineArgv('vscode', '/p/demo', claudeLine('/p/demo'))).toEqual(['open', '-a', 'Visual Studio Code', '/p/demo'])
  })

  it('bringing a terminal forward never runs claude or codex', () => {
    for (const terminal of ['terminal', 'iterm', 'vscode'] as const) {
      expect(bringForwardArgv(terminal, '/p/demo').join(' ')).not.toContain('claude')
      expect(bringForwardArgv(terminal, '/p/demo').join(' ')).not.toContain('codex')
    }
  })

  it('Terminal runs the Codex line in a new window, its quotes kept for AppleScript', () => {
    const argv = openLineArgv('terminal', '/p/demo', codexLine('/p/demo', '/h/.queue-tea/briefs/t-1.md'))

    expect(argv.join(' ')).toContain(`do script "cd '/p/demo' && codex --sandbox workspace-write --ask-for-approval on-request \\"$(cat '/h/.queue-tea/briefs/t-1.md')\\""`)
  })
})
