// Moves the version on after a commit, by what the commit's subject says it is,
// adds the new number to that commit and tags it. tools/hooks/post-commit runs
// this; the rule itself is written down in CLAUDE.md.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const PLUGIN = '.claude-plugin/plugin.json'
// Each file, and how many of its first version fields are its own: a package
// lock has two, and every one after them belongs to a dependency.
const FILES = { [PLUGIN]: 1, 'app/package.json': 1, 'app/package-lock.json': 2 }
const KINDS = { patch: 'a fix', minor: 'a small feature', major: 'a large feature' }

export const bumpOf = subject => {
  const text = subject.trim().toLowerCase()
  if (text.startsWith('large:')) return 'major'

  return /^add(ed)?\b/.test(text) ? 'minor' : 'patch'
}

export const nextVersion = (version, bump) => {
  const parts = /^(\d+)\.(\d+)\.(\d+)$/.exec(version)
  if (parts === null) throw new Error(`${version} is not a version`)
  const [major, minor, patch] = parts.slice(1).map(Number)
  if (bump === 'major') return `${major + 1}.0.0`
  if (bump === 'minor') return `${major}.${minor + 1}.0`

  return `${major}.${minor}.${patch + 1}`
}

export const withVersion = (text, version, times) => {
  let left = times

  return text.replace(/"version": "[^"]*"/g, field => {
    left -= 1

    return left >= 0 ? `"version": "${version}"` : field
  })
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

const versionAt = rev => {
  try {
    return JSON.parse(git('show', `${rev}:${PLUGIN}`)).version
  } catch {
    // Nothing to compare with: the file is new, so the version hasn't moved.
    return null
  }
}

const isRebasing = () => ['rebase-merge', 'rebase-apply'].some(name => existsSync(git('rev-parse', '--git-path', name)))

const write = version => {
  for (const [path, times] of Object.entries(FILES)) writeFileSync(path, withVersion(readFileSync(path, 'utf8'), version, times))
}

// Only the version files join the commit: --only leaves anything else that is
// staged for the next one. The hooks are off so this doesn't run itself again.
const addToCommit = () => git('-c', 'core.hooksPath=/dev/null', 'commit', '--amend', '--no-edit', '--no-verify', '--only', '--', ...Object.keys(FILES))

const moveVersion = () => {
  process.chdir(git('rev-parse', '--show-toplevel'))
  const parents = git('rev-list', '--parents', '-n', '1', 'HEAD').split(' ').length - 1
  if (parents !== 1 || isRebasing()) return

  const version = versionAt('HEAD')
  // A commit that already moved it is one being amended, or a number set by hand.
  if (version !== versionAt('HEAD~1')) {
    git('tag', '-f', `v${version}`)

    return
  }
  if (git('status', '--porcelain', '--', ...Object.keys(FILES)) !== '') {
    console.error(`queue-tea: left the version at ${version}, because ${Object.keys(FILES).join(', ')} has changes of its own. Commit those, and the next commit moves it.`)

    return
  }

  const bump = bumpOf(git('log', '-1', '--format=%s'))
  const next = nextVersion(version, bump)
  write(next)
  addToCommit()
  git('tag', '-f', `v${next}`)
  console.log(`queue-tea: version ${next}, for ${KINDS[bump]}.`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    moveVersion()
  } catch (err) {
    // The commit has already happened, so this only leaves the number behind.
    console.error(`queue-tea: the version did not move: ${err.message}`)
    process.exit(1)
  }
}
