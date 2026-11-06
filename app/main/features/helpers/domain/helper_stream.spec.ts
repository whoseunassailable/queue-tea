import { describe, expect, it } from 'vitest'

import { doingOf, HELPER_LIMITS, lineReader, orderOf, seenIn } from './helper_stream'

const AGENT = 'queue-tea:tea-dd'
const line = (event: object) => JSON.stringify(event)
const tool = (name: string, input: object) => line({ type: 'assistant', message: { content: [{ type: 'tool_use', name, input }] } })

describe('what a stream line means', () => {
  it('names the file a helper reads, edits or writes, not its whole path', () => {
    expect(seenIn(tool('Read', { file_path: '/p/demo/src/timer.ts' }), AGENT)).toEqual({ kind: 'doing', doing: { kind: 'reading', target: 'timer.ts' } })
    expect(doingOf('Edit', { file_path: '/p/demo/a.ts' })).toEqual({ kind: 'editing', target: 'a.ts' })
    expect(doingOf('Write', { file_path: '/p/demo/b.md' })).toEqual({ kind: 'writing', target: 'b.md' })
  })

  it("says a command in Claude's own words when it gave them", () => {
    expect(doingOf('Bash', { command: 'npm test -- --run', description: 'Run the tests' })).toEqual({ kind: 'step', target: 'Run the tests' })
    expect(doingOf('Bash', { command: 'npm test' })).toEqual({ kind: 'running', target: 'npm test' })
  })

  it('cuts a long target short', () => {
    const target = doingOf('Grep', { pattern: 'x'.repeat(200) }).target!

    expect(target.length).toBe(HELPER_LIMITS.targetChars)
    expect(target.endsWith('…')).toBe(true)
  })

  it('names the site a page comes from', () => {
    expect(doingOf('WebFetch', { url: 'https://vitest.dev/api/' })).toEqual({ kind: 'browsing', target: 'vitest.dev' })
    expect(doingOf('WebFetch', { url: 'not a url' })).toEqual({ kind: 'browsing', target: null })
  })

  it('takes the last tool when one message holds several', () => {
    const both = line({ type: 'assistant', message: { content: [{ type: 'text', text: 'First' }, { type: 'tool_use', name: 'Read', input: { file_path: 'a' } }, { type: 'tool_use', name: 'Glob', input: { pattern: '*.ts' } }] } })

    expect(seenIn(both, AGENT)).toEqual({ kind: 'doing', doing: { kind: 'searching', target: '*.ts' } })
  })

  it('is thinking when it only writes', () => {
    expect(seenIn(line({ type: 'assistant', message: { content: [{ type: 'text', text: 'Let me look.' }] } }), AGENT)).toEqual({ kind: 'doing', doing: { kind: 'thinking', target: null } })
  })

  it('hands on the answer, or a failure', () => {
    expect(seenIn(line({ type: 'result', subtype: 'success', is_error: false, result: 'All green.' }), AGENT)).toEqual({ kind: 'done', reply: 'All green.' })
    expect(seenIn(line({ type: 'result', subtype: 'error_max_turns', is_error: true }), AGENT)).toEqual({ kind: 'failed', detail: 'error_max_turns' })
  })

  it("notices when Claude Code doesn't have the helper", () => {
    expect(seenIn(line({ type: 'system', subtype: 'init', agents: ['claude', 'queue-tea:chai-pter'] }), AGENT)).toEqual({ kind: 'missing' })
    expect(seenIn(line({ type: 'system', subtype: 'init', agents: ['claude', AGENT] }), AGENT)).toBeNull()
  })

  it('passes over what the card has no use for', () => {
    expect(seenIn('Warning: this sign-in can end soon', AGENT)).toBeNull()
    expect(seenIn(line({ type: 'system', subtype: 'hook_started' }), AGENT)).toBeNull()
    expect(seenIn(line({ type: 'user', message: { content: [{ type: 'tool_result' }] } }), AGENT)).toBeNull()
    expect(seenIn('null', AGENT)).toBeNull()
  })

  it('names a tool it does not know by its own name', () => {
    expect(seenIn(tool('mcp__linear__create_issue', { title: 'x' }), AGENT)).toEqual({ kind: 'doing', doing: { kind: 'working', target: 'mcp__linear__create_issue' } })
  })

  it('does not call the helper missing when Claude Code lists no agents', () => {
    expect(seenIn(line({ type: 'system', subtype: 'init' }), AGENT)).toBeNull()
  })

  it('passes over a message holding a block it cannot read, keeping the tool beside it', () => {
    const odd = line({ type: 'assistant', message: { content: [null, { type: 'tool_use', name: 'Read', input: { file_path: '/x/timer.ts' } }] } })

    expect(seenIn(odd, AGENT)).toEqual({ kind: 'doing', doing: { kind: 'reading', target: 'timer.ts' } })
  })
})

describe('reading the stream in chunks', () => {
  it('hands on whole lines however the chunks cut them', () => {
    const lines: string[] = []
    const read = lineReader(l => lines.push(l))

    read('{"a":')
    read('1}\n{"b"')
    read(':2}\n\n')

    expect(lines).toEqual(['{"a":1}', '{"b":2}'])
  })

  it('drops a line too long to keep', () => {
    const lines: string[] = []
    const read = lineReader(l => lines.push(l))

    read('x'.repeat(HELPER_LIMITS.lineChars + 1))
    read('tail\n')

    expect(lines).toEqual(['tail'])
  })
})

describe('the order', () => {
  it('takes it trimmed', () => {
    expect(orderOf('  Write tests  ')).toEqual({ ok: true, order: 'Write tests' })
  })

  it('refuses one that is empty, too long or not text', () => {
    expect(orderOf('   ')).toEqual({ ok: false, why: 'empty' })
    expect(orderOf(42)).toEqual({ ok: false, why: 'empty' })
    expect(orderOf('x'.repeat(HELPER_LIMITS.orderChars + 1))).toEqual({ ok: false, why: 'long' })
  })

  it('takes one of exactly the longest length, as the form does', () => {
    const longest = 'x'.repeat(HELPER_LIMITS.orderChars)

    expect(orderOf(`  ${longest}\n`)).toEqual({ ok: true, order: longest })
  })
})
