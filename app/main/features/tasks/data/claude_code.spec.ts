import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Host } from '../../../../../hooks/core/host/host'
import type { TerminalChoice } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { openClaudeCode } from './claude_code'
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
