import type { ProjectRecord } from '../../../../../types'
import { checklistDraftOf, linkedNotesOf } from '../../../../shared/brew_draft'
import type { BrewDraft, DraftAsk, RealmQuest } from '../../../../shared/brew_draft'
import type { BrewProgress, Reply } from '../../../../shared/engine_api'
import { isNoteId } from '../../../../shared/notes'
import type { NotesView } from '../../../../shared/notes'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import type { streamProcess } from '../../../core/stream_process'
import { checkPath } from '../../branches/domain/constants'
import { lineReader, seenIn } from '../../helpers/domain/helper_stream'
import type { Seen } from '../../helpers/domain/helper_stream'
import { scopeOf } from '../../tasks/api/scope'
import type { TasksDeps } from '../../tasks/api/scope'
import { readOutcomes } from '../data/outcome_store'
import { briefOf, CONTEXT_FILES } from '../domain/brew_brief'
import { lessonsOf } from '../domain/brew_lessons'
import { draftOfReply } from '../domain/brew_reply'

// readNotes: the realm's notes as the Notes page reads them. tell: what
// BrewQuest is doing, for every window.
export type BrewquestDeps = TasksDeps & {
  stream: typeof streamProcess
  newDraftId: () => string
  readNotes: (key: unknown) => Promise<Reply<NotesView>>
  tell: (progress: BrewProgress) => void
}

export const BREW_RUN = { minutes: 8, agent: 'queue-tea:brewquest' } as const
// BrewQuest only reads: these tools are refused even where Rohan's own settings allow them.
export const BREW_REFUSED_TOOLS = ['Bash', 'Edit', 'MultiEdit', 'Write', 'NotebookEdit', 'WebFetch', 'WebSearch', 'Agent', 'Task'] as const

export const realmQuestsOf = (record: Pick<ProjectRecord, 'tasks'>): RealmQuest[] =>
  record.tasks.map(task => ({ id: task.id, title: task.title, state: task.state, parentIds: task.parentIds, priority: task.priority, description: task.description }))

const askOf = (value: unknown): DraftAsk => {
  const v = (value ?? {}) as Record<string, unknown>
  if ((v.mode !== 'claude' && v.mode !== 'checklist') || typeof v.withLinked !== 'boolean') throw new Refusal(MESSAGES.badBrewAsk)

  return { mode: v.mode, withLinked: v.withLinked }
}

const SAID = { unknownParent: MESSAGES.brewUnknownParent, parentNotOpen: MESSAGES.brewParentNotOpen, tooMany: MESSAGES.brewTooMany, loopLeftOut: MESSAGES.brewLoopLeftOut }

