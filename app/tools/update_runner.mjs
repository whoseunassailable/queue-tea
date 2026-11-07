// Only an acknowledged, owner-started push may queue a production update.
// Export that object, never the invoking worktree's working files.
import { execFile, spawn } from 'node:child_process'
import { createHash, randomUUID } from 'node:crypto'
import { appendFile, lstat, mkdir, mkdtemp, readFile, readdir, readlink, realpath, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { releaseProblem } from './release_guard.mjs'

const exec = promisify(execFile)
const OID = /^[a-f0-9]{40,64}$/
const STALLED_MS = 15_000
const ACTIVE = ['queued', 'checking', 'building', 'verifying', 'installing']
const FAILURE = 'The update could not finish. Check ~/Library/Logs/Queue-tea/refresh.log, fix the build or local dependencies, then retry.'
const tools = typeof __dirname === 'string' ? __dirname : dirname(fileURLToPath(import.meta.url))
export const updateFolder = () => join(homedir(), 'Library/Logs/Queue-tea')
const readJson = async path => {
  try { return JSON.parse(await readFile(path, 'utf8')) } catch (err) { if (err.code === 'ENOENT') return null; throw err }
}
const save = async (path, value) => {
  const temporary = `${path}.${randomUUID()}.tmp`
  await writeFile(temporary, JSON.stringify(value))
  await rename(temporary, path)
}
const git = async (repo, ...args) => (await exec('git', args, { cwd: repo, maxBuffer: 8 * 1024 * 1024 })).stdout.trim()
export const publishedSource = async request => {
  if (!request || !OID.test(request.commit ?? '') || typeof request.repo !== 'string' || typeof request.remote !== 'string') throw new Error('No acknowledged push is available.')
  let integration = 'main'
  try { integration = await git(request.repo, 'config', '--get', 'queue-tea.integrationBranch') || 'main' } catch (err) { if (err.code !== 1) throw err }
  if (request.branch !== integration) return null
  await git(request.repo, 'check-ref-format', `refs/heads/${integration}`)
  await git(request.repo, 'merge-base', '--is-ancestor', request.commit, `refs/heads/${integration}`)
  const pkg = JSON.parse(await git(request.repo, 'show', `${request.commit}:app/package.json`))
  if (pkg.name !== 'queue-tea-app' || pkg.productName !== 'Queue-tea') return null
  return { version: 1, commit: request.commit, branch: integration, integration, dirty: false, builtAt: new Date().toISOString(),
    repository: await realpath(await git(request.repo, 'rev-parse', '--path-format=absolute', '--git-common-dir')),
    published: { remote: request.remote, commit: request.commit } }
}
export const readUpdate = async (folder = updateFolder()) => {
  const state = await readJson(join(folder, 'state.json'))
  if (state && (!['idle', ...ACTIVE, 'installed', 'failed'].includes(state.phase) || !OID.test(state.commit ?? '') || typeof state.repository !== 'string' || (state.detail !== null && typeof state.detail !== 'string'))) throw new Error('The saved update state is damaged.')
  if (state && ACTIVE.includes(state.phase) && Date.now() - (state.updatedAt || 0) > STALLED_MS) {
    const pid = Number(await readFile(join(folder, 'refresh.lock/pid'), 'utf8').catch(err => { if (err.code === 'ENOENT') return ''; throw err }))
    try { if (!pid) throw Object.assign(new Error('No worker'), { code: 'ESRCH' }); process.kill(pid, 0) }
    catch (err) { if (err.code !== 'ESRCH') throw err; return { ...state, phase: 'failed', detail: FAILURE } }
  }
  return state
}

// Persist before launching so a crash leaves a useful Retry. The worker
// outlives the app; successful publication is never reported as a failed push.
export const queuePublished = async (request, options = {}) => {
  if (options.repository && await realpath(await git(request.repo, 'rev-parse', '--path-format=absolute', '--git-common-dir')) !== await realpath(options.repository)) return false
  const source = await publishedSource(request)
  if (!source) return false
  const folder = options.folder || updateFolder()
  await mkdir(folder, { recursive: true })
  const previous = await readUpdate(folder)
  if (!options.retry && previous?.commit === request.commit && previous?.repository === source.repository && previous.phase !== 'failed') return true
  await save(join(folder, 'request.json'), { ...request, repository: source.repository })
  await save(join(folder, 'state.json'), { phase: 'queued', commit: request.commit, repository: source.repository, detail: null, updatedAt: Date.now() })
  const child = spawn(options.executable || process.execPath, [join(options.tools || tools, 'update_runner.mjs'), 'run', folder], {
    detached: true, stdio: 'ignore', env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
  })
  try { await new Promise((yes, no) => { child.once('spawn', yes); child.once('error', no) }) }
  catch (err) {
    await save(join(folder, 'state.json'), { phase: 'failed', commit: request.commit, repository: source.repository, detail: FAILURE })
    throw err
  }
  child.unref()
  return true
}

export const runUpdates = async (folder = updateFolder(), options = {}) => {
  const lock = join(folder, 'refresh.lock')
  await mkdir(folder, { recursive: true })
  try { await mkdir(lock) } catch (err) {
    if (err.code !== 'EEXIST') throw err
    const pid = Number(await readFile(join(lock, 'pid'), 'utf8').catch(() => ''))
    if (!pid) {
      if (Date.now() - (await lstat(lock)).mtimeMs < STALLED_MS) return
    } else {
      try { process.kill(pid, 0); return } catch (probe) { if (probe.code !== 'ESRCH') throw probe }
    }
    await rm(lock, { recursive: true }); await mkdir(lock)
  }
  await writeFile(join(lock, 'pid'), String(process.pid))
  let handled = null
  const target = options.target || '/Applications/Queue-tea.app'
  const command = options.command || (async (argv, cwd, env) => {
    await appendFile(join(folder, 'refresh.log'), `\n$ ${argv.join(' ')}\n`)
    await new Promise((yes, no) => {
      const child = spawn(argv[0], argv.slice(1), { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] })
      let writes = Promise.resolve()
      const output = chunk => { writes = writes.then(() => appendFile(join(folder, 'refresh.log'), chunk)) }
      child.stdout.on('data', output); child.stderr.on('data', output)
      child.once('error', no)
      child.once('close', code => { writes.then(() => code === 0 ? yes() : no(new Error(`${argv[0]} exited ${code}`)), no) })
    })
  })
  try {
    while (true) {
      const request = await readJson(join(folder, 'request.json'))
      if (!request || JSON.stringify(request) === handled) break
      handled = JSON.stringify(request)
      let snapshot
      const progress = phase => save(join(folder, 'state.json'), { phase, commit: request.commit, repository: request.repository, detail: null, updatedAt: Date.now() })
      try {
        await progress('checking')
        const source = await publishedSource(request)
        if (!source || source.repository !== request.repository) throw new Error('The release source changed.')
        const installed = await readJson(join(target, 'Contents/Resources/provenance.json'))
        const problem = releaseProblem(source, installed, () => true)
        if (problem) throw new Error(problem)
        if (installed) await git(request.repo, 'merge-base', '--is-ancestor', installed.commit, source.commit)
        snapshot = await mkdtemp(join(tmpdir(), 'queue-tea-release-'))
        const archive = join(snapshot, 'source.tar')
        await git(request.repo, 'archive', '--format=tar', '-o', archive, source.commit)
        await exec('/usr/bin/tar', ['-xf', archive, '-C', snapshot])
        const tracked = (await git(request.repo, 'ls-tree', '-r', '--name-only', '-z', source.commit)).split('\0').filter(Boolean)
        const sourceDigest = async () => {
          const hash = createHash('sha256')
          for (const path of tracked) {
            const file = join(snapshot, path); const stat = await lstat(file)
            hash.update(path).update(String(stat.mode)).update(stat.isSymbolicLink() ? await readlink(file) : await readFile(file))
          }
          return hash.digest('hex')
        }
        const before = await sourceDigest()
        const app = join(snapshot, 'app')
        // Missing dependencies fail visibly; updates never run npm ci.
        const lockText = await readFile(join(app, 'package-lock.json'), 'utf8')
        const worktrees = (await git(request.repo, 'worktree', 'list', '--porcelain')).split('\n').filter(line => line.startsWith('worktree ')).map(line => line.slice(9))
        // A matching lockfile can sit over an older install, as after a merge with no npm ci.
        const locked = Object.entries(JSON.parse(lockText).packages ?? {}).filter(([path, p]) => path.startsWith('node_modules/') && !p.optional && !p.devOptional)
        const isInstalled = async modules => {
          for (const [path, p] of locked) {
            if (JSON.parse(await readFile(join(modules, path.slice('node_modules/'.length), 'package.json'), 'utf8')).version !== p.version) return false
          }
          return true
        }
        let dependencies = null
        for (const tree of worktrees) {
          try {
            if (await readFile(join(tree, 'app/package-lock.json'), 'utf8') === lockText) {
              const modules = await realpath(join(tree, 'app/node_modules'))
              // npm ci can leave Electron's binary out; its install script writes path.txt once it is there.
              await readFile(join(modules, 'electron/path.txt'))
              if (await isInstalled(modules)) { dependencies = modules; break }
            }
          } catch (err) { if (err.code !== 'ENOENT') throw err }
        }
        if (!dependencies) throw new Error('Matching local build dependencies are missing. Install them in the integration checkout, then retry.')
        await symlink(dependencies, join(app, 'node_modules'))
        const context = join(snapshot, 'release-context.json')
        await save(context, source)
        const env = { ...process.env, QUEUE_TEA_RELEASE_CONTEXT: context, QUEUE_TEA_RELEASE_REPOSITORY: request.repo, QUEUE_TEA_RELEASE_COMMIT: source.commit,
          QUEUE_TEA_APPLICATIONS: dirname(target), QUEUE_TEA_BUILD_FLAVOR: '', QUEUE_TEA_GIT_TESTS: '0',
          PATH: `${process.env.PATH || '/usr/bin:/bin'}:/opt/homebrew/bin:/usr/local/bin:${join(homedir(), '.local/bin')}` }
        delete env.ELECTRON_RUN_AS_NODE
        await progress('building')
        await command(['npm', 'run', 'typecheck'], app, env)
        await command(['npm', 'test'], app, env)
        await command(['npm', 'run', 'package'], app, env)
        await progress('verifying')
        if (before !== await sourceDigest()) throw new Error('Build commands changed the published source. The installed app was kept.')
        const outputs = (await readdir(join(app, 'dist'))).filter(name => /^mac(?:-|$)/.test(name))
        if (outputs.length !== 1) throw new Error('Expected one packaged application.')
        const built = join(app, 'dist', outputs[0], 'Queue-tea.app')
        const provenance = await readJson(join(built, 'Contents/Resources/provenance.json'))
        if (JSON.stringify(provenance) !== JSON.stringify(source)) throw new Error('The packaged source does not match the acknowledged push.')
        await command(['/usr/bin/codesign', '--verify', '--deep', '--strict', built], app, env)
        if (JSON.stringify(await readJson(join(folder, 'request.json'))) !== handled) continue
        await progress('installing')
        await command(['/bin/sh', join(options.tools || tools, 'install_app.sh')], app, env)
        const installedAfter = await readJson(join(target, 'Contents/Resources/provenance.json'))
        if (JSON.stringify(installedAfter) !== JSON.stringify(source)) throw new Error('The installed source could not be verified.')
        await progress('installed')
      } catch (err) {
        await appendFile(join(folder, 'refresh.log'), `${err.stack || err}\n`)
        await save(join(folder, 'state.json'), { phase: 'failed', commit: request.commit, repository: request.repository,
          detail: FAILURE })
      } finally {
        if (snapshot) await rm(snapshot, { recursive: true, force: true })
      }
    }
  } finally { await rm(lock, { recursive: true, force: true }) }
  // Close the handoff race with a worker launched while this one was releasing
  // the lock. The request is durable even if its short-lived worker returned.
  if (JSON.stringify(await readJson(join(folder, 'request.json'))) !== handled) await runUpdates(folder, options)
}

if (typeof __filename !== 'string' && process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const run = async () => {
    if (process.argv[2] !== 'run') throw new Error('Updates must follow a confirmed push. Use Queue-tea Push or node tools/push.mjs.')
    await runUpdates(process.argv[3])
  }
  run().catch(err => { process.stderr.write(`Queue-tea update failed: ${err.stack || err}\n`); process.exitCode = 1 })
}
