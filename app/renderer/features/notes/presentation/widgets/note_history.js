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
exports.NoteHistory = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var dialog_1 = require("../../../../core/widgets/dialog");
var states_1 = require("../../../../core/widgets/states");
var window_keys_1 = require("../../../../core/widgets/window_keys");
var en_1 = require("../../../../l10n/en");
var NoteHistory = function (_a) {
    var engine = _a.engine, realm = _a.realm, note = _a.note, onClose = _a.onClose, onRestored = _a.onRestored, onRefresh = _a.onRefresh;
    var _b = (0, hooks_1.useState)({ kind: 'loading' }), versions = _b[0], setVersions = _b[1];
    var _c = (0, hooks_1.useState)(null), selected = _c[0], setSelected = _c[1];
    var _d = (0, hooks_1.useState)({ kind: 'loading' }), preview = _d[0], setPreview = _d[1];
    var _e = (0, hooks_1.useState)(0), readAttempt = _e[0], setReadAttempt = _e[1];
    var _f = (0, hooks_1.useState)(0), previewAttempt = _f[0], setPreviewAttempt = _f[1];
    var _g = (0, hooks_1.useState)(false), isRestoring = _g[0], setRestoring = _g[1];
    var _h = (0, hooks_1.useState)(null), failure = _h[0], setFailure = _h[1];
    var _j = (0, hooks_1.useState)(false), hasConflict = _j[0], setConflict = _j[1];
    var content = (0, hooks_1.useRef)(null);
    var restoring = (0, hooks_1.useRef)(false);
    (0, hooks_1.useEffect)(function () {
        var isHere = true;
        setVersions({ kind: 'loading' });
        void (0, engine_client_1.ask)(engine, function () { return engine.readNoteHistory(realm, note.id); }).then(function (answer) {
            var _a, _b;
            if (!isHere)
                return;
            setVersions(answer.ok ? { kind: 'ready', data: answer.data } : { kind: 'failed', message: answer.message });
            if (answer.ok)
                setSelected((_b = (_a = answer.data[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null);
        });
        return function () { isHere = false; };
    }, [readAttempt]);
    (0, hooks_1.useEffect)(function () {
        if (selected === null)
            return;
        var isHere = true;
        setPreview({ kind: 'loading' });
        void (0, engine_client_1.ask)(engine, function () { return engine.readNoteVersion(realm, note.id, selected); }).then(function (answer) {
            if (isHere)
                setPreview(answer.ok ? { kind: 'ready', data: answer.data } : { kind: 'failed', message: answer.message });
        });
        return function () { isHere = false; };
    }, [selected, previewAttempt]);
    // Keep Tab inside the modal, including while its asynchronous content changes.
    (0, window_keys_1.useWindowKeys)(function (event) {
        var _a;
        if (event.key !== 'Tab')
            return;
        var dialog = (_a = content.current) === null || _a === void 0 ? void 0 : _a.closest('[role="dialog"]');
        if (dialog === null || dialog === undefined)
            return;
        var stops = __spreadArray([], dialog.querySelectorAll('button:not(:disabled), [tabindex="0"]'), true);
        var first = stops[0];
        var last = stops.at(-1);
        var isOffStop = !stops.includes(document.activeElement);
        if (event.shiftKey && (document.activeElement === first || isOffStop)) {
            event.preventDefault();
            last === null || last === void 0 ? void 0 : last.focus();
        }
        else if (!event.shiftKey && (document.activeElement === last || isOffStop)) {
            event.preventDefault();
            first === null || first === void 0 ? void 0 : first.focus();
        }
    });
    var isCurrent = preview.kind === 'ready' && preview.data.stamp === note.stamp;
    var restore = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (restoring.current || hasConflict || selected === null || preview.kind !== 'ready' || isCurrent)
                        return [2 /*return*/];
                    restoring.current = true;
                    setRestoring(true);
                    setFailure(null);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.restoreNoteVersion(realm, note.id, selected, note.stamp); })];
                case 1:
                    answer = _a.sent();
                    restoring.current = false;
                    setRestoring(false);
                    if (!answer.ok)
                        setFailure(answer.message);
                    else if (answer.data.kind === 'changed') {
                        setConflict(true);
                        setFailure(en_1.t.notebook.history.changed);
                        onRefresh();
                    }
                    else
                        onRestored(answer.data);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog isSheet title={en_1.t.notebook.history.title(note.title)} onCancel={function () { if (!restoring.current)
        onClose(); }} onSubmit={function () { return void restore(); }}>
      <div class="nt-history" ref={content} aria-busy={isRestoring}>
        <p class="hint">{en_1.t.notebook.history.policy}</p>
        {versions.kind === 'loading' && <states_1.Loading line={en_1.t.notebook.history.loading}/>}
        {versions.kind === 'failed' && <states_1.Failed message={versions.message} onRetry={function () { return setReadAttempt(function (n) { return n + 1; }); }}/>}
        {versions.kind === 'ready' && versions.data.length === 0 && <p>{en_1.t.notebook.history.empty}</p>}
        {versions.kind === 'ready' && versions.data.length > 0 && (<div class="nt-history-grid">
            <ul class="nt-versions" aria-label={en_1.t.notebook.history.versions}>
              {versions.data.map(function (version) { return (<li key={version.id}>
                  <button type="button" class={selected === version.id ? 'nt-item on' : 'nt-item'} aria-pressed={selected === version.id} disabled={isRestoring} onClick={function () { if (selected === version.id)
                return; setPreview({ kind: 'loading' }); setSelected(version.id); if (!hasConflict)
                setFailure(null); }}>
                    <time dateTime={version.savedAt} title={version.savedAt}>{new Date(version.savedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' })}</time>
                  </button>
                </li>); })}
            </ul>
            <section class="nt-version-preview">
              {preview.kind === 'loading' && <states_1.Loading line={en_1.t.notebook.history.loadingPreview}/>}
              {preview.kind === 'failed' && <states_1.Failed message={preview.message} onRetry={function () { return setPreviewAttempt(function (n) { return n + 1; }); }}/>}
              {preview.kind === 'ready' && (<>
                  <h3>{preview.data.title}</h3>
                  <p class="sub">{en_1.t.notebook.folder}: {preview.data.folder}</p>
                  {preview.data.tags.length > 0 && <p class="sub">{en_1.t.notebook.tags}: {preview.data.tags.map(function (tag) { return "#".concat(tag); }).join(' ')}</p>}
                  {isCurrent && <p class="hint">{en_1.t.notebook.history.current}</p>}
                  <pre class="nt-history-text" tabIndex={0} aria-label={en_1.t.notebook.history.preview}>{preview.data.body || en_1.t.notebook.history.emptyBody}</pre>
                </>)}
            </section>
          </div>)}
        {failure !== null && <p class="nt-banner" role="alert">{failure}</p>}
        {isRestoring && <p role="status"><states_1.Spinner /> {en_1.t.notebook.history.restoring}</p>}
        {selected !== null && <p class="hint">{en_1.t.notebook.history.restoreLine}</p>}
      </div>
      <div class="sheet-actions">
        <button type="button" class="btn" disabled={isRestoring} onClick={onClose}>{en_1.t.notebook.history.close}</button>
        {selected !== null && <button type="submit" class="btn primary" disabled={isRestoring || hasConflict || preview.kind !== 'ready' || isCurrent}>{en_1.t.notebook.history.restore}</button>}
      </div>
    </dialog_1.Dialog>);
};
exports.NoteHistory = NoteHistory;
