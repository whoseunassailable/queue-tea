import { isHelperId } from '../../../../../../hooks/shared/records/domain/services/helpers'
import type { HelperId } from '../../../../../../types'
import type { HelperJob } from '../../../../../shared/engine_api'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { HELPERS } from '../../../guild/domain/helpers'
import { HelperBot } from '../../../guild/presentation/widgets/helper_bot'
import { HELPER_DRAG } from '../../domain/constants'

// The helper a drop carried, or null when it carried something else.
export const helperDropped = (event: DragEvent): HelperId | null => {
  const id = event.dataTransfer?.getData(HELPER_DRAG)

  return isHelperId(id) ? id : null
}

const nameOf = (id: HelperId): string => HELPERS.find(helper => helper.id === id)?.name ?? id

// What the helper sent to this merge is doing, then what it said.
const Report = ({ job, onStop, onRetry }: { job: HelperJob; onStop: () => void; onRetry: () => void }) => {
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
    return (
      <div aria-live="polite">
        <p>
          <b>{t.branches.helperDone(name)}</b>
        </p>
        <p class="bench-reply">{job.reply?.trim() || t.guild.noReply}</p>
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

type Props = { jobs: HelperJob[]; mergeId: string; canSend: boolean; onSend: (helper: HelperId) => void; onStop: (helper: HelperId) => void; onRetry: (job: HelperJob) => void }

// The four helpers beside a merge. One is dragged onto the merge, or pressed,
// to resolve its conflicts; one at a time, so two never edit the same folder.
export const HelperBench = ({ jobs, mergeId, canSend, onSend, onStop, onRetry }: Props) => {
  const here = jobs.filter(job => job.merge === mergeId).sort((a, b) => b.started - a.started)
  const atWork = here.find(job => job.status === 'working') ?? null
  const shown = atWork ?? here[0] ?? null

  return (
    <section class="bench" aria-label={t.branches.bench}>
      <p class="hint">{t.branches.benchHint}</p>
      <div class="bench-row">
        {HELPERS.map(helper => {
          const job = jobs.find(one => one.helper === helper.id)
          const isElsewhere = job?.status === 'working' && job.merge !== mergeId
          const isFree = canSend && atWork === null && !isElsewhere

          return (
            <button
              key={helper.id}
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
              <HelperBot id={helper.id} mood={job?.merge === mergeId ? job.status : 'idle'} size={56} />
              <span>{helper.name}</span>
            </button>
          )
        })}
      </div>
      {shown !== null && <Report job={shown} onStop={() => onStop(shown.helper)} onRetry={() => onRetry(shown)} />}
    </section>
  )
}
