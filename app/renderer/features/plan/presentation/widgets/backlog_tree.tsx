import { useState } from 'preact/hooks'

import { byIdOf, containerOf, PLAN_LIMITS } from '../../../../../shared/plan'
import type { PlanQuest, PlanRealm } from '../../../../../shared/plan'
import { Field } from '../../../../core/widgets/field'
import { PriorityTag } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import { dropBefore, stepBefore } from '../../domain/plan_tree'
import type { TreeGroup, TreeRow } from '../../domain/plan_tree'

export type TreeActions = {
  onOpen: (realm: string, id: string) => void
  onPick: (realm: string, id: string) => void
  onFold: (realm: string, id: string) => void
  // Ranks `id` to stand before `before` among the quests beside it.
  onRank: (realm: PlanRealm, quest: PlanQuest, before: string | null) => void
  onRefused: (text: string) => void
  onAddChild: (realm: PlanRealm, parent: PlanQuest, title: string) => Promise<boolean>
}

type Dragging = { realm: string; id: string } | null

const titleOf = (realm: PlanRealm, id: string) => realm.quests.find(q => q.id === id)?.title ?? id

// One quest's line: its pick, its handle, where it stands and what it is.
const Row = ({ row, picked, opened, dragging, setDragging, actions, onAdding }: { row: TreeRow; picked: ReadonlySet<string>; opened: string | null; dragging: Dragging; setDragging: (d: Dragging) => void; actions: TreeActions; onAdding: (id: string) => void }) => {
  const { quest, realm, depth } = row
  const [isOver, setOver] = useState(false)
  const byId = byIdOf(realm.quests)
  const container = containerOf(quest, byId)
  const waits = quest.dependsOn.filter(id => byId.get(id)?.status !== 'done' && byId.has(id))
  const isPicked = picked.has(quest.id)
  const canRank = quest.status !== 'done'
  const canHaveChild = !quest.isSaga && quest.parentQuest === null && quest.status !== 'done'
  const besideDragged = (): boolean => {
    if (dragging === null || dragging.realm !== realm.key || dragging.id === quest.id) return false
    const dragged = byId.get(dragging.id)

    return dragged !== undefined && containerOf(dragged, byId) === container
  }
  const rankBy = (delta: -1 | 1) => {
    const before = stepBefore(realm.quests, quest, container, delta)
    if (before !== undefined) actions.onRank(realm, quest, before)
  }

  return (
    <li
      class={['pl-row', `d${depth}`, isPicked ? 'picked' : '', row.isContext ? 'context' : '', opened === quest.id ? 'open' : '', isOver ? 'over' : '', quest.status].filter(c => c !== '').join(' ')}
      onDragOver={event => {
        if (!besideDragged()) return
        event.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={event => {
        event.preventDefault()
        setOver(false)
        if (dragging === null) return
        const dragged = byId.get(dragging.id)
        setDragging(null)
        if (dragged === undefined || dragging.realm !== realm.key) return
        if (containerOf(dragged, byId) !== container) {
          actions.onRefused(t.plan.refuse.notBeside)

          return
        }
        actions.onRank(realm, dragged, dropBefore(realm.quests, dragged, quest, container))
      }}
    >
      <input type="checkbox" class="pl-pick" aria-label={t.plan.row.pick(quest.title)} checked={isPicked} disabled={row.isContext && !isPicked} onChange={() => actions.onPick(realm.key, quest.id)} />
      {canRank ? (
        <button
          type="button"
          class="pl-handle"
          draggable
          aria-label={t.plan.row.drag(quest.title)}
          onDragStart={event => {
            event.dataTransfer?.setData('text/plain', quest.id)
            setDragging({ realm: realm.key, id: quest.id })
          }}
          onDragEnd={() => setDragging(null)}
          onKeyDown={event => {
            if (!event.altKey || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return
            event.preventDefault()
            rankBy(event.key === 'ArrowUp' ? -1 : 1)
          }}
        >
          ⋮⋮
        </button>
      ) : (
        <span class="pl-handle" aria-hidden="true" />
      )}
      {row.hasChildren ? (
        <button type="button" class="icon-btn pl-fold" aria-expanded={!row.isFolded} aria-label={row.isFolded ? t.plan.row.unfold(quest.title) : t.plan.row.fold(quest.title)} onClick={() => actions.onFold(realm.key, quest.id)}>
          {row.isFolded ? '▸' : '▾'}
        </button>
      ) : (
        <span class="pl-fold" aria-hidden="true" />
      )}
      <button type="button" class="pl-title" aria-label={t.plan.row.open(quest.title)} onClick={() => actions.onOpen(realm.key, quest.id)}>
        {quest.isStar && <span class="pl-star" title={t.plan.row.star}>★ </span>}
        {quest.title}
      </button>
      <span class="pl-meta">
        {quest.isSaga && <span class="tag plain">{t.plan.row.saga}</span>}
        {quest.parentQuest !== null && <span class="tag plain">{t.plan.row.child}</span>}
        <span class={`pl-status ${quest.status}`}>{t.plan.status[quest.status]}</span>
        <PriorityTag priority={quest.priority} />
        <span class="pl-points">{quest.points === null ? t.plan.row.noPoints : t.plan.row.points(quest.points)}</span>
        {quest.tags.map(tag => (
          <span key={tag} class="pl-tag">
            {tag}
          </span>
        ))}
      </span>
      {(waits.length > 0 || quest.blockedReason !== null) && (
        <span class="pl-waits">
          {waits.length > 0 && t.plan.row.waitsFor(waits.map(id => titleOf(realm, id)).join(', '))}
          {waits.length > 0 && quest.blockedReason !== null && ' · '}
          {quest.blockedReason !== null && t.plan.row.sealed(quest.blockedReason)}
        </span>
      )}
      {canHaveChild && (
        <button type="button" class="link-btn pl-add-child" onClick={() => onAdding(quest.id)}>
          {t.plan.child.add}
        </button>
      )}
    </li>
  )
}

// The form under a quest for a new child quest: the title is checked as it
// leaves the field and when it is sent.
const AddChild = ({ realm, parent, depth, onAdd, onClose }: { realm: PlanRealm; parent: PlanQuest; depth: number; onAdd: TreeActions['onAddChild']; onClose: () => void }) => {
  const [title, setTitle] = useState('')
  const [isTouched, setTouched] = useState(false)
  const [isSending, setSending] = useState(false)
  const error = title.trim() === '' || title.trim().length > PLAN_LIMITS.title ? t.plan.child.required : undefined
  const submit = async () => {
    setTouched(true)
    if (error !== undefined || isSending) return
    setSending(true)
    const isAdded = await onAdd(realm, parent, title.trim())
    setSending(false)
    if (isAdded) onClose()
  }

  return (
    <li class={`pl-row pl-child-form d${Math.min(depth + 1, 2)}`}>
      <form
        onSubmit={event => {
          event.preventDefault()
          void submit()
        }}
      >
        <Field label={t.plan.child.title} isRequired value={title} error={isTouched ? error : undefined} onInput={setTitle} onBlur={() => setTouched(true)} onEnter={() => void submit()} />
        <div class="pl-name-actions">
          <button type="submit" class="btn primary" disabled={isSending}>
            {t.plan.child.addIt}
          </button>
          <button type="button" class="btn" onClick={onClose}>
            {t.plan.child.cancel}
          </button>
        </div>
      </form>
    </li>
  )
}

type Props = { groups: readonly TreeGroup[]; picked: ReadonlySet<string>; opened: string | null; isManyRealms: boolean; actions: TreeActions }

export const BacklogTree = ({ groups, picked, opened, isManyRealms, actions }: Props) => {
  const [dragging, setDragging] = useState<Dragging>(null)
  const [adding, setAdding] = useState<{ realm: string; id: string } | null>(null)

  return (
    <div class="pl-tree">
      {groups.map(group => (
        <section key={group.realm.key} class="panel pl-group" aria-label={group.realm.name}>
          {isManyRealms && <h2 class="pl-realm">{group.realm.name}</h2>}
          <ul class="pl-rows" role="list">
            {group.rows.map(row => {
              const isAdding = adding !== null && adding.realm === group.realm.key && adding.id === row.quest.id

              return [
                <Row key={row.quest.id} row={row} picked={picked} opened={opened} dragging={dragging} setDragging={setDragging} actions={actions} onAdding={id => setAdding({ realm: group.realm.key, id })} />,
                isAdding ? <AddChild key={`${row.quest.id}-add`} realm={group.realm} parent={row.quest} depth={row.depth} onAdd={actions.onAddChild} onClose={() => setAdding(null)} /> : null,
              ]
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
