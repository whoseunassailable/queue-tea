import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'
import type { Band, ParentPick, Task } from '../../../../../types'
import { portsOf } from '../../../../core/ports/claude_ports'
import { getView } from '../../../../core/store/view_store'
import { cut } from '../../../../core/widgets/text'
import { PRIORITY_ORDER } from '../../../../shared/records/domain/services/queue_rules'
import { DIFFICULTIES } from '../../domain/services/task_rules'
import { nameNewFeature, pickBand, saveFile } from '../state_management/filing_controller'

const FEATURE_LABEL = 24

export async function drawFileBand(
  $: EngineInterface,
  e: RenderInput<'AbovePrompt'>,
  band: Extract<Band, { kind: 'file' }>,
  held: { sameTask: () => void; cancel: () => void },
): Promise<RenderElement> {
  const { Box, Text, Button } = $.ui.resolve(e)

  const record = await getView($, 'record')
  const offered = (band.choices ?? [])
    .map(id => record?.tasks.find(t => t.id === id))
    .filter((t): t is Task => t !== undefined && (t.state === 'queued' || t.state === 'current'))
  const pick = band.parent
  const isPicked = (p: ParentPick) =>
    pick != null && pick.kind === p.kind && (p.kind !== 'task' || (pick.kind === 'task' && pick.id === p.id))
  const choice = (key: string, label: string, p: ParentPick) =>
    isPicked(p) ? (
      <Button key={key} label={label} variant="primary" onPress={() => {}} />
    ) : (
      <Button key={key} label={label} onPress={() => void pickBand(portsOf($), { parent: p })} />
    )
  // A new feature is named in a field the phone has not; Save waits for a
  // pick, and for a new feature's name.
  const naming =
    pick?.kind !== 'new' || e.surface === 'mobile' ? null : (() => {
      const { Input } = $.ui.resolve(e as RenderInput<'AbovePrompt', 'terminal'>)

      return (
        <Input
          key="feature-title"
          label="New feature"
          placeholder="its name, then Enter"
          value={pick.title}
          submitLabel="Set"
          onSubmit={value => void nameNewFeature(portsOf($), value)}
        />
      )
    })()
  const canSave = pick !== null && !(pick?.kind === 'new' && pick.title === '')

  return (
    <Box flexDirection="column">
      <Text>New task: {band.title}</Text>
      <Box>
        {PRIORITY_ORDER.map(p =>
          p === band.priority ? (
            <Button key={`prio:${p}`} label={p} variant="primary" onPress={() => {}} />
          ) : (
            <Button key={`prio:${p}`} label={p} onPress={() => void pickBand(portsOf($), { priority: p })} />
          ),
        )}
      </Box>
      <Box>
        {DIFFICULTIES.map(d =>
          d === band.difficulty ? (
            <Button key={`diff:${d}`} label={d} variant="primary" onPress={() => {}} />
          ) : (
            <Button key={`diff:${d}`} label={d} onPress={() => void pickBand(portsOf($), { difficulty: d })} />
          ),
        )}
      </Box>
      {band.choices !== undefined && (
        <Box flexWrap="wrap">
          <Text>Part of </Text>
          {choice('parent:none', 'On its own', { kind: 'none' })}
          {offered.map(t => choice(`parent:${t.id}`, cut(t.title, FEATURE_LABEL), { kind: 'task', id: t.id }))}
          {e.surface !== 'mobile' && choice('parent:new', 'New feature…', { kind: 'new', title: pick?.kind === 'new' ? pick.title : '' })}
        </Box>
      )}
      {pick === null && <Text color="warning">Is it part of a feature? Pick one, or On its own.</Text>}
      {naming}
      <Box>
        {canSave && <Button key="save" label="Save" variant="primary" onPress={() => void saveFile(portsOf($))} />}
        <Button key="same-task" label="Same task" onPress={held.sameTask} />
        <Button key="cancel" label="Cancel" onPress={held.cancel} />
      </Box>
    </Box>
  )
}
