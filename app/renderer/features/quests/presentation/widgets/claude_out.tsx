import type { Allowance } from '../../../../../../types'
import { isClaudeOut, refillTime } from '../../../../core/domain/format'
import { t } from '../../../../l10n/en'

// Beside Start and on a Claude quest, when Claude's allowance has run out.
// Claude stays the first button: this only says Codex is there.
export const ClaudeOut = ({ allowance }: { allowance: Allowance | null }) =>
  allowance !== null && isClaudeOut(allowance, Date.now()) ? <p class="hint">! {t.quest.claudeOut(refillTime(allowance))}</p> : null
