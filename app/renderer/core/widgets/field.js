"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pick = exports.Group = exports.Field = void 0;
var hooks_1 = require("preact/hooks");
// A labelled text field with its error directly under it.
var Field = function (_a) {
    var label = _a.label, value = _a.value, error = _a.error, isRequired = _a.isRequired, isLong = _a.isLong, _b = _a.type, type = _b === void 0 ? 'text' : _b, list = _a.list, isLabelHidden = _a.isLabelHidden, onInput = _a.onInput, onBlur = _a.onBlur, onEnter = _a.onEnter;
    var id = (0, hooks_1.useId)();
    var errorId = "".concat(id, "-error");
    var shared = {
        id: id,
        value: value,
        class: 'input',
        'aria-invalid': error === undefined ? undefined : 'true',
        'aria-describedby': error === undefined ? undefined : errorId,
        onInput: function (event) { return onInput(event.target.value); },
        onBlur: onBlur,
    };
    return (<div class="form-field">
      <label for={id} class={isLabelHidden === true ? 'sr' : undefined}>
        {label}
        {isRequired === true && ' *'}
      </label>
      {isLong === true ? (<textarea {...shared} rows={3}/>) : (<input {...shared} type={type} list={list} onKeyDown={function (event) {
                if (event.key === 'Enter' && !event.metaKey && onEnter !== undefined) {
                    event.preventDefault();
                    onEnter();
                }
            }}/>)}
      {error !== undefined && (<p class="field-error" id={errorId}>
          {error}
        </p>)}
    </div>);
};
exports.Field = Field;
// A group of choices with its one error under it.
var Group = function (_a) {
    var label = _a.label, error = _a.error, children = _a.children;
    return (<fieldset class="form-group">
    <legend>{label}</legend>
    {children}
    {error !== undefined && <p class="field-error">{error}</p>}
  </fieldset>);
};
exports.Group = Group;
var Pick = function (_a) {
    var name = _a.name, label = _a.label, detail = _a.detail, isPicked = _a.isPicked, onPick = _a.onPick;
    return (<label class="pick">
    <input type="radio" name={name} checked={isPicked} onChange={onPick}/>
    <span class="pick-label">{label}</span>
    {detail != null && <span class="pick-detail">{detail}</span>}
  </label>);
};
exports.Pick = Pick;
