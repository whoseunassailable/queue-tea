"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialog = void 0;
var hooks_1 = require("preact/hooks");
var window_keys_1 = require("./window_keys");
// A sheet (600 px) or a confirmation (480 px). Esc cancels; ⌘↩ confirms, which
// is the form's own submit, so the same checks run.
var Dialog = function (_a) {
    var title = _a.title, isSheet = _a.isSheet, closeLabel = _a.closeLabel, onCancel = _a.onCancel, onSubmit = _a.onSubmit, children = _a.children;
    var box = (0, hooks_1.useRef)(null);
    (0, hooks_1.useLayoutEffect)(function () {
        var _a;
        var first = (_a = box.current) === null || _a === void 0 ? void 0 : _a.querySelector('input, textarea, button');
        first === null || first === void 0 ? void 0 : first.focus();
    }, []);
    (0, window_keys_1.useWindowKeys)(function (event) {
        if (event.key === 'Escape') {
            event.stopPropagation();
            onCancel();
        }
        else if (event.key === 'Enter' && event.metaKey) {
            event.preventDefault();
            onSubmit();
        }
    });
    return (<div class="scrim">
      <form ref={box} class={isSheet === true ? 'sheet panel' : 'confirm panel'} role="dialog" aria-modal="true" aria-label={title} noValidate 
    // Pressing a button at the foot takes focus from the field, whose error
    // then pushes the button down mid-click, and the click misses. Keeping
    // the focus where it is leaves the button in place: the press itself
    // checks every field.
    onMouseDown={function (event) {
            if (event.target.closest('.sheet-actions') !== null)
                event.preventDefault();
        }} onSubmit={function (event) {
            event.preventDefault();
            onSubmit();
        }}>
        {closeLabel ? <div class="sheet-heading"><h2 class="sheet-title">{title}</h2><button type="button" class="btn" onClick={onCancel}>{closeLabel}</button></div> : <h2 class="sheet-title">{title}</h2>}
        {children}
      </form>
    </div>);
};
exports.Dialog = Dialog;
