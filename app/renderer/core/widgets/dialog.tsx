import type { ComponentChildren } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'

import { useWindowKeys } from './window_keys'

// A sheet (600 px) or a confirmation (480 px). Esc cancels; ⌘↩ confirms, which
// is the form's own submit, so the same checks run.
export const Dialog = ({ title, isSheet, onCancel, onSubmit, children }: { title: string; isSheet?: boolean; onCancel: () => void; onSubmit: () => void; children: ComponentChildren }) => {
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
        onSubmit={event => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <h2 class="sheet-title">{title}</h2>
        {children}
      </form>
    </div>
  )
}
