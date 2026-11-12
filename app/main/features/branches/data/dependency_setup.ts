import { lstat, readdir, realpath } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { Refusal } from '../../../core/reply'
import type { TasksDeps } from '../../tasks/api/scope'
import { BRANCH_TEXT } from '../domain/constants'
import { isFile } from '../domain/git_rules'

export class DependencySetupRequired extends Refusal {}
export class CheckStopped extends Error {
  constructor(readonly status: 'cancelled' | 'failed') { super(status === 'cancelled' ? BRANCH_TEXT.checkCancelled : BRANCH_TEXT.checkTimeout) }
}
type Package = { version?: string; resolved?: string; integrity?: string; link?: boolean; optional?: boolean; bin?: Record<string, string>; dependencies?: Record<string, string>; devDependencies?: Record<string, string>; optionalDependencies?: Record<string, string>; peerDependencies?: Record<string, string> }
type Lock = { lockfileVersion?: number; packages?: Record<string, Package> }
const inside = (root: string, path: string) => path === root || path.startsWith(root + sep)
const quote = (text: string) => "'" + text.replaceAll("'", "'\\''") + "'"
const dependencyKinds = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'] as const
const sameDependencies = (a: Package, b: Package) => dependencyKinds.every(kind => {
  const left = Object.entries(a[kind] ?? {}).sort(); const right = Object.entries(b[kind] ?? {}).sort()
  return JSON.stringify(left) === JSON.stringify(right)
})

