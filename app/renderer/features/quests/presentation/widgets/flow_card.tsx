import { useState } from 'preact/hooks'

import type { GitHold } from '../../../../../shared/engine_api'
import { HOLD_FILES_SHOWN } from '../../../../core/constants/constants'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { QuestFlow } from '../../../workspace/state_management/workspace_store'
import type { QuestActions } from '../state_management/flow_keys'
import { CopyLine } from './copy_line'

const Talisman = () => (
  <svg class="talisman" viewBox="0 0 44 80" width="44" height="80" aria-hidden="true">
    <rect x="4" y="2" width="36" height="76" rx="3" fill="#F6E3B0" stroke="#A87C30" stroke-width="2" />
    <rect x="9" y="7" width="26" height="66" fill="none" stroke="#B23C2B" stroke-width="2" />
    <path d="M22 14v14M15 21h14M16 36l12 8M28 36l-12 8M22 50v14M16 57h12" fill="none" stroke="#B23C2B" stroke-width="2.4" stroke-linecap="round" />
  </svg>
)

const Files = ({ hold }: { hold: GitHold }) => {
  const [isOpen, setOpen] = useState(false)
  if (hold.files.length === 0) return null
  const shown = isOpen ? hold.files : hold.files.slice(0, HOLD_FILES_SHOWN)
  const hidden = hold.fileCount - shown.length

  return (
    <div class="files" aria-label={t.flow.notCommitted}>
      {shown.map(file => (
        <span key={file}>{file}</span>
      ))}
      {hidden > 0 &&
        (isOpen ? (
          <span>{t.flow.more(hidden)}</span>
        ) : (
          <button type="button" class="link-btn" onClick={() => setOpen(true)}>
            {t.flow.more(hidden)}
          </button>
        ))}
    </div>
  )
}

const Held = ({ flow, actions }: { flow: Extract<QuestFlow, { kind: 'held' }>; actions: QuestActions }) => {
  const { hold } = flow

  return (
    <section class="mcard panel" aria-label={t.flow.gate(flow.title)}>
      <div class="m-h">
        <Talisman />
        <div>
          <p>{t.flow.gate(flow.title)}</p>
          <p class="card-note">{hold.branch === null ? hold.reason : t.flow.holdOn(hold.reason, hold.branch, hold.head)}</p>
        </div>
      </div>
      <Files hold={hold} />
      <p class="card-note">{`${t.flow.advice[hold.kind]} ${t.flow.nothingChanged}`}</p>
      {hold.command !== null && <CopyLine text={hold.command} onCopy={actions.onCopy} />}
      <div class="row-end">
        <button type="button" class="btn" onClick={actions.onCancel}>
          {t.actions.cancel}
        </button>
        <button type="button" class="btn primary" disabled={flow.isChecking} onClick={actions.onCheckAgain}>
          {flow.isChecking && <Spinner />}
          {flow.isChecking ? t.flow.checking : t.flow.checkAgain}
        </button>
      </div>
    </section>
  )
}

// What a quest is in the middle of, in place of the active card.
export const FlowCard = ({ flow, actions }: { flow: QuestFlow; actions: QuestActions }) => {
  if (flow.kind === 'held') return <Held flow={flow} actions={actions} />
  if (flow.kind === 'working') {
    return (
      <section class="mcard panel" role="status" aria-label={t.flow.working}>
        <p class="m-title">{flow.title}</p>
        <ul class="steps">
          <li>
            <span class="st wait">
              <Spinner />
            </span>
            {flow.line}
          </li>
        </ul>
      </section>
    )
  }
  if (flow.kind === 'refused') {
    return (
      <section class="mcard panel" role="alert">
        <p class="m-title">{flow.title}</p>
        <p class="card-note">{flow.message}</p>
        <div class="row-end">
          <button type="button" class="btn" onClick={actions.onCancel}>
            {t.actions.cancel}
          </button>
          <button type="button" class="btn primary" onClick={actions.onCheckAgain}>
            {t.failed.tryAgain}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section class="mcard panel" aria-label={t.flow.couldntOpen(t.terminal[flow.terminal])}>
      <p class="m-title">{t.flow.couldntOpen(t.terminal[flow.terminal])}</p>
      <p class="card-note">{t.flow.pasteLine}</p>
      <CopyLine text={flow.command} onCopy={actions.onCopy} />
      <div class="row-end">
        <button type="button" class="btn" onClick={actions.onCancel}>
          {t.actions.ok}
        </button>
        <button type="button" class="btn primary" onClick={actions.onCheckAgain}>
          {t.failed.tryAgain}
        </button>
      </div>
    </section>
  )
}
