"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empty = exports.Failed = exports.Loading = exports.Spinner = void 0;
var en_1 = require("../../l10n/en");
var Spinner = function () { return (<svg class="spinner" viewBox="0 0 24 24" width="22" height="22" role="presentation" aria-hidden="true">
    <circle class="spinner-track" cx="12" cy="12" r="9"/>
    <circle class="spinner-arc" cx="12" cy="12" r="9"/>
  </svg>); };
exports.Spinner = Spinner;
var Loading = function (_a) {
    var line = _a.line, children = _a.children;
    return (<div class="state panel" role="status">
    <exports.Spinner />
    <p class="state-line">{line}</p>
    {children}
  </div>);
};
exports.Loading = Loading;
var Failed = function (_a) {
    var message = _a.message, onRetry = _a.onRetry;
    return (<div class="state panel" role="alert">
    <p class="state-line">{message}</p>
    <button type="button" class="btn" onClick={onRetry}>
      {en_1.t.failed.tryAgain}
    </button>
  </div>);
};
exports.Failed = Failed;
var Empty = function (_a) {
    var title = _a.title, line = _a.line, children = _a.children;
    return (<div class="state panel">
    <h2 class="state-title">{title}</h2>
    <p class="state-line">{line}</p>
    {children}
  </div>);
};
exports.Empty = Empty;