// Only dependencies prepared inside this operation can be used. A link to a
// task's node_modules lets build tools write their caches into that task.
export const inspectDependencies = async (d: TasksDeps, folder: string, subfolder: string, active: () => void): Promise<void> => {
  let root = resolve(folder); let work = join(folder, subfolder); let install = work
  const setup = (reason: string): never => {
    const blockedReasons: readonly string[] = [BRANCH_TEXT.dependencyUnsafe, BRANCH_TEXT.dependencyLockMissing, BRANCH_TEXT.dependencyLockUnsupported]
    const blocked = blockedReasons.includes(reason)
    throw new DependencySetupRequired(BRANCH_TEXT.dependencySetup(reason, work, blocked ? null : `cd ${quote(install)} && npm ci --offline`))
  }
  const read = async <T>(path: string): Promise<T> => {
    active()
    if (!inside(root, await realpath(path))) setup(BRANCH_TEXT.dependencyUnsafe)
    active()
    const value = JSON.parse(await d.host.read(path)) as T
    active()
    return value
  }
  const exists = async (path: string) => {
    active()
    try { await lstat(path); return true } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') return false
      throw err
    }
  }
  try {
    active()
    root = await realpath(folder)
    work = resolve(root, subfolder); install = work
    if (!inside(root, work) || !inside(root, await realpath(work))) setup(BRANCH_TEXT.dependencyUnsafe)
    const manifest = await read<Package>(join(work, 'package.json'))
    let ancestor = work
    while (true) {
      const modules = join(ancestor, 'node_modules')
      if (await exists(modules) && !(await lstat(modules)).isDirectory()) setup(BRANCH_TEXT.dependencyUnsafe)
      if (ancestor === root) break
      ancestor = dirname(ancestor)
    }
    const needsInstallation = dependencyKinds.some(kind => Object.keys(manifest[kind] ?? {}).length) || await exists(join(work, 'node_modules'))

    // npm workspaces use the nearest ancestor lock; independent nested
    // packages (such as docs/) keep their own installation and lock.
    let lock: Lock | undefined
    while (true) {
      const name = await exists(join(install, 'npm-shrinkwrap.json')) ? 'npm-shrinkwrap.json' : 'package-lock.json'
      if (await exists(join(install, name))) { lock = await read<Lock>(join(install, name)); break }
      if (install === root) break
      install = dirname(install)
    }
    const selected = relative(install, work).split(sep).join('/')
    // A dependency-free workspace can still use its root's tools. Independent
    // Node scripts need no installation, even beside an unrelated parent lock.
    if (!needsInstallation && (install === work || !lock?.packages?.[selected])) return
    if (!lock) return setup(BRANCH_TEXT.dependencyLockMissing)
    if (!lock.packages || ![2, 3].includes(lock.lockfileVersion ?? 0)) setup(BRANCH_TEXT.dependencyLockUnsupported)
    const locked = lock.packages!
    if (!locked[selected]) { install = work; setup(BRANCH_TEXT.dependencyLockMissing) }
    if (!sameDependencies(manifest, locked[selected]!)) setup(BRANCH_TEXT.dependencyMismatch)
    for (const [path, expected] of Object.entries(locked)) {
      active()
      if (path.split('/').includes('node_modules')) continue
      if (path && !isFile(path)) setup(BRANCH_TEXT.dependencyUnsafe)
      const packagePath = resolve(install, path)
      if (!inside(root, await realpath(packagePath))) setup(BRANCH_TEXT.dependencyUnsafe)
      if (!sameDependencies(await read<Package>(join(packagePath, 'package.json')), expected)) setup(BRANCH_TEXT.dependencyMismatch)
    }
    const modules = join(install, 'node_modules')
    if (!(await exists(modules))) setup(BRANCH_TEXT.dependencyMissing)
    if (!(await lstat(modules)).isDirectory() || !inside(root, await realpath(modules))) setup(BRANCH_TEXT.dependencyUnsafe)
    const installed = await read<Lock>(join(modules, '.package-lock.json'))
    if (!installed.packages || ![2, 3].includes(installed.lockfileVersion ?? 0)) setup(BRANCH_TEXT.dependencyMismatch)
    for (const [path, actual] of Object.entries(installed.packages!)) {
      active()
      if (!isFile(path)) setup(BRANCH_TEXT.dependencyUnsafe)
      const expected = locked[path]
      if (!expected || ['version', 'resolved', 'integrity', 'link'].some(key => actual[key as keyof Package] !== expected[key as keyof Package])) setup(BRANCH_TEXT.dependencyMismatch)
      const packagePath = resolve(install, path)
      if (!inside(root, await realpath(packagePath))) setup(BRANCH_TEXT.dependencyUnsafe)
      if (expected!.link) {
        if (!expected!.resolved || !inside(root, resolve(install, expected!.resolved))) setup(BRANCH_TEXT.dependencyUnsafe)
      } else if ((await read<Package>(join(packagePath, 'package.json'))).version !== expected!.version) setup(BRANCH_TEXT.dependencyMismatch)
      if (path.includes('node_modules/')) {
        const bin = join(install, path.slice(0, path.lastIndexOf('node_modules/') + 'node_modules'.length), '.bin')
        for (const [name, target] of Object.entries(expected!.bin ?? {})) {
          active()
          if (!isFile(name) || name.includes('/') || typeof target !== 'string' || !inside(root, await realpath(resolve(packagePath, target)))) setup(BRANCH_TEXT.dependencyUnsafe)
          const executable = join(bin, process.platform === 'win32' ? name + '.cmd' : name)
          if (!(await exists(executable))) setup(BRANCH_TEXT.dependencyMissing)
          if (!inside(root, await realpath(executable))) setup(BRANCH_TEXT.dependencyUnsafe)
        }
      }
    }
    for (const [path, expected] of Object.entries(locked)) {
      active()
      if (path.split('/').includes('node_modules') && !expected.optional && !installed.packages![path]) setup(BRANCH_TEXT.dependencyMismatch)
    }
    // Executable links may point within this operation, never into a source
    // checkout. npm creates a .bin directory alongside each nested install.
    const bins = new Set([join(modules, '.bin'), ...Object.keys(installed.packages!).filter(path => path.includes('node_modules/')).map(path => join(install, path.slice(0, path.lastIndexOf('node_modules/') + 'node_modules'.length), '.bin'))])
    for (const bin of bins) {
      if (!(await exists(bin))) continue
      if (!inside(root, await realpath(bin))) setup(BRANCH_TEXT.dependencyUnsafe)
      for (const name of await readdir(bin)) {
        active()
        if (!inside(root, await realpath(join(bin, name)))) setup(BRANCH_TEXT.dependencyUnsafe)
      }
    }
    active()
  } catch (err) {
    active()
    if (err instanceof DependencySetupRequired || err instanceof CheckStopped) throw err
    d.log.error('Inspecting merge-check dependencies failed', err)
    setup(BRANCH_TEXT.dependencyUnreadable)
  }
}
