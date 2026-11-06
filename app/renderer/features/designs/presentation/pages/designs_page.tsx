import type { ComponentChildren } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { folderOf, isOpen } from '../../../../../shared/designs'
import type { DesignComment, DesignRead, DesignsView, VersionRow, VersionView } from '../../../../../shared/designs'
import type { EngineApi } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import type { Answer } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { DETAIL_IS_PAGE_BELOW } from '../../../../core/constants/constants'
import { ReadView } from '../../../../core/widgets/read_view'
import { Failed, Loading } from '../../../../core/widgets/states'
import { useWindowWidth } from '../../../../core/widgets/window_width'
import { t } from '../../../../l10n/en'
import { nextFormOf, questOfNext, validateNext } from '../../domain/design_forms'
import type { Names, NextForm } from '../../domain/design_forms'
import { BrokenFile, DesignCard } from '../widgets/design_card'
import type { CardRead } from '../widgets/design_card'
import { DesignEditor } from '../widgets/design_editor'
import { NextVersionSheet } from '../widgets/next_version_sheet'
import { VersionMenu, VersionRail } from '../widgets/version_rail'
import '../designs.css'

type Filed = { form: NextForm; count: number }

// Labels a new version can't take: the folders on disk and the ones already coming.
const takenOf = (view: DesignsView) => [...view.versions.map(v => v.folder), ...view.coming.map(c => folderOf(c.label))]

// What was filed, and the way to the quest.
const FiledNote = ({ filed, onQuests }: { filed: Filed; onQuests: () => void }) => (
  <div class="note panel dz-filed" role="status">
    <b>{filed.form.from === null ? t.designs.firstFiledTitle : t.designs.filedTitle}</b>
    <button type="button" class="link-btn" onClick={onQuests}>
      {filed.form.title.trim()} · {t.designs.queued}
    </button>
    <p class="sub">{filed.form.from === null ? t.designs.firstFiledLine : t.designs.filedLine(filed.count, filed.form.label.trim())}</p>
  </div>
)

