import { useEffect, useId, useState } from 'preact/hooks'

import { isFrame, isText, LIMITS } from '../../../../../shared/designs'
import type { Layer, Scene } from '../../../../../shared/designs'
import { t } from '../../../../l10n/en'
import { colourError, numberError } from '../../domain/design_forms'
import { DESIGN_FRAME, layerOf } from '../../domain/scene_edits'

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]

// One small field. It checks what's typed when it loses focus or on ↩, shows
// its error under it, and only then hands the value on.
const Small = ({ label, value, check, onCommit, isWide }: { label: string; value: string; check: (text: string) => string | undefined; onCommit: (text: string) => void; isWide?: boolean }) => {
  const id = useId()
  const [text, setText] = useState(value)
  const [error, setError] = useState<string | undefined>(undefined)
  // A new selection, an undo or a drag shows its own value.
  useEffect(() => {
    setText(value)
    setError(undefined)
  }, [value])
  const done = () => {
    // Leaving a field as it was isn't an answer to check.
    if (text.trim() === value) {
      setError(undefined)

      return
    }
    const wrong = check(text)
    setError(wrong)
    if (wrong === undefined) onCommit(text.trim())
  }

  return (
    <div class={`dz-field${isWide === true ? ' wide' : ''}`}>
      <label for={id}>{label}</label>
      <input
        id={id}
        class="input"
        value={text}
        aria-invalid={error === undefined ? undefined : 'true'}
        aria-describedby={error === undefined ? undefined : `${id}-error`}
        onInput={event => setText((event.target as HTMLInputElement).value)}
        onBlur={done}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault()
            done()
          } else if (event.key === 'Escape') {
            event.stopPropagation()
            setText(value)
            setError(undefined)
          }
        }}
      />
      {error !== undefined && (
        <p class="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

const number = (what: string, low: number, high: number) => (text: string) => numberError(text, low, high, what)
const round = (text: string) => Math.round(Number(text))

export type InspectorProps = { scene: Scene; selected: string | null; onChange: (patch: Partial<Layer>) => void; onDuplicate: () => void; onRemove: () => void }

export const Inspector = ({ scene, selected, onChange, onDuplicate, onRemove }: InspectorProps) => {
  const w = t.designs.what
  if (selected === null) {
    return (
      <section class="dz-inspect panel" aria-label={t.designs.inspector}>
        <h2>{t.designs.nothingSelected}</h2>
        <p class="hint">{t.designs.nothingLine(scene.name)}</p>
      </section>
    )
  }
  if (selected === DESIGN_FRAME) {
    return (
      <section class="dz-inspect panel" aria-label={t.designs.inspector}>
        <h2>
          {scene.name} <span class="sub">{t.designs.kind(DESIGN_FRAME)}</span>
        </h2>
        <h3>{t.designs.positionSize}</h3>
        <div class="dz-fields">
          <Small label="W" value={String(scene.width)} check={number(w.width, 1, LIMITS.size)} onCommit={text => onChange({ width: round(text) })} />
          <Small label="H" value={String(scene.height)} check={number(w.height, 1, LIMITS.size)} onCommit={text => onChange({ height: round(text) })} />
        </div>
        <div class="dz-fields">
          <Small label={t.designs.fill} value={scene.fill} check={colourError} onCommit={fill => onChange({ fill } as Partial<Layer>)} isWide />
        </div>
      </section>
    )
  }
  const layer = layerOf(scene, selected)
  if (layer === null) return null

  return (
    <section class="dz-inspect panel" aria-label={t.designs.inspector}>
      <h2>
        {layer.name} <span class="sub">{t.designs.kind(layer.type)}</span>
      </h2>
      <h3>{t.designs.positionSize}</h3>
      <div class="dz-fields">
        <Small label="X" value={String(layer.x)} check={number(w.x, -LIMITS.place, LIMITS.place)} onCommit={text => onChange({ x: round(text) })} />
        <Small label="Y" value={String(layer.y)} check={number(w.y, -LIMITS.place, LIMITS.place)} onCommit={text => onChange({ y: round(text) })} />
        <Small label="W" value={String(layer.width)} check={number(w.width, 1, LIMITS.size)} onCommit={text => onChange({ width: round(text) })} />
        {isText(layer) ? (
          <div class="dz-field">
            <span class="dz-label">H</span>
            <span class="dz-auto">{t.designs.auto}</span>
          </div>
        ) : (
          <Small label="H" value={String(layer.height ?? '')} check={number(w.height, 1, LIMITS.size)} onCommit={text => onChange({ height: round(text) })} />
        )}
      </div>
      {isFrame(layer) && (
        <>
          <h3>{t.designs.fillRadius}</h3>
          <div class="dz-fields">
            <Small label={t.designs.fill} value={layer.fill ?? ''} check={colourError} onCommit={fill => onChange({ fill } as Partial<Layer>)} isWide />
            <Small label={t.designs.radius} value={String(layer.radius ?? 0)} check={number(w.radius, 0, LIMITS.radius)} onCommit={text => onChange({ radius: round(text) } as Partial<Layer>)} />
          </div>
        </>
      )}
      {isText(layer) && (
        <>
          <h3>{t.designs.textStyle}</h3>
          <p class="dz-font">{layer.font}</p>
          <div class="dz-fields">
            <Small label={t.designs.size} value={String(layer.size)} check={number(w.size, 1, LIMITS.fontSize)} onCommit={text => onChange({ size: round(text) } as Partial<Layer>)} />
            <div class="dz-field">
              <label for={`weight-${layer.id}`}>{t.designs.weight}</label>
              <select id={`weight-${layer.id}`} class="input" value={String(layer.weight)} onChange={event => onChange({ weight: Number((event.target as HTMLSelectElement).value) } as Partial<Layer>)}>
                {WEIGHTS.map(weight => (
                  <option key={weight} value={String(weight)}>
                    {weight}
                  </option>
                ))}
              </select>
            </div>
            <Small label={t.designs.colour} value={layer.color} check={colourError} onCommit={color => onChange({ color } as Partial<Layer>)} isWide />
          </div>
          <p class="hint">{t.designs.fontNote}</p>
        </>
      )}
      <div class="dz-actions">
        <button type="button" class="chip-btn" onClick={onDuplicate}>
          {t.designs.duplicate} <kbd>⌘D</kbd>
        </button>
        <button type="button" class="chip-btn" onClick={onRemove}>
          {t.designs.remove} <kbd>⌫</kbd>
        </button>
      </div>
    </section>
  )
}
