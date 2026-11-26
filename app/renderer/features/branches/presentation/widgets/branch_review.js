"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.BranchReview = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var dialog_1 = require("../../../../core/widgets/dialog");
var read_view_1 = require("../../../../core/widgets/read_view");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var constants_1 = require("../../domain/constants");
var merge_review_1 = require("./merge_review");
var step_line_1 = require("../../../../core/widgets/step_line");
var ReviewContents = function (_a) {
    var _b, _c, _d, _e;
    var engine = _a.engine, realm = _a.realm, review = _a.review, onTarget = _a.onTarget, onRefresh = _a.onRefresh, onAdopt = _a.onAdopt;
    var _f = (0, hooks_1.useState)('overview'), tab = _f[0], setTab = _f[1];
    var _g = (0, hooks_1.useState)([]), selected = _g[0], setSelected = _g[1];
    var _h = (0, hooks_1.useState)(''), message = _h[0], setMessage = _h[1];
    var _j = (0, hooks_1.useState)(null), messageError = _j[0], setMessageError = _j[1];
    var _k = (0, hooks_1.useState)(null), idleFor = _k[0], setIdleFor = _k[1];
    var idle = idleFor === review.fingerprint;
    var _l = (0, hooks_1.useState)(null), error = _l[0], setError = _l[1];
    var _m = (0, hooks_1.useState)(null), busy = _m[0], setBusy = _m[1];
    var _o = (0, hooks_1.useState)((_c = (_b = review.operation) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : null), operationId = _o[0], setOperationId = _o[1];
    // Claude's proposal fills the form once, and a newer one replaces it only
    // while the form still holds nothing or the last proposal unedited.
    var proposal = (_d = review.proposal) !== null && _d !== void 0 ? _d : null;
    var proposalKey = proposal && "".concat(proposal.at, "\n").concat(proposal.message, "\n").concat(proposal.files.join('\n'));
    var _p = (0, hooks_1.useState)(null), applied = _p[0], setApplied = _p[1];
    (0, hooks_1.useEffect)(function () {
        if (!proposal || !proposalKey || proposalKey === (applied === null || applied === void 0 ? void 0 : applied.key))
            return;
        if (!message.trim() || message === (applied === null || applied === void 0 ? void 0 : applied.message)) {
            setMessage(proposal.message);
            setSelected(proposal.files);
            setMessageError(null);
        }
        setApplied({ key: proposalKey, message: proposal.message });
    }, [proposalKey]);
    (0, hooks_1.useEffect)(function () { var _a, _b; setOperationId((_b = (_a = review.operation) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null); }, [(_e = review.operation) === null || _e === void 0 ? void 0 : _e.id]);
    var request = { taskId: review.taskId, target: review.target, fingerprint: review.fingerprint, idleConfirmed: idle };
    var validate = function () {
        var problem = !message.trim() ? en_1.t.branches.messageRequired : message.length > constants_1.MESSAGE_LIMIT ? en_1.t.branches.messageLong : null;
        setMessageError(problem);
        return !problem;
    };
    (0, hooks_1.useEffect)(function () { if (!busy)
        return; var timer = window.setInterval(onRefresh, 400); return function () { return window.clearInterval(timer); }; }, [busy, onRefresh]);
    // A background reread never locks the form: the engine refuses a commit made on a stale fingerprint.
    var disabled = !!busy;
    // Ticks outlive a reread; only files that are no longer changed drop out.
    var chosen = selected.filter(function (path) { return review.files.some(function (file) { return file.path === path; }); });
    var isAllChosen = review.files.length > 0 && chosen.length === review.files.length;
    return <>
    <p class="branch-direction mono">{review.source} → {review.target}</p>
    <label>{en_1.t.branches.destination}<select value={review.target} disabled={!!busy} onChange={function (e) { return onTarget(e.currentTarget.value); }}>{review.targets.map(function (branch) { return <option key={branch} value={branch}>{branch}</option>; })}</select></label>
    <div class="branch-tabs" role="tablist">{Object.keys(en_1.t.branches.tabs).map(function (name) { return <button type="button" role="tab" aria-selected={name === tab} class={name === tab ? 'selected' : ''} key={name} onClick={function () { return setTab(name); }}>{en_1.t.branches.tabs[name]}</button>; })}</div>
    {error && <p class="note" role="alert">{error}</p>}
    {busy && <states_1.Loading line={busy}/>}
    {review.commitProgress && <section aria-label={en_1.t.branches.commitProgress}>
      <strong>{en_1.t.branches.checkStatus[review.commitProgress.status]}</strong>
      <p>{review.commitProgress.message}</p>
      <code>{review.commitProgress.command}</code>
      <pre class="live-terminal" role="log" aria-label={en_1.t.branches.commitOutput}>{review.commitProgress.output || en_1.t.branches.waitingOutput}</pre>
      {review.commitProgress.exitCode !== null && <p>{en_1.t.branches.exitCode(review.commitProgress.exitCode)}</p>}
    </section>}
    <section role="tabpanel" aria-label={en_1.t.branches.tabs[tab]}>
      {tab === 'overview' && <>
        <p><strong>{en_1.t.branches.states[review.state]}</strong></p>
        {review.step && <step_line_1.StepLine step={review.step}/>}
        <dl class="branch-refs"><dt>{en_1.t.branches.source}</dt><dd class="mono">{review.sourceHead}</dd><dt>{en_1.t.branches.target}</dt><dd class="mono">{review.targetHead}</dd></dl>
        <p class="hint">{en_1.t.branches.localOnly}</p>
        <h3>{en_1.t.branches.commits}</h3>
        {review.commits.length ? <ul class="branch-commits">{review.commits.map(function (c) { return <li key={c.id}><code>{c.id.slice(0, 7)}</code> {c.message}</li>; })}</ul> : <p>{en_1.t.branches.noCommits}</p>}
      </>}
      {tab === 'changes' && <>
        <h3>{en_1.t.branches.files}</h3>
        {review.files.length === 0 ? <p>{en_1.t.branches.noFiles}</p> : <>
          <label class="branch-confirm"><input type="checkbox" checked={isAllChosen} disabled={disabled} onChange={function (e) { return setSelected(e.currentTarget.checked ? review.files.map(function (file) { return file.path; }) : []); }}/>{en_1.t.branches.selectAll}</label>
          <ul class="branch-files">{review.files.map(function (file) { return <li key={file.path}><label><input type="checkbox" checked={chosen.includes(file.path)} disabled={disabled} onChange={function (e) { var checked = e.currentTarget.checked; setSelected(function (was) { return checked ? __spreadArray(__spreadArray([], was, true), [file.path], false) : was.filter(function (f) { return f !== file.path; }); }); }}/><code>{file.status}</code> {file.path}</label></li>; })}</ul>
          {proposal && <p class="hint" role="status">{en_1.t.branches.proposed}</p>}
          <label>{en_1.t.branches.commitMessage}<textarea value={message} disabled={disabled} onInput={function (e) { return setMessage(e.currentTarget.value); }} onBlur={validate} aria-invalid={!!messageError}/></label>
          {messageError && <p role="alert">{messageError}</p>}
          <label class="branch-confirm"><input type="checkbox" checked={idle} disabled={disabled} onChange={function (e) { return setIdleFor(e.currentTarget.checked ? review.fingerprint : null); }}/>{en_1.t.branches.idle}</label>
          <button type="button" class="btn primary" disabled={disabled || !idle || review.state === 'working'} onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                    var answer;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!validate())
                                    return [2 /*return*/];
                                if (!chosen.length) {
                                    setError(en_1.t.branches.selectFiles);
                                    return [2 /*return*/];
                                }
                                setBusy(en_1.t.branches.committing);
                                setError(null);
                                return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.commitBranchFiles(realm, __assign(__assign({}, request), { files: chosen, message: message })); })];
                            case 1:
                                answer = _a.sent();
                                if (answer.ok) {
                                    onAdopt(answer.data);
                                    setMessage('');
                                }
                                else
                                    setError(answer.message);
                                setBusy(null);
                                return [2 /*return*/];
                        }
                    });
                }); }}>{en_1.t.branches.commitSelected}</button>
        </>}
        <details open><summary>{en_1.t.branches.diff}</summary><pre class="branch-diff">{review.diff}</pre></details>
        {review.truncated && <p role="status">{en_1.t.branches.truncated}</p>}
      </>}
      {tab === 'checks' && <>
        <p class="hint">{en_1.t.branches.checkHint}</p>
        {review.checks.length === 0 ? <p>{en_1.t.branches.noChecks}</p> : <ol class="activity-list">{review.checks.map(function (run) {
                    var _a;
                    return <li key={run.id}>
          <time>{new Date(run.at).toLocaleString()}</time><strong>{run.name}</strong> <span class={"activity-status ".concat(run.status === 'succeeded' ? 'succeeded' : run.status === 'running' ? 'running' : 'failed')}>{en_1.t.branches.checkStatus[run.status]}</span>
          <code class="activity-subject">{run.command}</code>
          <p class="hint">{en_1.t.branches.checkedTree(run.tree.slice(0, 7))}{((_a = review.operation) === null || _a === void 0 ? void 0 : _a.tree) && run.tree !== review.operation.tree ? " \u00B7 ".concat(en_1.t.branches.staleChecks) : ''}</p>
          {run.exitCode !== null && <p>{en_1.t.branches.exitCode(run.exitCode)}</p>}
        </li>;
                })}</ol>}
      </>}
    </section>
    {operationId ? <merge_review_1.MergeReview key={operationId} engine={engine} realm={realm} id={operationId} remotes={review.remotes} onChanged={onRefresh}/> : <div class="merge-start">
      {review.blocked && <p role="status">{review.blocked}</p>}
      <label class="branch-confirm"><input type="checkbox" checked={idle} disabled={disabled} onChange={function (e) { return setIdleFor(e.currentTarget.checked ? review.fingerprint : null); }}/>{en_1.t.branches.idle}</label>
      <button type="button" class="btn primary" disabled={disabled || !!review.blocked || !idle} onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                var answer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setBusy(en_1.t.branches.preparing);
                            setError(null);
                            return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.prepareMerge(realm, request); })];
                        case 1:
                            answer = _a.sent();
                            if (answer.ok) {
                                setOperationId(answer.data.operation.id);
                                onRefresh();
                            }
                            else {
                                setError(answer.message);
                                onRefresh();
                            }
                            setBusy(null);
                            return [2 /*return*/];
                    }
                });
            }); }}>{en_1.t.branches.prepare}</button>
    </div>}
  </>;
};
var BranchReview = function (_a) {
    var engine = _a.engine, realm = _a.realm, id = _a.id, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(null), target = _b[0], setTarget = _b[1];
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readBranch(realm, id, target); }, [realm, id, target]);
    (0, hooks_1.useEffect)(function () { var timer = window.setInterval(read.refresh, constants_1.BRANCH_POLL_MS); return function () { return window.clearInterval(timer); }; }, [read.refresh]);
    return <dialog_1.Dialog title={en_1.t.branches.review} isSheet closeLabel={en_1.t.branches.close} onCancel={onClose} onSubmit={function () { }}>
    <div class="branch-review">
      <read_view_1.ReadView read={read} line={en_1.t.branches.checking}>{function (review) { return <ReviewContents key={"".concat(id, ":").concat(review.target)} engine={engine} realm={realm} review={review} onTarget={setTarget} onRefresh={read.refresh} onAdopt={read.adopt}/>; }}</read_view_1.ReadView>
    </div>
    <div class="sheet-actions"><button type="button" class="btn" onClick={read.refresh}>{en_1.t.branches.refresh}</button></div>
  </dialog_1.Dialog>;
};
exports.BranchReview = BranchReview;
