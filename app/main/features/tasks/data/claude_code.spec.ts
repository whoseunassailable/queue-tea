import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Host } from '../../../../../hooks/core/host/host'
import type { TerminalChoice } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { codexLine, codexPasteLine } from '../../../core/platform/mac'
import { openClaudeCode, openCodex } from './claude_code'
import type { ClaudeDeps } from './claude_code'

let ran: string[][]
let exitCode: number
let copied: string[]
let logged: string[]

const deps = (terminal: TerminalChoice = 'terminal', over: Partial<ClaudeDeps> = {}): ClaudeDeps => ({
  host: {
    run: async (argv: string[]) => {
      ran.push(argv)

      return { exitCode, stdout: '', stderr: exitCode === 0 ? '' : 'no such application' }
    },
  } as unknown as Host,
  home: '/home',
  terminal: async () => terminal,
  copy: text => void copied.push(text),
  log: createLogger('dev', line => void logged.push(line)),
  ...over,
})

beforeEach(() => {
  ran = []
  exitCode = 0
  copied = []
  logged = []
})

describe('opening Claude Code', () => {
  it('opens the chosen terminal when no session is open', async () => {
    const handover = await openClaudeCode(deps('iterm'), '/p/demo', false)

    expect(handover).toEqual({ kind: 'opened', terminal: 'iterm' })
    expect(ran[0]!.join(' ')).toContain('claude')
  })

  it('brings the terminal forward when a session is open, and starts no second one', async () => {
    const handover = await openClaudeCode(deps('terminal'), '/p/demo', true)

    expect(handover).toEqual({ kind: 'opened', terminal: 'terminal' })
    expect(ran[0]!.join(' ')).not.toContain('claude')
  })

  it('copies claude for VS Code, which has to be pasted', async () => {
    await openClaudeCode(deps('vscode'), '/p/demo', false)

    expect(copied).toEqual(['claude'])
  })

  it('leaves the clipboard alone when VS Code is only brought forward', async () => {
    await openClaudeCode(deps('vscode'), '/p/demo', true)

    expect(copied).toEqual([])
  })

  it('names the terminal and gives the line to copy when it would not open', async () => {
    exitCode = 1
    const handover = await openClaudeCode(deps('iterm'), '/p/my realm', false)

    expect(handover).toEqual({ kind: 'failed', terminal: 'iterm', command: "cd '/p/my realm' && claude" })
    expect(logged.join('\n')).toContain('no such application')
  })

  it('reports a failure when the launch itself throws', async () => {
    const copy = vi.fn(() => {
      throw new Error('clipboard is locked')
    })
    const handover = await openClaudeCode(deps('vscode', { copy }), '/p/demo', false)

    expect(handover.kind).toBe('failed')
    expect(logged.join('\n')).toContain('clipboard is locked')
  })
})

// A host that also makes folders and writes files, or fails to.
const briefHost = (over: { madeExit?: number; write?: () => Promise<void> } = {}) => {
  const written: Record<string, string> = {}
  const host = {
    run: async (argv: string[]) => {
      ran.push(argv)

      return { exitCode, stdout: '', stderr: exitCode === 0 ? '' : 'no such application' }
    },
    makeDirs: async () => ({ exitCode: over.madeExit ?? 0, stdout: '', stderr: over.madeExit ? 'Permission denied' : '' }),
    write:
      over.write ??
      (async (path: string, text: string) => {
        written[path] = text
      }),
  } as unknown as Host

  return { host, written }
}

const BRIEF_FILE = '/home/.queue-tea/briefs/t-1.md'

describe('opening Codex', () => {
  it('writes the brief under ~/.queue-tea/briefs and opens the terminal on Codex reading it', async () => {
    const { host, written } = briefHost()

    const handover = await openCodex(deps('terminal', { host }), '/p/demo', 't-1', 'From Queue-tea: the rules.\n\nTask: A')

    expect(handover).toEqual({ kind: 'opened', terminal: 'terminal' })
    expect(written).toEqual({ [BRIEF_FILE]: 'From Queue-tea: the rules.\n\nTask: A' })
    expect(ran).toHaveLength(1)
    expect(ran[0]!.join(' ')).toContain(`codex --sandbox workspace-write --ask-for-approval on-request \\"$(cat '${BRIEF_FILE}')\\"`)
  })

  it('copies the whole Codex line for VS Code, which has to be pasted', async () => {
    const { host } = briefHost()

    await openCodex(deps('vscode', { host }), '/p/demo', 't-1', 'Task: A')

    expect(copied).toEqual([codexLine('/p/demo', BRIEF_FILE)])
  })

  it('a briefs folder that cannot be made opens nothing, and gives a line to paste that carries the brief', async () => {
    const { host } = briefHost({ madeExit: 1 })

    const handover = await openCodex(deps('iterm', { host }), '/p/demo', 't-1', 'Task: A')

    expect(handover).toEqual({ kind: 'failed', terminal: 'iterm', command: codexPasteLine('/p/demo', 'Task: A') })
    if (handover.kind !== 'failed') return
    expect(handover.command).not.toContain('$(cat')
    expect(handover.command).toContain(`'Task: A'`)
    expect(ran).toEqual([])
    expect(logged.join('\n')).toContain('writing the Codex brief failed')
  })

  it('a brief that cannot be written fails the same way, with a single quote in it escaped', async () => {
    const { host } = briefHost({
      write: async () => {
        throw new Error('ENOSPC: no space left')
      },
    })

    const handover = await openCodex(deps('terminal', { host }), '/p/demo', 't-1', "Don't push.")

    expect(handover).toEqual({ kind: 'failed', terminal: 'terminal', command: `cd '/p/demo' && codex --sandbox workspace-write --ask-for-approval on-request 'Don'\\''t push.'` })
    expect(ran).toEqual([])
    expect(logged.join('\n')).toContain('ENOSPC')
  })

  it('a terminal that will not open, once the brief is written, gives the line that reads it', async () => {
    exitCode = 1
    const { host } = briefHost()

    const handover = await openCodex(deps('iterm', { host }), '/p/demo', 't-1', 'Task: A')

    expect(handover).toEqual({ kind: 'failed', terminal: 'iterm', command: codexLine('/p/demo', BRIEF_FILE) })
  })
})
