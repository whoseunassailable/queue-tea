import { useRef, useState } from 'preact/hooks'

import type { EngineApi, RecordLine, Settings, SettingsPage as PageData, SkyChoice, TerminalChoice } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { DEFAULT_LOG_PATH } from '../../../../core/constants/constants'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field } from '../../../../core/widgets/field'
import { ReadView } from '../../../../core/widgets/read_view'
import { t } from '../../../../l10n/en'
import { logPathError } from '../../../quests/domain/quest_form'

const SKIES: readonly SkyChoice[] = ['auto', 'morning', 'day', 'evening', 'night']
const TERMINALS: readonly TerminalChoice[] = ['terminal', 'iterm', 'vscode']
const CONFIG = '/config'

type Editing = { record: RecordLine }

const LogDialog = ({ engine, record, onDone, onClose }: { engine: EngineApi; record: RecordLine; onDone: () => void; onClose: () => void }) => {
  const [path, setPath] = useState(record.logPath ?? DEFAULT_LOG_PATH)
  const [isTouched, setTouched] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)
  const isSending = useRef(false)

  const submit = async () => {
    setTouched(true)
    setFailure(null)
    if (isSending.current || logPathError(path) !== undefined) return
    isSending.current = true
    const answer = await ask(engine, () => engine.setTaskLog(record.key, path.trim()))
    isSending.current = false
    if (!answer.ok) {
      setFailure(answer.message)

      return
    }
    onDone()
    onClose()
  }

  return (
    <Dialog title={t.settings.logTitle(record.name)} onCancel={onClose} onSubmit={() => void submit()}>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <Field label={t.finish.path} isRequired value={path} error={isTouched ? logPathError(path) : undefined} onInput={setPath} onBlur={() => setTouched(true)} onEnter={() => void submit()} />
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.actions.save}
        </button>
      </div>
    </Dialog>
  )
}

type Sections = { page: PageData; settings: Settings; onChange: (patch: Partial<Settings>) => void; onCopy: (text: string) => void; onShow: (key: string | null) => void; onEdit: (editing: Editing) => void }

const Switch = ({ label, isOn, onToggle }: { label: string; isOn: boolean; onToggle: () => void }) => <button type="button" class="switch" role="switch" aria-checked={isOn} aria-label={label} onClick={onToggle} />

const Motion = ({ settings, onChange }: Pick<Sections, 'settings' | 'onChange'>) => (
  <section class="panel panel-pad" aria-labelledby="set-sky">
    <div class="sec-row">
      <h2 id="set-sky">{t.settings.sky}</h2>
    </div>
    <div class="set-row">
      <span>{t.settings.skyLabel}</span>
      <div class="seg" role="group" aria-label={t.settings.skyLabel}>
        {SKIES.map(sky => (
          <button key={sky} type="button" class={settings.sky === sky ? 'on' : ''} aria-pressed={settings.sky === sky} onClick={() => onChange({ sky })}>
            {t.settings.skyNames[sky]}
          </button>
        ))}
      </div>
      <span class="sub">{t.settings.skyLine}</span>
    </div>
    <div class="set-row">
      <span>{t.settings.calm}</span>
      <Switch label={t.settings.calm} isOn={settings.isCalm} onToggle={() => onChange({ isCalm: !settings.isCalm })} />
      <span class="sub">{t.settings.calmLine}</span>
    </div>
  </section>
)

const FromClaude = ({ page, onCopy }: Pick<Sections, 'page' | 'onCopy'>) => {
  const value = (text: string) => (page.isDefault ? `${text} · ${t.settings.default}` : text)
  const { options } = page
  const row = (label: string, text: string) => (
    <div class="set-row">
      <span>{label}</span>
      <span class="val">{value(text)}</span>
    </div>
  )

  return (
    <section class="panel panel-pad" aria-labelledby="set-claude">
      <div class="sec-row">
        <h2 id="set-claude">{t.settings.claude}</h2>
        <span class="sec-sub">{t.settings.claudeSub}</span>
      </div>
      {row(t.settings.idle, t.settings.minutes(options.idleGapMinutes))}
      {row(t.settings.fresh, t.settings.tokens(options.freshAtTokens.toLocaleString('en-US')))}
      {row(t.settings.handoff, t.settings.percent(options.handoffAtPercent))}
      {row(t.settings.check, t.settings.seconds(options.checkTimeoutSeconds))}
      <div class="set-row">
        <span class="copy-line">
          {t.settings.fromClaude} · <code>{CONFIG}</code>
        </span>
        <button type="button" class="chip-btn" onClick={() => onCopy(CONFIG)}>
          {t.settings.copyConfig}
        </button>
      </div>
    </section>
  )
}

