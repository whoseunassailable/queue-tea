import { isHelperId } from '../../../../../../hooks/shared/records/domain/services/helpers'
import type { HelperId } from '../../../../../../types'
import type { HelperJob } from '../../../../../shared/engine_api'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { HELPERS, TEA_CONCILE } from '../../../guild/domain/helpers'
import { HelperBot } from '../../../guild/presentation/widgets/helper_bot'
import { concileReport } from '../../domain/concile_report'
import { HELPER_DRAG } from '../../domain/constants'

// The helper a drop carried, or null when it carried something else.
export const helperDropped = (event: DragEvent): HelperId | null => {
  const id = event.dataTransfer?.getData(HELPER_DRAG)

  return isHelperId(id) ? id : null
}

const nameOf = (id: HelperId): string => HELPERS.find(helper => helper.id === id)?.name ?? id

// The choices it left on files that are still in conflict.
const choicesLeft = (job: HelperJob, open: readonly string[]): number => concileReport(job.reply).decisions.filter(decision => open.includes(decision.file)).length

// What the helper sent to this merge is doing, then what it said, without its
// list of choices: each of those shows on its own file.
const Report = ({ job, open, onStop, onRetry }: { job: HelperJob; open: readonly string[]; onStop: () => void; onRetry: () => void }) => {
  const name = nameOf(job.helper)
  if (job.status === 'working') {
    return (
      <div class="bench-now" role="status">
        <Spinner />
        <span>{t.branches.helperAt(name, job.doing === null ? t.guild.starting : t.guild.doing(job.doing.kind, job.doing.target))}</span>
        <button type="button" class="btn" onClick={onStop}>
          {t.guild.stop}
        </button>
      </div>
    )
  }
  if (job.status === 'done') {
    const report = concileReport(job.reply)
    const left = choicesLeft(job, open)

    return (
      <div aria-live="polite">
        <p>
          <b>{t.branches.helperDone(name)}</b>
        </p>
        <p class="bench-reply">{report.text || t.guild.noReply}</p>
        {report.problem !== null ? <p role="status">{t.branches.decisionsUnreadable}</p> : left > 0 && <p role="status">{t.branches.decisionsLeft(left)}</p>}
      </div>
    )
  }

  return (
    <div>
      <p role={job.status === 'failed' ? 'alert' : 'status'}>{job.status === 'failed' ? `${t.branches.helperStuck(name)} ${job.error ?? ''}` : t.branches.helperStopped(name)}</p>
      <button type="button" class="btn" onClick={onRetry}>
        {t.guild.tryAgain}
      </button>
    </div>
  )
}

type Props = { jobs: HelperJob[]; mergeId: string; open: readonly string[]; canSend: boolean; onSend: (helper: HelperId) => void; onStop: (helper: HelperId) => void; onRetry: (job: HelperJob) => void }

// Tea-Concile beside a merge. It is dragged onto the merge, or pressed, to
// reconcile its conflicts; one order at a time, so two never edit the folder.
// `open` is the files still in conflict, where its choices wait for Rohan.
export const HelperBench = ({ jobs, mergeId, open, canSend, onSend, onStop, onRetry }: Props) => {
  const here = jobs.filter(job => job.merge === mergeId).sort((a, b) => b.started - a.started)
  const atWork = here.find(job => job.status === 'working') ?? null
  const shown = atWork ?? here[0] ?? null
  const helper = TEA_CONCILE
  const job = jobs.find(one => one.helper === helper.id)
  const isElsewhere = job?.status === 'working' && job.merge !== mergeId
  const isFree = canSend && atWork === null && !isElsewhere
  const isAsking = job?.merge === mergeId && job.status === 'done' && choicesLeft(job, open) > 0
  const mood = job?.merge !== mergeId ? 'idle' : isAsking ? 'asking' : job.status

  return (
    <section class="bench" aria-label={t.branches.bench}>
      <p class="hint">{t.branches.benchHint}</p>
      <div class="bench-row">
        <button
          type="button"
          class={`bench-bot ${helper.kind}`}
          draggable={isFree}
          disabled={!isFree}
          aria-label={t.branches.sendHelper(helper.name)}
          title={isElsewhere ? t.branches.benchBusy(helper.name) : t.branches.sendHelper(helper.name)}
          onDragStart={event => {
            event.dataTransfer?.setData(HELPER_DRAG, helper.id)
            if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy'
          }}
          onClick={() => onSend(helper.id)}
        >
          <HelperBot id={helper.id} mood={mood} size={56} />
          <span>{helper.name}</span>
        </button>
      </div>
      {shown !== null && <Report job={shown} open={open} onStop={() => onStop(shown.helper)} onRetry={() => onRetry(shown)} />}
    </section>
  )
}
