"use strict";
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
exports.FreeSpace = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var dialog_1 = require("../../../../core/widgets/dialog");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var constants_1 = require("../../domain/constants");
var s = en_1.t.branches.space;
var canClear = function (f) { return !f.held && f.folders.length > 0; };
var FolderRow = function (_a) {
    var f = _a.folder, isPicked = _a.isPicked, isBusy = _a.isBusy, onPick = _a.onPick, onRemove = _a.onRemove;
    var _b = (0, hooks_1.useState)(false), isConfirming = _b[0], setConfirming = _b[1];
    return <li class="panel space-row">
    <label class="branch-confirm"><input type="checkbox" checked={isPicked} disabled={isBusy || !canClear(f)} onChange={function (e) { return onPick(e.currentTarget.checked); }}/><strong>{f.title}</strong></label>
    <p class="mono hint">{f.path}</p>
    <p>{s.size(s.bytes(f.bytes), s.bytes(f.freeable))}</p>
    {f.held ? <p class="hint">{s.held[f.held]}</p> : f.folders.length === 0 && <p class="hint">{s.nothing}</p>}
    {f.removable && (isConfirming ? <div class="space-confirm">
      <p>{s.removeHint}</p>
      <div class="q-actions">
        <button type="button" class="btn danger" disabled={isBusy} onClick={function () { setConfirming(false); onRemove(); }}>{s.confirmRemove}</button>
        <button type="button" class="btn" onClick={function () { return setConfirming(false); }}>{s.keep}</button>
      </div>
    </div> : <div class="q-actions"><button type="button" class="btn" disabled={isBusy} onClick={function () { return setConfirming(true); }}>{s.remove}</button></div>)}
    {f.merged && f.changed.length > 0 && <details>
      <summary>{s.changed(f.changed.length)}</summary>
      <ul class="mono space-files">{f.changed.slice(0, constants_1.CHANGED_SHOWN).map(function (c) { return <li key={c.path}>{c.status} {c.path}</li>; })}</ul>
      {f.changed.length > constants_1.CHANGED_SHOWN && <p class="hint">{s.more(f.changed.length - constants_1.CHANGED_SHOWN)}</p>}
    </details>}
  </li>;
};
// Measures every quest folder once when it opens, and again only when asked:
// measuring walks every build folder, so it never reruns on its own.
var FreeSpace = function (_a) {
    var engine = _a.engine, realm = _a.realm, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)({ status: 'loading' }), load = _b[0], setLoad = _b[1];
    var _c = (0, hooks_1.useState)([]), picked = _c[0], setPicked = _c[1];
    var _d = (0, hooks_1.useState)(null), busy = _d[0], setBusy = _d[1];
    var _e = (0, hooks_1.useState)(null), error = _e[0], setError = _e[1];
    var _f = (0, hooks_1.useState)(null), done = _f[0], setDone = _f[1];
    var measure = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoad({ status: 'loading' });
                    setDone(null);
                    setError(null);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.readFolderSpace(realm); })];
                case 1:
                    answer = _a.sent();
                    setLoad(answer.ok ? { status: 'ready', data: answer.data } : { status: 'failed', message: answer.message });
                    return [2 /*return*/];
            }
        });
    }); };
    (0, hooks_1.useEffect)(function () { void measure(); }, [realm]);
    var run = function (line, outcome, call) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setBusy(line);
                    setError(null);
                    setDone(null);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, call)];
                case 1:
                    answer = _a.sent();
                    setBusy(null);
                    if (!answer.ok) {
                        setError(answer.message);
                        return [2 /*return*/];
                    }
                    setLoad({ status: 'ready', data: answer.data });
                    setPicked([]);
                    setDone(outcome);
                    return [2 /*return*/];
            }
        });
    }); };
    var folders = load.status === 'ready' ? load.data.folders : [];
    var clearable = folders.filter(canClear);
    var chosen = clearable.filter(function (f) { return picked.includes(f.path); });
    var freeable = chosen.reduce(function (sum, f) { return sum + f.freeable; }, 0);
    var free = function () {
        if (busy || load.status !== 'ready')
            return;
        if (!chosen.length) {
            setError(s.choose);
            return;
        }
        void run(s.freeing, s.freed(s.bytes(freeable)), function () { return engine.freeFolderSpace(realm, chosen.map(function (f) { return f.path; })); });
    };
    return <dialog_1.Dialog title={s.title} isSheet closeLabel={en_1.t.branches.close} onCancel={onClose} onSubmit={free}>
    <p>{s.line}</p>
    {load.status === 'loading' && <states_1.Loading line={s.reading}/>}
    {load.status === 'failed' && <states_1.Failed message={load.message} onRetry={function () { return void measure(); }}/>}
    {load.status === 'ready' && (folders.length === 0 ? <states_1.Empty title={s.empty} line={s.emptyLine}/> : <>
      <div class="sec-row"><p class="hint" role="status">{s.measured(load.data.at)}</p><button type="button" class="btn" disabled={!!busy} onClick={function () { return void measure(); }}>{s.measure}</button></div>
      {clearable.length > 0 && <label class="branch-confirm"><input type="checkbox" checked={chosen.length === clearable.length} disabled={!!busy} onChange={function (e) { return setPicked(e.currentTarget.checked ? clearable.map(function (f) { return f.path; }) : []); }}/>{s.selectAll}</label>}
      <ul class="space-list">{folders.map(function (f) { return <FolderRow key={f.path} folder={f} isPicked={chosen.includes(f)} isBusy={!!busy} onPick={function (on) { return setPicked(function (was) { return on ? __spreadArray(__spreadArray([], was, true), [f.path], false) : was.filter(function (p) { return p !== f.path; }); }); }} onRemove={function () { return void run(s.removing, s.removed(f.title), function () { return engine.removeTaskFolder(realm, f.taskId); }); }}/>; })}</ul>
    </>)}
    {busy && <states_1.Loading line={busy}/>}
    {done && <p class="note" role="status">{done}</p>}
    <div class="sheet-actions">
      {error && <p class="field-error" role="alert">{error}</p>}
      <button type="submit" class="btn primary" disabled={!!busy || load.status !== 'ready'}>{chosen.length ? s.free(s.bytes(freeable), chosen.length) : s.freeNone}</button>
    </div>
  </dialog_1.Dialog>;
};
exports.FreeSpace = FreeSpace;
