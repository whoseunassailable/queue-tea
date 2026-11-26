import { useId, useState } from 'preact/hooks'

import { childrenIn, EFFORT_POINTS, linksOf, PLAN_LIMITS, PLAN_LINK_KINDS, tagOf } from '../../../../../shared/plan'
import type { PlanChange, PlanLinkKind, PlanQuest, PlanRealm, ShownLink } from '../../../../../shared/plan'
import { formatMinutes } from '../../../../core/domain/format'
import { PriorityTag } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'

type Props = {
  realm: PlanRealm
  quest: PlanQuest
  isBusy: boolean
  onChange: (change: PlanChange, said: string) => Promise<boolean>
  onInspect: (id: string) => void
  onOpenInQuests: (id: string) => void
  onClose: () => void
}

// Taking a link off, from whichever end the pane shows it.
const unlinkOf = (quest: PlanQuest, shown: ShownLink): PlanChange =>
  shown.kind === 'duplicatedBy'
    ? { kind: 'link', id: shown.quest.id, link: 'duplicates', to: quest.id, isOn: false }
    : { kind: 'link', id: quest.id, link: shown.kind, to: shown.quest.id, isOn: false }

const tagProblem = (quest: PlanQuest, text: string): string | null => {
  const tag = tagOf(text)
  if (tag === null) return t.plan.pane.tagError
  if (quest.tags.includes(tag)) return t.plan.pane.tagTaken
  if (quest.tags.length >= PLAN_LIMITS.tags) return t.plan.pane.tagFull

  return null
}

const Points = ({ quest, isBusy, onChange }: Pick<Props, 'quest' | 'isBusy' | 'onChange'>) => {
  const choose = (points: number | null) => {
    if (points !== quest.points) void onChange({ kind: 'bulk', ids: [quest.id], op: { kind: 'points', points } }, t.plan.pointsSet(quest.title, points))
  }

  return (
    <fieldset class="pl-pane-part">
      <legend>{t.plan.pane.points}</legend>
      <div class="seg pl-points-pick" role="group" aria-label={t.plan.pane.points}>
        {EFFORT_POINTS.map(points => (
          <button key={points} type="button" class={quest.points === points ? 'on' : undefined} aria-pressed={quest.points === points} disabled={isBusy} onClick={() => choose(points)}>
            {points}
          </button>
        ))}
        <button type="button" class={quest.points === null ? 'on' : undefined} aria-pressed={quest.points === null} disabled={isBusy} onClick={() => choose(null)}>
          {t.plan.pane.noPoints}
        </button>
      </div>
      <p class="hint">{t.plan.pane.pointsHint}</p>
      <p class="hint">{t.plan.pane.time(formatMinutes(quest.minutes))}</p>
    </fieldset>
  )
}

