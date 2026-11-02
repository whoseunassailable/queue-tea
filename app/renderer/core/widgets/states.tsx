import type { ComponentChildren } from 'preact'

import { t } from '../../l10n/en'

export const Spinner = () => (
  <svg class="spinner" viewBox="0 0 24 24" width="22" height="22" role="presentation" aria-hidden="true">
    <circle class="spinner-track" cx="12" cy="12" r="9" />
    <circle class="spinner-arc" cx="12" cy="12" r="9" />
  </svg>
)

export const Loading = ({ line }: { line: string }) => (
  <div class="state panel" role="status">
    <Spinner />
    <p class="state-line">{line}</p>
  </div>
)

export const Failed = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div class="state panel" role="alert">
    <p class="state-line">{message}</p>
    <button type="button" class="btn" onClick={onRetry}>
      {t.failed.tryAgain}
    </button>
  </div>
)

export const Empty = ({ title, line, children }: { title: string; line: string; children?: ComponentChildren }) => (
  <div class="state panel">
    <h2 class="state-title">{title}</h2>
    <p class="state-line">{line}</p>
    {children}
  </div>
)