// A design read once when it opens: a later read would throw away its undo
// history, so only Load the new one reads it again.
const EditorLoader = ({ engine, realm, row, id, version, onBack, onComments, onCopied }: { engine: EngineApi; realm: string; row: VersionRow; id: string; version: VersionView; onBack: () => void; onComments: (comments: DesignComment[]) => void; onCopied: (name: string) => void }) => {
  const [reads, setReads] = useState(0)
  const [load, setLoad] = useState<{ status: 'loading' } | { status: 'failed'; message: string } | { status: 'ready'; data: DesignRead }>({ status: 'loading' })
  useEffect(() => {
    let isCurrent = true
    setLoad({ status: 'loading' })
    void ask(engine, () => engine.readDesign(realm, row.folder, id)).then(answer => {
      if (isCurrent) setLoad(answer.ok ? { status: 'ready', data: answer.data } : { status: 'failed', message: answer.message })
    })

    return () => {
      isCurrent = false
    }
  }, [engine, realm, row.folder, id, reads])
  const again = () => setReads(n => n + 1)
  const comment = async (call: () => ReturnType<EngineApi['addDesignComment']>): Promise<Answer<unknown>> => {
    const answer = await ask(engine, call)
    if (answer.ok) onComments(answer.data)

    return answer
  }

  if (load.status === 'loading') return <Loading line={t.designs.readingDesign(id)} />
  if (load.status === 'failed') return <Failed message={load.message} onRetry={again} />
  if (load.data.kind === 'broken') {
    return (
      <div class="dz-page">
        <button type="button" class="link-btn" onClick={onBack}>
          {t.designs.back(row.label)}
        </button>
        <div class="panel panel-pad">
          <BrokenFile
            title={t.designs.brokenTitle(id)}
            problem={load.data.problem}
            onRetry={again}
            onRestore={async () => {
              const answer = await ask(engine, () => engine.restoreDesignFile(realm, row.folder, id))
              if (answer.ok) again()

              return answer.ok ? null : answer.message
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <DesignEditor
      key={reads}
      engine={engine}
      realm={realm}
      folder={row.folder}
      label={row.label}
      id={id}
      scene={load.data.scene}
      stamp={load.data.stamp}
      comments={version.comments}
      commentsProblem={version.commentsProblem}
      onBack={onBack}
      onReload={again}
      onCopied={onCopied}
      onAddComment={input => comment(() => engine.addDesignComment(realm, row.folder, input))}
      onSetComment={(commentId, isResolved) => comment(() => engine.setDesignComment(realm, row.folder, commentId, isResolved))}
    />
  )
}

type ScopeProps = {
  engine: EngineApi
  realm: string
  name: string
  row: VersionRow
  view: DesignsView
  rail: ComponentChildren
  filed: Filed | null
  onFiled: (filed: Filed) => void
  onChanged: () => void
  onQuests: () => void
}

// One version: its page of cards, or one of its designs open in the editor.
const VersionScope = ({ engine, realm, name, row, view, rail, filed, onFiled, onChanged, onQuests }: ScopeProps) => {
  const version = useEngineRead<VersionView>(engine, () => engine.readDesignVersion(realm, row.folder), [realm, row.folder])
  const [open, setOpen] = useState<string | null>(null)
  const [names, setNames] = useState<Names>({})
  const [reads, setReads] = useState<Record<string, CardRead>>({})
  const [sheet, setSheet] = useState<NextForm | null>(null)
  const [needComment, setNeedComment] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  if (version.load.status !== 'ready') {
    return (
      <div class="dz">
        {rail}
        <ReadView read={version} line={t.designs.loading}>
          {() => null}
        </ReadView>
      </div>
    )
  }
  const data = version.load.data
  const adoptComments = (comments: DesignComment[]) => {
    version.adopt({ ...data, comments })
    onChanged()
  }
  if (open !== null) {
    return (
      <EditorLoader
        engine={engine}
        realm={realm}
        row={row}
        id={open}
        version={data}
        onBack={() => {
          setOpen(null)
          version.refresh()
          onChanged()
        }}
        onComments={adoptComments}
        onCopied={designName => {
          setCopied(t.designs.savedCopy(designName))
          version.refresh()
        }}
      />
    )
  }
  const openCount = data.comments.filter(isOpen).length
  const commented = new Set(data.comments.filter(isOpen).map(c => c.design)).size
  const taken = takenOf(view)
  const stillReading = data.designs.some(id => reads[id] === undefined)
  const next = nextFormOf(name, { label: row.label, folder: row.folder }, data.comments, names, taken)

  return (
    <div class="dz">
      {rail}
      <section class="dz-main">
        {version.note !== null && (
          <p class="note panel" role="status">
            {version.note}
          </p>
        )}
        <header class="dz-head panel">
          <div>
            <h1>{row.label}</h1>
            <p class="sub">
              <b>{t.designs.by(row.by)}</b> · {t.designs.meta(row.made, row.from, data.designs.length)}
            </p>
          </div>
          <div class="dz-next">
            <button
              type="button"
              class="btn primary"
              onClick={() => {
                setNeedComment(openCount === 0)
                if (openCount > 0) setSheet(next)
              }}
            >
              {t.designs.nextVersion}
            </button>
            {needComment && openCount === 0 ? (
              <p class="field-error" role="alert">
                {t.designs.needComment}
              </p>
            ) : (
              <p class="sub">{stillReading ? t.designs.stillReading : openCount > 0 ? t.designs.nextLine(openCount, commented, next.label) : t.designs.noOpenLine}</p>
            )}
          </div>
        </header>
        {filed !== null && filed.form.from?.folder === row.folder && <FiledNote filed={filed} onQuests={onQuests} />}
        {copied !== null && (
          <p class="note panel" role="status">
            {copied}
          </p>
        )}
        {data.designs.length === 0 && <p class="hint panel panel-pad">{t.designs.noDesigns}</p>}
        <div class="dz-cards">
          {data.designs.map(id => (
            <DesignCard
              key={id}
              engine={engine}
              realm={realm}
              folder={row.folder}
              id={id}
              comments={data.comments}
              onOpen={() => setOpen(id)}
              onRead={(design, state, found) => {
                setReads(was => (was[design] === state ? was : { ...was, [design]: state }))
                if (found !== null) setNames(was => ({ ...was, [design]: found }))
              }}
            />
          ))}
        </div>
      </section>
      {sheet !== null && (
        <NextVersionSheet
          realm={name}
          first={sheet}
          taken={taken}
          comments={data.comments}
          names={names}
          uncommitted={data.uncommitted}
          onFile={async form => {
            // The rail can be stale (a version merged while this was open), and main refuses a
            // taken label only after the quest is filed, so check the label against a fresh read.
            const fresh = await ask(engine, () => engine.readDesigns(realm))
            if (!fresh.ok) return { filed: fresh, marked: null }
            const labelError = validateNext(form, takenOf(fresh.data)).label
            if (labelError !== undefined) return { filed: { ok: false, message: labelError }, marked: null }
            const filedQuest = await ask(engine, () => engine.fileQuest(realm, questOfNext(form)))
            if (!filedQuest.ok || form.from === null) return { filed: filedQuest, marked: null }
            const marked = await ask(engine, () => engine.sendDesignComments(realm, row.folder, { label: form.label.trim(), quest: form.title.trim() }))

            return { filed: filedQuest, marked }
          }}
          onMarkAgain={form => ask(engine, () => engine.sendDesignComments(realm, row.folder, { label: form.label.trim(), quest: form.title.trim() }))}
          onDone={form => {
            setSheet(null)
            onFiled({ form, count: openCount })
            version.refresh()
            onChanged()
          }}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  )
}

// A version that doesn't read, where its page would be.
const BrokenVersion = ({ engine, realm, row, others, rail, onChanged }: { engine: EngineApi; realm: string; row: VersionRow; others: number; rail: ComponentChildren; onChanged: () => void }) => {
  const [failure, setFailure] = useState<string | null>(null)
  const problem = row.problem!

  return (
    <div class="dz">
      {rail}
      <section class="dz-main">
        <div class="panel panel-pad dz-broken" role="alert">
          <h2>{t.designs.versionBrokenTitle(row.label)}</h2>
          <p>{t.designs.versionBrokenLine(problem.detail)}</p>
          <code>{problem.file}</code>
          <p>{problem.backupAt === null ? t.designs.fixLine : `${t.designs.fixLine} ${t.designs.backupLine(problem.backupAt)}`}</p>
          <div class="dz-broken-acts">
            <button type="button" class="btn" onClick={onChanged}>
              {t.failed.tryAgain}
            </button>
            {problem.backupAt !== null && (
              <button
                type="button"
                class="btn"
                onClick={async () => {
                  const answer = await ask(engine, () => engine.restoreDesignFile(realm, row.folder, 'version'))
                  setFailure(answer.ok ? null : answer.message)
                  if (answer.ok) onChanged()
                }}
              >
                {t.designs.useLastGood}
              </button>
            )}
          </div>
          {failure !== null && <p class="field-error">{failure}</p>}
          {others > 0 && <p class="sub">{t.designs.othersWork(others)}</p>}
        </div>
      </section>
    </div>
  )
}

export const DesignsPage = ({ engine, realm, name, onQuests }: { engine: EngineApi; realm: string; name: string; onQuests: () => void }) => {
  const list = useEngineRead<DesignsView>(engine, () => engine.readDesigns(realm), [realm])
  const [chosen, setChosen] = useState<string | null>(null)
  const [filed, setFiled] = useState<Filed | null>(null)
  const [sheet, setSheet] = useState<NextForm | null>(null)
  const [showFailure, setShowFailure] = useState<string | null>(null)
  const isNarrow = useWindowWidth() < DETAIL_IS_PAGE_BELOW
  useEffect(() => {
    setChosen(null)
    setFiled(null)
  }, [realm])
  // Claude or a merge may have changed docs/designs while the window was away.
  useEffect(() => {
    window.addEventListener('focus', list.refresh)

    return () => window.removeEventListener('focus', list.refresh)
  }, [list.refresh])

  const show = async () => {
    const answer = await ask(engine, () => engine.showDesigns(realm))
    setShowFailure(answer.ok ? null : answer.message)
  }

  if (list.load.status !== 'ready') {
    return (
      <main class="page dz-page">
        <ReadView read={list} line={t.designs.loading}>
          {() => null}
        </ReadView>
        {list.load.status === 'loading' && <p class="sub dz-where">{t.designs.loadingWhere(name)}</p>}
      </main>
    )
  }
  const view = list.load.data
  // Until one is picked, the newest version that reads.
  const row = view.versions.find(v => v.folder === chosen) ?? view.versions.find(v => v.problem === null) ?? view.versions[0] ?? null
  const rail = isNarrow ? (
    view.versions.length > 0 && <VersionMenu view={view} current={row?.folder ?? null} showFailure={showFailure} onPick={setChosen} onShow={() => void show()} />
  ) : (
    <VersionRail view={view} current={row?.folder ?? null} showFailure={showFailure} onPick={setChosen} onShow={() => void show()} />
  )

  if (row === null) {
    return (
      <main class={`page dz-page${isNarrow ? ' narrow' : ''}`}>
        <div class="dz">
          {rail}
          <section class="dz-main">
            {filed !== null ? (
              <FiledNote filed={filed} onQuests={onQuests} />
            ) : (
              <div class="state panel">
                <h2 class="state-title">{t.designs.emptyTitle(name)}</h2>
                <p class="state-line">{t.designs.emptyLine}</p>
                <button type="button" class="btn primary" onClick={() => setSheet(nextFormOf(name, null, [], {}, view.coming.map(c => folderOf(c.label))))}>
                  {t.designs.fileDesignQuest}
                </button>
                <p class="sub">{t.designs.emptyHint}</p>
              </div>
            )}
          </section>
        </div>
        {sheet !== null && (
          <NextVersionSheet
            realm={name}
            first={sheet}
            taken={[]}
            comments={[]}
            names={{}}
            uncommitted={0}
            onFile={async form => ({ filed: await ask(engine, () => engine.fileQuest(realm, questOfNext(form))), marked: null })}
            onMarkAgain={async () => ({ ok: true, data: null })}
            onDone={form => {
              setSheet(null)
              setFiled({ form, count: 0 })
            }}
            onClose={() => setSheet(null)}
          />
        )}
      </main>
    )
  }

  return (
    <main class={`page dz-page${isNarrow ? ' narrow' : ''}`}>
      {list.note !== null && (
        <p class="note panel" role="status">
          {list.note}
        </p>
      )}
      {row.problem !== null ? (
        <BrokenVersion engine={engine} realm={realm} row={row} others={view.versions.length - 1} rail={rail} onChanged={list.refresh} />
      ) : (
        <VersionScope key={`${realm}/${row.folder}`} engine={engine} realm={realm} name={name} row={row} view={view} rail={rail} filed={filed} onFiled={setFiled} onChanged={list.refresh} onQuests={onQuests} />
      )}
    </main>
  )
}
