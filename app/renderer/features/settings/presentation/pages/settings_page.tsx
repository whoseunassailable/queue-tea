import { useRef, useState } from 'preact/hooks'

import type { EngineApi, RealmLine, Settings, SettingsPage as PageData, SkyChoice, TerminalChoice } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { DEFAULT_LOG_PATH } from '../../../../core/constants/constants'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field } from '../../../../core/widgets/field'
import { ReadView } from '../../../../core/widgets/read_view'
import { t } from '../../../../l10n/en'
import { GithubAccounts } from '../../../github/presentation/widgets/github_accounts'
import { logPathError } from '../../../quests/domain/quest_form'

const SKIES: readonly SkyChoice[] = ['auto', 'morning', 'day', 'evening', 'night']
const TERMINALS: readonly TerminalChoice[] = ['terminal', 'iterm', 'vscode']
const CONFIG = '/config'

const LogDialog = ({ engine, realm, onDone, onClose }: { engine: EngineApi; realm: RealmLine; onDone: () => void; onClose: () => void }) => {
  const [path, setPath] = useState(realm.logPath ?? DEFAULT_LOG_PATH)
  const [isTouched, setTouched] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)
  const isSending = useRef(false)
  const error = logPathError(path, realm.path)

  const submit = async () => {
    setTouched(true)
    setFailure(null)
    if (isSending.current || error !== undefined) return
    isSending.current = true
    const answer = await ask(engine, () => engine.setTaskLog(realm.key, path.trim()))
    isSending.current = false
    if (!answer.ok) {
      setFailure(answer.message)

      return
    }
    onDone()
    onClose()
  }

  return (
    <Dialog title={t.settings.logTitle(realm.name)} onCancel={onClose} onSubmit={() => void submit()}>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <Field label={t.finish.path} isRequired value={path} error={isTouched ? error : undefined} onInput={setPath} onBlur={() => setTouched(true)} onEnter={() => void submit()} />
      <p class="card-note">{t.settings.logInside}</p>
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

type Sections = { page: PageData; settings: Settings; onChange: (patch: Partial<Settings>) => void; onCopy: (text: string) => void }

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

const copyText = (realm: RealmLine): string => {
  if (!realm.isReadable) return t.settings.cantRead

  return realm.hasCopy ? t.settings.hasCopy : t.settings.noCopy
}

type ThisRealmProps = { realm: RealmLine; account: string | null; onShow: (key: string) => void; onEdit: () => void; onConnect: (realm: RealmLine) => void }

// One realm at a time, so nothing of another realm's is ever on this page.
const ThisRealm = ({ realm, account, onShow, onEdit, onConnect }: ThisRealmProps) => (
  <section class="panel panel-pad" aria-labelledby="set-realm">
    <div class="sec-row">
      <h2 id="set-realm">{t.settings.thisRealm(realm.name)}</h2>
    </div>
    <div class="set-row">
      <span>
        {t.settings.record} · <span class="mono">{realm.file}</span>
      </span>
      <button type="button" class="chip-btn" onClick={() => onShow(realm.key)}>
        {t.settings.showInFinder}
      </button>
      <span class="sub">{copyText(realm)}</span>
    </div>
    {realm.isReadable && (
      <>
        <div class="set-row">
          <span>
            {t.settings.log} · {realm.logPath === null ? t.settings.notSet : <span class="mono">{realm.logPath}</span>}
          </span>
          <button type="button" class="chip-btn" onClick={onEdit}>
            {realm.logPath === null ? t.settings.setNow : t.settings.change}
          </button>
          {realm.logPath === null && <span class="sub">{t.settings.notSetLine}</span>}
        </div>
        <div class="set-row">
          <span>
            {t.github.question} · {account === null ? t.github.notConnected : <span class="mono">{t.github.chip(account)}</span>}
          </span>
          <button type="button" class="chip-btn" aria-label={account === null ? t.github.connectFor(realm.name) : t.github.changeFor(realm.name)} onClick={() => onConnect(realm)}>
            {account === null ? t.github.connect : t.settings.change}
          </button>
        </div>
      </>
    )}
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

type PageProps = { engine: EngineApi; selected: string | null; settings: Settings; onChange: (patch: Partial<Settings>) => void; onCopy: (text: string) => void; onShow: (key: string) => void; onInstall: () => Promise<boolean>; onConnect: (realm: RealmLine) => void }

export const SettingsPage = ({ engine, selected, settings, onChange, onCopy, onShow, onInstall, onConnect }: PageProps) => {
  const read = useEngineRead(engine, () => engine.readSettingsPage(selected), [selected])
  const [isEditing, setEditing] = useState(false)

  return (
    <main class="page">
      <ReadView read={read} line={t.loading.settings}>
        {page => (
          <div class="set-grid">
            {page.realm !== null && <ThisRealm realm={page.realm} account={settings.realmAccounts[page.realm.key] ?? null} onShow={onShow} onEdit={() => setEditing(true)} onConnect={onConnect} />}
            <GithubAccounts engine={engine} onCopy={onCopy} />
            <FromClaude page={page} onCopy={onCopy} />
            <Opening page={page} onInstall={() => void onInstall().then(isDone => isDone && read.refresh())} />
            {isEditing && page.realm !== null && <LogDialog engine={engine} realm={page.realm} onDone={read.refresh} onClose={() => setEditing(false)} />}
          </div>
        )}
      </ReadView>
      <div class="set-grid">
        <Motion settings={settings} onChange={onChange} />
        <Terminals settings={settings} onChange={onChange} />
        <Keyboard settings={settings} onChange={onChange} />
      </div>
    </main>
  )
}
