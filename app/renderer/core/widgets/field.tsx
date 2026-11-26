import type { ComponentChildren } from 'preact'
import { useId } from 'preact/hooks'

type FieldProps = {
  label: string
  value: string
  error?: string | undefined
  isRequired?: boolean
  isLong?: boolean
  // A date or time field takes YYYY-MM-DD or HH:MM; empty while unfinished.
  type?: 'text' | 'date' | 'time'
  // The id of a datalist of suggestions.
  list?: string
  // The label is still read out, but not shown, where a column heads the fields.
  isLabelHidden?: boolean
  onInput: (value: string) => void
  onBlur?: () => void
  onEnter?: () => void
}

// A labelled text field with its error directly under it.
export const Field = ({ label, value, error, isRequired, isLong, type = 'text', list, isLabelHidden, onInput, onBlur, onEnter }: FieldProps) => {
  const id = useId()
  const errorId = `${id}-error`
  const shared = {
    id,
    value,
    class: 'input',
    'aria-invalid': error === undefined ? undefined : ('true' as const),
    'aria-describedby': error === undefined ? undefined : errorId,
    onInput: (event: Event) => onInput((event.target as HTMLInputElement).value),
    onBlur,
  }

  return (
    <div class="form-field">
      <label for={id} class={isLabelHidden === true ? 'sr' : undefined}>
        {label}
        {isRequired === true && ' *'}
      </label>
      {isLong === true ? (
        <textarea {...shared} rows={3} />
      ) : (
        <input
          {...shared}
          type={type}
          list={list}
          onKeyDown={event => {
            if (event.key === 'Enter' && !event.metaKey && onEnter !== undefined) {
              event.preventDefault()
              onEnter()
            }
          }}
        />
      )}
      {error !== undefined && (
        <p class="field-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}

// A group of choices with its one error under it.
export const Group = ({ label, error, children }: { label: string; error?: string | undefined; children: ComponentChildren }) => (
  <fieldset class="form-group">
    <legend>{label}</legend>
    {children}
    {error !== undefined && <p class="field-error">{error}</p>}
  </fieldset>
)

export const Pick = ({ name, label, detail, isPicked, onPick }: { name: string; label: string; detail?: string | null | undefined; isPicked: boolean; onPick: () => void }) => (
  <label class="pick">
    <input type="radio" name={name} checked={isPicked} onChange={onPick} />
    <span class="pick-label">{label}</span>
    {detail != null && <span class="pick-detail">{detail}</span>}
  </label>
)

// One of a group where any number can be ticked.
export const Tick = ({ label, detail, isTicked, onTick }: { label: string; detail?: string | null | undefined; isTicked: boolean; onTick: () => void }) => (
  <label class="pick">
    <input type="checkbox" checked={isTicked} onChange={onTick} />
    <span class="pick-label">{label}</span>
    {detail != null && <span class="pick-detail">{detail}</span>}
  </label>
)
