import { useLayoutEffect, useRef, useState } from 'preact/hooks'

import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { t } from '../../../../l10n/en'
import { canRun, filterPalette } from '../../domain/palette'
import type { PaletteEntry } from '../../domain/palette'

const LIST_ID = 'palette-list'

const optionId = (item: PaletteEntry) => `palette-${item.id}`

type Props = { entries: PaletteEntry[]; onClose: () => void }

export const PaletteDialog = ({ entries, onClose }: Props) => {
  const [query, setQuery] = useState('')
  const [at, setAt] = useState(0)
  const box = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => box.current?.focus(), [])

  const found = filterPalette(entries, query)
  const index = Math.min(at, found.length - 1)
  const highlighted = found[index]

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
      setAt(Math.max(0, Math.min(found.length - 1, index + step)))
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
                  <span class="palette-label">
                    {item.label}
                    {item.reason !== null && <span class="palette-reason"> · {item.reason}</span>}
                  </span>
                  {item.keys !== null && <kbd>{item.keys}</kbd>}
                </li>
              </>
            )
          })}
        </ul>
        <p class="palette-hint">{t.palette.hint}</p>
      </div>
    </div>
  )
}
