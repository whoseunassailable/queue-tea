#!/usr/bin/env node
// Checks the import rules in docs/architecture.md, section 2. It's a script
// and not a test because a mod's tests can't read files. Run it from the
// repository's root: node tools/check_layers.mjs
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, normalize, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// Today's flat files. Each task of the restructure takes out what it empties.
const LEGACY = [
  'actions.ts',
  'docslog.ts',
  'flow.ts',
  'session.ts',
  'ui/band.tsx',
  'ui/menu.tsx',
]
// Folders allowed to read a flat file while the restructure is under way.
const LEGACY_READERS = []
// Cycles in the flat files, as `a → b`, until the task that moves them.
const KNOWN_CYCLES = []

const walk = dir =>
  readdirSync(dir).flatMap(name => {
    const path = join(dir, name)

    return statSync(path).isDirectory() ? walk(path) : [path]
  })

// Where a file sits: its area, its resource, and its layer and folder.
const placeOf = (path, legacy) => {
  if (path === 'register.tsx') return { area: 'register' }
  if (legacy.includes(path)) return { area: 'legacy' }
  const parts = path.split('/')
  if (parts[0] === 'app' || parts[0] === 'core') return { area: parts[0], folder: parts[1] }
  if (parts[0] === 'features' || parts[0] === 'shared') {
    const [area, resource, layer, folder] = parts
    if (parts.length === 3) return { area, resource, layer: 'providers' }

    return { area, resource, layer, folder }
  }

  return { area: 'unplaced' }
}

const isTypeOnly = (word, names) => {
  if (word !== undefined) return true
  const inside = /\{([^}]*)\}/.exec(names ?? '')

  return inside !== null && inside[1].split(',').every(n => n.trim() === '' || n.trim().startsWith('type '))
}

// Every import and re-export in a file's text.
const importsOf = text =>
  [...text.matchAll(/(?:^|\n)\s*(?:import|export)\s+(type\s+)?([^'";]*?\sfrom\s+)?'([^']+)'/g)].map(m => ({
    source: m[3],
    isType: isTypeOnly(m[1], m[2]),
  }))

const resolve = (from, source, root) => {
  const base = normalize(join(dirname(from), source))
  const names = [base, `${base}.ts`, `${base}.tsx`, join(base, 'index.ts')]

  return names.find(name => existsSync(join(root, name)) && statSync(join(root, name)).isFile()) ?? null
}

const CLAUDE_MAY = place =>
  ['register', 'legacy', 'app', 'core'].includes(place.area) ||
  place.layer === 'data' ||
  (place.layer === 'presentation' && ['views', 'widgets'].includes(place.folder))

// What's wrong with `from` importing `to`, or null.
const edgeProblem = (from, to, toPath, readers, fromPath) => {
  if (to.area === 'legacy') {
    const mayRead = ['legacy', 'register'].includes(from.area) || readers.some(folder => fromPath.startsWith(`${folder}/`))

    return mayRead ? null : 'imports a legacy flat file'
  }
  if (['legacy', 'register', 'app'].includes(from.area)) return null
  if (to.area === 'app' || to.area === 'register') return 'imports the app layer'
  if (from.area === 'core') {
    if (to.area === 'core') return null

    return to.area === 'shared' && to.layer === 'domain' && to.folder === 'entities' ? null : 'core imports outside core'
  }
  if (from.area === 'shared' && to.area === 'features') return 'shared imports a feature'
  if (from.area === 'features' && to.area === 'features' && from.resource !== to.resource) return 'imports another feature'
  if (from.layer === 'domain') {
    const isOwn = to.area === from.area && to.resource === from.resource && to.layer === 'domain'
    const isOk = isOwn || (to.area === 'shared' && to.layer === 'domain') || (to.area === 'core' && to.folder === 'env')

    return isOk ? null : `domain imports ${toPath}`
  }
  if (from.layer === 'presentation' && (to.layer === 'data' || toPath.endsWith('_impl.ts'))) return `presentation imports ${toPath}`
  if (from.layer === 'data' && to.layer === 'presentation') return `data imports ${toPath}`

  return null
}

// Each cycle of value imports once, as `a → b`, starting at its first name.
const cyclesIn = graph => {
  const found = new Map()
  const done = new Set()
  const visit = (node, trail) => {
    const at = trail.indexOf(node)
    if (at !== -1) {
      const loop = trail.slice(at)
      const first = loop.indexOf([...loop].sort()[0])
      const key = [...loop.slice(first), ...loop.slice(0, first)].join(' → ')
      found.set(key, key)

      return
    }
    if (done.has(node)) return
    for (const next of graph.get(node) ?? []) visit(next, [...trail, node])
    done.add(node)
  }
  for (const node of graph.keys()) visit(node, [])

  return [...found.keys()]
}

export const checkLayers = (root, { legacy = LEGACY, legacyReaders = LEGACY_READERS, knownCycles = KNOWN_CYCLES } = {}) => {
  const hooks = join(root, 'hooks')
  const files = walk(hooks)
    .map(path => relative(hooks, path))
    .filter(path => /\.tsx?$/.test(path))
  const problems = []
  const graph = new Map()

  for (const path of files) {
    const place = placeOf(path, legacy)
    if (place.area === 'unplaced') problems.push(`hooks/${path} isn't in a layer`)
    const text = readFileSync(join(hooks, path), 'utf8')
    const values = []
    for (const { source, isType } of importsOf(text)) {
      if (source === 'claude-code' || source.startsWith('claude-code/')) {
        if (!CLAUDE_MAY(place)) problems.push(`hooks/${path} imports claude-code`)
        continue
      }
      if (!source.startsWith('.')) continue
      const target = resolve(path, source, hooks)
      if (target === null) continue
      const problem = edgeProblem(place, placeOf(target, legacy), target, legacyReaders, path)
      if (problem !== null) problems.push(`hooks/${path}: ${problem} (${source})`)
      if (!isType) values.push(target)
    }
    graph.set(path, values)
    for (const [, name] of text.matchAll(/module="([^"]+)"/g)) {
      if (!existsSync(join(hooks, dirname(path), name))) problems.push(`hooks/${path}: module="${name}" names no file`)
    }
  }
  for (const cycle of cyclesIn(graph)) {
    if (!knownCycles.includes(cycle)) problems.push(`import cycle: ${cycle}`)
  }

  return problems
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkLayers(process.cwd())
  for (const problem of problems) console.error(problem)
  process.exit(problems.length === 0 ? 0 : 1)
}
