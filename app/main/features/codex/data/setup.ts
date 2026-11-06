import { createHash } from 'node:crypto'
import { lstat, mkdir, readFile, readlink, symlink, writeFile } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'

import { CODEX_TEXT } from '../domain/constants'
import { codexSkills, companionSkills } from './definitions'

const digest = (text: string) => createHash('sha256').update(text).digest('hex')
const info = async (path: string) => {
  try {
    return await lstat(path)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw err
  }
}

// Own folders only. Never overwrite an unrelated skill, a symlink, or a skill
// the user edited after generation. The host handles and logs any failure.
export const installCodexSkills = async (root: string): Promise<string[]> => {
  const rootInfo = await info(root)
  if (rootInfo !== null && (!rootInfo.isDirectory() || rootInfo.isSymbolicLink())) throw new Error('The Codex skill folder must be a real directory.')
  await mkdir(root, { recursive: true })
  const written: string[] = []
  for (const [name, contents] of Object.entries(codexSkills())) {
    const folder = join(root, `queue-tea-${name}`)
    const file = join(folder, 'SKILL.md')
    const owner = join(folder, '.queue-tea.sha256')
    const folderInfo = await info(folder)
    if (folderInfo === null) await mkdir(folder)
    else {
      if (!folderInfo.isDirectory() || folderInfo.isSymbolicLink()) throw new Error(`Refusing to replace ${folder}`)
      const fileInfo = await info(file)
      const ownerInfo = await info(owner)
      if (!fileInfo?.isFile() || fileInfo.isSymbolicLink() || !ownerInfo?.isFile() || ownerInfo.isSymbolicLink()) throw new Error(`Existing skill is not owned by Queue-tea: ${folder}`)
      const old = await readFile(file, 'utf8')
      if (!old.includes(CODEX_TEXT.skillMarker) || digest(old) !== (await readFile(owner, 'utf8')).trim()) throw new Error(`Keep the edited skill and move it out of ${folder} before retrying setup.`)
      if (old === contents) continue
    }
    await writeFile(file, contents, 'utf8')
    await writeFile(owner, digest(contents), 'utf8')
    written.push(file)
  }

  return written
}

// Codex follows skill-folder symlinks. Keep third-party skills and all their
// references in their installed source folders, with no network or copying.
// Existing destinations are left alone, including links to an older install.
export const linkCompanionSkills = async (root: string, home: string): Promise<{ linked: string[]; missing: string[] }> => {
  const manifest = join(home, '.claude/plugins/installed_plugins.json')
  let plugins: Record<string, { installPath?: unknown }[]> = {}
  if (await info(manifest)) {
    const parsed: unknown = JSON.parse(await readFile(manifest, 'utf8'))
    if (typeof parsed === 'object' && parsed !== null && 'plugins' in parsed && typeof parsed.plugins === 'object' && parsed.plugins !== null) plugins = parsed.plugins as typeof plugins
  }
  const linked: string[] = []
  const missing: string[] = []
  for (const name of companionSkills()) {
    const [plugin, skill] = name.split(':') as [string, string]
    const candidates = Object.entries(plugins).filter(([id]) => id.split('@')[0] === plugin).flatMap(([, entries]) => Array.isArray(entries) ? entries : []).flatMap(entry => typeof entry?.installPath === 'string' && isAbsolute(entry.installPath) ? [join(entry.installPath, 'skills', skill)] : [])
    candidates.push(join(home, '.claude/skills', skill))
    let source: string | null = null
    for (const candidate of candidates) {
      if ((await info(join(candidate, 'SKILL.md')))?.isFile()) { source = candidate; break }
    }
    const destination = join(root, `queue-tea-companion-${plugin}-${skill}`)
    const existing = await info(destination)
    if (source === null) { missing.push(name); continue }
    if (existing !== null) {
      if (!existing.isSymbolicLink() || await readlink(destination) !== source) missing.push(`${name} (existing destination preserved)`)
      continue
    }
    await symlink(source, destination)
    linked.push(name)
  }

  return { linked, missing }
}

export type CodexRuntime = { command: string; server: string; electron?: boolean }

// JSON strings are valid TOML basic strings here. The caller separately quotes
// each whole argument for the shell; no config or prompt text is executable.
export const codexConfigArgs = (runtime: CodexRuntime, cwd: string): string[] => {
  const entries: Record<string, unknown> = {
    command: runtime.command,
    args: [runtime.server, '--cwd', cwd],
    cwd,
    enabled: true,
    required: true,
  }
  return [
    ...Object.entries(entries).flatMap(([key, value]) => ['-c', `mcp_servers.queue-tea.${key}=${JSON.stringify(value)}`]),
    ...(runtime.electron === true ? ['-c', 'mcp_servers.queue-tea.env.ELECTRON_RUN_AS_NODE="1"'] : []),
  ]
}
