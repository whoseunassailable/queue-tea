import type { ComponentChildren } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'

import { useWindowKeys } from './window_keys'

// A sheet (600 px) or a confirmation (480 px). Esc cancels; ⌘↩ confirms, which
// is the form's own submit, so the same checks run.
export const Dialog = ({ title, isSheet, closeLabel, onCancel, onSubmit, children }: { title: string; isSheet?: boolean; closeLabel?: string; onCancel: () => void; onSubmit: () => void; children: ComponentChildren }) => {
  const box = useRef<HTMLFormElement>(null)
  useLayoutEffect(() => {
    const first = box.current?.querySelector<HTMLElement>('input, textarea, button')
    first?.focus()
  }, [])
  useWindowKeys(event => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onCancel()
    } else if (event.key === 'Enter' && event.metaKey) {
      event.preventDefault()
      onSubmit()
    }
  })

  return (
    <div class="scrim">
      <form
        ref={box}
        class={isSheet === true ? 'sheet panel' : 'confirm panel'}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        noValidate
        // Pressing a button at the foot takes focus from the field, whose error
        // then pushes the button down mid-click, and the click misses. Keeping
        // the focus where it is leaves the button in place: the press itself
        // checks every field.
        onMouseDown={event => {
          if ((event.target as HTMLElement).closest('.sheet-actions') !== null) event.preventDefault()
        }}
        onSubmit={event => {
          event.preventDefault()
          onSubmit()
        }}
      >
        {closeLabel ? <div class="sheet-heading"><h2 class="sheet-title">{title}</h2><button type="button" class="btn" onClick={onCancel}>{closeLabel}</button></div> : <h2 class="sheet-title">{title}</h2>}
        {children}
      </form>
    </div>
  )
}