// BrewQuest's planning: it reads one note, the notes beside it and the realm
// with Claude Code, in the realm's folder and with read-only tools, and drafts
// quests for Rohan to review. Main checks every part of the answer before the
// window sees it, and whenever reading fails the draft is the checklist, with
// the reason above it. Nothing here files a quest.
export const brewquestApi = (d: BrewquestDeps) => {
  const stops = new Map<string, AbortController>()

  type Ran = { kind: 'answered'; text: string } | { kind: 'trouble'; trouble: string }

  const read = async (key: string, noteId: string, folder: string, order: string, stop: AbortController): Promise<Ran> => {
    let isMissing = false
    let last: Seen | null = null
    let steps = 0
    const lines = lineReader(line => {
      const seen = seenIn(line, BREW_RUN.agent)
      if (seen === null) return
      if (seen.kind === 'doing') {
        steps += seen.doing.kind === 'thinking' ? 0 : 1
        d.tell({ key, noteId, doing: seen.doing, steps })
      } else if (seen.kind === 'missing') {
        isMissing = true
        stop.abort()
      } else last = seen
    })
    d.tell({ key, noteId, doing: null, steps })
    d.log.debug(`brewquest reads note ${noteId} in ${folder}`)
    const argv = ['claude', '-p', '--agent', BREW_RUN.agent, '--disallowedTools', BREW_REFUSED_TOOLS.join(','), '--output-format', 'stream-json', '--verbose', '--', order]
    const ran = await d.stream(d.log, { argv, cwd: folder, signal: stop.signal, timeoutMs: BREW_RUN.minutes * 60_000, env: { PATH: checkPath(d.home, process.env.PATH) } }, lines)
    const ended = last as Seen | null
    d.log.debug(`brewquest ended with exit ${ran.exitCode}`)
    if (isMissing) return { kind: 'trouble', trouble: MESSAGES.brewMissing }
    if (ran.timedOut === true) return { kind: 'trouble', trouble: MESSAGES.brewTimedOut(BREW_RUN.minutes) }
    if (stop.signal.aborted) return { kind: 'trouble', trouble: MESSAGES.brewStopped }
    if (ended?.kind === 'done') return { kind: 'answered', text: ended.reply }
    d.log.warn(`brewquest failed: ${ended?.kind === 'failed' ? ended.detail : ran.stderr.slice(-2_000)}`)

    return { kind: 'trouble', trouble: /ENOENT/.test(ran.stderr) ? MESSAGES.brewNoClaude : MESSAGES.brewFailed }
  }

  const draftNoteQuests = (key: unknown, id: unknown, ask: unknown): Promise<Reply<BrewDraft>> =>
    reply(d.log, MESSAGES.draftNoteQuests, async () => {
      const how = askOf(ask)
      if (!isNoteId(id)) throw new Refusal(MESSAGES.unknownNote)
      const scope = await scopeOf(d, key)
      const view = await d.readNotes(scope.key)
      if (!view.ok) throw new Refusal(view.error.message)
      const note = view.data.notes.find(one => one.id === id)
      if (note === undefined) throw new Refusal(MESSAGES.unknownNote)
      const realm = realmQuestsOf(scope.record)
      const draftId = d.newDraftId()
      if (how.mode === 'checklist') return checklistDraftOf(draftId, note, realm)

      const folder = scope.ctx.projectPath
      if (!(await d.host.exists(folder))) return checklistDraftOf(draftId, note, realm, MESSAGES.brewFolderGone(folder))
      const linked = how.withLinked ? linkedNotesOf(note, view.data.notes) : []
      const files: string[] = []
      for (const file of CONTEXT_FILES) if (await d.host.exists(`${folder}/${file}`)) files.push(file)
      const lessons = lessonsOf(await readOutcomes(d, scope.key))
      const order = briefOf({ realm: { name: scope.ctx.projectName, path: folder }, note, linked, quests: realm, files, lessons })
      // After the last await before the run, so two quick reads can't both start.
      if (stops.has(scope.key)) throw new Refusal(MESSAGES.brewBusy)
      const stop = new AbortController()
      stops.set(scope.key, stop)
      let ran: Ran
      try {
        ran = await read(scope.key, note.id, folder, order, stop)
      } finally {
        stops.delete(scope.key)
      }
      if (ran.kind === 'trouble') return checklistDraftOf(draftId, note, realm, ran.trouble)
      const answer = draftOfReply(ran.text, { id: draftId, notes: [note, ...linked], realm, said: SAID })
      if (answer.kind === 'unreadable') {
        d.log.warn(`brewquest's answer didn't read as a draft: ${answer.why}`)

        return checklistDraftOf(draftId, note, realm, MESSAGES.brewUnreadable)
      }

      return { ...answer.draft, learned: lessons }
    })

  const stopNoteDraft = (key: unknown): Promise<Reply<null>> =>
    reply(d.log, MESSAGES.stopNoteDraft, async () => {
      if (typeof key !== 'string') throw new Refusal(MESSAGES.unknownProject)
      stops.get(key)?.abort()

      return null
    })

  const isBusy = (): boolean => stops.size > 0

  return { draftNoteQuests, stopNoteDraft, isBusy }
}

export type BrewquestApi = ReturnType<typeof brewquestApi>
