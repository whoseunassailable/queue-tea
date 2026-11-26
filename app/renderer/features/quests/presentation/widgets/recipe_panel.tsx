import type { EngineApi, Recipe, RecipeAttention, RecipeNote, SessionState } from '../../../../../shared/engine_api'
import { dayAndTime } from '../../../../core/domain/format'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { checkTally, progressOf, RECIPE_DETAILS, recipeStatus, showsSteps, showsTechnical, stageCount } from '../../domain/recipe_view'
import { useRecipeDetail } from '../state_management/recipe_detail'
import '../recipe.css'

type Props = { engine: EngineApi; recipe: Recipe; session: SessionState; isWithCodex: boolean }

const Attention = ({ items }: { items: RecipeAttention[] }) =>
  items.length === 0 ? null : (
    <ul class="recipe-attention" aria-label={t.recipe.attentionLabel}>
      {items.map((item, i) => (
        <li key={`${item.kind}-${i}`} class={item.kind}>
          {item.kind === 'looksDone' ? (
            t.recipe.attention.looksDone
          ) : (
            <>
              <strong>{t.recipe.attention[item.kind]}</strong> {item.text}
            </>
          )}
        </li>
      ))}
    </ul>
  )

const Verification = ({ recipe }: { recipe: Recipe }) => {
  const { passed, failed } = checkTally(recipe.checks)
  const line = recipe.profile === null ? t.recipe.noProfile : t.recipe.verification(t.testProfile.names[recipe.profile.id], t.recipe.scope[recipe.profile.id])

  return (
    <p class="recipe-verify">
      {line}
      {recipe.checks.length > 0 && <span class={failed > 0 ? 'recipe-tally failed' : 'recipe-tally'}> · {t.recipe.tally(passed, failed)}</span>}
    </p>
  )
}

const Lines = ({ lines, isMono = false }: { lines: string[]; isMono?: boolean }) => (
  <ul class={isMono ? 'recipe-lines mono' : 'recipe-lines'}>
    {lines.map((line, i) => (
      <li key={`${i}-${line}`}>{line}</li>
    ))}
  </ul>
)

// What the quest is for and the steps to it, with what counts as done.
const Steps = ({ recipe }: { recipe: Recipe }) => (
  <div class="recipe-more">
    {recipe.goal !== null && (
      <>
        <h4>{t.recipe.goal}</h4>
        <p class="card-note">{recipe.goal}</p>
      </>
    )}
    <h4>{t.recipe.steps}</h4>
    {recipe.steps.length === 0 ? (
      <p class="hint">{t.recipe.noSteps}</p>
    ) : (
      <ol class="recipe-steps">
        {recipe.steps.map((step, i) => (
          <li key={`${i}-${step.text}`} class={step.mark} aria-current={step.mark === 'now' ? 'step' : undefined}>
            <span class="sr">{t.recipe.marks[step.mark]}: </span>
            {step.text}
          </li>
        ))}
      </ol>
    )}
    {recipe.doneWhen.length > 0 && (
      <>
        <h4>{t.recipe.doneWhen}</h4>
        <Lines lines={recipe.doneWhen} />
      </>
    )}
    {recipe.written !== null && <p class="hint">{t.recipe.written[recipe.written.kind](dayAndTime(recipe.written.at))}</p>}
  </div>
)

const Note = ({ note }: { note: RecipeNote }) => (
  <div class="recipe-note">
    <h4>{note.heading ?? t.recipe.notes[note.kind]}</h4>
    {note.kind === 'note' ? <p class="card-note notes-text">{note.lines.join('\n')}</p> : <Lines lines={note.lines} isMono={note.kind === 'files'} />}
  </div>
)

// The decisions behind the work and every check, one by one.
const Technical = ({ recipe }: { recipe: Recipe }) => (
  <div class="recipe-more">
    {recipe.notes.length === 0 && recipe.written === null && <p class="hint">{t.recipe.nothingTechnical}</p>}
    {recipe.notes.map((note, i) => (
      <Note key={`${note.kind}-${i}`} note={note} />
    ))}
    <h4>{t.recipe.checks}</h4>
    {recipe.checks.length === 0 ? (
      <p class="hint">{t.recipe.noChecks}</p>
    ) : (
      <ul class="recipe-checks">
        {recipe.checks.map(check => (
          <li key={check.command} class={check.isOk ? 'passed' : 'failed'}>
            <code class="mono">{check.command}</code>
            <span class="recipe-result">{check.isOk ? t.recipe.checkResult.passed : t.recipe.checkResult.failed}</span>
            {check.summary !== '' && <span class="hint">{check.summary}</span>}
            <time class="hint" dateTime={check.at}>
              {dayAndTime(check.at)}
            </time>
          </li>
        ))}
      </ul>
    )}
  </div>
)

// A quest's recipe: compact by default, with the stage it is on and anything
// that needs Rohan; the steps and the technical notes when he asks for them.
export const RecipePanel = ({ engine, recipe, session, isWithCodex }: Props) => {
  const choice = useRecipeDetail(engine)
  const status = recipeStatus(recipe, session, isWithCodex)
  const { at, of } = stageCount(recipe)
  const done = recipe.stages.filter(stage => stage.mark === 'done').length

  return (
    <section class="recipe" aria-label={t.recipe.label}>
      <div class="recipe-head">
        <p class="recipe-kicker">{t.recipe.step(at, of)}</p>
        <p class={`recipe-status ${status}`}>{t.recipe.status[status]}</p>
      </div>
      <div class="recipe-bar" role="progressbar" aria-label={t.recipe.progress(at, of)} aria-valuemin={0} aria-valuemax={of} aria-valuenow={done}>
        <span style={{ width: `${Math.round(progressOf(recipe) * 100)}%` }} />
      </div>
      <Attention items={recipe.attention} />
      <div class="helper-chips recipe-depths" role="group" aria-label={t.recipe.detailLabel}>
        {RECIPE_DETAILS.map(detail => (
          <button key={detail} type="button" class="helper-chip" aria-pressed={choice.detail === detail} onClick={() => choice.pick(detail)}>
            {t.recipe.details[detail]}
          </button>
        ))}
      </div>
      {choice.isSaving && (
        <p class="hint" role="status">
          <Spinner />
          {t.recipe.savingDetail}
        </p>
      )}
      {!choice.isSaving && choice.failure !== null && (
        <p class="hint" role="alert">
          {t.recipe.detailNotSaved(choice.failure)}{' '}
          <button type="button" class="link-btn" onClick={choice.retry}>
            {t.failed.tryAgain}
          </button>
        </p>
      )}
      <ol class="recipe-stages">
        {recipe.stages.map(stage => (
          <li key={stage.id} class={stage.mark} aria-current={stage.mark === 'now' ? 'step' : undefined}>
            <span class="sr">{t.recipe.marks[stage.mark]}: </span>
            {t.recipe.stages[stage.id]}
          </li>
        ))}
      </ol>
      <Verification recipe={recipe} />
      {showsSteps(choice.detail) && <Steps recipe={recipe} />}
      {showsTechnical(choice.detail) && <Technical recipe={recipe} />}
    </section>
  )
}
