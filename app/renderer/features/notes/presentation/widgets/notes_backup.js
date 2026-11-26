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
exports.useNotesBackup = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var dialog_1 = require("../../../../core/widgets/dialog");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var b = en_1.t.notebook.backup;
// Only the lines that aren't zero, or one line when nothing came of it.
var restoredLines = function (r) {
    return r.added + r.files + r.toHistory + r.skipped.length === 0
        ? [b.nothingNew]
        : __spreadArray(__spreadArray(__spreadArray(__spreadArray([], (r.added + r.files > 0 ? [b.added(r.added, r.files)] : []), true), (r.renamed > 0 ? [b.renamed(r.renamed)] : []), true), (r.same > 0 ? [b.same(r.same)] : []), true), (r.toHistory > 0 ? [b.toHistory(r.toHistory)] : []), true);
};
// Export notes and Restore from backup. Main asks for the folder; while it
// works a line says so, and what came of it, or why it failed, opens in a
// dialog. Cancelling the folder picker changes nothing.
// onRefresh: a restore that stopped part way may have added notes already.
// links go in the list and dialog outside it: the list's blur would shrink the
// dialog's dimming to the list alone. Kept by the page, a result also outlives
// the narrow layout's list drawer closing.
var useNotesBackup = function (_a) {
    var engine = _a.engine, realm = _a.realm, onView = _a.onView, onRefresh = _a.onRefresh;
    var _b = (0, hooks_1.useState)(null), working = _b[0], setWorking = _b[1];
    var _c = (0, hooks_1.useState)(null), outcome = _c[0], setOutcome = _c[1];
    var buttons = (0, hooks_1.useRef)({});
    var failed = function (kind, message) { return ({ kind: kind, title: kind === 'export' ? b.exportFailed : b.restoreFailed, lines: [message], hint: null, skipped: [], isFailed: true }); };
    var run = function (kind) { return __awaiter(void 0, void 0, void 0, function () {
        var answer, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (working !== null)
                        return [2 /*return*/];
                    setOutcome(null);
                    setWorking(kind);
                    if (!(kind === 'export')) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.exportNotes(realm); })];
                case 1:
                    answer = _a.sent();
                    setWorking(null);
                    if (!answer.ok)
                        setOutcome(failed(kind, answer.message));
                    else if (answer.data !== null)
                        setOutcome({ kind: kind, title: b.exportedTitle, lines: [b.exported(answer.data.notes, answer.data.files, answer.data.folder)], hint: b.historyStays, skipped: answer.data.skipped, isFailed: false });
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.restoreNotes(realm); })];
                case 3:
                    answer = _a.sent();
                    setWorking(null);
                    if (!answer.ok) {
                        setOutcome(failed(kind, answer.message));
                        onRefresh();
                    }
                    else if (answer.data !== null) {
                        onView(answer.data.view);
                        setOutcome({ kind: kind, title: b.restoredTitle, lines: restoredLines(answer.data), hint: null, skipped: answer.data.skipped, isFailed: false });
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var close = function () {
        var kind = outcome === null || outcome === void 0 ? void 0 : outcome.kind;
        setOutcome(null);
        if (kind !== undefined)
            requestAnimationFrame(function () { var _a; return (_a = buttons.current[kind]) === null || _a === void 0 ? void 0 : _a.focus(); });
    };
    var links = (<>
      {['export', 'restore'].map(function (kind) { return (<button key={kind} type="button" class="nt-link" ref={function (el) { return void (buttons.current[kind] = el); }} disabled={working !== null} onClick={function () { return void run(kind); }}>
          {kind === 'export' ? b.export : b.restore}
        </button>); })}
      {working !== null && (<p class="nt-file-status" role="status">
          <states_1.Spinner /> {working === 'export' ? b.exporting : b.restoring}
        </p>)}
    </>);
    var dialog = outcome !== null && (<dialog_1.Dialog title={outcome.title} onCancel={close} onSubmit={function () { return (outcome.isFailed ? void run(outcome.kind) : close()); }}>
      {outcome.lines.map(function (line) { return (<p key={line} class="form-line" role={outcome.isFailed ? 'alert' : undefined}>
          {line}
        </p>); })}
      {outcome.skipped.length > 0 && (<>
          <p class="form-line">{b.leftOut(outcome.skipped.length)}</p>
          <ul class="nt-skipped">
            {outcome.skipped.map(function (skip) { return (<li key={skip.path}>
                <code>{skip.path}</code>: {b.reasons[skip.reason]}
              </li>); })}
          </ul>
        </>)}
      {outcome.hint !== null && <p class="hint">{outcome.hint}</p>}
      <div class="sheet-actions">
        {outcome.isFailed && (<button type="button" class="btn" onClick={close}>
            {b.close}
          </button>)}
        <button type="submit" class="btn primary">
          {outcome.isFailed ? en_1.t.failed.tryAgain : b.close}
        </button>
      </div>
    </dialog_1.Dialog>);
    return { links: links, dialog: dialog };
};
exports.useNotesBackup = useNotesBackup;
