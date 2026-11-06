import { mkdir, mkdtemp, readFile, readlink, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { codexSkills } from './definitions'
import { codexConfigArgs, installCodexSkills, linkCompanionSkills } from './setup'

let root: string
beforeEach(async () => { root = await mkdtemp(join(tmpdir(), 'queue-tea-skills-')) })
afterEach(async () => { await rm(root, { recursive: true, force: true }) })

describe('Codex skill setup', () => {
  it('installs all shared workflows, is idempotent and preserves edited skills', async () => {
    const files = await installCodexSkills(root)
    expect(files).toHaveLength(12)
    expect(await installCodexSkills(root)).toEqual([])
    for (const [name, contents] of Object.entries(codexSkills())) {
      expect(await readFile(join(root, `queue-tea-${name}/SKILL.md`), 'utf8')).toBe(contents)
    }
    const ours = join(root, 'queue-tea-brew/SKILL.md')
    await writeFile(ours, 'My edited skill')
    await expect(installCodexSkills(root)).rejects.toThrow('Keep the edited skill')
    expect(await readFile(ours, 'utf8')).toBe('My edited skill')
  })

  it('refuses a symlink rather than overwriting its target', async () => {
    const destination = join(root, 'keep.txt')
    await writeFile(destination, 'keep me')
    await symlink(destination, join(root, 'queue-tea-queue-tea'))
    await expect(installCodexSkills(root)).rejects.toThrow('Refusing to replace')
    expect(await readFile(destination, 'utf8')).toBe('keep me')
  })

  it('keeps shell characters as data in per-session MCP configuration', () => {
    const path = `/tmp/a folder ' $(whoami)`
    const args = codexConfigArgs({ command: '/Applications/Queue-tea.app/Contents/MacOS/Queue-tea', server: `${path}/server.cjs`, electron: true }, path)
    expect(args).toContain(`mcp_servers.queue-tea.args=${JSON.stringify([`${path}/server.cjs`, '--cwd', path])}`)
    expect(args).toContain('mcp_servers.queue-tea.env.ELECTRON_RUN_AS_NODE="1"')
    expect(args).toContain('mcp_servers.queue-tea.required=true')
    expect(args.join(' ')).not.toContain('approval_mode')
  })

  it('links available companion skills with their resources, reports missing ones and preserves destinations', async () => {
    const plugin = join(root, 'plugin')
    const source = join(plugin, 'skills/git-workflow-and-versioning')
    const installed = join(root, '.claude/plugins')
    await mkdir(join(source, 'references'), { recursive: true })
    await mkdir(installed, { recursive: true })
    await writeFile(join(installed, 'installed_plugins.json'), JSON.stringify({ plugins: { 'agent-skills@example': [{ installPath: plugin }] } }))
    await writeFile(join(source, 'SKILL.md'), '---\nname: git-workflow-and-versioning\ndescription: Git workflow\n---\nRead references/rules.md.')
    await writeFile(join(source, 'references/rules.md'), 'Keep the history intact.')
    const result = await linkCompanionSkills(root, root)
    expect(result.linked).toContain('agent-skills:git-workflow-and-versioning')
    expect(result.missing).toContain('superpowers:verification-before-completion')
    const destination = join(root, 'queue-tea-companion-agent-skills-git-workflow-and-versioning')
    expect(await readlink(destination)).toBe(source)
    expect(await readFile(join(destination, 'references/rules.md'), 'utf8')).toBe('Keep the history intact.')
    expect((await linkCompanionSkills(root, root)).linked).toEqual([])
    await rm(destination)
    await mkdir(destination)
    await writeFile(join(destination, 'SKILL.md'), 'user-owned')
    expect((await linkCompanionSkills(root, root)).missing).toContain('agent-skills:git-workflow-and-versioning (existing destination preserved)')
    expect(await readFile(join(destination, 'SKILL.md'), 'utf8')).toBe('user-owned')
  })
})
