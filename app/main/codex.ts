import { homedir } from 'node:os'
import { isAbsolute, join, resolve } from 'node:path'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { createLogger } from './core/logger'
import { nodeHost } from './core/node_host'
import { loadCodexContext } from './features/codex/data/context'
import { createCodexServer } from './features/codex/data/server'
import { installCodexSkills, linkCompanionSkills } from './features/codex/data/setup'

const log = createLogger('prod', line => process.stderr.write(line))

const main = async () => {
  const args = process.argv.slice(2)
  const setup = args[0] === 'setup'
  if (setup) args.shift()
  const values = new Map<string, string>()
  const allowed = setup ? ['--skills-dir', '--home'] : ['--cwd', '--home']
  for (let i = 0; i < args.length; i += 2) {
    const name = args[i]!
    const value = args[i + 1]
    if (!allowed.includes(name) || value === undefined || !isAbsolute(value) || values.has(name)) throw new Error('Use setup [--skills-dir /absolute/path], or --cwd /absolute/project [--home /absolute/home].')
    values.set(name, value)
  }
  if (setup) {
    const home = values.get('--home') ?? homedir()
    const root = values.get('--skills-dir') ?? join(home, '.agents', 'skills')
    const files = await installCodexSkills(root)
    const companions = await linkCompanionSkills(root, home)
    process.stdout.write(`Queue-tea skills ready (${files.length} written). Configure the queue-tea MCP server, then restart Codex.\n`)
    process.stdout.write(`Companion skills linked: ${companions.linked.length}. Missing: ${companions.missing.join(', ') || 'none'}.\n`)

    return
  }
  const host = nodeHost(log, async () => ({ exitCode: 1, stdout: '', stderr: 'Opening URLs is not a Queue-tea MCP operation.' }))
  const context = await loadCodexContext(host, log, resolve(values.get('--cwd') ?? process.cwd()), values.get('--home') ?? homedir())
  const server = createCodexServer(context, log)
  await server.connect(new StdioServerTransport())
}

main().catch(err => {
  log.error('Queue-tea Codex startup failed', err)
  process.exitCode = 1
})