const Tags = ({ quest, isBusy, onChange }: Pick<Props, 'quest' | 'isBusy' | 'onChange'>) => {
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const id = useId()
  const add = async () => {
    const problem = tagProblem(quest, text)
    setError(problem)
    const tag = tagOf(text)
    if (problem !== null || tag === null) return
    if (await onChange({ kind: 'bulk', ids: [quest.id], op: { kind: 'addTag', tag } }, t.plan.tagged(quest.title, tag))) setText('')
  }

  return (
    <div class="pl-pane-part">
      <h3>{t.plan.pane.tags}</h3>
      {quest.tags.length === 0 ? (
        <p class="hint">{t.plan.pane.noTags}</p>
      ) : (
        <ul class="pl-tag-list" role="list">
          {quest.tags.map(tag => (
            <li key={tag} class="pl-tag">
              {tag}
              <button type="button" class="icon-btn" aria-label={t.plan.pane.removeTag(tag)} disabled={isBusy} onClick={() => void onChange({ kind: 'bulk', ids: [quest.id], op: { kind: 'removeTag', tag } }, t.plan.untagged(quest.title, tag))}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        class="pl-inline-form"
        onSubmit={event => {
          event.preventDefault()
          void add()
        }}
      >
        <label for={id}>{t.plan.pane.addTag}</label>
        <input
          id={id}
          class="input"
          value={text}
          aria-invalid={error === null ? undefined : 'true'}
          aria-describedby={error === null ? undefined : `${id}-error`}
          onInput={event => {
            setText((event.target as HTMLInputElement).value)
            if (error !== null) setError(null)
          }}
          onBlur={() => setError(text.trim() === '' ? null : tagProblem(quest, text))}
        />
        <button type="submit" class="btn" disabled={isBusy}>
          {t.plan.pane.addTag}
        </button>
        {error !== null && (
          <p class="field-error" id={`${id}-error`}>
            {error}
          </p>
        )}
      </form>
    </div>
  )
}

const Links = ({ realm, quest, isBusy, onChange, onInspect }: Pick<Props, 'realm' | 'quest' | 'isBusy' | 'onChange' | 'onInspect'>) => {
  const [kind, setKind] = useState<PlanLinkKind>('dependsOn')
  const [to, setTo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const id = useId()
  const shown = linksOf(quest, realm.quests)
  const others = realm.quests.filter(q => q.id !== quest.id && !q.isSaga)
  const add = async () => {
    const other = others.find(q => q.id === to)
    if (other === undefined) {
      setError(t.plan.pane.linkRequired)

      return
    }
    setError(null)
    if (await onChange({ kind: 'link', id: quest.id, link: kind, to, isOn: true }, t.plan.linked(t.plan.link[kind], other.title))) setTo('')
  }

  return (
    <div class="pl-pane-part">
      <h3>{t.plan.pane.links}</h3>
      {shown.length === 0 ? (
        <p class="hint">{t.plan.pane.noLinks}</p>
      ) : (
        <ul class="pl-link-list" role="list">
          {shown.map(link => (
            <li key={`${link.kind}-${link.quest.id}`} class={link.kind === 'dependsOn' && link.quest.status !== 'done' ? 'waiting' : undefined}>
              <span class="pl-link-kind">{t.plan.link[link.kind]}</span>
              <button type="button" class="link-btn" aria-label={t.plan.pane.inspect(link.quest.title)} onClick={() => onInspect(link.quest.id)}>
                {link.quest.title}
              </button>
              <span class={`pl-status ${link.quest.status}`}>{t.plan.status[link.quest.status]}</span>
              <button type="button" class="icon-btn" aria-label={t.plan.pane.removeLink(t.plan.link[link.kind], link.quest.title)} disabled={isBusy} onClick={() => void onChange(unlinkOf(quest, link), t.plan.unlinked(t.plan.link[link.kind], link.quest.title))}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        class="pl-inline-form"
        onSubmit={event => {
          event.preventDefault()
          void add()
        }}
      >
        <label for={`${id}-kind`}>{t.plan.pane.linkKind}</label>
        <select id={`${id}-kind`} class="chip-select" value={kind} onChange={event => setKind((event.target as HTMLSelectElement).value as PlanLinkKind)}>
          {PLAN_LINK_KINDS.map(k => (
            <option key={k} value={k}>
              {t.plan.link[k]}
            </option>
          ))}
        </select>
        <label for={`${id}-to`}>{t.plan.pane.linkTo}</label>
        <select
          id={`${id}-to`}
          class="chip-select"
          value={to}
          aria-invalid={error === null ? undefined : 'true'}
          aria-describedby={error === null ? undefined : `${id}-error`}
          onChange={event => {
            setTo((event.target as HTMLSelectElement).value)
            setError(null)
          }}
        >
          <option value="">{t.plan.pane.linkPick}</option>
          {others.map(q => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
        <button type="submit" class="btn" disabled={isBusy}>
          {t.plan.pane.addLink}
        </button>
        {error !== null && (
          <p class="field-error" id={`${id}-error`}>
            {error}
          </p>
        )}
      </form>
    </div>
  )
}

// The side pane for one quest: its size, tags, links and child quests.
export const PlanPane = ({ realm, quest, isBusy, onChange, onInspect, onOpenInQuests, onClose }: Props) => {
  const children = childrenIn(quest.id, realm.quests)

  return (
    <aside class="pl-pane panel panel-pad" aria-label={t.plan.pane.label}>
      <div class="pl-pane-head">
        <div>
          <p class="hint">{t.plan.pane.realm(realm.name)}</p>
          <h2>{quest.title}</h2>
          <p class="pl-meta">
            <span class={`pl-status ${quest.status}`}>{t.plan.status[quest.status]}</span>
            <PriorityTag priority={quest.priority} />
            {quest.isSaga && <span class="tag plain">{t.plan.row.saga}</span>}
          </p>
        </div>
        <button type="button" class="btn" onClick={onClose}>
          {t.plan.pane.close}
        </button>
      </div>
      {!quest.isSaga && <Points quest={quest} isBusy={isBusy} onChange={onChange} />}
      <Tags quest={quest} isBusy={isBusy} onChange={onChange} />
      {!quest.isSaga && <Links realm={realm} quest={quest} isBusy={isBusy} onChange={onChange} onInspect={onInspect} />}
      {children.length > 0 && (
        <div class="pl-pane-part">
          <h3>{t.plan.pane.children}</h3>
          <ul class="pl-link-list" role="list">
            {children.map(child => (
              <li key={child.id}>
                <button type="button" class="link-btn" aria-label={t.plan.pane.inspect(child.title)} onClick={() => onInspect(child.id)}>
                  {child.title}
                </button>
                <span class={`pl-status ${child.status}`}>{t.plan.status[child.status]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button type="button" class="btn" onClick={() => onOpenInQuests(quest.id)}>
        {t.plan.pane.openInQuests}
      </button>
    </aside>
  )
}
