import { useEffect, useState } from 'preact/hooks'

import type { Toast } from '../../features/workspace/state_management/workspace_store'
import { TOAST_ACTION_MS, TOAST_MS } from '../constants/constants'

const Item = ({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) => {
  const [isHeld, setHeld] = useState(false)
  useEffect(() => {
    if (isHeld) return undefined
    const timer = setTimeout(() => onDismiss(toast.id), toast.action === undefined ? TOAST_MS : TOAST_ACTION_MS)

    return () => clearTimeout(timer)
  }, [isHeld, toast, onDismiss])

  return (
    <div class={`toast-item ${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'} onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
      <span class="toast-text">{toast.text}</span>
      {toast.action !== undefined && (
        <button
          type="button"
          class="link-btn"
          onClick={() => {
            onDismiss(toast.id)
            toast.action?.run()
          }}
        >
          {toast.action.label}
        </button>
      )}
    </div>
  )
}

export const Toasts = ({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) => (
  <div class="toasts">
    {toasts.map(toast => (
      <Item key={toast.id} toast={toast} onDismiss={onDismiss} />
    ))}
  </div>
)
