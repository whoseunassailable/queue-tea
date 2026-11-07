import { useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks'

import type { EngineApi, Reply } from '../../../../../shared/engine_api'
import type { NotesView } from '../../../../../shared/notes'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { Spinner } from '../../../../core/widgets/states'
import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { t } from '../../../../l10n/en'
import { canRun, filterPalette, paletteEntries } from '../../domain/palette'
import type { PaletteEntry, PaletteInput } from '../../domain/palette'

const LIST_ID = 'palette-list'

const optionId = (item: PaletteEntry) => `palette-${item.id}`

// With no realm to read, no notes and no call to main.
const NO_NOTES: Reply<NotesView> = { ok: true, data: { notes: [], unreadable: [], folder: '' } }

type Props = { engine: EngineApi; input: Omit<PaletteInput, 'notes'>; onClose: () => void }

// The selected realm's notes are read while the palette is open, and the rest
// of the list works while they're on their way.
export const PaletteDialog = ({ engine, input, onClose }: Props) => {
  const [query, setQuery] = useState('')
  const [at, setAt] = useState(0)
  const box = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => box.current?.focus(), [])
  const key = input.view?.key ?? null
  const read = useEngineRead(engine, () => (key === null ? Promise.resolve(NO_NOTES) : engine.readNotes(key)), [key])
  const entries = useMemo(() => paletteEntries({ ...input, notes: read.load, isRefreshingNotes: read.isRefreshing, notesProblem: read.note !== null }), [input, read.load, read.isRefreshing, read.note])

  const found = filterPalette(entries, query)
  const pointed = Math.min(at, found.length - 1)
  // Reading is feedback, so Return stays on the next action while it waits.
  const index = found[pointed]?.isBusy ? found.findIndex((item, i) => i > pointed && !item.isBusy) : pointed
  const highlighted = found[index]
  const noNoteMatches = key !== null && query.trim() !== '' && read.load.status === 'ready' && !read.isRefreshing && read.note === null && read.load.data.unreadable.length === 0 && !found.some(item => item.note !== null)

  const run = (item: PaletteEntry | undefined) => {
    if (item === undefined || !canRun(item)) return
    onClose()
    item.run()
  }
  const start = (item: PaletteEntry | undefined) => {
    if (item?.start == null) return
    onClose()
    item.start()
  }

  useWindowKeys(event => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onClose()
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      let next = index + step
      while (found[next]?.isBusy) next += step
      if (next >= 0 && next < found.length) setAt(next)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (event.metaKey) start(highlighted)
      else run(highlighted)
    }
  })

  return (
    <div class="scrim palette-scrim" onClick={event => event.target === event.currentTarget && onClose()}>
      <div class="palette panel" role="dialog" aria-modal="true" aria-label={t.palette.label}>
        <input
          ref={box}
          class="input palette-input"
          type="text"
          role="combobox"
          aria-label={t.palette.placeholder}
          aria-expanded="true"
          aria-controls={LIST_ID}
          aria-activedescendant={highlighted === undefined ? undefined : optionId(highlighted)}
          placeholder={t.palette.placeholder}
          value={query}
          onInput={event => {
            setQuery((event.target as HTMLInputElement).value)
            setAt(0)
          }}
        />
        <ul class="palette-list" id={LIST_ID} role="listbox" aria-label={t.palette.label}>
          {found.length === 0 && <li class="hint">{t.palette.empty}</li>}
          {found.map((item, i) => {
            const isNewSection = found[i - 1]?.section !== item.section

            return (
              <>
                {isNewSection && (
                  <li class="palette-h" role="presentation">
                    {t.palette.sections[item.section]}
                  </li>
                )}
                <li
                  key={item.id}
                  id={optionId(item)}
                  class={['palette-item', i === index ? 'on' : '', canRun(item) ? '' : 'dim'].filter(c => c !== '').join(' ')}
                  role="option"
                  aria-selected={i === index}
                  aria-disabled={!canRun(item)}
                  onMouseEnter={() => setAt(i)}
                  onClick={() => run(item)}
                >
                  {item.isBusy && <Spinner />}
                  <span class="palette-label">
                    {item.label}
                    {item.reason !== null && <span class="palette-reason"> · {item.reason}</span>}
                    {item.detail !== null && <span class="palette-detail">{item.detail}</span>}
                  </span>
                  {item.keys !== null && <kbd>{item.keys}</kbd>}
                </li>
              </>
            )
          })}
        </ul>
        {noNoteMatches && <p class="palette-hint" role="status">{t.palette.noNoteMatches}</p>}
        <p class="palette-hint">{t.palette.hint}</p>
      </div>
    </div>
  )
}
