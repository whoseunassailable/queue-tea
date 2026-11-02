import { t } from '../../../../l10n/en'

// A command as text, and a button that copies it. The button never names the
// command, so nothing in the app reads as a button that runs git.
export const CopyLine = ({ text, onCopy }: { text: string; onCopy: (text: string) => void }) => (
  <span class="copy-line">
    <code>{text}</code>
    <button type="button" class="icon-btn" aria-label={t.flow.copy} onClick={() => onCopy(text)}>
      <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
        <path d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
      </svg>
    </button>
  </span>
)
