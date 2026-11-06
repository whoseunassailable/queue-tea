import { createHash, randomBytes } from 'node:crypto'

import { DESIGNS_FOLDER, folderOf, freeId, isDesignId, isFolderName, isOpen, LIMITS } from '../../../../shared/designs'
import type { DesignComment, DesignRead, DesignSave, DesignsView, Problem, VersionRow, VersionView } from '../../../../shared/designs'
import type { Reply } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { scopeOf } from '../../tasks/api/scope'
import type { TasksDeps } from '../../tasks/api/scope'
import { checkScene, parseComments, parseScene, parseVersion } from '../domain/design_files'
import type { CommentsFile, Parsed, VersionFile } from '../domain/design_files'

// listFolders: the folders in a folder, none when it isn't there.
export type DesignsDeps = TasksDeps & { listFolders: (dir: string) => Promise<string[]>; reveal: (path: string) => void }

const VERSION = 'version.json'
const COMMENTS = 'comments.json'
const DESIGN = '.design.json'

const stampOf = (text: string) => createHash('sha1').update(text).digest('hex')
const jsonOf = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`
const fileOf = (id: string) => `${id}${DESIGN}`

const parserOf = (file: string): ((text: string) => Parsed<unknown>) => {
  if (file === VERSION) return parseVersion
  if (file === COMMENTS) return parseComments

  return parseScene
}

const folderArg = (value: unknown): string => {
  if (!isFolderName(value)) throw new Refusal(MESSAGES.unknownDesign)

  return value
}

const idArg = (value: unknown): string => {
  if (!isDesignId(value)) throw new Refusal(MESSAGES.unknownDesign)

  return value
}

// Designs in the order the version lists them, then any it doesn't, by name.
const idsIn = (files: readonly string[], listed: readonly string[]): string[] => {
  const present = files.filter(f => f.endsWith(DESIGN)).map(f => f.slice(0, -DESIGN.length)).filter(isDesignId)
  const first = listed.filter(id => present.includes(id))

  return [...first, ...present.filter(id => !first.includes(id)).sort()]
}

const counted = (comments: readonly DesignComment[]) => {
  const sent = comments.filter(c => c.sentTo !== null)

  return { open: comments.filter(isOpen).length, resolved: comments.filter(c => c.resolved !== null && c.sentTo === null).length, sent: sent.length, sentTo: sent.at(-1)?.sentTo ?? null }
}

export const designsApi = (d: DesignsDeps) => {
  const now = () => new Date(d.now()).toISOString()

  const realmOf = async (key: unknown) => {
    const scope = await scopeOf(d, key)

    return { key: scope.key, path: scope.ctx.projectPath, base: `${scope.ctx.projectPath}/${DESIGNS_FOLDER}` }
  }
  type Realm = Awaited<ReturnType<typeof realmOf>>

  // The last good copy lives outside the realm: beside the file it would be an
  // uncommitted file of its own, and hold Start.
  const backupOf = (realm: Realm, folder: string, file: string) => `${d.home}/.queue-tea/designs/${realm.key}/${folder}/${file}`

  const keepBackup = async (realm: Realm, folder: string, file: string, text: string) => {
    const backup = backupOf(realm, folder, file)
    try {
      if ((await d.host.exists(backup)) && (await d.host.read(backup)) === text) return
      await d.host.write(backup, text)
      d.log.debug(`designs: kept the last good copy of ${folder}/${file}`)
    } catch (err) {
      // The copy only helps mend a file later; the read or save it rides on
      // matters more, so a copy that can't be kept is logged and let go.
      d.log.warn(`designs: couldn't keep the last good copy of ${folder}/${file}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const problemOf = async (realm: Realm, folder: string, file: string, detail: string): Promise<Problem> => ({
    file: `${DESIGNS_FOLDER}/${folder}/${file}`,
    detail,
    backupAt: await d.host.modifiedAt(backupOf(realm, folder, file)),
  })

  // Written whole beside the file, then moved over it, so a crash never leaves
  // half a file. A file that read cleanly is kept as the last good copy first.
  const writeFile = async (realm: Realm, folder: string, file: string, text: string) => {
    const path = `${realm.base}/${folder}/${file}`
    if (await d.host.exists(path)) {
      const old = await d.host.read(path)
      if (parserOf(file)(old).ok) await keepBackup(realm, folder, file, old)
    }
    const tmp = `${path}.tmp`
    await d.host.write(tmp, text)
    const moved = await d.host.move(tmp, path)
    if (moved.exitCode !== 0) throw new Error(moved.stderr)
    d.log.debug(`designs: wrote ${folder}/${file}`)
  }

  const readParsed = async <T>(realm: Realm, folder: string, file: string, parse: (text: string) => Parsed<T>): Promise<Parsed<T> | null> => {
    const path = `${realm.base}/${folder}/${file}`
    if (!(await d.host.exists(path))) return null
    const text = await d.host.read(path)
    d.log.debug(`designs: read ${folder}/${file}`)
    const parsed = parse(text)
    if (parsed.ok) await keepBackup(realm, folder, file, text)

    return parsed
  }

  const versionOf = async (realm: Realm, folder: string): Promise<VersionFile> => {
    const parsed = await readParsed(realm, folder, VERSION, parseVersion)
    if (parsed === null || !parsed.ok) throw new Refusal(MESSAGES.brokenVersion(`${DESIGNS_FOLDER}/${folder}/${VERSION}`))

    return parsed.value
  }

  const commentsOf = async (realm: Realm, folder: string): Promise<CommentsFile> => {
    const parsed = await readParsed(realm, folder, COMMENTS, parseComments)
    if (parsed === null) return { format: 1, comments: [] }
    if (!parsed.ok) throw new Refusal(MESSAGES.brokenComments(`${DESIGNS_FOLDER}/${folder}/${COMMENTS}`))

    return parsed.value
  }

  // A version's row in the history, and when it was made for sorting: a row
  // that doesn't read sorts by when its file last changed.
  const rowOf = async (realm: Realm, folder: string): Promise<{ row: VersionRow; at: number }> => {
    const files = await d.host.list(`${realm.base}/${folder}`)
    const blank = { folder, label: folder, made: null, by: null, from: null, next: null, open: 0, resolved: 0, sent: 0, sentTo: null }
    const designCount = idsIn(files, []).length
    const at = (await d.host.modifiedAt(`${realm.base}/${folder}/${VERSION}`)) ?? 0
    const version = await readParsed(realm, folder, VERSION, parseVersion)
    if (version === null) return { row: { ...blank, designCount, problem: await problemOf(realm, folder, VERSION, MESSAGES.designFaults.noVersionFile) }, at }
    if (!version.ok) return { row: { ...blank, designCount, problem: await problemOf(realm, folder, VERSION, version.detail) }, at }
    const v = version.value
    const comments = await readParsed(realm, folder, COMMENTS, parseComments)
    const made = v.made === null ? Number.NaN : Date.parse(v.made)

    return {
      row: { folder, label: v.label, made: v.made, by: v.by, from: v.from, next: v.next, designCount, problem: null, ...counted(comments?.ok === true ? comments.value.comments : []) },
      at: Number.isNaN(made) ? at : made,
    }
  }

  const foldersOf = async (realm: Realm) => (await d.listFolders(realm.base)).filter(isFolderName)

  // One change at a time per realm, so two quick saves can't lose each other.
  const queues = new Map<string, Promise<unknown>>()
  const inTurn = <T>(key: unknown, work: () => Promise<T>): Promise<T> => {
    const name = String(key)
    const run = (queues.get(name) ?? Promise.resolve()).then(work, work)
    queues.set(
      name,
      run.then(
        () => undefined,
        () => undefined,
      ),
    )

    return run
  }

  const authorOf = async (realm: Realm): Promise<string> => {
    const named = await d.host.run(['git', 'config', 'user.name'], realm.path)
    const first = named.exitCode === 0 ? named.stdout.trim().split(/\s+/)[0] : ''

    return first === undefined || first === '' ? 'You' : first
  }

  const uncommittedIn = async (realm: Realm, folder: string): Promise<number> => {
    const status = await d.host.run(['git', 'status', '--porcelain', '--untracked-files=all', '--', `${DESIGNS_FOLDER}/${folder}`], realm.path)
    if (status.exitCode !== 0) {
      // Not a git folder, or git isn't there: nothing to warn about committing.
      d.log.debug(`designs: git status failed in ${realm.path}: ${status.stderr}`)
      return 0
    }

    return status.stdout.split('\n').filter(line => line.trim() !== '').length
  }

  const changeComments = (key: unknown, folder: unknown, failure: string, work: (file: CommentsFile, realm: Realm, folder: string) => Promise<CommentsFile>) =>
    inTurn(key, () =>
      reply(d.log, failure, async () => {
        const realm = await realmOf(key)
        const name = folderArg(folder)
        await versionOf(realm, name)
        const next = await work(await commentsOf(realm, name), realm, name)
        await writeFile(realm, name, COMMENTS, jsonOf(next))

        return next.comments
      }),
    )

  return {
    readDesigns: (key: unknown): Promise<Reply<DesignsView>> =>
      reply(d.log, MESSAGES.readDesigns, async () => {
        const realm = await realmOf(key)
        const rows = (await Promise.all((await foldersOf(realm)).map(folder => rowOf(realm, folder)))).sort((a, b) => b.at - a.at).map(r => r.row)
        const has = (label: string) => rows.some(r => r.folder === folderOf(label))
        const coming = rows.flatMap(r => (r.next !== null && !has(r.next.label) ? [{ ...r.next, from: r.label }] : []))

        return { versions: rows, coming }
      }),

    readDesignVersion: (key: unknown, folder: unknown): Promise<Reply<VersionView>> =>
      reply(d.log, MESSAGES.readDesigns, async () => {
        const realm = await realmOf(key)
        const name = folderArg(folder)
        const version = await versionOf(realm, name)
        const comments = await readParsed(realm, name, COMMENTS, parseComments)
        const commentsProblem = comments !== null && !comments.ok ? await problemOf(realm, name, COMMENTS, comments.detail) : null

        return {
          folder: name,
          label: version.label,
          designs: idsIn(await d.host.list(`${realm.base}/${name}`), version.designs),
          comments: comments?.ok === true ? comments.value.comments : [],
          commentsProblem,
          uncommitted: await uncommittedIn(realm, name),
        }
      }),

    readDesign: (key: unknown, folder: unknown, id: unknown): Promise<Reply<DesignRead>> =>
      reply(d.log, MESSAGES.readDesign, async () => {
        const realm = await realmOf(key)
        const name = folderArg(folder)
        const file = fileOf(idArg(id))
        const path = `${realm.base}/${name}/${file}`
        if (!(await d.host.exists(path))) throw new Refusal(MESSAGES.designGone)
        const text = await d.host.read(path)
        d.log.debug(`designs: read ${name}/${file}`)
        if (text.length > LIMITS.bytes) return { kind: 'broken', problem: await problemOf(realm, name, file, MESSAGES.designFaults.tooLarge) }
        const parsed = parseScene(text)
        if (!parsed.ok) return { kind: 'broken', problem: await problemOf(realm, name, file, parsed.detail) }
        await keepBackup(realm, name, file, text)

        return { kind: 'ready', scene: parsed.value, stamp: stampOf(text) }
      }),

    // stamp is the file as the editor read it. When the file on disk is
    // something else now, it's left alone and the window is told.
    saveDesign: (key: unknown, folder: unknown, id: unknown, scene: unknown, stamp: unknown): Promise<Reply<DesignSave>> =>
      inTurn(key, () =>
        reply(d.log, MESSAGES.saveDesign, async () => {
          const realm = await realmOf(key)
          const name = folderArg(folder)
          const file = fileOf(idArg(id))
          const checked = checkScene(scene)
          if (!checked.ok) throw new Refusal(MESSAGES.badScene)
          const path = `${realm.base}/${name}/${file}`
          if (!(await d.host.exists(path)) || stampOf(await d.host.read(path)) !== stamp) return { kind: 'changed' }
          const text = jsonOf({ ...checked.value, edited: { by: 'you', at: now() } })
          await writeFile(realm, name, file, text)

          return { kind: 'saved', stamp: stampOf(text), at: d.now() }
        }),
      ),

    // Your edits beside the file that changed under them, as "<name> (yours)".
    saveDesignCopy: (key: unknown, folder: unknown, id: unknown, scene: unknown): Promise<Reply<string>> =>
      inTurn(key, () =>
        reply(d.log, MESSAGES.saveDesign, async () => {
          const realm = await realmOf(key)
          const name = folderArg(folder)
          const of = idArg(id)
          const checked = checkScene(scene)
          if (!checked.ok) throw new Refusal(MESSAGES.badScene)
          const version = await versionOf(realm, name)
          const ids = new Set(idsIn(await d.host.list(`${realm.base}/${name}`), []))
          const copy = freeId(`${of}-yours`, ids)
          await writeFile(realm, name, fileOf(copy), jsonOf({ ...checked.value, name: `${checked.value.name} (yours)`, edited: { by: 'you', at: now() } }))
          const listed = version.designs.includes(of) ? version.designs : [...version.designs, of]
          await writeFile(realm, name, VERSION, jsonOf({ ...version, designs: listed.flatMap(each => (each === of ? [each, copy] : [each])) }))

          return copy
        }),
      ),

    // file: 'version', 'comments' or a design's id.
    restoreDesignFile: (key: unknown, folder: unknown, file: unknown): Promise<Reply<null>> =>
      inTurn(key, () =>
        reply(d.log, MESSAGES.restoreDesign, async () => {
          const realm = await realmOf(key)
          const name = folderArg(folder)
          const target = file === 'version' ? VERSION : file === 'comments' ? COMMENTS : fileOf(idArg(file))
          const backup = backupOf(realm, name, target)
          if (!(await d.host.exists(backup))) throw new Refusal(MESSAGES.noBackup)
          await writeFile(realm, name, target, await d.host.read(backup))

          return null
        }),
      ),

    addDesignComment: (key: unknown, folder: unknown, input: unknown): Promise<Reply<DesignComment[]>> =>
      changeComments(key, folder, MESSAGES.addComment, async (file, realm, name) => {
        const v = (input ?? {}) as Record<string, unknown>
        const design = idArg(v.design)
        if (!(await d.host.exists(`${realm.base}/${name}/${fileOf(design)}`))) throw new Refusal(MESSAGES.designGone)
        const text = typeof v.text === 'string' ? v.text.trim() : ''
        if (text === '') throw new Refusal(MESSAGES.commentRequired)
        if (text.length > LIMITS.comment) throw new Refusal(MESSAGES.commentLong)
        const on = typeof v.on === 'string' && v.on !== '' && v.on.length <= 100 ? v.on : null
        const comment: DesignComment = { id: `c-${randomBytes(4).toString('hex')}`, design, on, text, by: await authorOf(realm), at: now(), resolved: null, sentTo: null }

        return { ...file, comments: [...file.comments, comment] }
      }),

    setDesignComment: (key: unknown, folder: unknown, id: unknown, isResolved: unknown): Promise<Reply<DesignComment[]>> =>
      changeComments(key, folder, MESSAGES.setComment, async file => {
        if (!file.comments.some(c => c.id === id)) throw new Refusal(MESSAGES.commentGone)

        return { ...file, comments: file.comments.map(c => (c.id === id ? { ...c, resolved: isResolved === true ? now() : null } : c)) }
      }),

    // After Next version filed its quest: the open comments count as sent, and
    // the version names the one that's coming.
    sendDesignComments: (key: unknown, folder: unknown, next: unknown): Promise<Reply<null>> =>
      inTurn(key, () =>
        reply(d.log, MESSAGES.sendComments, async () => {
          const realm = await realmOf(key)
          const name = folderArg(folder)
          const v = (next ?? {}) as Record<string, unknown>
          const label = typeof v.label === 'string' ? v.label.trim() : ''
          const quest = typeof v.quest === 'string' ? v.quest.trim() : ''
          if (label === '' || label.length > LIMITS.label || folderOf(label) === '') throw new Refusal(MESSAGES.badLabel)
          // Taken: a version on disk, or one another version already filed as coming.
          const folders = await foldersOf(realm)
          const coming = await Promise.all(
            folders.map(async f => {
              const v = await readParsed(realm, f, VERSION, parseVersion)

              return v?.ok === true && v.value.next !== null ? folderOf(v.value.next.label) : null
            }),
          )
          if ([...folders, ...coming].includes(folderOf(label))) throw new Refusal(MESSAGES.labelTaken(label))
          if (quest === '' || quest.length > LIMITS.title) throw new Refusal(MESSAGES.badQuestTitle)
          const version = await versionOf(realm, name)
          const file = await commentsOf(realm, name)
          if (file.comments.some(isOpen)) await writeFile(realm, name, COMMENTS, jsonOf({ ...file, comments: file.comments.map(c => (isOpen(c) ? { ...c, sentTo: label } : c)) }))
          await writeFile(realm, name, VERSION, jsonOf({ ...version, next: { label, quest } }))

          return null
        }),
      ),

    showDesigns: (key: unknown): Promise<Reply<null>> =>
      reply(d.log, MESSAGES.showRecord, async () => {
        const realm = await realmOf(key)
        d.reveal((await d.host.exists(realm.base)) ? realm.base : realm.path)

        return null
      }),
  }
}

export type DesignsApi = ReturnType<typeof designsApi>
