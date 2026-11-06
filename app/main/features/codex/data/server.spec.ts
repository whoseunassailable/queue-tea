import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { ProjectRecord } from '../../../../../types'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { makeTask } from '../../tasks/api/fixtures'
import type { CodexContext } from '../domain/operations'
import { loadCodexContext } from './context'
import { createCodexServer } from './server'

let root: string
let context: CodexContext
let server: McpServer
let client: Client
let logs: string[]
const seed = (record: ProjectRecord) => writeFile(context.ctx.file, JSON.stringify(record))
const read = async (): Promise<ProjectRecord> => JSON.parse(await readFile(context.ctx.file, 'utf8'))
const call = async (name: string, args: Record<string, unknown> = {}) => {
  const result = await client.callTool({ name, arguments: args })
  const content = result.content as { type: string; text: string }[]

  return { error: result.isError === true, text: content[0]!.text }
}

beforeEach(async () => {
  root = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-codex-')))
  const cwd = join(root, 'workspace')
  await mkdir(cwd)
  logs = []
  const log = createLogger('dev', line => logs.push(line))
  context = await loadCodexContext(nodeHost(log, async () => { throw new Error('unexpected open') }), log, cwd, root)
  await mkdir(join(root, '.queue-tea/projects'), { recursive: true })
  await seed({ ...emptyRecord('workspace', cwd), tasks: [
    makeTask({ id: 'other', state: 'current', worktreePath: join(root, 'other') }),
    makeTask({ id: 'ours', state: 'current', worktreePath: cwd }),
    makeTask({ id: 'feature', title: 'New flow' }),
  ] })
  server = createCodexServer(context, log)
  client = new Client({ name: 'test', version: '1' })
  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair()
  await server.connect(serverSide)
  await client.connect(clientSide)
})

afterEach(async () => {
  await client?.close()
  await server?.close()
  await rm(root, { recursive: true, force: true })
})

describe('Queue-tea MCP operations', () => {
  it('exposes all workflows and selects the current task in this folder', async () => {
    const names = (await client.listTools()).tools.map(t => t.name)
    expect(names).toEqual(expect.arrayContaining(['queue_tea', 'brew', 'instant', 'tea', 'steep', 'feature', 'done', 'task_looks_done', 'helper_instructions', 'helper_finished']))
    expect(JSON.parse((await call('queue_tea')).text).current.id).toBe('ours')
  })

  it('errands return the request and never write queue records', async () => {
    const before = await readFile(context.ctx.file, 'utf8')
    for (const name of ['brew', 'instant', 'tea']) {
      const result = JSON.parse((await call(name, { request: 'Explain this code' })).text)
      expect(result.request).toBe('Explain this code')
      expect(result.instructions).toContain('outside the Queue-tea queue')
      if (name === 'tea') expect(result.instructions).toContain('change no files')
    }
    expect(await readFile(context.ctx.file, 'utf8')).toBe(before)
  })

  it('queues messages under an explicitly selected feature and preserves both active tasks', async () => {
    await call('feature', { args: 'New flow' })
    expect((await read()).feature).toBe('feature')
    const result = await call('steep', { message: 'Add a keyboard shortcut', parentId: 'feature' })
    expect(result.error).toBe(false)
    const filed = JSON.parse(result.text).task
    expect(filed).toMatchObject({ state: 'queued', parentId: 'feature', messages: ['Add a keyboard shortcut'] })
    expect((await read()).tasks.filter(t => t.state === 'current').map(t => t.id)).toEqual(['other', 'ours'])
    await call('feature', { args: 'off' })
    expect((await read()).feature).toBe(null)
  })

  it('reminds once, records completed helpers idempotently, and requests review without finishing', async () => {
    const first = await call('task_looks_done', { taskId: 'ours', checked: 'npm test passed' })
    expect(first.text).toContain('tea-dd')
    expect((await read()).tasks.find(t => t.id === 'ours')!.review).toBe(null)
    await call('helper_finished', { taskId: 'ours', helper: 'tea-dd' })
    await call('helper_finished', { taskId: 'ours', helper: 'tea-dd' })
    await call('done', { taskId: 'ours', checked: 'npm test: 12 passed' })
    const record = await read()
    expect(record.tasks.find(t => t.id === 'ours')).toMatchObject({ state: 'current', helpers: { ran: ['tea-dd'] }, review: { checked: 'npm test: 12 passed' } })
    expect(record.tasks.find(t => t.id === 'other')!.review).toBe(null)
  })

  it('rejects other worktrees, stale task IDs, bad schemas and unreadable records', async () => {
    for (const taskId of ['other', 'stale']) {
      expect((await call('done', { taskId })).error).toBe(true)
      expect((await call('helper_finished', { taskId, helper: 'tea-dd' })).error).toBe(true)
    }
    for (const args of [{ message: ' ' }, { message: 'x', cwd: '/elsewhere' }, { message: 'x', parentId: 'missing' }]) {
      expect((await call('steep', args)).error).toBe(true)
    }
    await writeFile(context.ctx.file, 'broken')
    expect((await call('steep', { message: 'Keep this' })).error).toBe(true)
    expect(await readFile(context.ctx.file, 'utf8')).toBe('broken')
    expect(logs.join('')).toContain('Codex tool failed')
  })

  it('keeps concurrent record writers through the shared lock', async () => {
    await Promise.all(Array.from({ length: 8 }, (_, i) => call('steep', { message: `Task ${i}` })))
    expect((await read()).tasks).toHaveLength(11)
  })

  it('loads every shared helper, retaining external skill names without claiming they are installed', async () => {
    for (const helper of ['chai-pter', 'commit-chai-n', 'mocha-mockup', 'tea-dd']) {
      const result = await call('helper_instructions', { helper })
      expect(result.error).toBe(false)
      expect(result.text).toContain('Companion skills:')
      expect(result.text).toContain('Report any missing skills')
    }
    expect((await read()).tasks.find(t => t.id === 'ours')!.helpers.ran).toEqual([])
  })
})
