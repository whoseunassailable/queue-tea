"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inspector = void 0;
var hooks_1 = require("preact/hooks");
var designs_1 = require("../../../../../shared/designs");
var en_1 = require("../../../../l10n/en");
var design_forms_1 = require("../../domain/design_forms");
var scene_edits_1 = require("../../domain/scene_edits");
var WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
// One small field. It checks what's typed when it loses focus or on ↩, shows
// its error under it, and only then hands the value on.
var Small = function (_a) {
    var label = _a.label, value = _a.value, check = _a.check, onCommit = _a.onCommit, isWide = _a.isWide;
    var id = (0, hooks_1.useId)();
    var _b = (0, hooks_1.useState)(value), text = _b[0], setText = _b[1];
    var _c = (0, hooks_1.useState)(undefined), error = _c[0], setError = _c[1];
    // A new selection, an undo or a drag shows its own value.
    (0, hooks_1.useEffect)(function () {
        setText(value);
        setError(undefined);
    }, [value]);
    var done = function () {
        // Leaving a field as it was isn't an answer to check.
        if (text.trim() === value) {
            setError(undefined);
            return;
        }
        var wrong = check(text);
        setError(wrong);
        if (wrong === undefined)
            onCommit(text.trim());
    };
    return (<div class={"dz-field".concat(isWide === true ? ' wide' : '')}>
      <label for={id}>{label}</label>
      <input id={id} class="input" value={text} aria-invalid={error === undefined ? undefined : 'true'} aria-describedby={error === undefined ? undefined : "".concat(id, "-error")} onInput={function (event) { return setText(event.target.value); }} onBlur={done} onKeyDown={function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                done();
            }
            else if (event.key === 'Escape') {
                event.stopPropagation();
                setText(value);
                setError(undefined);
            }
        }}/>
      {error !== undefined && (<p class="field-error" id={"".concat(id, "-error")}>
          {error}
        </p>)}
    </div>);
};
var number = function (what, low, high) { return function (text) { return (0, design_forms_1.numberError)(text, low, high, what); }; };
var round = function (text) { return Math.round(Number(text)); };
var Inspector = function (_a) {
    var _b, _c, _d;
    var scene = _a.scene, selected = _a.selected, onChange = _a.onChange, onDuplicate = _a.onDuplicate, onRemove = _a.onRemove;
    var w = en_1.t.designs.what;
    if (selected === null) {
        return (<section class="dz-inspect panel" aria-label={en_1.t.designs.inspector}>
        <h2>{en_1.t.designs.nothingSelected}</h2>
        <p class="hint">{en_1.t.designs.nothingLine(scene.name)}</p>
      </section>);
    }
    if (selected === scene_edits_1.DESIGN_FRAME) {
        return (<section class="dz-inspect panel" aria-label={en_1.t.designs.inspector}>
        <h2>
          {scene.name} <span class="sub">{en_1.t.designs.kind(scene_edits_1.DESIGN_FRAME)}</span>
        </h2>
        <h3>{en_1.t.designs.positionSize}</h3>
        <div class="dz-fields">
          <Small label="W" value={String(scene.width)} check={number(w.width, 1, designs_1.LIMITS.size)} onCommit={function (text) { return onChange({ width: round(text) }); }}/>
          <Small label="H" value={String(scene.height)} check={number(w.height, 1, designs_1.LIMITS.size)} onCommit={function (text) { return onChange({ height: round(text) }); }}/>
        </div>
        <div class="dz-fields">
          <Small label={en_1.t.designs.fill} value={scene.fill} check={design_forms_1.colourError} onCommit={function (fill) { return onChange({ fill: fill }); }} isWide/>
        </div>
      </section>);
    }
    var layer = (0, scene_edits_1.layerOf)(scene, selected);
    if (layer === null)
        return null;
    return (<section class="dz-inspect panel" aria-label={en_1.t.designs.inspector}>
      <h2>
        {layer.name} <span class="sub">{en_1.t.designs.kind(layer.type)}</span>
      </h2>
      <h3>{en_1.t.designs.positionSize}</h3>
      <div class="dz-fields">
        <Small label="X" value={String(layer.x)} check={number(w.x, -designs_1.LIMITS.place, designs_1.LIMITS.place)} onCommit={function (text) { return onChange({ x: round(text) }); }}/>
        <Small label="Y" value={String(layer.y)} check={number(w.y, -designs_1.LIMITS.place, designs_1.LIMITS.place)} onCommit={function (text) { return onChange({ y: round(text) }); }}/>
        <Small label="W" value={String(layer.width)} check={number(w.width, 1, designs_1.LIMITS.size)} onCommit={function (text) { return onChange({ width: round(text) }); }}/>
        {(0, designs_1.isText)(layer) ? (<div class="dz-field">
            <span class="dz-label">H</span>
            <span class="dz-auto">{en_1.t.designs.auto}</span>
          </div>) : (<Small label="H" value={String((_b = layer.height) !== null && _b !== void 0 ? _b : '')} check={number(w.height, 1, designs_1.LIMITS.size)} onCommit={function (text) { return onChange({ height: round(text) }); }}/>)}
      </div>
      {(0, designs_1.isFrame)(layer) && (<>
          <h3>{en_1.t.designs.fillRadius}</h3>
          <div class="dz-fields">
            <Small label={en_1.t.designs.fill} value={(_c = layer.fill) !== null && _c !== void 0 ? _c : ''} check={design_forms_1.colourError} onCommit={function (fill) { return onChange({ fill: fill }); }} isWide/>
            <Small label={en_1.t.designs.radius} value={String((_d = layer.radius) !== null && _d !== void 0 ? _d : 0)} check={number(w.radius, 0, designs_1.LIMITS.radius)} onCommit={function (text) { return onChange({ radius: round(text) }); }}/>
          </div>
        </>)}
      {(0, designs_1.isText)(layer) && (<>
          <h3>{en_1.t.designs.textStyle}</h3>
          <p class="dz-font">{layer.font}</p>
          <div class="dz-fields">
            <Small label={en_1.t.designs.size} value={String(layer.size)} check={number(w.size, 1, designs_1.LIMITS.fontSize)} onCommit={function (text) { return onChange({ size: round(text) }); }}/>
            <div class="dz-field">
              <label for={"weight-".concat(layer.id)}>{en_1.t.designs.weight}</label>
              <select id={"weight-".concat(layer.id)} class="input" value={String(layer.weight)} onChange={function (event) { return onChange({ weight: Number(event.target.value) }); }}>
                {WEIGHTS.map(function (weight) { return (<option key={weight} value={String(weight)}>
                    {weight}
                  </option>); })}
              </select>
            </div>
            <Small label={en_1.t.designs.colour} value={layer.color} check={design_forms_1.colourError} onCommit={function (color) { return onChange({ color: color }); }} isWide/>
          </div>
          <p class="hint">{en_1.t.designs.fontNote}</p>
        </>)}
      <div class="dz-actions">
        <button type="button" class="chip-btn" onClick={onDuplicate}>
          {en_1.t.designs.duplicate} <kbd>⌘D</kbd>
        </button>
        <button type="button" class="chip-btn" onClick={onRemove}>
          {en_1.t.designs.remove} <kbd>⌫</kbd>
        </button>
      </div>
    </section>);
};
exports.Inspector = Inspector;
