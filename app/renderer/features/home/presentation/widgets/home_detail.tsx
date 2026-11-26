import type { EngineApi } from '../../../../../shared/engine_api'
import type { Row } from '../../../quests/domain/board'
import type { Sheet } from '../../../quests/presentation/pages/quests_page'
import type { QuestActions } from '../../../quests/presentation/state_management/flow_keys'
import type { QuestEdits } from '../../../quests/presentation/state_management/quest_edits'
import { ActiveCard } from '../../../quests/presentation/widgets/active_card'
import { ActiveDetail } from '../../../quests/presentation/widgets/active_detail'
import { JudgementCard } from '../../../quests/presentation/widgets/judgement_card'
import { QuestDetail } from '../../../quests/presentation/widgets/quest_detail'
import type { QuestFlow, ReadableView } from '../../../workspace/state_management/workspace_store'
import { canStartRow } from '../../domain/dashboard'
import type { HomeItem } from '../../domain/dashboard'

type Props = {
  engine: EngineApi
  view: ReadableView
  picked: HomeItem | null
  flow: QuestFlow | undefined
  actions: QuestActions
  edits: QuestEdits
  questNotes: Record<string, string>
  savedQuest: string | null
  onSheet: (sheet: Sheet) => void
}

// The picked quest's details, in the same panes Quests shows: a quest in hand
// with its card and actions over its details, any other quest in the quest
// details pane.
export const HomeDetail = ({ engine, view, picked, flow, actions, edits, questNotes, savedQuest, onSheet }: Props) => {
  if (picked?.kind === 'active') {
    const { quest } = picked
    const session = quest.session ?? view.session

    return (
      <div class="home-detail">
        {quest.review === null ? <ActiveCard active={quest} session={session} actions={actions} kind="full" /> : <JudgementCard active={quest} session={session} actions={actions} kind="full" />}
        <ActiveDetail engine={engine} realm={view.key} active={quest} isSaved={quest.id === savedQuest} edits={edits} />
      </div>
    )
  }

  const row: Row | null = picked?.kind === 'row' ? picked.row : null
  const isBusy = flow?.kind === 'working'
  const act = (run: (open: Row) => void) => () => {
    if (row !== null) run(row)
  }
  const remove = (open: Row) => {
    if (open.sagaOf !== null) onSheet({ kind: 'remove', quest: open.quest, chapters: open.sagaOf.chapters.length })
    else void edits.remove(view.key, open.quest)
  }

  return (
    <div class="home-detail">
      <QuestDetail
        engine={engine}
        realm={view.key}
        row={row}
        isBusy={isBusy}
        note={row === null ? undefined : questNotes[row.quest.id]}
        onStart={platform => row !== null && canStartRow(row) && !isBusy && actions.onStart(row.quest, platform)}
        allowance={view.session.allowance}
        isActiveSaga={row !== null && view.activeSagaId === row.quest.id}
        isSaved={row !== null && row.quest.id === savedQuest}
        edits={edits}
        onSeal={act(open => onSheet({ kind: 'seal', quest: open.quest }))}
        onUnseal={act(open => open.quest.sealedBecause !== null && void edits.unseal(view.key, open.quest))}
        onPartOf={act(open => onSheet({ kind: 'move', quest: open.quest }))}
        onRemove={act(remove)}
        onPlayNext={act(open => void edits.togglePlayNext(view.key, open.quest))}
        onActiveSaga={act(open => void edits.setActiveSaga(view.key, view.activeSagaId === open.quest.id ? null : open.quest))}
      />
    </div>
  )
}
