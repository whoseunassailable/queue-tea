import { useEffect, useRef, useState } from 'preact/hooks'

import type { Priority } from '../../../../../../types'
import { t } from '../../../../l10n/en'

const PRIORITIES: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']

export const PriorityControl = ({ title, priority, isSaved, onPick }: { title: string; priority: Priority; isSaved: boolean; onPick: (priority: Priority) => void }) => {
  const [isOpen, setOpen] = useState(false)
  const box = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!isOpen) return undefined
    const away = (event: MouseEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false)
    }
    const heard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', away)
    window.addEventListener('keydown', heard)

    return () => {
      window.removeEventListener('mousedown', away)
      window.removeEventListener('keydown', heard)
    }
  }, [isOpen])

  return (
    <span class="prio" ref={box}>
      <button type="button" class={`tag ${priority} prio-btn`} aria-haspopup="menu" aria-expanded={isOpen ? 'true' : 'false'} aria-label={t.edit.priorityOf(title, t.priority[priority])} onClick={() => setOpen(!isOpen)}>
        {t.priority[priority]} <span aria-hidden="true">{isSaved ? '✓' : '▾'}</span>
      </button>
      {isOpen && (
        <span class="prio-menu" role="menu">
          {PRIORITIES.map((choice, i) => (
            <button
              key={choice}
              type="button"
              role="menuitemradio"
              aria-checked={choice === priority ? 'true' : 'false'}
              class="prio-item"
              onClick={() => {
                setOpen(false)
                if (choice !== priority) onPick(choice)
              }}
            >
              <kbd>{i + 1}</kbd>
              {t.priority[choice]}
              {choice === priority && ' ✓'}
            </button>
          ))}
        </span>
      )}
    </span>
  )
}
