import type { Color, EngineInterface, RenderElement, RenderInput } from 'claude-code'

import type { Band, Difficulty, ParentPick, Task } from '../../types'
import {
  cancelHeld,
  nameNewFeature,
  pickBand,
  saveDifficulty,
  saveDocsPath,
  saveFile,
  sendHeld,
  sendQuick,
  toggleMenu,
  unsureToNew,
} from '../actions'
import { getView, readCup } from '../ports'
import { PRIORITY_ORDER } from '../queue'
import { CUP_COLUMNS, CUP_ROWS, cupArt } from './cup'
import type { Frame, Mood } from './cup'
import { KEYS } from './keys'
import { cut } from './status'

const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']
const FEATURE_LABEL = 24

// Narrower than this, the band has the words without the cup.
const CUP_MIN_COLUMNS = 40

const MOOD_WORD: Record<Mood, string> = { idle: 'idle', working: 'brewing', attention: 'needs you', done: 'done' }
const MOOD_COLOR: Record<Mood, Color> = { idle: 'inactive', working: 'suggestion', attention: 'warning', done: 'success' }

// The band: the tea cup, always, with what Queue-tea is doing beside it, or
// the question Queue-tea is asking. Null only while a survey holds the band.
export async function renderBand($: EngineInterface, e: RenderInput<'AbovePrompt'>): Promise<RenderElement | null> {
  if (e.props.hasSurvey) return null
  const band = await getView($, 'band')
  const { Box, Text, Button } = $.ui.resolve(e)
  const cup = await readCup($, e.props.isWorking)
  const art = await drawCup($, e, cup.mood)

  if (band.kind !== 'none') {
    const question = await drawQuestion($, e, band)

    return art === null ? question : (
      <Box gap={1}>
        {art}
        {question}
      </Box>
    )
  }

  const isMenuOpen = await getView($, 'isMenuOpen')
  const room = e.props.bodyColumns - (art === null ? 0 : CUP_COLUMNS + 1)
  // Clicks reach the cup only where the terminal reports them.
  const how = art !== null && e.viewport?.isFullscreen === true ? ' · /queue-tea, or click the cup' : ' · /queue-tea'

  return (
    <Box gap={1}>
      {art}
      <Box flexDirection="column">
        <Text>
          <Text bold>Queue-tea</Text> <Text color={MOOD_COLOR[cup.mood]}>{MOOD_WORD[cup.mood]}</Text>
        </Text>
        {cup.mood === 'attention' ? (
          <Text color="warning">{cut(cup.line, room)}</Text>
        ) : (
          <Text dimColor>{cut(cup.line, room)}</Text>
        )}
        <Box>
          <Button
            key="cup-menu"
            plain
            hotkey={KEYS.menu}
            label={isMenuOpen ? 'Close menu' : 'Menu'}
            onPress={() => void toggleMenu($)}
          />
          <Text dimColor>{cut(how, room - 12)}</Text>
        </Box>
      </Box>
    </Box>
  )
}

// The cup: animated by its surface module where the surface runs one, still
// where it does not or the module failed, left out where the band is narrow.
async function drawCup($: EngineInterface, e: RenderInput<'AbovePrompt'>, mood: Mood): Promise<RenderElement | null> {
  if (e.props.bodyColumns < CUP_MIN_COLUMNS) return null
  const art = cupArt(mood)
  if (!(await getView($, 'isCupStill')) && (e.surface === 'terminal' || e.surface === 'desktop')) {
    const { Client } = $.ui.resolve(e as RenderInput<'AbovePrompt', 'terminal'>)

    return <Client key="cup" module="./teacup.tsx" props={art} width={CUP_COLUMNS} height={CUP_ROWS} />
  }

  return stillCup($, e, art.frames[0]!)
}

