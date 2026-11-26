import type { ComponentChildren } from 'preact'

import { t } from '../../l10n/en'

export const Spinner = () => (
  <svg class="spinner" viewBox="0 0 24 24" width="22" height="22" role="presentation" aria-hidden="true">
    <circle class="spinner-track" cx="12" cy="12" r="9" />
    <circle class="spinner-arc" cx="12" cy="12" r="9" />
  </svg>
)

// The three states every view that waits shows: loading, failed and empty.
// They share one panel, so a page's states look alike wherever they appear.
export const Loading = ({ line, children }: { line: string; children?: ComponentChildren }) => (
  <div class="state panel" role="status">
    <Spinner />
    <p class="state-line">{line}</p>
    {children}
  </div>
)

// What went wrong, in plain words, and a way to try again. A screen that has
// another way to put it right, such as showing the folder, passes it as a
// child, and it sits beside Try again.
export const Failed = ({ title, message, onRetry, children }: { title?: string; message: string; onRetry: () => void; children?: ComponentChildren }) => (
  <div class="state panel" role="alert">
    {title !== undefined && <h2 class="state-title">{title}</h2>}
    <p class="state-line">{message}</p>
    <div class="state-actions">
      <button type="button" class="btn" onClick={onRetry}>
        {t.failed.tryAgain}
      </button>
      {children}
    </div>
  </div>
)

export const Empty = ({ title, line, children }: { title: string; line: string; children?: ComponentChildren }) => (
  <div class="state panel">
    <h2 class="state-title">{title}</h2>
    <p class="state-line">{line}</p>
    {children}
  </div>
)
