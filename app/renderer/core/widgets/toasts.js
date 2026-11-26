"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toasts = void 0;
var hooks_1 = require("preact/hooks");
var constants_1 = require("../constants/constants");
var states_1 = require("./states");
var Item = function (_a) {
    var toast = _a.toast, onDismiss = _a.onDismiss;
    var _b = (0, hooks_1.useState)(false), isHeld = _b[0], setHeld = _b[1];
    (0, hooks_1.useEffect)(function () {
        if (isHeld || toast.isBusy)
            return undefined;
        var timer = setTimeout(function () { return onDismiss(toast.id); }, toast.action === undefined && toast.isLong !== true ? constants_1.TOAST_MS : constants_1.TOAST_ACTION_MS);
        return function () { return clearTimeout(timer); };
    }, [isHeld, toast, onDismiss]);
    return (<div class={"toast-item ".concat(toast.tone)} role={toast.tone === 'error' ? 'alert' : 'status'} onMouseEnter={function () { return setHeld(true); }} onMouseLeave={function () { return setHeld(false); }}>
      {toast.isBusy && <states_1.Spinner />}
      <span class="toast-text">{toast.text}</span>
      {toast.action !== undefined && (<button type="button" class="link-btn" onClick={function () {
                var _a;
                onDismiss(toast.id);
                (_a = toast.action) === null || _a === void 0 ? void 0 : _a.run();
            }}>
          {toast.action.label}
        </button>)}
    </div>);
};
var Toasts = function (_a) {
    var toasts = _a.toasts, onDismiss = _a.onDismiss;
    return (<div class="toasts">
    {toasts.map(function (toast) { return (<Item key={toast.id} toast={toast} onDismiss={onDismiss}/>); })}
  </div>);
};
exports.Toasts = Toasts;
