"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeChecks = void 0;
var hooks_1 = require("preact/hooks");
var en_1 = require("../../../../l10n/en");
var constants_1 = require("../../domain/constants");
var duration = function (ms) { var seconds = Math.floor(Math.max(0, ms) / 1000); return "".concat(Math.floor(seconds / 60), ":").concat(String(seconds % 60).padStart(2, '0')); };
var MergeChecks = function (_a) {
    var _b, _c, _d;
    var workspace = _a.workspace, busy = _a.busy, onRun = _a.onRun, onCancel = _a.onCancel;
    var _e = (0, hooks_1.useState)([]), selected = _e[0], setSelected = _e[1];
    var _f = (0, hooks_1.useState)(null), error = _f[0], setError = _f[1];
    var choices = (_b = workspace.availableChecks) !== null && _b !== void 0 ? _b : [];
    // Keep retry history on disk without rendering every old log on each tick.
    var latest = new Map(((_c = workspace.checks) !== null && _c !== void 0 ? _c : []).filter(function (run) { return choices.some(function (choice) { return choice.id === run.checkId; }); }).map(function (run) { return [run.checkId, run]; }));
    var runs = __spreadArray([], latest.values(), true);
    var running = ((_d = workspace.checks) !== null && _d !== void 0 ? _d : []).some(function (r) { return r.status === 'running'; });
    var _g = (0, hooks_1.useState)(Date.now), now = _g[0], setNow = _g[1];
    (0, hooks_1.useEffect)(function () {
        if (!running)
            return;
        setNow(Date.now());
        var timer = window.setInterval(function () { return setNow(Date.now()); }, constants_1.CHECK_CLOCK_MS);
        return function () { return window.clearInterval(timer); };
    }, [running]);
    var validSelected = selected.filter(function (id) { return choices.some(function (c) { return c.id === id; }); });
    return <section class="merge-checks" aria-label={en_1.t.branches.preparedChecks}>
    <h4>{en_1.t.branches.preparedChecks}</h4>
    <p class="hint">{en_1.t.branches.preparedChecksHint}</p>
    {runs.length > 0 && <p class="hint">{en_1.t.branches.latestChecks}</p>}
    {choices.length === 0 ? <p>{en_1.t.branches.noConfiguredChecks}</p> : <>
      <ul class="branch-files">{choices.map(function (choice) { return <li key={choice.id}><label>
        <input type="checkbox" disabled={busy || running} checked={validSelected.includes(choice.id)} onChange={function (e) {
                    var checked = e.currentTarget.checked;
                    setSelected(function (was) { return checked ? __spreadArray(__spreadArray([], was, true), [choice.id], false) : was.filter(function (id) { return id !== choice.id; }); });
                    setError(null);
                }}/><span><strong>{choice.name}</strong><code class="activity-subject">{choice.command}</code></span>
      </label></li>; })}</ul>
      {error && <p role="alert">{error}</p>}
      <button type="button" class="btn primary" disabled={busy || running || !workspace.approval} onClick={function () {
                if (!validSelected.length) {
                    setError(en_1.t.branches.chooseChecks);
                    return;
                }
                onRun(validSelected);
            }}>{en_1.t.branches.runChecks}</button>
    </>}
    {running && <button type="button" class="btn" onClick={onCancel}>{en_1.t.branches.cancelChecks}</button>}
    <ol class="check-runs">{runs.map(function (run) { return <li key={run.id}>
      <div class="sec-row"><strong>{run.name}</strong><span>{en_1.t.branches.checkStatus[run.status]}</span></div>
      <code>{run.command}</code>
      <p class="hint">{run.finished === null ? en_1.t.branches.checkElapsed(duration(now - run.at)) : en_1.t.branches.checkDuration(duration(run.finished - run.at))}</p>
      <p class="hint">{en_1.t.branches.checkedTree(run.tree.slice(0, 7))}{run.tree !== workspace.operation.tree ? " \u00B7 ".concat(en_1.t.branches.staleChecks) : ''}</p>
      <pre class="live-terminal" role="log" aria-label={en_1.t.branches.checkOutput(run.name)}>{run.output || en_1.t.branches.waitingOutput}</pre>
      {run.exitCode !== null && <p>{en_1.t.branches.exitCode(run.exitCode)}</p>}
      {run.truncated && <p class="hint">{en_1.t.activity.excerpt}</p>}
    </li>; })}</ol>
    {choices.length > 0 && !workspace.checksCurrent && <p role="status">{en_1.t.branches.checksBeforeMerge}</p>}
  </section>;
};
exports.MergeChecks = MergeChecks;