const Terminals = ({ settings, onChange }: Pick<Sections, 'settings' | 'onChange'>) => (
  <section class="panel panel-pad" aria-labelledby="set-terminal">
    <div class="sec-row">
      <h2 id="set-terminal">{t.settings.terminal}</h2>
    </div>
    <div class="set-row">
      <div class="seg" role="group" aria-label={t.settings.terminal}>
        {TERMINALS.map(terminal => (
          <button key={terminal} type="button" class={settings.terminal === terminal ? 'on' : ''} aria-pressed={settings.terminal === terminal} onClick={() => onChange({ terminal })}>
            {t.terminal[terminal]}
          </button>
        ))}
      </div>
      <span class="sub">{t.settings.terminalLine}</span>
    </div>
  </section>
)

const copyText = (record: RecordLine): string => {
  if (!record.isReadable) return t.settings.cantRead

  return record.hasCopy ? t.settings.hasCopy : t.settings.noCopy
}

const Records = ({ page, onShow }: Pick<Sections, 'page' | 'onShow'>) => (
  <section class="panel panel-pad" aria-labelledby="set-records">
    <div class="sec-row">
      <h2 id="set-records">{t.settings.records}</h2>
    </div>
    <div class="set-row">
      <span class="mono">{page.folder}</span>
      <button type="button" class="chip-btn" onClick={() => onShow(null)}>
        {t.settings.showInFinder}
      </button>
    </div>
    {page.records.map(record => (
      <div key={record.key} class="set-row">
        <span>
          {record.name} · <span class="mono">{record.file}</span>
        </span>
        <span class="val">{copyText(record)}</span>
      </div>
    ))}
  </section>
)

const Logs = ({ page, onEdit }: Pick<Sections, 'page' | 'onEdit'>) => (
  <section class="panel panel-pad" aria-labelledby="set-logs">
    <div class="sec-row">
      <h2 id="set-logs">{t.settings.log}</h2>
    </div>
    {page.records
      .filter(record => record.isReadable)
      .map(record => (
        <div key={record.key} class="set-row">
          <span>
            {record.name} · {record.logPath === null ? t.settings.notSet : <span class="mono">{record.logPath}</span>}
          </span>
          <button type="button" class="chip-btn" aria-label={`${record.logPath === null ? t.settings.setNow : t.settings.change} ${record.name}`} onClick={() => onEdit({ record })}>
            {record.logPath === null ? t.settings.setNow : t.settings.change}
          </button>
          {record.logPath === null && <span class="sub">{t.settings.notSetLine}</span>}
        </div>
      ))}
  </section>
)

const Opening = ({ page, onInstall }: { page: PageData; onInstall: () => void }) => (
  <section class="panel panel-pad" aria-labelledby="set-opening">
    <div class="sec-row">
      <h2 id="set-opening">{t.settings.opening}</h2>
    </div>
    <div class="set-row">
      <span class="copy-line">
        <code>queue-tea open</code> {t.settings.commandLine}
      </span>
      {page.command === null ? (
        <button type="button" class="chip-btn" onClick={onInstall}>
          {t.settings.install}
        </button>
      ) : (
        <span class="val mono">{page.command.path}</span>
      )}
      {page.command?.needsPath === true && <span class="sub">{t.settings.installedPath(page.command.path)}</span>}
    </div>
    <div class="set-row">
      <span class="copy-line">
        <code>queue-tea://open?path=…</code>
      </span>
      <span class="sub">{t.settings.linkLine}</span>
    </div>
  </section>
)

const Keyboard = ({ settings, onChange }: Pick<Sections, 'settings' | 'onChange'>) => (
  <section class="panel panel-pad" aria-labelledby="set-keys">
    <div class="sec-row">
      <h2 id="set-keys">{t.settings.keyboard}</h2>
    </div>
    <div class="set-row">
      <span>{t.settings.letters}</span>
      <Switch label={t.settings.letters} isOn={settings.letterKeys} onToggle={() => onChange({ letterKeys: !settings.letterKeys })} />
      <span class="sub">{t.settings.lettersLine}</span>
    </div>
  </section>
)

type PageProps = { engine: EngineApi; settings: Settings; onChange: (patch: Partial<Settings>) => void; onCopy: (text: string) => void; onShow: (key: string | null) => void; onInstall: () => Promise<boolean> }

export const SettingsPage = ({ engine, settings, onChange, onCopy, onShow, onInstall }: PageProps) => {
  const read = useEngineRead(engine, () => engine.readSettingsPage(), [])
  const [editing, setEditing] = useState<Editing | null>(null)

  return (
    <main class="page">
      <div class="set-grid">
        <Motion settings={settings} onChange={onChange} />
        <Terminals settings={settings} onChange={onChange} />
        <Keyboard settings={settings} onChange={onChange} />
      </div>
      <ReadView read={read} line={t.loading.settings}>
        {page => (
          <div class="set-grid">
            <FromClaude page={page} onCopy={onCopy} />
            <Records page={page} onShow={onShow} />
            <Logs page={page} onEdit={setEditing} />
            <Opening page={page} onInstall={() => void onInstall().then(isDone => isDone && read.refresh())} />
          </div>
        )}
      </ReadView>
      {editing !== null && <LogDialog engine={engine} record={editing.record} onDone={read.refresh} onClose={() => setEditing(null)} />}
    </main>
  )
}
