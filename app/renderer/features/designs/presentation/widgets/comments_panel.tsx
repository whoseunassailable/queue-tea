import { useEffect, useId, useRef, useState } from 'preact/hooks'

import { isOpen, layersOf } from '../../../../../shared/designs'
import type { CommentInput, DesignComment, Layer, Problem, Scene } from '../../../../../shared/designs'
import type { Answer } from '../../../../core/api/engine_client'
import { t } from '../../../../l10n/en'
import { commentError } from '../../domain/design_forms'

type Props = {
  scene: Scene
  designId: string
  comments: DesignComment[]
  problem: Problem | null
  about: Layer | null
  onAdd: (input: CommentInput) => Promise<Answer<unknown>>
  onSet: (id: string, isResolved: boolean) => Promise<Answer<unknown>>
}

const CommentRow = ({ comment, names, onSet }: { comment: DesignComment; names: Map<string, string>; onSet: Props['onSet'] }) => {
  const [failure, setFailure] = useState<string | null>(null)
  const set = async (isResolved: boolean) => {
    const answer = await onSet(comment.id, isResolved)
    setFailure(answer.ok ? null : answer.message)
  }
  const on = comment.on === null ? null : (names.get(comment.on) ?? null)

  return (
    <li class={`dz-comment${isOpen(comment) ? '' : ' done'}`}>
      <div class="dz-c-head">
        <span class="dz-avatar" aria-hidden="true">
          {comment.by.slice(0, 1).toUpperCase()}
        </span>
        <b>{comment.by}</b>
        <span class="sub">{t.designs.commentWhen(comment.at, Date.now())}</span>
        {comment.sentTo !== null ? (
          <span class="sub dz-c-act">{t.designs.sentTo(comment.sentTo)}</span>
        ) : comment.resolved === null ? (
          <button type="button" class="link-btn dz-c-act" onClick={() => void set(true)}>
            {t.designs.resolve}
          </button>
        ) : (
          <button type="button" class="link-btn dz-c-act" onClick={() => void set(false)}>
            {t.designs.reopen}
          </button>
        )}
      </div>
      {comment.resolved !== null && comment.sentTo === null && <p class="sub">{t.designs.resolvedOn(comment.resolved)}</p>}
      {comment.on !== null && <p class="dz-c-on">{on === null ? t.designs.onGone : t.designs.onLayer(on)}</p>}
      <p class="dz-c-text">{comment.text}</p>
      {failure !== null && (
        <p class="field-error" role="alert">
          {failure}
        </p>
      )}
    </li>
  )
}

// Every design's comments box: the open ones first, newest first, the rest
// folded away, and a box for a new one about the selection or the whole design.
export const CommentsPanel = ({ scene, designId, comments, problem, about, onAdd, onSet }: Props) => {
  const id = useId()
  const [text, setText] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [failure, setFailure] = useState<string | null>(null)
  const [isWhole, setWhole] = useState(false)
  // Typed into since the last comment went: only then does leaving it check it.
  const isTouched = useRef(false)
  const isSending = useRef(false)
  // A new selection is what the next comment is about again.
  useEffect(() => setWhole(false), [about?.id])
  const names = new Map(layersOf(scene.nodes).map(l => [l.id, l.name]))
  const newest = [...comments].sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
  const open = newest.filter(isOpen)
  const closed = newest.filter(c => !isOpen(c))
  const target = isWhole ? null : about

  const submit = async (event: Event) => {
    event.preventDefault()
    const wrong = commentError(text)
    setError(wrong)
    if (wrong !== undefined || isSending.current) return
    isSending.current = true
    const answer = await onAdd({ design: designId, on: target?.id ?? null, text: text.trim() })
    isSending.current = false
    if (answer.ok) {
      setText('')
      isTouched.current = false
      setFailure(null)
    } else setFailure(answer.message)
  }

  return (
    <section class="dz-comments panel" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>
        {t.designs.commentsOn(scene.name)} <span class="sub">{t.designs.open(open.length)}</span>
      </h2>
      {open.length === 0 && closed.length === 0 && <p class="hint">{t.designs.noCommentsYet}</p>}
      <ul class="dz-c-list">
        {open.map(c => (
          <CommentRow key={c.id} comment={c} names={names} onSet={onSet} />
        ))}
      </ul>
      {closed.length > 0 && (
        <details class="dz-c-fold">
          <summary>{t.designs.resolvedFold(closed.length)}</summary>
          <ul class="dz-c-list">
            {closed.map(c => (
              <CommentRow key={c.id} comment={c} names={names} onSet={onSet} />
            ))}
          </ul>
        </details>
      )}
      {problem !== null ? (
        <p class="form-banner" role="alert">
          {problem.file}: {problem.detail} {t.designs.fixLine}
        </p>
      ) : (
        <form class="dz-c-new" noValidate onSubmit={event => void submit(event)}>
          <div class="form-field">
            <label for={id}>{t.designs.yourComment} *</label>
            <textarea
              id={id}
              class="input"
              rows={3}
              value={text}
              placeholder={t.designs.placeholder(scene.name)}
              aria-invalid={error === undefined ? undefined : 'true'}
              aria-describedby={error === undefined ? undefined : `${id}-error`}
              onInput={event => {
                isTouched.current = true
                setText((event.target as HTMLTextAreaElement).value)
              }}
              onBlur={() => isTouched.current && setError(commentError(text))}
              onKeyDown={event => {
                if (event.key === 'Enter' && event.metaKey) void submit(event)
              }}
            />
            {error !== undefined && (
              <p class="field-error" id={`${id}-error`}>
                {error}
              </p>
            )}
          </div>
          <div class="dz-c-foot">
            {target === null ? (
              <span class="sub">{t.designs.aboutWhole}</span>
            ) : (
              <span class="tag dz-about">
                {t.designs.about(target.name)}
                <button type="button" class="dz-about-x" aria-label={t.designs.clearAbout} onClick={() => setWhole(true)}>
                  ✕
                </button>
              </span>
            )}
            <button type="submit" class="btn primary">
              {t.designs.addComment}
            </button>
          </div>
          {failure !== null && (
            <p class="form-banner" role="alert">
              {failure}
            </p>
          )}
        </form>
      )}
    </section>
  )
}