function stillCup($: EngineInterface, e: RenderInput<'AbovePrompt'>, frame: Frame): RenderElement {
  const { Box, Text } = $.ui.resolve(e)

  return (
    <Box flexDirection="column">
      {frame.map(row => (
        <Text>
          {row.map(seg => (
            <Text
              {...(seg.color === undefined ? {} : { color: seg.color })}
              {...(seg.backgroundColor === undefined ? {} : { backgroundColor: seg.backgroundColor })}
              {...(seg.bold === true ? { bold: true } : {})}
            >
              {seg.text}
            </Text>
          ))}
        </Text>
      ))}
    </Box>
  )
}

// What the band asks: a held message's priority and what it is part of, the
// can't-tell choice, the difficulty at the end of a task, the docs log's path.
async function drawQuestion(
  $: EngineInterface,
  e: RenderInput<'AbovePrompt'>,
  band: Exclude<Band, { kind: 'none' }>,
): Promise<RenderElement> {
  const els = $.ui.resolve(e)
  const { Box, Text, Button } = els

  if (band.kind === 'file') {
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
        <Button key={key} label={label} onPress={() => void pickBand($, { parent: p })} />
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
            onSubmit={value => void nameNewFeature($, value)}
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
              <Button key={`prio:${p}`} label={p} onPress={() => void pickBand($, { priority: p })} />
            ),
          )}
        </Box>
        <Box>
          {DIFFICULTIES.map(d =>
            d === band.difficulty ? (
              <Button key={`diff:${d}`} label={d} variant="primary" onPress={() => {}} />
            ) : (
              <Button key={`diff:${d}`} label={d} onPress={() => void pickBand($, { difficulty: d })} />
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
          {canSave && <Button key="save" label="Save" variant="primary" onPress={() => void saveFile($)} />}
          <Button key="same-task" label="Same task" onPress={() => void sendHeld($)} />
          <Button key="cancel" label="Cancel" onPress={() => void cancelHeld($)} />
        </Box>
      </Box>
    )
  }

  if (band.kind === 'unsure') {
    return (
      <Box flexDirection="column">
        {!band.didCheckRun && <Text>The check didn't run, so pick one.</Text>}
        <Text dimColor>{band.text.slice(0, 80)}</Text>
        <Box>
          <Button key="same-task" label="Same task" onPress={() => void sendHeld($)} />
          <Button key="new-task" label="New task" onPress={() => void unsureToNew($)} />
          <Button key="quick-question" label="Quick question" onPress={() => void sendQuick($)} />
          <Button key="cancel" label="Cancel" onPress={() => void cancelHeld($)} />
        </Box>
      </Box>
    )
  }

  if (band.kind === 'difficulty') {
    return (
      <Box flexDirection="column">
        <Text>How hard was it?</Text>
        <Box>
          {DIFFICULTIES.map(d =>
            d === band.picked ? (
              <Button key={`diff:${d}`} label={d} variant="primary" onPress={() => {}} />
            ) : (
              <Button key={`diff:${d}`} label={d} onPress={() => void pickBand($, { difficulty: d })} />
            ),
          )}
          <Button key="save-difficulty" label="Save" variant="primary" onPress={() => void saveDifficulty($)} />
        </Box>
      </Box>
    )
  }

  // The docs log's path, asked the first time a task is finished here.
  if (e.surface === 'mobile') {
    return (
      <Box flexDirection="column">
        <Text>Where should this project's task log go?</Text>
        <Button key="docs-path" label={`Use ${band.suggested}`} onPress={() => void saveDocsPath($, band.suggested)} />
      </Box>
    )
  }
  const { Input } = $.ui.resolve(e as RenderInput<'AbovePrompt', 'terminal'>)

  return (
    <Box flexDirection="column">
      <Text>Where should this project's task log go?</Text>
      <Input
        key="docs-path"
        label="Task log path"
        value={band.suggested}
        submitLabel="Save"
        onSubmit={value => void saveDocsPath($, value)}
      />
    </Box>
  )
}
