import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { test } from 'node:test'
import { promisify } from 'node:util'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const run = promisify(execFile)
const server = resolve('out/codex/server.cjs')
const command = process.env.QUEUE_TEA_CODEX_RUNTIME ?? process.execPath
const env = Object.fromEntries(Object.entries({ ...process.env, ELECTRON_RUN_AS_NODE: '1' }).filter(([, value]) => value !== undefined))

test('built stdio server initializes, validates tools, persists through a second process, and generates skills', async () => {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-codex-stdio-')))
  const cwd = join(root, 'project with spaces')
  await mkdir(cwd)
  const connect = async () => {
    const client = new Client({ name: 'queue-tea-smoke', version: '1' })
    const transport = new StdioClientTransport({ command, args: [server, '--cwd', cwd, '--home', root], env, stderr: 'pipe' })
    let stderr = ''
    transport.stderr?.on('data', data => { stderr += String(data) })
    try {
      await client.connect(transport)
    } catch (err) {
      await transport.close()
      throw new Error(`${err}\n${stderr}`)
    }

    return client
  }
  const call = async (client, name, args = {}) => {
    const result = await client.callTool({ name, arguments: args })
    assert.equal(result.isError, undefined, JSON.stringify(result))

    return JSON.parse(result.content[0].text)
  }
  let first
  let second
  try {
    first = await connect()
    assert.equal((await first.listTools()).tools.length, 10)
    assert.equal((await call(first, 'queue_tea')).current, null)
    const filed = await call(first, 'steep', { message: 'Prove real persistence' })
    assert.equal(filed.task.state, 'queued')
    second = await connect()
    assert.equal((await call(second, 'queue_tea')).queued[0].id, filed.task.id)
    assert.equal((await first.callTool({ name: 'steep', arguments: { message: '' } })).isError, true)
    assert.equal((await first.callTool({ name: 'done', arguments: { taskId: filed.task.id } })).isError, true)
    assert.equal((await call(second, 'queue_tea')).queued[0].state, 'queued')
    await call(first, 'feature', { args: filed.task.id })
    assert.equal((await call(second, 'queue_tea')).feature.id, filed.task.id)
    for (const helper of ['chai-pter', 'commit-chai-n', 'mocha-mockup', 'tea-dd']) {
      assert.match((await call(first, 'helper_instructions', { helper })).instructions, /Companion skills:/)
    }
    const skillRoot = join(root, 'skills')
    const setup = await run(command, [server, 'setup', '--skills-dir', skillRoot, '--home', root], { env })
    assert.match(setup.stdout, /12 written/)
    assert.match(await readFile(join(skillRoot, 'queue-tea-brew/SKILL.md'), 'utf8'), /name: brew/)
  } finally {
    await first?.close()
    await second?.close()
    await rm(root, { recursive: true, force: true })
  }
})
