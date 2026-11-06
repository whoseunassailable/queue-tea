import { useState } from 'preact/hooks'

import type { HelperJob } from '../../../../../shared/engine_api'
import { Field } from '../../../../core/widgets/field'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Helper } from '../../domain/helpers'
import { folderName, orderError } from '../../domain/order_form'
import { HelperBot } from './helper_bot'

export type GuildRealm = { key: string; name: string }
type Mood = keyof typeof t.guild.states

const skillsText = (skills: string[]): string => (skills.length > 1 ? `${skills[0]} +${skills.length - 1}` : (skills[0] ?? ''))

// The speech bubble: what the helper says now, from waiting for an order to its answer.
const Bubble = ({ helper, job, isChecking, onRetry }: { helper: Helper; job: HelperJob | null; isChecking: boolean; onRetry: (job: HelperJob) => void }) => {
  if (isChecking) {
    return (
      <div class="bubble" role="status">
        <p class="bubble-now">
          <Spinner />
          <span>{t.guild.checking}</span>
        </p>
      </div>
    )
  }
  if (job === null) {
    return (
      <div class="bubble idle">
        <p>{t.guild.idle[helper.id]}</p>
      </div>
    )
  }
  const folder = folderName(job.folder)

  return (
    <div class={`bubble ${job.status}`} aria-live="polite">
      <p class="bubble-order">
        <b>{t.guild.youAsked}</b> · {job.order}
      </p>
      {job.status === 'working' && (
        <>
          <p class="bubble-now">
            <Spinner />
            <span>{job.doing === null ? t.guild.starting : t.guild.doing(job.doing.kind, job.doing.target)}</span>
          </p>
          <p class="card-note">{t.guild.working(job.steps, folder)}</p>
        </>
      )}
      {job.status === 'done' && (
        <>
          <p class="bubble-reply">{job.reply?.trim() || t.guild.noReply}</p>
          <p class="card-note">{t.guild.done(job.steps, folder)}</p>
        </>
      )}
      {(job.status === 'failed' || job.status === 'stopped') && (
        <>
          <p class="bubble-error" role={job.status === 'failed' ? 'alert' : undefined}>
            {job.status === 'failed' ? job.error : t.guild.stopped}
          </p>
          <div>
            <button type="button" class="btn" onClick={() => onRetry(job)}>
              {t.guild.tryAgain}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

type Props = {
  helper: Helper
  job: HelperJob | null
  isChecking: boolean
  realm: GuildRealm | null
  onSend: (key: string, order: string) => Promise<string | null>
  onStop: () => Promise<string | null>
  onRetry: (job: HelperJob) => Promise<string | null>
  onCopy: (text: string) => void
}

// One helper: a portrait that idles, works and celebrates, its bubble, and an
// order box that sends it to work in the realm picked in the sidebar.
export const HelperCard = ({ helper, job, isChecking, realm, onSend, onStop, onRetry, onCopy }: Props) => {
  const [order, setOrder] = useState('')
  const [isTouched, setTouched] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const [isSending, setSending] = useState(false)
  const error = isTouched ? orderError(order) : undefined
  const mood: Mood = isChecking ? 'idle' : (job?.status ?? 'idle')

  const send = async (key: string, text: string): Promise<boolean> => {
    setSending(true)
    setProblem(null)
    const failed = await onSend(key, text)
    setSending(false)
    setProblem(failed)

    return failed === null
  }

  const submit = async (event: Event) => {
    event.preventDefault()
    setTouched(true)
    if (realm === null || isSending || orderError(order) !== undefined) return
    if (await send(realm.key, order.trim())) {
      setOrder('')
      setTouched(false)
    }
  }

  return (
    <article class={`member panel ${helper.kind}`} aria-labelledby={`${helper.id}-name`}>
      <div class="m-top">
        <span class={`portrait ${mood}`}>
          <HelperBot id={helper.id} mood={mood} />
          <span class="steam" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </span>
        <div>
          <h2 class="m-name" id={`${helper.id}-name`}>
            {helper.name}
          </h2>
          <span class="m-class">{helper.role}</span> <span class={`m-state ${mood}`}>{t.guild.states[mood]}</span>
        </div>
      </div>
      <Bubble helper={helper} job={job} isChecking={isChecking} onRetry={last => void onRetry(last).then(setProblem)} />
      <p class="m-desc">{helper.summary}</p>
      <p class="card-note">
        <b>{t.guild.skills}</b> · {skillsText(helper.skills)}
      </p>
      {realm !== null && (
        <form class="m-order" onSubmit={event => void submit(event)} noValidate>
          <Field label={t.guild.orderLabel(helper.name)} value={order} error={error} isRequired isLong onInput={setOrder} onBlur={() => setTouched(true)} />
          {problem !== null && (
            <p class="field-error" role="alert">
              {problem}
            </p>
          )}
          {job?.status !== 'working' && (
            <div class="m-send">
              <button type="submit" class="btn primary">
                {isSending ? t.guild.sending : t.guild.send}
              </button>
            </div>
          )}
        </form>
      )}
      {/* Outside the form: a helper at work can be stopped with no realm picked. */}
      {job?.status === 'working' && (
        <div class="m-send">
          {realm === null && problem !== null && (
            <p class="field-error" role="alert">
              {problem}
            </p>
          )}
          <button type="button" class="btn" onClick={() => void onStop().then(setProblem)}>
            {t.guild.stop}
          </button>
        </div>
      )}
      <div class="m-call">
        <code>{helper.mention}</code>
        <button type="button" class="icon-btn" aria-label={t.guild.copy(helper.name)} onClick={() => onCopy(helper.mention)}>
          ⧉
        </button>
      </div>
    </article>
  )
}
