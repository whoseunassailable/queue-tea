import { useState } from 'preact/hooks'

import type { DesignsView, VersionRow } from '../../../../../shared/designs'
import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { t } from '../../../../l10n/en'

const badgeOf = (row: VersionRow): { text: string; tone: string } | null => {
  if (row.problem !== null) return { text: t.designs.couldntRead, tone: 'bad' }
  if (row.open > 0) return { text: t.designs.open(row.open), tone: 'open' }
  if (row.sent > 0 && row.sentTo !== null) return { text: t.designs.sent(row.sent, row.sentTo), tone: 'sent' }

  return row.resolved > 0 ? { text: t.designs.allResolved, tone: 'done' } : null
}

const Row = ({ row, isCurrent, onPick }: { row: VersionRow; isCurrent: boolean; onPick: () => void }) => {
  const badge = badgeOf(row)

  return (
    <li>
      <button type="button" class={`dz-vrow${isCurrent ? ' sel' : ''}`} aria-current={isCurrent ? 'true' : undefined} onClick={onPick}>
        <span class="dz-vlabel">{row.label}</span>
        <span class="sub">{row.problem === null ? t.designs.rowMeta(row.made, row.designCount) : row.problem.file}</span>
        {badge !== null && <span class={`dz-badge ${badge.tone}`}>{badge.text}</span>}
      </button>
    </li>
  )
}

type Props = { view: DesignsView; current: string | null; showFailure: string | null; onPick: (folder: string) => void; onShow: () => void }

export const VersionRail = ({ view, current, showFailure, onPick, onShow }: Props) => (
  <aside class="dz-rail panel" aria-labelledby="dz-history">
    <div class="sec-row">
      <h2 id="dz-history">{t.designs.history}</h2>
      <span class="sub">{t.designs.versions(view.versions.length, view.coming.length)}</span>
    </div>
    {view.versions.length === 0 && view.coming.length === 0 && <p class="hint">{t.designs.railEmpty}</p>}
    <ul class="dz-vlist">
      {view.coming.map(next => (
        <li key={next.label} class="dz-vrow coming">
          <span class="dz-vlabel">{next.label}</span>
          <span class="sub">{t.designs.comingLine}</span>
          <span class="dz-badge sent">{t.designs.comingFrom(next.from)}</span>
        </li>
      ))}
      {view.versions.map(row => (
        <Row key={row.folder} row={row} isCurrent={row.folder === current} onPick={() => onPick(row.folder)} />
      ))}
    </ul>
    <div class="dz-rail-foot">
      <span class="sub">{t.designs.savedIn}</span>
      <code>docs/designs/</code>
      <button type="button" class="link-btn" onClick={onShow}>
        {t.designs.showInFinder}
      </button>
      {showFailure !== null && (
        <p class="field-error" role="alert">
          {showFailure}
        </p>
      )}
    </div>
  </aside>
)

// A narrow window's history: one button naming the version, opening a list
// that ↑↓ move through, ↩ opens and Esc closes.
export const VersionMenu = ({ view, current, showFailure, onPick, onShow }: Props) => {
  const [isOpen, setOpen] = useState(false)
  const at = Math.max(0, view.versions.findIndex(row => row.folder === current))
  const [focus, setFocus] = useState(at)
  useWindowKeys(event => {
    if (!isOpen) return
    if (event.key === 'Escape') setOpen(false)
    else if (event.key === 'ArrowDown') setFocus(i => Math.min(view.versions.length - 1, i + 1))
    else if (event.key === 'ArrowUp') setFocus(i => Math.max(0, i - 1))
    else if (event.key === 'Enter' && view.versions[focus] !== undefined) {
      onPick(view.versions[focus].folder)
      setOpen(false)
    } else return
    event.preventDefault()
    event.stopPropagation()
  })

  return (
    <div class="dz-vmenu">
      <button
        type="button"
        class="btn"
        aria-expanded={isOpen}
        onClick={() => {
          setFocus(at)
          setOpen(!isOpen)
        }}
      >
        {t.designs.versionMenu(at + 1, view.versions.length)} ▾
      </button>
      {isOpen && (
        <div class="dz-vmenu-list panel" role="listbox" aria-label={t.designs.historyMenu}>
          <p class="sub">{t.designs.historyMenu}</p>
          {view.coming.map(next => (
            <div key={next.label} role="option" aria-disabled="true" aria-selected={false} class="dz-vrow coming">
              <span class="dz-vlabel">{next.label}</span>
              <span class="sub">{t.designs.comingLine}</span>
              <span class="dz-badge sent">{t.designs.comingFrom(next.from)}</span>
            </div>
          ))}
          {view.versions.map((row, i) => (
            <button
              key={row.folder}
              type="button"
              role="option"
              aria-selected={i === focus}
              class={`dz-vrow${i === focus ? ' sel' : ''}`}
              onClick={() => {
                onPick(row.folder)
                setOpen(false)
              }}
            >
              <span class="dz-vlabel">{row.label}</span>
              <span class="sub">{t.designs.rowMeta(row.made, row.designCount)}</span>
            </button>
          ))}
          <p class="sub">{t.designs.menuKeys}</p>
        </div>
      )}
      <button type="button" class="link-btn" onClick={onShow}>
        {t.designs.showInFinder}
      </button>
      {showFailure !== null && (
        <p class="field-error" role="alert">
          {showFailure}
        </p>
      )}
    </div>
  )
}
