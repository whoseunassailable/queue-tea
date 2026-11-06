import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readdir, readFile, realpath, rm, utimes, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Host } from '../../../../../hooks/core/host/host'
import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { DesignComment, DesignRead, DesignSave, DesignsView, Scene, VersionView } from '../../../../shared/designs'
import type { Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { nodeHost } from '../../../core/node_host'
import { designsApi } from './designs_api'

const KEY = 'gait-abc123'
const NOW = Date.parse('2026-11-05T12:00:00Z')
const AT = new Date(NOW).toISOString()
const run = promisify(execFile)

let home: string
let realm: string
let designs: string
let touched: string[]
let writes: string[]
let reveal: ReturnType<typeof vi.fn>
let api: ReturnType<typeof designsApi>
const gitEnv = { GIT_CONFIG_GLOBAL: process.env.GIT_CONFIG_GLOBAL, GIT_CONFIG_NOSYSTEM: process.env.GIT_CONFIG_NOSYSTEM }

const git = async (...args: string[]) => (await run('git', args, { cwd: realm })).stdout.trim()
const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`
const at = (folder: string, file: string) => join(designs, folder, file)
const put = async (folder: string, file: string, content: unknown) => {
  await mkdir(join(designs, folder), { recursive: true })
  await writeFile(at(folder, file), typeof content === 'string' ? content : json(content))
}
const text = (folder: string, file: string) => readFile(at(folder, file), 'utf8')
const onDisk = async (folder: string, file: string) => JSON.parse(await text(folder, file))
const backup = (folder: string, file: string) => join(home, '.queue-tea/designs', KEY, folder, file)
const realmFiles = async () => (await readdir(realm, { recursive: true })).filter(f => !f.startsWith('.git')).sort()

const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const refused = (answer: Reply<unknown>): string => {
  if (answer.ok) throw new Error(`should be refused, got ${JSON.stringify(answer.data)}`)

  return answer.error.message
}

// Every path the API hands the host, so a test can say none was built.
const recording = (host: Host): Host =>
  new Proxy(host, {
    get: (target, prop) => {
      const real = target[prop as keyof Host]
      if (typeof real !== 'function') return real

      return (...args: unknown[]) => {
        if (typeof args[0] === 'string') touched.push(resolve(args[0]))
        if (prop === 'run' && Array.isArray(args[0]) && args[0].includes('--')) touched.push(resolve(String(args[1]), String(args[0].at(-1))))
        if (prop === 'write' || prop === 'move' || prop === 'remove') writes.push(String(args.at(prop === 'move' ? 1 : 0)))

        return (real as (...a: unknown[]) => unknown).apply(target, args)
      }
    },
  })

// From the sample realm the Design Tab was built against: a design with a
// layer type the editor doesn't know, and fields it doesn't know either.
const textLayer = (id: string, name: string, x: number, y: number, words: string) => ({ id, type: 'text', name, x, y, width: 342, text: words, font: 'Nunito Sans', size: 15, weight: 400, color: '#2A2218' })
const WELCOME: Scene = {
  format: 1,
  name: 'Welcome',
  width: 390,
  height: 844,
  fill: '#F6F1E7',
  grid: { size: 8 },
  edited: { by: 'claude', at: '2026-11-04T22:20:00.000Z' },
  nodes: [
    { id: 'hero', type: 'frame', name: 'Hero', x: 0, y: 0, width: 390, height: 420, fill: '#BFE3D5', radius: 0, children: [{ id: 'sun', type: 'frame', name: 'Sun', x: 250, y: 60, width: 90, height: 90, fill: '#FFE9A8', radius: 45, children: [] }] },
    { ...textLayer('headline', 'Headline', 24, 293, 'Walk better every step'), locked: true },
    { id: 'tip', type: 'frame', name: 'Tip card', x: 24, y: 467, width: 342, height: 104, fill: '#DDF2E8', radius: 12, children: [textLayer('tip-title', 'Tip title', 16, 16, 'Pair both insoles first')] },
    { id: 'chart', type: 'chart', name: 'Stride chart', x: 24, y: 600, width: 342, height: 60, series: [1, 2, 3] },
  ],
}
const PAIR: Scene = { format: 1, name: 'Pair your insoles', width: 390, height: 844, fill: '#FFFAEE', nodes: [textLayer('h', 'Headline', 24, 120, 'Pair your insoles')] }
const LIVE_WALK = '{\n  "format": 1,\n  "name": "Live walk",\n  "width": 390\n  "height": 844\n}\n'
const BROKEN_VERSION = '{ "format": 1, "label": "5.4.2",\n  "made": "2026-10-28T16:02:00-06:00"\n  "designs": [] }\n'
const comment = (over: Partial<DesignComment> & { id: string }): DesignComment => ({ design: 'welcome', on: null, text: 'Shorter', by: 'Rohan', at: '2026-11-05T10:00:00.000Z', resolved: null, sentTo: null, ...over })
const COMMENTS = [
  comment({ id: 'c1', on: 'headline', text: 'Make the headline shorter, it wraps to three lines on a small phone.' }),
  comment({ id: 'c2', text: 'The hero is too tall: the button drops below the fold.' }),
  comment({ id: 'c3', on: 'tip', text: 'Use the jade tip card, not grey.', resolved: '2026-11-04T15:00:00.000Z' }),
]
const VERSION = { format: 1, label: '5.4.3', made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designs: ['welcome', 'pair-your-insoles', 'live-walk'], theme: 'day' }

const sample = async () => {
  await put('5.4.3', 'version.json', VERSION)
  await put('5.4.3', 'welcome.design.json', WELCOME)
  await put('5.4.3', 'pair-your-insoles.design.json', PAIR)
  await put('5.4.3', 'live-walk.design.json', LIVE_WALK)
  await put('5.4.3', 'comments.json', { format: 1, comments: COMMENTS, pinned: [] })
  await put('onboarding-pass-2', 'version.json', { format: 1, label: 'Onboarding pass 2', made: '2026-11-01T10:00:00-06:00', by: 'you', from: 'v5', designs: ['welcome'] })
  await put('onboarding-pass-2', 'welcome.design.json', WELCOME)
  await put('5.4.2', 'version.json', BROKEN_VERSION)
  await put('5.4.2', 'welcome.design.json', WELCOME)
}

const readFirst = async (id = 'welcome') => {
  const read = data(await api.readDesign(KEY, '5.4.3', id))
  if (read.kind !== 'ready') throw new Error('should read')

  return read
}

beforeEach(async () => {
  // The realm's own git config only, whatever this machine's says.
  process.env.GIT_CONFIG_GLOBAL = '/dev/null'
  process.env.GIT_CONFIG_NOSYSTEM = '1'
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-designs-')))
  realm = join(home, 'gait')
  designs = join(realm, 'docs/designs')
  touched = []
  writes = []
  await mkdir(realm)
  await git('init', '-q', '-b', 'main')
  await git('config', 'user.email', 'test@example.com')
  await git('config', 'user.name', 'Rohan Bhande')
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify(emptyRecord('Gait-feedback', realm)))
  await sample()
  const log = createLogger('dev', () => {})
  reveal = vi.fn()
  api = designsApi({
    host: recording(nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' }))),
    home,
    now: () => NOW,
    log,
    offsetMinutes: () => 60,
    newId: () => 'q-1',
    terminal: async () => 'terminal',
    copy: () => {},
    reveal,
    listFolders: async dir => {
      try {
        return (await readdir(dir, { withFileTypes: true })).filter(e => e.isDirectory()).map(e => e.name)
      } catch {
        // No docs/designs yet holds no versions.
        return []
      }
    },
  })
})

afterEach(async () => {
  for (const [name, was] of Object.entries(gitEnv)) {
    if (was === undefined) delete process.env[name]
    else process.env[name] = was
  }
  await rm(home, { recursive: true, force: true })
})

describe('the history rail', () => {
  const folders = (view: DesignsView) => view.versions.map(v => v.folder)

  it('lists versions newest made first, and one that does not read by its file time', async () => {
    await utimes(at('5.4.2', 'version.json'), new Date('2026-11-02T00:00:00Z'), new Date('2026-11-02T00:00:00Z'))
    await put('v5', 'version.json', { format: 1, label: 'v5' })
    await utimes(at('v5', 'version.json'), new Date('2026-10-01T00:00:00Z'), new Date('2026-10-01T00:00:00Z'))

    expect(folders(data(await api.readDesigns(KEY)))).toEqual(['5.4.3', '5.4.2', 'onboarding-pass-2', 'v5'])
  })

  it('orders by when versions were made, never by their labels', async () => {
    await put('9.0', 'version.json', { format: 1, label: '9.0', made: '2026-01-01T00:00:00Z' })

    expect(folders(data(await api.readDesigns(KEY))).at(-1)).toBe('9.0')
  })

  it('shows a version that does not read by its folder, with the file and line', async () => {
    const row = data(await api.readDesigns(KEY)).versions.find(v => v.folder === '5.4.2')!

    expect(row).toMatchObject({ label: '5.4.2', designCount: 1, problem: { file: 'docs/designs/5.4.2/version.json', detail: 'It has a mistake near line 3.', backupAt: null } })
  })

  it('says when a folder has no version file', async () => {
    await put('stray', 'welcome.design.json', WELCOME)

    expect(data(await api.readDesigns(KEY)).versions.find(v => v.folder === 'stray')?.problem?.detail).toMatch(/no version file/)
  })

  it('counts each version\'s designs and comments', async () => {
    const row = data(await api.readDesigns(KEY)).versions.find(v => v.folder === '5.4.3')!

    expect(row).toMatchObject({ folder: '5.4.3', label: '5.4.3', by: 'claude', from: '5.4.2', designCount: 3, open: 2, resolved: 1, sent: 0, sentTo: null, problem: null })
  })

  it('leaves out folders whose names the window could not send back', async () => {
    await put('UPPER', 'version.json', { format: 1, label: 'UPPER' })
    await put('.hidden', 'version.json', { format: 1, label: 'hidden' })

    const listed = folders(data(await api.readDesigns(KEY)))

    expect(listed).not.toContain('UPPER')
    expect(listed).not.toContain('.hidden')
    expect(listed).toHaveLength(3)
  })

  it('has nothing to list in a realm with no docs/designs', async () => {
    await rm(designs, { recursive: true })

    expect(data(await api.readDesigns(KEY))).toEqual({ versions: [], coming: [] })
  })

  it('shows a version filed but not drafted yet as coming', async () => {
    await put('5.4.3', 'version.json', { ...VERSION, next: { label: '5.4.4', quest: 'Designs 5.4.4' } })

    expect(data(await api.readDesigns(KEY)).coming).toEqual([{ label: '5.4.4', quest: 'Designs 5.4.4', from: '5.4.3' }])
  })

  it('stops showing it as coming once its folder is there, whatever its spelling', async () => {
    await put('5.4.3', 'version.json', { ...VERSION, next: { label: 'Onboarding Pass 3', quest: 'Designs' } })
    await put('onboarding-pass-3', 'version.json', { format: 1, label: 'Onboarding pass 3', made: '2026-11-05T00:00:00Z' })

    expect(data(await api.readDesigns(KEY)).coming).toEqual([])
  })

  it('refuses a realm it does not know', async () => {
    expect(refused(await api.readDesigns('nope-000000'))).toBe(MESSAGES.unknownProject)
    expect(refused(await api.readDesigns('../../etc'))).toBe(MESSAGES.unknownProject)
  })
})

describe('a version', () => {
  const view = async (folder = '5.4.3'): Promise<VersionView> => data(await api.readDesignVersion(KEY, folder))

  it('lists its designs in the version\'s order, then the rest by name', async () => {
    await put('5.4.3', 'version.json', { ...VERSION, designs: ['pair-your-insoles', 'gone', 'welcome'] })
    await put('5.4.3', 'zeta.design.json', PAIR)
    await put('5.4.3', 'alpha.design.json', PAIR)
    await put('5.4.3', 'Bad.Name.design.json', PAIR)
    await put('5.4.3', 'notes.txt', 'not a design')

    expect((await view()).designs).toEqual(['pair-your-insoles', 'welcome', 'alpha', 'live-walk', 'zeta'])
  })

  it('gives its comments and label', async () => {
    expect(await view()).toMatchObject({ folder: '5.4.3', label: '5.4.3', comments: COMMENTS, commentsProblem: null })
  })

  it('says when its comments do not read, and lists none', async () => {
    await put('5.4.3', 'comments.json', '{ "format": 1,\n "comments": [\n }')

    expect(await view()).toMatchObject({ comments: [], commentsProblem: { file: 'docs/designs/5.4.3/comments.json', detail: 'It has a mistake near line 3.' } })
  })

  it('counts the files in its folder git has not been given', async () => {
    expect((await view()).uncommitted).toBe(5)

    await git('add', '.')
    await git('commit', '-q', '-m', 'designs')
    expect((await view()).uncommitted).toBe(0)

    await put('5.4.3', 'welcome.design.json', { ...WELCOME, name: 'Hello' })
    expect((await view()).uncommitted).toBe(1)
  })

  it('counts nothing uncommitted outside git', async () => {
    await rm(join(realm, '.git'), { recursive: true })

    expect((await view()).uncommitted).toBe(0)
  })

  it('refuses one that does not read, naming its file', async () => {
    expect(refused(await api.readDesignVersion(KEY, '5.4.2'))).toBe(MESSAGES.brokenVersion('docs/designs/5.4.2/version.json'))
  })
})

describe('reading a design', () => {
  it('reads a good one with a stamp that stays while the file does', async () => {
    const first = await readFirst()

    expect(first.scene.name).toBe('Welcome')
    expect((await readFirst()).stamp).toBe(first.stamp)
  })

  it('keeps the last good copy outside the realm', async () => {
    const before = await realmFiles()
    await readFirst()

    expect(await readFile(backup('5.4.3', 'welcome.design.json'), 'utf8')).toBe(await text('5.4.3', 'welcome.design.json'))
    expect(backup('5.4.3', 'welcome.design.json').startsWith(realm)).toBe(false)
    expect(await realmFiles()).toEqual(before)
  })

  it('says which file does not read and near which line, with no copy yet', async () => {
    const read = data(await api.readDesign(KEY, '5.4.3', 'live-walk'))

    expect(read).toEqual({ kind: 'broken', problem: { file: 'docs/designs/5.4.3/live-walk.design.json', detail: 'It has a mistake near line 5.', backupAt: null } })
  })

  it('says when there is a last good copy to go back to', async () => {
    await readFirst()
    await put('5.4.3', 'welcome.design.json', '{')

    const read = data(await api.readDesign(KEY, '5.4.3', 'welcome')) as Extract<DesignRead, { kind: 'broken' }>
    expect(read.problem.backupAt).toEqual(expect.any(Number))
  })

  it('leaves a file that does not read exactly as it is', async () => {
    await api.readDesign(KEY, '5.4.3', 'live-walk')

    expect(await text('5.4.3', 'live-walk.design.json')).toBe(LIVE_WALK)
  })

  it('refuses to open a file over 2 MB', async () => {
    await put('5.4.3', 'welcome.design.json', { ...WELCOME, nodes: [textLayer('big', 'Big', 0, 0, 'x'.repeat(2_200_000))] })

    expect(data(await api.readDesign(KEY, '5.4.3', 'welcome'))).toMatchObject({ kind: 'broken', problem: { detail: 'It’s larger than 2 MB.' } })
  })

  it('says when the design is not on disk any more', async () => {
    expect(refused(await api.readDesign(KEY, '5.4.3', 'nope'))).toBe(MESSAGES.designGone)
  })
})

describe('saving a design', () => {
  const moved = (scene: Scene): Scene => ({ ...scene, nodes: scene.nodes.map(l => (l.id === 'headline' ? { ...l, x: 40 } : l)) })

  it('saves over the file it read, and says who edited it when', async () => {
    const { scene, stamp } = await readFirst()

    const saved = data(await api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp)) as Extract<DesignSave, { kind: 'saved' }>

    expect(saved).toEqual({ kind: 'saved', stamp: expect.any(String), at: NOW })
    expect(saved.stamp).not.toBe(stamp)
    expect((await onDisk('5.4.3', 'welcome.design.json')).edited).toEqual({ by: 'you', at: AT })
  })

  it('writes back every field and layer it does not know, exactly as read', async () => {
    const { scene, stamp } = await readFirst()

    data(await api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp))

    expect(await onDisk('5.4.3', 'welcome.design.json')).toEqual({ ...moved(WELCOME), edited: { by: 'you', at: AT } })
  })

  it('writes nothing over a file that changed since it was read', async () => {
    const { scene, stamp } = await readFirst()
    await put('5.4.3', 'welcome.design.json', { ...WELCOME, name: 'Changed by Claude' })
    const theirs = await text('5.4.3', 'welcome.design.json')

    expect(data(await api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp))).toEqual({ kind: 'changed' })
    expect(await text('5.4.3', 'welcome.design.json')).toBe(theirs)
  })

  it('says changed when the file is gone', async () => {
    const { scene, stamp } = await readFirst()
    await rm(at('5.4.3', 'welcome.design.json'))

    expect(data(await api.saveDesign(KEY, '5.4.3', 'welcome', scene, stamp))).toEqual({ kind: 'changed' })
  })

  it('saves again with the stamp the last save gave', async () => {
    const { scene, stamp } = await readFirst()
    const first = data(await api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp)) as Extract<DesignSave, { kind: 'saved' }>

    expect(data(await api.saveDesign(KEY, '5.4.3', 'welcome', scene, first.stamp)).kind).toBe('saved')
  })

  it('runs two saves at once one after the other, so the second sees the first', async () => {
    const { scene, stamp } = await readFirst()

    const answers = await Promise.all([api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp), api.saveDesign(KEY, '5.4.3', 'welcome', scene, stamp)])

    expect(answers.map(a => data(a).kind)).toEqual(['saved', 'changed'])
    expect((await onDisk('5.4.3', 'welcome.design.json')).nodes[1].x).toBe(40)
  })

  it('refuses a design the app could not read back, and leaves the file', async () => {
    const { scene, stamp } = await readFirst()
    const before = await text('5.4.3', 'welcome.design.json')

    expect(refused(await api.saveDesign(KEY, '5.4.3', 'welcome', { ...scene, fill: 'jade' }, stamp))).toBe(MESSAGES.badScene)
    expect(await text('5.4.3', 'welcome.design.json')).toBe(before)
  })

  it('keeps the file as it was as the last good copy, and leaves no temp file', async () => {
    const { scene, stamp } = await readFirst()
    const before = await text('5.4.3', 'welcome.design.json')
    const files = await realmFiles()

    data(await api.saveDesign(KEY, '5.4.3', 'welcome', moved(scene), stamp))

    expect(await readFile(backup('5.4.3', 'welcome.design.json'), 'utf8')).toBe(before)
    expect(await realmFiles()).toEqual(files)
  })
})

describe('saving yours beside a file that changed', () => {
  it('saves it as "<name> (yours)", listed right after the design', async () => {
    const { scene } = await readFirst()

    expect(data(await api.saveDesignCopy(KEY, '5.4.3', 'welcome', scene))).toBe('welcome-yours')
    expect(await onDisk('5.4.3', 'welcome-yours.design.json')).toMatchObject({ name: 'Welcome (yours)', edited: { by: 'you', at: AT }, grid: { size: 8 } })
    expect(await onDisk('5.4.3', 'version.json')).toMatchObject({ ...VERSION, designs: ['welcome', 'welcome-yours', 'pair-your-insoles', 'live-walk'] })
  })

  it('gives a second copy a free name', async () => {
    const { scene } = await readFirst()
    data(await api.saveDesignCopy(KEY, '5.4.3', 'welcome', scene))

    expect(data(await api.saveDesignCopy(KEY, '5.4.3', 'welcome', scene))).toBe('welcome-yours-2')
  })
})

describe('the last good copy', () => {
  it('puts a design back as it last read', async () => {
    await readFirst()
    const good = await text('5.4.3', 'welcome.design.json')
    await put('5.4.3', 'welcome.design.json', '{ broken')

    data(await api.restoreDesignFile(KEY, '5.4.3', 'welcome'))

    expect(await text('5.4.3', 'welcome.design.json')).toBe(good)
  })

  it('puts a version file back, so the version reads again', async () => {
    await put('5.4.2', 'version.json', { format: 1, label: '5.4.2', made: '2026-10-28T16:02:00-06:00' })
    await api.readDesigns(KEY)
    await put('5.4.2', 'version.json', BROKEN_VERSION)

    data(await api.restoreDesignFile(KEY, '5.4.2', 'version'))

    expect(data(await api.readDesigns(KEY)).versions.find(v => v.folder === '5.4.2')?.problem).toBeNull()
  })

  it('puts the comments file back', async () => {
    await api.readDesignVersion(KEY, '5.4.3')
    await put('5.4.3', 'comments.json', '{')

    data(await api.restoreDesignFile(KEY, '5.4.3', 'comments'))

    expect((await onDisk('5.4.3', 'comments.json')).comments).toEqual(COMMENTS)
  })

  it('says so when there is no copy to go back to', async () => {
    expect(refused(await api.restoreDesignFile(KEY, '5.4.3', 'live-walk'))).toBe(MESSAGES.noBackup)
  })
})

describe('comments', () => {
  const add = (over: Record<string, unknown> = {}) => api.addDesignComment(KEY, '5.4.3', { design: 'welcome', on: 'headline', text: 'Bigger button', ...over })

  it('adds one by the first word of git\'s user name, open, about the layer', async () => {
    const comments = data(await add())

    expect(comments.at(-1)).toEqual({ id: expect.stringMatching(/^c-[0-9a-f]{8}$/), design: 'welcome', on: 'headline', text: 'Bigger button', by: 'Rohan', at: AT, resolved: null, sentTo: null })
    expect((await onDisk('5.4.3', 'comments.json')).comments).toEqual(comments)
  })

  it('keeps the earlier comments and the fields it does not know', async () => {
    data(await add())

    const file = await onDisk('5.4.3', 'comments.json')
    expect(file.comments.slice(0, 3)).toEqual(COMMENTS)
    expect(file.pinned).toEqual([])
  })

  it('signs as You when git has no user name', async () => {
    await git('config', '--unset', 'user.name')

    expect(data(await add()).at(-1)?.by).toBe('You')
  })

  it('starts the comments file with the first comment', async () => {
    data(await api.addDesignComment(KEY, 'onboarding-pass-2', { design: 'welcome', on: null, text: '  First thoughts  ' }))

    expect(await onDisk('onboarding-pass-2', 'comments.json')).toMatchObject({ format: 1, comments: [{ text: 'First thoughts', on: null }] })
  })

  it('takes an empty layer as the whole design', async () => {
    expect(data(await add({ on: '' })).at(-1)?.on).toBeNull()
  })

  it.each([
    ['an empty comment', { text: '   ' }, 'Comment is required.'],
    ['a comment over 2,000 characters', { text: 'x'.repeat(2001) }, MESSAGES.commentLong],
    ['a design that is not on disk', { design: 'nope' }, MESSAGES.designGone],
    ['a design id that climbs out', { design: '../x' }, MESSAGES.unknownDesign],
  ])('refuses %s and writes nothing', async (_, over, message) => {
    const before = await text('5.4.3', 'comments.json')

    expect(refused(await add(over))).toBe(message)
    expect(await text('5.4.3', 'comments.json')).toBe(before)
  })

  it('refuses to add to a comments file that does not read, and leaves it', async () => {
    await put('5.4.3', 'comments.json', '{ nope')

    expect(refused(await add())).toBe(MESSAGES.brokenComments('docs/designs/5.4.3/comments.json'))
    expect(await text('5.4.3', 'comments.json')).toBe('{ nope')
  })

  it('refuses to comment on a version that does not read', async () => {
    expect(refused(await api.addDesignComment(KEY, '5.4.2', { design: 'welcome', on: null, text: 'Hi' }))).toBe(MESSAGES.brokenVersion('docs/designs/5.4.2/version.json'))
  })

  it('resolves a comment, and reopens it', async () => {
    const resolved = data(await api.setDesignComment(KEY, '5.4.3', 'c1', true))
    expect(resolved.find(c => c.id === 'c1')?.resolved).toBe(AT)
    expect(resolved.find(c => c.id === 'c2')).toEqual(COMMENTS[1])

    const reopened = data(await api.setDesignComment(KEY, '5.4.3', 'c1', false))
    expect(reopened.find(c => c.id === 'c1')?.resolved).toBeNull()
    expect((await onDisk('5.4.3', 'comments.json')).comments).toEqual(reopened)
  })

  it('says when a comment is not there any more', async () => {
    expect(refused(await api.setDesignComment(KEY, '5.4.3', 'gone', true))).toBe(MESSAGES.commentGone)
  })
})

describe('sending the comments to the next version', () => {
  const send = (next: unknown) => api.sendDesignComments(KEY, '5.4.3', next)

  it('marks only the open comments as sent to the new label', async () => {
    await put('5.4.3', 'comments.json', { format: 1, comments: [...COMMENTS, comment({ id: 'c4', sentTo: '5.4.3' })] })

    data(await send({ label: '5.4.4', quest: 'Designs 5.4.4' }))

    const sent = (await onDisk('5.4.3', 'comments.json')).comments as DesignComment[]
    expect(sent.map(c => [c.id, c.resolved === null ? null : 'resolved', c.sentTo])).toEqual([
      ['c1', null, '5.4.4'],
      ['c2', null, '5.4.4'],
      ['c3', 'resolved', null],
      ['c4', null, '5.4.3'],
    ])
  })

  it('names the coming version in the version file, keeping the rest', async () => {
    data(await send({ label: ' 5.4.4 ', quest: ' Designs 5.4.4 ' }))

    expect(await onDisk('5.4.3', 'version.json')).toEqual({ ...VERSION, next: { label: '5.4.4', quest: 'Designs 5.4.4' } })
  })

  it('shows the coming version and the sent count in the rail after', async () => {
    data(await send({ label: '5.4.4', quest: 'Designs 5.4.4' }))

    const view = data(await api.readDesigns(KEY))
    expect(view.coming).toEqual([{ label: '5.4.4', quest: 'Designs 5.4.4', from: '5.4.3' }])
    expect(view.versions.find(v => v.folder === '5.4.3')).toMatchObject({ open: 0, sent: 2, sentTo: '5.4.4' })
  })

  it('refuses a label another version already filed as coming, and writes nothing', async () => {
    await put('onboarding-pass-2', 'version.json', { format: 1, label: 'Onboarding pass 2', made: '2026-11-01T10:00:00-06:00', next: { label: '5.4.4', quest: 'Designs 5.4.4' } })
    const comments = await text('5.4.3', 'comments.json')

    expect(refused(await send({ label: '5.4.4', quest: 'Another' }))).toBe(MESSAGES.labelTaken('5.4.4'))
    expect(await text('5.4.3', 'comments.json')).toBe(comments)
  })

  it('leaves the comments file alone with no open comments', async () => {
    const quiet = { format: 1, comments: [COMMENTS[2]] }
    await put('5.4.3', 'comments.json', quiet)

    data(await send({ label: '5.4.4', quest: 'Designs 5.4.4' }))

    expect(await text('5.4.3', 'comments.json')).toBe(json(quiet))
  })

  it.each([
    ['a label taken by a folder', { label: '5.4.2', quest: 'Q' }, MESSAGES.labelTaken('5.4.2')],
    ['a label whose folder is taken', { label: 'Onboarding Pass 2', quest: 'Q' }, MESSAGES.labelTaken('Onboarding Pass 2')],
    ['no label', { label: '  ', quest: 'Q' }, MESSAGES.badLabel],
    ['a label with no letter or number', { label: '!!!', quest: 'Q' }, MESSAGES.badLabel],
    ['a label over 40 characters', { label: 'x'.repeat(41), quest: 'Q' }, MESSAGES.badLabel],
    ['no quest title', { label: '5.4.4', quest: '' }, MESSAGES.badQuestTitle],
    ['a quest title over 200 characters', { label: '5.4.4', quest: 'x'.repeat(201) }, MESSAGES.badQuestTitle],
    ['nothing at all', null, MESSAGES.badLabel],
  ])('refuses %s and writes nothing', async (_, next, message) => {
    const version = await text('5.4.3', 'version.json')
    const comments = await text('5.4.3', 'comments.json')

    expect(refused(await send(next))).toBe(message)
    expect(await text('5.4.3', 'version.json')).toBe(version)
    expect(await text('5.4.3', 'comments.json')).toBe(comments)
  })
})

describe('Show in Finder', () => {
  it('shows docs/designs, or the realm when there is none yet', async () => {
    data(await api.showDesigns(KEY))
    expect(reveal).toHaveBeenLastCalledWith(designs)

    await rm(designs, { recursive: true })
    data(await api.showDesigns(KEY))
    expect(reveal).toHaveBeenLastCalledWith(realm)
  })
})

describe('names from the window', () => {
  const insideRealm = () => touched.filter(p => p.startsWith(realm) || p.startsWith(join(home, '.queue-tea/designs')))

  it.each(['../x', 'a/b', '.hidden', 'UPPER', '..', '', 'a\\b', '/etc', '5.4.3/../../..', 5, null])('refuses the folder %j before building any path', async folder => {
    const answers = await Promise.all([
      api.readDesignVersion(KEY, folder),
      api.readDesign(KEY, folder, 'welcome'),
      api.saveDesign(KEY, folder, 'welcome', WELCOME, 'stamp'),
      api.saveDesignCopy(KEY, folder, 'welcome', WELCOME),
      api.restoreDesignFile(KEY, folder, 'version'),
      api.addDesignComment(KEY, folder, { design: 'welcome', on: null, text: 'Hi' }),
      api.setDesignComment(KEY, folder, 'c1', true),
      api.sendDesignComments(KEY, folder, { label: '9.9', quest: 'Q' }),
    ])

    for (const answer of answers) expect(refused(answer)).toBe(MESSAGES.unknownDesign)
    expect(insideRealm()).toEqual([])
    expect(writes).toEqual([])
  })

  it.each(['../x', '../../version', 'a.b', 'Welcome', 'a/b', '.x', '', 5])('refuses the design %j before building its path', async id => {
    const answers = await Promise.all([
      api.readDesign(KEY, '5.4.3', id),
      api.saveDesign(KEY, '5.4.3', id, WELCOME, 'stamp'),
      api.saveDesignCopy(KEY, '5.4.3', id, WELCOME),
      api.restoreDesignFile(KEY, '5.4.3', id),
      api.addDesignComment(KEY, '5.4.3', { design: id, on: null, text: 'Hi' }),
    ])

    for (const answer of answers) expect(refused(answer)).toBe(MESSAGES.unknownDesign)
    // Only the version and comments files are read, to check the version first.
    expect(insideRealm().filter(p => ![at('5.4.3', 'version.json'), at('5.4.3', 'comments.json'), backup('5.4.3', 'version.json'), backup('5.4.3', 'comments.json')].includes(p))).toEqual([])
    expect(writes.filter(p => !p.startsWith(join(home, '.queue-tea/designs')))).toEqual([])
  })
})
