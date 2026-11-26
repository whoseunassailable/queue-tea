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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeReview = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var read_view_1 = require("../../../../core/widgets/read_view");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var helper_jobs_1 = require("../../../guild/presentation/state_management/helper_jobs");
var constants_1 = require("../../domain/constants");
var helper_bench_1 = require("./helper_bench");
var merge_checks_1 = require("./merge_checks");
var ConflictEditor = function (_a) {
    var _b, _c, _d;
    var file = _a.file, source = _a.source, target = _a.target, busy = _a.busy, onResolve = _a.onResolve;
    var _e = (0, hooks_1.useState)((_d = (_c = (_b = file.result) !== null && _b !== void 0 ? _b : file.target) !== null && _c !== void 0 ? _c : file.source) !== null && _d !== void 0 ? _d : ''), text = _e[0], setText = _e[1];
    var _f = (0, hooks_1.useState)(null), error = _f[0], setError = _f[1];
    return <section class="conflict-file" aria-label={file.path}>
    <h4 class="mono">{file.path}</h4>
    <div class="three-way">{['base', 'target', 'source'].map(function (side) {
            var _a;
            return <details key={side} open>
      <summary>{side === 'base' ? en_1.t.branches.base : side === 'target' ? target : source}</summary>
      <pre>{(_a = file[side]) !== null && _a !== void 0 ? _a : en_1.t.branches.absent}</pre>
    </details>;
        })}</div>
    {!file.editable && <p class="hint">{en_1.t.branches.binary}</p>}
    <div class="q-actions">
      <button type="button" class="btn" disabled={busy} onClick={function () { return onResolve('target'); }}>{en_1.t.branches.useTarget}</button>
      <button type="button" class="btn" disabled={busy} onClick={function () { return onResolve('source'); }}>{en_1.t.branches.useSource}</button>
      <button type="button" class="btn" disabled={busy} onClick={function () { return onResolve('base'); }}>{en_1.t.branches.useBase}</button>
    </div>
    {file.editable && <>
      <label>{en_1.t.branches.result}<textarea class="conflict-result mono" value={text} disabled={busy} onInput={function (e) { setText(e.currentTarget.value); setError(null); }}/></label>
      {error && <p role="alert">{error}</p>}
      <button type="button" class="btn primary" disabled={busy} onClick={function () {
                if (/^(<{7}|={7}|>{7}|\|{7})( |$)/m.test(text))
                    setError(en_1.t.branches.markers);
                else
                    onResolve('edited', text);
            }}>{en_1.t.branches.saveResolution}</button>
    </>}
  </section>;
};
var MergeReview = function (_a) {
    var _b, _c;
    var engine = _a.engine, realm = _a.realm, id = _a.id, remotes = _a.remotes, onChanged = _a.onChanged;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readMergeWorkspace(realm, id); }, [realm, id]);
    var _d = (0, hooks_1.useState)(null), busy = _d[0], setBusy = _d[1];
    var _e = (0, hooks_1.useState)(null), error = _e[0], setError = _e[1];
    var _f = (0, hooks_1.useState)(null), message = _f[0], setMessage = _f[1];
    var _g = (0, hooks_1.useState)(null), messageError = _g[0], setMessageError = _g[1];
    var _h = (0, hooks_1.useState)(null), idleFor = _h[0], setIdleFor = _h[1];
    var _j = (0, hooks_1.useState)(false), abandon = _j[0], setAbandon = _j[1];
    var _k = (0, hooks_1.useState)((_b = remotes[0]) !== null && _b !== void 0 ? _b : ''), remote = _k[0], setRemote = _k[1];
    var _l = (0, hooks_1.useState)(null), push = _l[0], setPush = _l[1];
    var approval = read.load.status === 'ready' ? read.load.data.approval : null;
    var idle = approval !== null && idleFor === approval;
    var hasRunningChecks = read.load.status === 'ready' && ((_c = read.load.data.checks) === null || _c === void 0 ? void 0 : _c.some(function (run) { return run.status === 'running'; }));
    var helpers = (0, helper_jobs_1.useHelperJobs)(engine);
    // A helper resolving this merge edits its folder, so nothing else may until it is done.
    var isHelperAtWork = helpers.jobs.some(function (job) { return job.merge === id && job.status === 'working'; });
    var held = !!busy || isHelperAtWork;
    var _m = (0, hooks_1.useState)(false), isDropping = _m[0], setDropping = _m[1];
    var canSendHelper = read.load.status === 'ready' && read.load.data.operation.stage === 'conflicts' && !held;
    (0, hooks_1.useEffect)(function () { if (!busy && !hasRunningChecks && !isHelperAtWork)
        return; var timer = window.setInterval(read.refresh, constants_1.MERGE_POLL_MS); return function () { return window.clearInterval(timer); }; }, [busy, hasRunningChecks, isHelperAtWork, read.refresh]);
    // One more read when the helper finishes, for what it staged last.
    var wasHelperAtWork = (0, hooks_1.useRef)(false);
    (0, hooks_1.useEffect)(function () { if (wasHelperAtWork.current && !isHelperAtWork)
        read.refresh(); wasHelperAtWork.current = isHelperAtWork; }, [isHelperAtWork, read.refresh]);
    var tell = function (failed) { if (failed !== null)
        setError(failed); };
    var sendHelper = function (helper) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                setError(null);
                _a = tell;
                return [4 /*yield*/, helpers.concile(realm, helper, id)];
            case 1:
                _a.apply(void 0, [_b.sent()]);
                return [2 /*return*/];
        }
    }); }); };
    var run = function (line, call) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (busy)
                        return [2 /*return*/];
                    setBusy(line);
                    setError(null);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, call)];
                case 1:
                    result = _a.sent();
                    if (result.ok) {
                        read.adopt(result.data);
                        onChanged();
                        setPush(null);
                    }
                    else {
                        setError(result.message);
                        read.refresh();
                    }
                    setBusy(null);
                    return [2 /*return*/];
            }
        });
    }); };
    return <section class={"merge-review".concat(isDropping ? ' dropping' : '')} onDragOver={function (event) { var _a; if (!canSendHelper || !((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.includes(constants_1.HELPER_DRAG)))
        return; event.preventDefault(); setDropping(true); }} onDragLeave={function (event) { if (!event.currentTarget.contains(event.relatedTarget))
        setDropping(false); }} onDrop={function (event) { setDropping(false); var helper = (0, helper_bench_1.helperDropped)(event); if (!canSendHelper || helper === null)
        return; event.preventDefault(); void sendHelper(helper); }}>
    {error && <p class="note" role="alert">{error}</p>}
    {busy && <states_1.Loading line={busy}/>}
    {(hasRunningChecks || busy === en_1.t.branches.runningChecks) && <p class="hint">{en_1.t.branches.checksContinue}</p>}
    <read_view_1.ReadView read={read} line={en_1.t.branches.workspace}>{function (workspace) {
            var _a;
            var op = workspace.operation;
            var commitMessage = (_a = message !== null && message !== void 0 ? message : op.message) !== null && _a !== void 0 ? _a : en_1.t.branches.mergeMessage(op.source, op.target);
            var validateMessage = function () {
                var problem = !commitMessage.trim() ? en_1.t.branches.messageRequired : commitMessage.length > constants_1.MESSAGE_LIMIT ? en_1.t.branches.messageLong : null;
                setMessageError(problem);
                return !problem;
            };
            return <>
        <h3>{en_1.t.branches.mergeStages[op.stage]}</h3>
        <p class="mono">{op.source} → {op.target}</p>
        <p class="hint">{en_1.t.branches.isolation}</p>
        <p class="hint">{en_1.t.branches.checkIntegration}</p>
        {(op.stage === 'conflicts' || helpers.jobs.some(function (job) { return job.merge === op.id; })) && <helper_bench_1.HelperBench jobs={helpers.jobs} mergeId={op.id} canSend={canSendHelper} onSend={function (helper) { return void sendHelper(helper); }} onStop={function (helper) { return void helpers.stop(helper).then(tell); }} onRetry={function (job) { return void helpers.retry(job).then(tell); }}/>}
        <button type="button" class="btn" disabled={held} onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                    var opened;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.openMergeFolder(realm, op.id); })];
                            case 1:
                                opened = _a.sent();
                                if (!opened.ok)
                                    setError(opened.message);
                                return [2 /*return*/];
                        }
                    });
                }); }}>{en_1.t.branches.openIntegration}</button>
        {workspace.conflicts.map(function (file) { return <ConflictEditor key={file.path} file={file} source={op.source} target={op.target} busy={held} onResolve={function (choice, text) { return void run(en_1.t.branches.resolving, function () { return engine.resolveMergeFile(realm, __assign({ operationId: op.id, path: file.path, choice: choice }, (text === undefined ? {} : { text: text }))); }); }}/>; })}
        {op.stage === 'ready' || op.stage === 'applying' ? <>
          <details open><summary>{en_1.t.branches.diff}</summary><pre class="branch-diff">{workspace.diff}</pre></details>
          {workspace.truncated && <p role="status">{en_1.t.branches.truncated}</p>}
          <merge_checks_1.MergeChecks workspace={workspace} busy={held} onRun={function (ids) { return void run(en_1.t.branches.runningChecks, function () { return engine.runMergeChecks(realm, { operationId: op.id, approval: workspace.approval, checkIds: ids }); }); }} onCancel={function () { return __awaiter(void 0, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.cancelMergeChecks(realm, op.id); })];
                                case 1:
                                    result = _a.sent();
                                    if (!result.ok)
                                        setError(result.message);
                                    return [2 /*return*/];
                            }
                        });
                    }); }}/>
          {!workspace.approval && <p role="status">{en_1.t.branches.unstaged}</p>}
          <label>{en_1.t.branches.commitMessage}<textarea value={commitMessage} disabled={held || op.stage === 'applying'} onInput={function (e) { return setMessage(e.currentTarget.value); }} onBlur={validateMessage} aria-invalid={!!messageError}/></label>
          {messageError && <p role="alert">{messageError}</p>}
          <label class="branch-confirm"><input type="checkbox" checked={idle} disabled={held} onChange={function (e) { return setIdleFor(e.currentTarget.checked ? approval : null); }}/>{en_1.t.branches.idle}</label>
          <button type="button" class="btn primary" disabled={held || !idle || !workspace.approval || workspace.checksCurrent === false} onClick={function () {
                        if (validateMessage())
                            void run(en_1.t.branches.completing, function () { return engine.completeMerge(realm, { operationId: op.id, approval: workspace.approval, message: commitMessage, idleConfirmed: idle }); });
                    }}>{en_1.t.branches.approve(op.source, op.target)}</button>
        </> : null}
        {op.stage === 'merged' && op.commit && <>
          <p role="status">{en_1.t.branches.merged(op.commit, op.target)}</p>
          <p class="mono">{op.message}</p>
          {op.published && <p role="status">{en_1.t.branches.pushed(op.published.remote, op.target, op.published.commit)}</p>}
          {remotes.length === 0 ? <p>{en_1.t.branches.noRemote}</p> : <>
            <label>{en_1.t.branches.remote}<select value={remote} disabled={held} onChange={function (e) { setRemote(e.currentTarget.value); setPush(null); }}>{remotes.map(function (name) { return <option key={name} value={name}>{name}</option>; })}</select></label>
            <p class="hint">{en_1.t.branches.pushHint}</p>
            <button type="button" class="btn" disabled={held} onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        setBusy(en_1.t.branches.checkingRemote);
                                        setError(null);
                                        setPush(null);
                                        return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.readPush(realm, op.id, remote); })];
                                    case 1:
                                        result = _a.sent();
                                        if (result.ok)
                                            setPush(result.data);
                                        else
                                            setError(result.message);
                                        setBusy(null);
                                        return [2 /*return*/];
                                }
                            });
                        }); }}>{en_1.t.branches.checkRemote}</button>
            {push && <div class="push-preview">
              <p class="mono">{push.head.slice(0, 7)} → {push.remote}/{push.branch}</p>
              <ul>{push.commits.map(function (c) { return <li key={c.id}><code>{c.id.slice(0, 7)}</code> {c.message}</li>; })}</ul>
              <button type="button" class="btn primary" disabled={held} onClick={function () { return void run(en_1.t.branches.pushing, function () { return engine.pushMerge(realm, push); }); }}>{en_1.t.branches.push(push.remote, push.branch)}</button>
            </div>}
          </>}
        </>}
        {op.stage === 'failed' && <p role="status">{en_1.t.branches.retained}</p>}
        <details class="merge-log" open><summary>{en_1.t.branches.operationLog}</summary><ol>{op.events.map(function (event, i) { return <li key={i}>
          <time>{new Date(event.at).toLocaleTimeString()}</time> <strong>{en_1.t.activity.status[event.status]}</strong><code>{event.command}</code>
          {event.output && <pre class="live-terminal" role="log" aria-label={en_1.t.branches.operationOutput}>{event.output}</pre>}
        </li>; })}</ol></details>
        <div class="q-actions">
          <button type="button" class="btn" disabled={held} onClick={read.refresh}>{en_1.t.branches.refresh}</button>
          {!['merged', 'abandoned', 'committing'].includes(op.stage) && <button type="button" class="btn" disabled={held} onClick={function () { return setAbandon(true); }}>{en_1.t.branches.abandon}</button>}
        </div>
        {abandon && <div class="branch-abandon" role="group" aria-label={en_1.t.branches.abandon}>
          <p>{op.commit ? en_1.t.branches.abandonRetained : en_1.t.branches.abandonHint}</p>
          <button type="button" class="btn" disabled={held} onClick={function () { return setAbandon(false); }}>{en_1.t.branches.cancel}</button>
          <button type="button" class="btn danger" disabled={held} onClick={function () { setAbandon(false); void run(en_1.t.branches.abandoning, function () { return engine.abandonMerge(realm, op.id); }); }}>{en_1.t.branches.confirmAbandon}</button>
        </div>}
      </>;
        }}</read_view_1.ReadView>
  </section>;
};
exports.MergeReview = MergeReview;
