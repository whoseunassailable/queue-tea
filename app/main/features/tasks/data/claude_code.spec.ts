import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Host } from '../../../../../hooks/core/host/host'
import type { SessionFile } from '../../../../../hooks/shared/sessions/domain/entities/session_file'
import type { TerminalChoice } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { codexLine, codexPasteLine } from '../../../core/platform/mac'
import { focusCodex, openClaudeCode, openCodex, openSessionOf } from './claude_code'
import type { ClaudeDeps, OpenSession } from './claude_code'

let ran: string[][]
let exitCode: number
let stdout: string
let copied: string[]
let logged: string[]

const deps = (terminal: TerminalChoice = 'terminal', over: Partial<ClaudeDeps> = {}): ClaudeDeps => ({
  host: {
    run: async (argv: string[]) => {
      ran.push(argv)

      return { exitCode, stdout, stderr: exitCode === 0 ? '' : 'no such application' }
    },
  } as unknown as Host,
  home: '/home',
  terminal: async () => terminal,
  copy: text => void copied.push(text),
  log: createLogger('dev', line => void logged.push(line)),
  ...over,
})

// A session whose file says nothing of its terminal, as an older mod's.
const SESSION: OpenSession = { tty: null, terminal: null }

beforeEach(() => {
  ran = []
  exitCode = 0
  stdout = ''
  copied = []
  logged = []
})

describe('opening Claude Code', () => {
  it('opens the chosen terminal when no session is open', async () => {
    const handover = await openClaudeCode(deps('iterm'), '/p/demo', null)

    expect(handover).toEqual({ kind: 'opened', terminal: 'iterm' })
    expect(ran[0]!.join(' ')).toContain('claude')
  })

  it('brings the terminal forward when a session is open, and starts no second one', async () => {
    const handover = await openClaudeCode(deps('terminal'), '/p/demo', SESSION)

    expect(handover).toEqual({ kind: 'opened', terminal: 'terminal' })
    expect(ran[0]!.join(' ')).not.toContain('claude')
  })

  it("brings forward the session's own tab by its tty, in the terminal it runs in", async () => {
    stdout = 'found\n'
    const handover = await openClaudeCode(deps('terminal'), '/p/demo', { tty: '/dev/ttys004', terminal: 'iterm' })

    expect(handover).toEqual({ kind: 'opened', terminal: 'iterm' })
    expect(ran[0]!.join(' ')).toContain('tell application "iTerm"')
    expect(ran[0]!.join(' ')).toContain('tty of queueTeaSession is "/dev/ttys004"')
  })

  it('a session that names no terminal app is looked for in the chosen one', async () => {
    const handover = await openClaudeCode(deps('terminal'), '/p/demo', { tty: '/dev/ttys004', terminal: null })

    expect(handover).toEqual({ kind: 'opened', terminal: 'terminal' })
    expect(ran[0]!.join(' ')).toContain('tty of queueTeaTab is "/dev/ttys004"')
  })

  it('says the tab was not found when no tab holds the session, with no line that would start a second one', async () => {
    stdout = 'missing\n'
    const handover = await openClaudeCode(deps('terminal'), '/p/demo', { tty: '/dev/ttys004', terminal: null })

    expect(handover).toEqual({ kind: 'notFound', terminal: 'terminal' })
    expect(logged.join('\n')).toContain('no terminal tab holds the session in /p/demo')
    expect(copied).toEqual([])
  })

  it('a missing tab when nothing was open is no miss: a new window prints nothing', async () => {
    stdout = 'missing\n'

    expect(await openClaudeCode(deps('terminal'), '/p/demo', null)).toEqual({ kind: 'opened', terminal: 'terminal' })
  })

  it('copies claude for VS Code, which has to be pasted', async () => {
    await openClaudeCode(deps('vscode'), '/p/demo', null)

    expect(copied).toEqual(['claude'])
  })

  it('leaves the clipboard alone when VS Code is only brought forward', async () => {
    await openClaudeCode(deps('vscode'), '/p/demo', SESSION)

    expect(copied).toEqual([])
  })

  it('names the terminal and gives the line to copy when it would not open', async () => {
    exitCode = 1
    const handover = await openClaudeCode(deps('iterm'), '/p/my realm', null)

    expect(handover).toEqual({ kind: 'failed', terminal: 'iterm', command: "cd '/p/my realm' && claude" })
    expect(logged.join('\n')).toContain('no such application')
  })

  it('reports a failure when the launch itself throws', async () => {
    const copy = vi.fn(() => {
      throw new Error('clipboard is locked')
    })
    const handover = await openClaudeCode(deps('vscode', { copy }), '/p/demo', null)

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
  it('focuses an existing session without attempting setup that would fail', async () => {
    const prepareCodex = vi.fn(async (): Promise<string[]> => { throw new Error('edited skill') })
    expect(await focusCodex(deps('terminal', { prepareCodex }), '/p/demo', 'Task: A')).toEqual({ kind: 'opened', terminal: 'terminal' })
    expect(prepareCodex).not.toHaveBeenCalled()
    expect(ran).toHaveLength(1)
    expect(ran[0]!.join(' ')).not.toContain('do script')
  })

  it('prepares a configured recovery command only after focusing fails', async () => {
    exitCode = 1
    const args = ['-c', 'mcp_servers.queue-tea.required=true']
    const prepareCodex = vi.fn(async () => {
      expect(ran).toHaveLength(1)

      return args
    })
    expect(await focusCodex(deps('iterm', { prepareCodex }), '/p/demo', 'Task: A')).toEqual({ kind: 'failed', terminal: 'iterm', command: codexPasteLine('/p/demo', 'Task: A', args) })
    expect(prepareCodex).toHaveBeenCalledWith('/p/demo')
  })

  it('a Codex tab that is not there gets the recovery line, as a failed focus does', async () => {
    stdout = 'missing\n'
    const prepareCodex = vi.fn(async () => ['-c', 'x=1'])

    expect(await focusCodex(deps('terminal', { prepareCodex }), '/p/demo', 'Task: A')).toEqual({ kind: 'failed', terminal: 'terminal', command: codexPasteLine('/p/demo', 'Task: A', ['-c', 'x=1']) })
  })

  it('prepares the adapter before launch and preserves its configuration in fallback commands', async () => {
    const { host } = briefHost({ madeExit: 1 })
    const prepareCodex = vi.fn(async () => ['-c', 'mcp_servers.queue-tea.required=true'])
    const result = await openCodex(deps('terminal', { host, prepareCodex }), '/p/demo', 't-1', 'Task: A')
    expect(prepareCodex).toHaveBeenCalledWith('/p/demo')
    expect(result).toEqual({ kind: 'failed', terminal: 'terminal', command: codexPasteLine('/p/demo', 'Task: A', await prepareCodex()) })
    expect(ran).toEqual([])
  })

  it('does not launch a bare session when adapter setup fails', async () => {
    const { host } = briefHost()
    await expect(openCodex(deps('terminal', { host, prepareCodex: async () => { throw new Error('edited skill') } }), '/p/demo', 't-1', 'Task: A')).rejects.toThrow('edited skill')
    expect(ran).toEqual([])
  })

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

describe("a session's terminal", () => {
  const file = (terminal?: SessionFile['terminal']): SessionFile => ({
    id: 's-1',
    projectPath: '/p',
    recordFile: '/h/r.json',
    currentTaskId: null,
    isTurnRunning: false,
    cup: { mood: 'idle', line: '' },
    allowance: null,
    options: { idleGapMinutes: 15, freshAtTokens: 1, handoffAtPercent: 1, checkTimeoutSeconds: 1 },
    heartbeat: 0,
    startedAt: 0,
    ...(terminal === undefined ? {} : { terminal }),
  })

  it('is its tty, in the app its TERM_PROGRAM names', () => {
    expect(openSessionOf(file({ program: 'Apple_Terminal', tty: '/dev/ttys004' }))).toEqual({ tty: '/dev/ttys004', terminal: 'terminal' })
    expect(openSessionOf(file({ program: 'iTerm.app', tty: '/dev/ttys005' }))).toEqual({ tty: '/dev/ttys005', terminal: 'iterm' })
    expect(openSessionOf(file({ program: 'vscode', tty: null }))).toEqual({ tty: null, terminal: 'vscode' })
  })

  it('an app Queue-tea cannot drive, or an older file, leaves the chosen terminal to try', () => {
    expect(openSessionOf(file({ program: 'WarpTerminal', tty: '/dev/ttys006' }))).toEqual({ tty: '/dev/ttys006', terminal: null })
    expect(openSessionOf(file())).toEqual({ tty: null, terminal: null })
  })
})
